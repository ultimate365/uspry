"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "@/context/FirbaseContext";
import { collection, getDocs, query } from "firebase/firestore";
import { useGlobalContext } from "../../context/Store";
import { SCHOOLNAME } from "@/modules/constants";
import Image from "next/image";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function TeacherPhotoCorner() {
  const {
    state,
    teachersState,
    setTeachersState,
    setTeacherUpdateTime,
    teacherUpdateTime,
  } = useGlobalContext();
  const access = state?.ACCESS;
  const router = useRouter();
  const [teacherData, setTeacherData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const teachersData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "teachers"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setTeacherData(data);
    setTeachersState(data);
    setTeacherUpdateTime(Date.now());
    setShowTable(true);
  };
  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }

    const teacherDifference = (Date.now() - teacherUpdateTime) / 1000 / 60 / 15;
    if (teacherDifference >= 1 || teachersState.length === 0) {
      teachersData();
    } else {
      setTeacherData(teachersState);
      setShowTable(true);
    }
  }, []);
  return (
    <div className="container text-center mx-auto flex-wrap my-2">
      {showTable ? (
        <div>
          <h3 className="text-center">TEACHERS' CORNER OF {SCHOOLNAME}</h3>

          <div className="row mx-auto justify-content-center">
            {teacherData.map((el, index) => {
              return (
                <div
                  style={{
                    width: "200px",
                    margin: "10px",
                    border: "1px solid black",
                    borderRadius: "10px",
                    padding: "5px",
                  }}
                  className="justify-content-center align-items-center text-center"
                  key={index}
                >
                  <div className="align-items-center">
                    <div
                      style={{
                        width: "150px",
                        height: "180px",
                        margin: "auto",
                        marginBottom: "5px",
                        // borderWidth: "1px",
                        // borderRadius: "5px",
                        // borderColor: "1px solid black",
                      }}
                      className="text-center justify-content-center align-items-center border-1 border-dark"
                    ></div>
                  </div>

                  <h6 className="m-1 p-0 text-center text-wrap">
                    Name: {el?.tname}
                  </h6>

                  <h6 className="m-1 p-0 text-center text-wrap">
                    Designation: {el?.desig}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    Mobile: {el?.phone}
                  </h6>
                  {/* <h6 className="m-1 p-0 text-center text-wrap">
                    Date of Birth: {el?.dob}
                  </h6> */}
                  <h6 className="m-1 p-0 text-center text-wrap">
                    Date of Joining: {el?.doj}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    DOJ to this School: {el?.dojnow}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    Date of Retirement: {el?.dor}
                  </h6>
                  <h6 className="m-1 p-0 text-center text-wrap">
                    Training: {el?.training}
                  </h6>
                </div>
              );
            })}
          </div>
          <div className="mx-auto my-3 noprint">
            <button
              type="button"
              className="btn btn-primary text-white font-weight-bold p-2 rounded"
              onClick={() => {
                if (typeof document != "undefined") {
                  window.print();
                }
              }}
            >
              Print
            </button>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
