"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/Store";
import Typed from "typed.js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SCHOOLNAME } from "@/modules/constants";
export default function Dashboard() {
  const { state } = useGlobalContext();
  const name = state?.USER?.name;
  const student_class = state?.USER?.class;
  const desig = state?.USER?.desig;
  const access = state?.ACCESS;
  const router = useRouter();
  const el = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("+917074485030");
  const [message, setMessage] = useState("Hello from @Maidul365");
  const [status, setStatus] = useState("");
  const sendMessage = async () => {
    setStatus("Sending...");
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, message }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Message sent successfully!");
      } else {
        setStatus("❌ Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setStatus("❌ Failed: " + err.message);
    }
  };
  useEffect(() => {
    document.title = `${SCHOOLNAME}:Dashboard`;

    const typed = new Typed(el.current, {
      strings: [
        access === "student"
          ? `Welcome ${name},<br />Student of ${student_class}, of <br /> ${SCHOOLNAME}`
          : `Welcome ${name},<br /> ${desig}, of <br /> ${SCHOOLNAME}`,
      ],
      typeSpeed: 50,
      loop: true,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!state?.ACCESS) {
      router.push("/login");
    }
    // eslint-disable-next-line
  }, [state]);

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <div className="mx-auto my-2" style={{ height: "120px" }}>
        <span
          className="text-primary text-center fs-3 mb-3 web-message"
          ref={el}
        />
      </div>
      <h2 className="mb-4 text-center">Send Telegram Message</h2>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="+911234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary w-100"
          onClick={sendMessage}
          disabled={!phoneNumber || !message}
        >
          Send Message
        </button>
        {status && <div className="alert alert-info mt-3">{status}</div>}
      </div>
    </div>
  );
}
