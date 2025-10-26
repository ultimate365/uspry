import axios from "axios";
import https from "https";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      type,
      aadhaar_number,
      gurdian_mobile_number,
      name,
      father_name,
      mother_name,
      dob,
    } = await req.json();

    // Build form data
    const form = new FormData();
    form.append("ci_csrf_token", "");
    form.append("pass_out_status_id", "1");
    form.append("district_id", "20");

    if (type === "aadhaar") {
      form.append("aadhaar_number", aadhaar_number);

      // Create HTTPS agent to handle legacy SSL renegotiation issues
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // ⛔ disables cert verification (only use if target site is trusted)
        secureOptions: 0x4, // allow legacy renegotiation (OpenSSL constant SSL_OP_LEGACY_SERVER_CONNECT)
      });

      try {
        const time = Date.now();
        const response = await axios.post(
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_aadhaar",
          form,
          {
            headers: {
              ...form.getHeaders?.(), // ensures proper multipart headers
            },
            httpsAgent,
          }
        );

        if (Date.now() - time <= 10000) {
          return NextResponse.json({
            success: true,
            data: response.data,
          });
        } else {
          return NextResponse.json({
            success: false,
            message: "Failed to fetch data due to SSL or network issue.",
          });
        }
      } catch (error) {
        console.error("POST request failed:", error.message);
        return NextResponse.json({
          success: false,
          message:
            error.message ||
            "Failed to fetch data due to SSL or network issue.",
        });
      }
    } else if (type === "mobile") {
      form.append("gurdian_mobile_number", gurdian_mobile_number);
      form.append("name", name);

      // Create HTTPS agent to handle legacy SSL renegotiation issues
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // ⛔ disables cert verification (only use if target site is trusted)
        secureOptions: 0x4, // allow legacy renegotiation (OpenSSL constant SSL_OP_LEGACY_SERVER_CONNECT)
      });

      try {
        const time = Date.now();
        const response = await axios.post(
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id_by_gurdian_mobile_no",
          form,
          {
            headers: {
              ...form.getHeaders?.(), // ensures proper multipart headers
            },
            httpsAgent,
          }
        );
        if (Date.now() - time <= 10000) {
          return NextResponse.json({
            success: true,
            data: response.data,
          });
        } else {
          return NextResponse.json({
            success: false,
            message: "Failed to fetch data due to SSL or network issue.",
          });
        }
      } catch (error) {
        console.error("POST request failed:", error.message);
        return NextResponse.json({
          success: false,
          message:
            error.message ||
            "Failed to fetch data due to SSL or network issue.",
        });
      }
    } else if (type === "details") {
      form.append("name", name);
      form.append("father_name", father_name);
      form.append("mother_name", mother_name);
      form.append("dob", dob);

      // Create HTTPS agent to handle legacy SSL renegotiation issues
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // ⛔ disables cert verification (only use if target site is trusted)
        secureOptions: 0x4, // allow legacy renegotiation (OpenSSL constant SSL_OP_LEGACY_SERVER_CONNECT)
      });

      try {
        const time = Date.now();
        const response = await axios.post(
          "https://banglarshiksha.wb.gov.in/Ajax_ep/ajax_get_bs_id",
          form,
          {
            headers: {
              ...form.getHeaders?.(), // ensures proper multipart headers
            },
            httpsAgent,
          }
        );

        if (Date.now() - time <= 10000) {
          return NextResponse.json({
            success: true,
            data: response.data,
          });
        } else {
          return NextResponse.json({
            success: false,
            message: "Failed to fetch data due to SSL or network issue.",
          });
        }
      } catch (error) {
        console.error("POST request failed:", error.message);
        return NextResponse.json({
          success: false,
          message:
            error.message ||
            "Failed to fetch data due to SSL or network issue.",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid request type.",
      });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
