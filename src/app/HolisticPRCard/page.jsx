"use client";
import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  todayInString,
} from "../../modules/calculatefunctions";
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
import { SCHOOLNAME } from "@/modules/constants";
import { useGlobalContext } from "../../context/Store";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import HPRCFrontPage from "../../HPRCard/HPRCFrontPage";
import HPRCInsidePage from "../../HPRCard/HPRCInsidePage";
import { useRouter } from "next/navigation";
export default function HolisticPRCard() {
  const {
    state,
    studentState,
    studentUpdateTime,
    setStudentState,
    setStudentUpdateTime,
  } = useGlobalContext();
  const [showTable, setShowTable] = useState(false);
  const router = useRouter();
  const access = state.ACCESS;

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFPage, setShowFpage] = useState(true);
  const [showIPage, setShowIpage] = useState(false);
  const studentData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "students"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    const excPP = data.filter((student) => student.nclass !== 0);
    setData(excPP);
    setFilteredData(excPP);
    setShowTable(true);
    setStudentState(data);
    setStudentUpdateTime(Date.now());
  };
  useEffect(() => {
    document.title = `${SCHOOLNAME}:Students Database`;

    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      studentData();
    } else {
      const excPP = studentState.filter((student) => student.nclass !== 0);
      setData(excPP);
      setFilteredData(excPP);
      setShowTable(true);
    }
  }, []);
  useEffect(() => {
    const result = data.filter((el) => {
      return el.student_name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
  }, [search, data]);
  return (
    <div className="container-fluid">
      {showTable ? (
        <div>
          <div className="noprint">
            <div className="col-md-12">
              <h3>Holistic Progress Report Card</h3>
              <button
                className="btn btn-sm btn-danger my-3 mx-2"
                onClick={() => {
                  router.back();
                }}
              >
                Back
              </button>
              <button
                className="btn btn-sm btn-info my-3 mx-2"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
              >
                Print
              </button>
            </div>
            <div className="col-md-12">
              <button
                className="btn btn-sm btn-dark m-1"
                onClick={() => {
                  setShowFpage(true);
                  setShowIpage(false);
                }}
              >
                Front Page
              </button>
              <button
                className="btn btn-sm btn-success m-1"
                onClick={() => {
                  setShowFpage(false);
                  setShowIpage(true);
                }}
              >
                Inside Page
              </button>
            </div>
          </div>
          <div className="col-md-12 my-2">
            {showFPage && (
              <div>
                <HPRCFrontPage data={filteredData} />
              </div>
            )}
            {showIPage && (
              <div>
                <HPRCInsidePage data={filteredData} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loader center content="loading" size="lg" />
      )}
    </div>
  );
}
