import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
import qs from "querystring";

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

    // Form data construction
    const formData = {
      ci_csrf_token: "",
      pass_out_status_id: "1",
      district_id: "20",
    };

    let targetUrl = "";
    switch (type) {
      case "aadhaar":
        formData.aadhaar_number = aadhaar_number;
        targetUrl =
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_aadhaar";
        break;
      case "mobile":
        formData.gurdian_mobile_number = gurdian_mobile_number;
        formData.name = name;
        targetUrl =
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_gurdian_mobile_no";
        break;
      case "details":
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

    // Direct request without proxy
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      secureOptions: 0x4,
    });

    console.log(`Making direct request to: ${targetUrl}`);

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
      timeout: 30000,
    });

    return NextResponse.json({
      success: true,
      data: response.data,
      method_used: "direct",
    });
  } catch (error) {
    console.error("Direct request failed:", error.message);

    let errorMessage = error.message;
    if (error.code === "ECONNABORTED") {
      errorMessage =
        "The request timed out. The server might be overloaded or experiencing issues.";
    } else if (error.response) {
      errorMessage = `Server responded with status ${error.response.status}`;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
