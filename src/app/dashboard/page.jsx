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
    </div>
  );
}
