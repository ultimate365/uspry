import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
import FormData from "form-data";

// ✅ Indian proxy servers (you can add more)
const INDIAN_PROXIES = [process.env.SCRAPE_URL].filter(Boolean);

// ✅ Get a random Indian proxy
const getIndianProxy = () => {
  if (INDIAN_PROXIES.length === 0) return null;
  return INDIAN_PROXIES[Math.floor(Math.random() * INDIAN_PROXIES.length)];
};

// ✅ Fixed HTTPS agent with proxy support
const createHttpsAgent = (proxyUrl = null) => {
  const baseConfig = {
    rejectUnauthorized: false,
    secureOptions: 0x4, // legacy renegotiation allowed
  };

  if (proxyUrl) {
    const { hostname, port, username, password } = new URL(proxyUrl);
    baseConfig.proxy = {
      host: hostname,
      port: parseInt(port),
      ...(username &&
        password && {
          proxyAuth: `${username}:${password}`,
        }),
    };
  }

  return new https.Agent(baseConfig);
};

// ✅ Helper function to send POST request with proxy
const fetchStudentData = async (url, form) => {
  const startTime = Date.now();

  // Try with proxy first, fallback to direct connection
  const proxyUrl = getIndianProxy();
  const httpsAgent = createHttpsAgent(proxyUrl);

  console.log(`Making request to ${url} via proxy: ${proxyUrl ? "Yes" : "No"}`);

  const response = await axios.post(url, form, {
    headers: {
      ...form.getHeaders(),
      // Add headers to appear more like a Indian browser request
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
      Accept: "application/json, text/plain, */*",
      "Cache-Control": "no-cache",
    },
    httpsAgent,
    timeout: 30000,
    // Additional axios configuration for Indian IP
    withCredentials: true,
    decompress: true,
  });

  // Check if it took too long
  if (Date.now() - startTime > 20000) {
    throw new Error("Request timed out or SSL handshake too slow.");
  }

  return response.data;
};

export async function POST(request) {
  try {
    const {
      type,
      aadhaar_number,
      gurdian_mobile_number,
      name,
      father_name,
      mother_name,
      dob,
    } = await request.json();

    const form = new FormData();
    form.append("ci_csrf_token", "");
    form.append("pass_out_status_id", "1");
    form.append("district_id", "20");

    let url = "";

    switch (type) {
      case "aadhaar":
        form.append("aadhaar_number", aadhaar_number);
        url =
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_aadhaar";
        break;

      case "mobile":
        form.append("gurdian_mobile_number", gurdian_mobile_number);
        form.append("name", name);
        url =
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_gurdian_mobile_no";
        break;

      case "details":
        form.append("name", name);
        form.append("father_name", father_name);
        form.append("mother_name", mother_name);
        form.append("dob", dob);
        url = "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id";
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid request type.",
          },
          { status: 400 }
        );
    }

    const data = await fetchStudentData(url, form);

    return NextResponse.json({
      success: true,
      data,
      via_proxy: !!getIndianProxy(),
    });
  } catch (error) {
    console.error("POST request failed:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to fetch data due to SSL, timeout, or network issue.",
        via_proxy: !!getIndianProxy(),
      },
      { status: 500 }
    );
  }
}
