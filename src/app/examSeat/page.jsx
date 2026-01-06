"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { firestore } from "@/context/FirbaseContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useGlobalContext } from "../../context/Store";
import { SCHOOLNAME } from "../../modules/constants";
import ExamSeatDistribution from "../../pdf/ExamSeatDistribution";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
export default function Result() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const {
    state,
    studentState,
    studentUpdateTime,
    setStudentState,
    setStudentUpdateTime,
  } = useGlobalContext();
  const router = useRouter();
  const [examData, setExamData] = useState([]);
  const [loader, setLoader] = useState(false);
  const studentData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "students"))
    );
    const data = querySnapshot.docs
      .map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }))
      .sort((a, b) => {
        if (a.nclass === b.nclass) {
          return a.roll_no - b.roll_no;
        } else {
          return a.nclass - b.nclass;
        }
      });
    setExamData(data);
    setStudentState(data);
    setStudentUpdateTime(Date.now());
    setLoader(false);
  };
  useEffect(() => {
    document.title = `${SCHOOLNAME} : Students Result Seat`;

    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      studentData();
    } else {
      setExamData(studentState);
      setLoader(false);
    }
  }, []);
  return (
    <div className="container-fluid text-center">
      {loader ? (
        <Loader center content="loading" size="lg" />
      ) : (
        <div className="container-fluid text-center">
          <div className="noprint">
            <div className="my-2">
              <button
                type="button"
                className="btn btn-info m-2"
                onClick={() => {
                  if (typeof window !== undefined) {
                    window.print();
                  }
                }}
              >
                Print
              </button>
              <button
                type="button"
                className="btn btn-warning m-2"
                onClick={() => {
                  router.push("/");
                }}
              >
                Go Back
              </button>
            </div>
            <PDFDownloadLink
              document={<ExamSeatDistribution examData={examData} />}
              fileName={`Exam Seat Distribution.pdf`}
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
                loading ? "Loading..." : "Download Seat Distribution PDF"
              }
            </PDFDownloadLink>
          </div>

          <div className="d-flex my-3">
            <div className="row justify-content-center align-items-center flex-wrap ">
              {examData.map((item, index) => (
                <div
                  className="col-md-4 m-2 d-flex flex-column justify-content-center align-items-center nobreak"
                  key={index}
                  style={{
                    width: "200px",
                    height: 80,
                    margin: "5px",
                    border: "1px solid black",
                    borderRadius: "10px",
                  }}
                >
                  <h6 className="m-1" style={{ margin: 0, padding: 0 }}>
                    {item?.student_name}
                  </h6>
                  <h6 className="m-1" style={{ margin: 0, padding: 0 }}>
                    {" "}
                    {item?.class}
                  </h6>
                  <h4 className="m-1" style={{ margin: 0, padding: 0 }}>
                    ROLL: {item?.roll_no}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
