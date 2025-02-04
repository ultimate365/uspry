"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "@/context/FirbaseContext";
import { collection, getDocs, query } from "firebase/firestore";
import { useGlobalContext } from "../../context/Store";
import { SCHOOLNAME } from "@/modules/constants";
import Image from "next/image";
import Loader from "@/components/Loader";
import StudentCorner from "../../components/StudentCorner";
import dynamic from "next/dynamic";
export default function PhotoCorner() {
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
    setStudentState,
    studentUpdateTime,
    setStudentUpdateTime,
  } = useGlobalContext();
  const today = new Date();
  const month = today.getMonth() + 1;
  const YEAR = month > 10 ? today.getFullYear() + 1 : today.getFullYear();
  const [showTable, setShowTable] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const studentData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "students"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setFilteredData(data);
    setShowTable(true);
    setStudentState(data);
    setStudentUpdateTime(Date.now());
  };
  const filterStudents = (index) => {
    setFilteredData(studentState.filter((el) => el?.nclass === index));
  };
  useEffect(() => {
    document.title = `${SCHOOLNAME}:Students Database`;

    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      studentData();
    } else {
      setFilteredData(studentState);
      setShowTable(true);
    }
  }, []);
  return (
    <div className="container text-center mx-auto flex-wrap my-2 timesFont">
      {showTable ? (
        <div>
          <h4 className="text-center">
            STUDENT CORNER OF {SCHOOLNAME} OF THE YEAR {YEAR}
          </h4>
          <div className="mt-3 noprint mx-auto col-md-4">
            <button
              type="button"
              className="btn btn-sm m-2 btn-info"
              onClick={() => filterStudents(0)}
            >
              PP
            </button>
            <button
              type="button"
              className="btn btn-sm m-2 btn-primary"
              onClick={() => filterStudents(1)}
            >
              I
            </button>
            <button
              type="button"
              className="btn btn-sm m-2 btn-secondary"
              onClick={() => filterStudents(2)}
            >
              II
            </button>
            <button
              type="button"
              className="btn btn-sm m-2 btn-warning"
              onClick={() => filterStudents(3)}
            >
              III
            </button>
            <button
              type="button"
              className="btn btn-sm m-2 btn-dark"
              onClick={() => filterStudents(4)}
            >
              IV
            </button>
            <button
              type="button"
              className="btn btn-sm m-2 btn-success"
              onClick={() => setFilteredData(studentState)}
            >
              All
            </button>
            <button
              type="button"
              className="btn btn-sm m-2 btn-info"
              onClick={() => {
                if (typeof document != "undefined") {
                  window.print();
                }
              }}
            >
              Print
            </button>
          </div>
          <div className="my-3 noprint">
            <PDFDownloadLink
              document={<StudentCorner data={filteredData} />}
              fileName={`Student Photo Corner.pdf`}
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
                loading ? "Loading..." : "Download Student Photo Corner PDF"
              }
            </PDFDownloadLink>
          </div>
          <div className="row mx-auto text-center">
            {filteredData.map((el, index) => {
              return (
                <div
                  style={{
                    width: "200px",
                    margin: "5px",
                    border: "1px solid black",
                    borderRadius: "10px",
                    padding: "5px",
                  }}
                  className="justify-content-center align-items-center text-center nobreak"
                  key={index}
                >
                  <div className="align-items-center">
                    <div
                      style={{
                        width: 100,
                        height: 130,
                        margin: "auto",
                        marginBottom: 5,
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: "black",
                      }}
                      className="text-center justify-content-center align-items-center"
                    ></div>
                  </div>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    {el?.class?.split(" (A)").join("")}
                  </h6>

                  <h6>Roll No.- {el?.roll_no}</h6>

                  <h6 className="m-1 p-0 text-center text-wrap">
                    Name: {el?.student_name}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    Mother's Name: {el?.mother_name}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    Father's Name: {el?.father_name}
                  </h6>

                  <h6 className="m-1 p-0 text-center text-wrap">
                    Mobile:{" "}
                    {el?.mobile === "0"
                      ? ""
                      : el?.mobile === "9999999999"
                      ? ""
                      : el?.mobile === "7872882343"
                      ? ""
                      : el?.mobile === "7679230482"
                      ? ""
                      : el?.mobile === "9933684468"
                      ? ""
                      : el?.mobile}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    Student ID: {el?.student_id}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    DOB: {el?.birthdate}
                  </h6>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
