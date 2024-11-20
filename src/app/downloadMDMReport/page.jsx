"use client";
import React, { Suspense, useEffect } from "react";

import { useSearchParams } from "next/navigation";
import MDMPrint from "@/components/MDMPrint";
import dynamic from "next/dynamic";

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
    ftFound,
    thisMonthlyData,
    thisMonthFromFirstTransaction,
    thisMonthFromTransaction,
    prevMonthlyData,
    balRCThisMonth,
    pryRCThisMonth,
    balRCPrevMonth,
    pryRCPrevMonth,
    remarks,
  } = data;
  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <Suspense>
      <div className="container-fluid">
        <PDFDownloadLink
          document={
            <MDMPrint
              data={{
                ftFound: ftFound,
                thisMonthlyData: thisMonthlyData,
                thisMonthFromFirstTransaction: thisMonthFromFirstTransaction,
                thisMonthFromTransaction: thisMonthFromTransaction,
                prevMonthlyData: prevMonthlyData,
                balRCThisMonth: balRCThisMonth,
                pryRCThisMonth: pryRCThisMonth,
                balRCPrevMonth: balRCPrevMonth,
                pryRCPrevMonth: pryRCPrevMonth,
                remarks: remarks,
              }}
            />
          }
          fileName={`${thisMonthlyData.id} MDM Return.pdf`}
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
            loading ? "Loading..." : "Download Monthly Report"
          }
        </PDFDownloadLink>
      </div>
    </Suspense>
  );
}
