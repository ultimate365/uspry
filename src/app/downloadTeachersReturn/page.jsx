"use client";
import React, { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ReturnPrint from "../../pdf/ReturnPrint";

export default function Page() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("data"));
  const {
    students,
    inspection,
    remarks,
    workingDays,
    teachers,
    year,
    id,
    month,
  } = data;

  return (
    <Suspense>
      <div className="container my-5">
        <PDFDownloadLink
          document={
            <ReturnPrint
              data={{
                students,
                inspection,
                remarks,
                workingDays,
                teachers,
                year,
                id,
                month,
              }}
            />
          }
          fileName={`${id} Teachers Return.pdf`}
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#fff",
            backgroundColor: "navy",
            border: "1px solid #4a4a4a",
            width: "40%",
            borderRadius: 10,
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading..." : `Download ${id} Teachers Return`
          }
        </PDFDownloadLink>
      </div>
    </Suspense>
  );
}
