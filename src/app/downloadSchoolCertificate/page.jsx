"use client";
import { Suspense } from "react";

import { useSearchParams } from "next/navigation";

import dynamic from "next/dynamic";
import SchoolCertificate from "../../components/SchoolCertificate";
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

  return (
    <Suspense>
      <div className="container-fluid">
        <PDFDownloadLink
          document={<SchoolCertificate data={data} />}
          fileName={`School Certificate of ${data.student_name}.pdf`}
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#fff",
            backgroundColor: "navy",
            border: "1px solid #4a4a4a",
            width: "40%",
            borderRadius: 10,
            margin: 10,
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Please Wait..." : "Download School Certificate"
          }
        </PDFDownloadLink>
      </div>
    </Suspense>
  );
}
