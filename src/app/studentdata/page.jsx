"use client";
import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { createDownloadLink } from "@/modules/calculatefunctions";
import Loader from "@/components/Loader";
import { firestore } from "@/context/FirbaseContext";
import { collection, getDocs, query } from "firebase/firestore";
import { SCHOOLNAME } from "@/modules/constants";
import { useGlobalContext } from "../../context/Store";
export default function StudentData() {
  const {
    state,
    studentState,
    studentUpdateTime,
    setStudentState,
    setStudentUpdateTime,
  } = useGlobalContext();
  const [showTable, setShowTable] = useState(false);
  const access = state.ACCESS;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const studentData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "students"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
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
      setData(studentState);
      setShowTable(true);
    }
  }, []);
  useEffect(() => {
    const result = data.filter((el) => {
      return el.student_name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
  }, [search, data]);
  const columns = [
    {
      name: "Sl",
      selector: (row, ind) => data.findIndex((i) => i.id === row.id) + 1,
      width: "2",
    },

    {
      name: "Student Name",
      selector: (row) => row.student_name,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Class",
      selector: (row) => row.class.split(" (A)")[0],
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Roll No.",
      selector: (row) => row.roll_no,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Student ID",
      selector: (row) => row.student_id,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Gurdian's Name",
      selector: (row) => row.guardians_name,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Mobile",
      selector: (row) =>
        row.mobile === "0" ? (
          <p>No Data</p>
        ) : row.mobile === "9999999999" ? (
          <p>No Data</p>
        ) : row.mobile === "7872882343" ? (
          <p>No Data</p>
        ) : row.mobile === "7679230482" ? (
          <p>No Data</p>
        ) : row.mobile === "9933684468" ? (
          <p>No Data</p>
        ) : (
          <p>
            <a
              href={`tel: +91${row.mobile}`}
              className="d-inline-block text-decoration-none text-dark"
            >
              <i className="bi bi-telephone-fill"></i>
              {"  "}
              +91{row.mobile}
            </a>
          </p>
        ),
      sortable: false,
      wrap: +true,
      center: +true,
    },
  ];
  return (
    <div className="container text-center my-3">
      <h2 className="text-center text-success">{SCHOOLNAME}</h2>
      {showTable ? (
        <>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              createDownloadLink(data, "students");
            }}
          >
            Download Data
          </button>
          <h3 className="text-center text-primary">Student&apos;s Deatails</h3>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
            subHeaderAlign="right"
          />
        </>
      ) : (
        <Loader center content="loading" size="lg" />
      )}
    </div>
  );
}
