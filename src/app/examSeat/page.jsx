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
export default function Result() {
  const {
    state,
    studentState,
    studentUpdateTime,
    setStudentState,
    setStudentUpdateTime,
  } = useGlobalContext();
  const [examData, setExamData] = useState([]);
  const [loader, setLoader] = useState(false);
  const studentData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "students"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setExamData(data);
    setStudentState(data);
    setStudentUpdateTime(Date.now());
    setLoader(false);
  };
  useEffect(() => {
    document.title = `${SCHOOLNAME}:Students Result Seat`;

    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      studentData();
    } else {
      setExamData(studentState);
      setLoader(false);
    }
  }, []);
  return (
    <div className="container text-center">
      <div className="d-flex">
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
                {item?.class?.split(" (A)")[0]}
              </h6>
              <h4 className="m-1" style={{ margin: 0, padding: 0 }}>
                ROLL: {item?.roll_no}
              </h4>
            </div>
          ))}
        </div>
      </div>
      {loader && <Loader center content="loading" size="lg" />}
    </div>
  );
}
