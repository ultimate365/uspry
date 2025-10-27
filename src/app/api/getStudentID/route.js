import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
import qs from "querystring";

const SCRAPEDO_CONFIG = {
  token: process.env.SCRAPE_URL,
};

// Method 1: Scrape.do proxy
const fetchWithScrapeDo = async (targetUrl, formData) => {
  if (!SCRAPEDO_CONFIG.token) {
    throw new Error("Scrape.do token missing");
  }

  const encodedUrl = encodeURIComponent(targetUrl);
  const scrapeDoUrl = `https://api.scrape.do?token=${SCRAPEDO_CONFIG.token}&url=${encodedUrl}`;

  const response = await axios.post(scrapeDoUrl, qs.stringify(formData), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
    },
    timeout: 45000,
  });

  return response.data;
};

// Method 2: Direct request with Indian headers
const fetchDirect = async (targetUrl, formData) => {
  console.log("Trying direct connection...");

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    secureOptions: 0x4,
  });

  const response = await axios.post(targetUrl, qs.stringify(formData), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
      Accept: "application/json, text/plain, */*",
      Origin: "https://banglarshiksha.wb.gov.in",
      Referer: "https://banglarshiksha.wb.gov.in/",
    },
    httpsAgent,
    timeout: 90000,
  });

  return response.data;
};

// Main function with fallback
const fetchStudentData = async (targetUrl, formData) => {
  try {
    console.log("Trying Scrape.do proxy...");
    const data = await fetchWithScrapeDo(targetUrl, formData);
    return { data, method: "scrape.do" };
  } catch (error) {
    console.log("Scrape.do failed, trying direct connection...");
    try {
      const data = await fetchDirect(targetUrl, formData);
      return { data, method: "direct" };
    } catch (directError) {
      console.log("Direct connection also failed");
      throw new Error(
        `All methods failed: Scrape.do - ${error.message}, Direct - ${directError.message}`
      );
    }
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      type,
      aadhaar_number,
      gurdian_mobile_number,
      name,
      father_name,
      mother_name,
      dob,
    } = body;

    // Form data construction (same as before)
    const formData = {
      ci_csrf_token: "",
      pass_out_status_id: "1",
      district_id: "20",
    };

    let targetUrl = "";
    switch (type) {
      case "aadhaar":
        if (!aadhaar_number) {
          return NextResponse.json(
            { success: false, message: "Aadhaar number required" },
            { status: 400 }
          );
        }
        formData.aadhaar_number = aadhaar_number;
        targetUrl =
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_aadhaar";
        break;
      case "mobile":
        if (!gurdian_mobile_number || !name) {
          return NextResponse.json(
            { success: false, message: "Mobile and name required" },
            { status: 400 }
          );
        }
        formData.gurdian_mobile_number = gurdian_mobile_number;
        formData.name = name;
        targetUrl =
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_gurdian_mobile_no";
        break;
      case "details":
        if (!name || !father_name || !mother_name || !dob) {
          return NextResponse.json(
            { success: false, message: "All details required" },
            { status: 400 }
          );
        }
        formData.name = name;
        formData.father_name = father_name;
        formData.mother_name = mother_name;
        formData.dob = dob;
        targetUrl = "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id";
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid type" },
          { status: 400 }
        );
    }

    console.log(`Making ${type} request to ${targetUrl}`);

    const { data, method } = await fetchStudentData(targetUrl, formData);

    return NextResponse.json({
      success: true,
      data,
      method_used: method,
      via_proxy: method === "scrape.do",
    });
  } catch (error) {
    console.error("All request methods failed:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: `All connection methods failed: ${error.message}`,
        suggestion:
          "The target website might be temporarily unavailable or blocking requests. Please try again later.",
      },
      { status: 500 }
    );
  }
}
