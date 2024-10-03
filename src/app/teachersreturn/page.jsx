"use client";
import {
  createDownloadLink,
  monthNamesWithIndex,
} from "@/modules/calculatefunctions";
import {
  BLOCK,
  CIRCLE,
  HOI_MOBILE_NO,
  JLNO,
  KHATIAN_NO,
  LAST_DAY_OF_INSPECTION,
  MEDIUM,
  MOUZA,
  PLOT_NO,
  PO,
  PS,
  SCHNO,
  SCHOOL_AREA,
  SCHOOL_RECOGNITION_DATE,
  SCHOOLNAME,
  UDISE_CODE,
  VILL,
  WARD_NO,
} from "@/modules/constants";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
import { firestore } from "../../context/FirbaseContext";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  deleteDoc,
} from "firebase/firestore";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReturnTeacherData from "./returnTeacherData.json";
import ReturnStudentData from "./returnStudentData.json";
export default function Teachersreturn() {
  const {
    state,
    teachersState,
    teacherUpdateTime,
    setTeachersState,
    setTeacherUpdateTime,
  } = useGlobalContext();

  const access = state?.ACCESS;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [teachers, setTeachers] = useState(ReturnTeacherData);
  const [filteredData, setFilteredData] = useState(ReturnTeacherData);
  const [students, setStudents] = useState(ReturnStudentData);
  const [showRemark, setShowRemark] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [addRemark, setAddRemark] = useState(false);
  const [showFrontPage, setShowFrontPage] = useState(true);
  const [showBackPage, setShowBackPage] = useState(true);
  const [workingDays, setWorkingDays] = useState(24);
  const [editTeacher, setEditTeacher] = useState({
    cast: "",
    tname: "",
    training: "",
    education: "",
    dor: "",
    desig: "",
    rank: "",
    dojnow: "",
    dob: "",
    id: "",
    doj: "",
    clThisMonth: "",
    clThisYear: "",
    olThisMonth: "",
    olThisYear: "",
    fullPay: "",
    halfPay: "",
    WOPay: "",
    workingDays: workingDays,
  });
  const getMonth = () => {
    const currentDate = new Date();
    const month =
      monthNamesWithIndex[
        currentDate.getDate() > 10
          ? currentDate.getMonth()
          : currentDate.getMonth() - 1
      ].monthName.toUpperCase();
    const year = currentDate.getFullYear();

    return `${month} of ${year}`;
  };

  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container-fluid">
      {loader && <Loader />}
      <div className="noprint">
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => {
            createDownloadLink(teachers, "teachers");
          }}
        >
          Download Teachers Data
        </button>
        <div>
          <button
            type="button"
            className="btn btn-success m-2"
            onClick={() => {
              if (typeof window !== undefined) {
                window.print();
              }
            }}
          >
            Print
          </button>
          <button
            className={`btn btn-primary m-2`}
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                setShowBackPage(false);
                setTimeout(() => {
                  window.print();
                  setShowBackPage(true);
                }, 200);
              }
            }}
          >
            Print Front Page
          </button>
          <button
            className={`btn btn-info m-2`}
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                setShowBackPage(true);
                setShowFrontPage(false);
                setTimeout(() => {
                  window.print();
                  setShowFrontPage(true);
                }, 200);
              }
            }}
          >
            Print Back Page
          </button>
        </div>
        <div>
          <button
            className={`btn btn-dark m-2`}
            type="button"
            onClick={() => {
              setShowBackPage(false);
              setShowFrontPage(false);
              setAddRemark(!addRemark);
              if (addRemark) {
                setShowBackPage(true);
                setShowFrontPage(true);
              }
            }}
          >
            {addRemark ? "Close Remark" : "Write Remark"}
          </button>
          <button
            className={`btn btn-primary m-2`}
            type="button"
            onClick={() => {
              setShowRemark(!showRemark);
            }}
          >
            {showRemark ? "Hide Remark" : "Show Remark"}
          </button>
        </div>
      </div>
      <div className="col-md-6 mx-auto my-2 noprint">
        <div className="mb-3 mx-auto col-md-6">
          <h5 htmlFor="rank" className="text-danger">
            ***Set Total Working Days of this Month
          </h5>
          <input
            type="number"
            className="form-control"
            id="workingDays"
            name="workingDays"
            value={workingDays}
            onChange={(e) => {
              if (e.target.value !== "") {
                setWorkingDays(parseInt(e.target.value));
              } else {
                setWorkingDays("");
              }
            }}
          />
        </div>
      </div>
      <div
        className="noprint rounded p-2 m-2 col-md-4 mx-auto"
        style={{ backgroundColor: "#a19e9d" }}
      >
        <h4 className="text-black">Edit Teacher</h4>
        <table className="table table-hover table-sm table-bordered border-black border-1 align-middle table-responsive text-center rounded">
          <thead>
            <tr>
              <th className="text-center" style={{ border: "1px solid" }}>
                SL. NO.
              </th>
              <th className="text-center" style={{ border: "1px solid" }}>
                TEACHER'S NAME
              </th>
              <th className="text-center" style={{ border: "1px solid" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={index} className="teacher-tr">
                <td className="text-center" style={{ border: "1px solid" }}>
                  {index + 1}
                </td>
                <td className="text-center" style={{ border: "1px solid" }}>
                  {teacher.tname}
                </td>
                <td className="text-center" style={{ border: "1px solid" }}>
                  {/* <!-- Button trigger modal --> */}
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    onClick={() => {
                      setEditTeacher(teacher);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                {editTeacher?.tname}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <h6 htmlFor="tname" className="form-label">
                    Name: {editTeacher?.tname}
                  </h6>
                  <h6 htmlFor="rank" className="form-label">
                    Rank: {editTeacher?.rank}
                  </h6>
                  <h6 htmlFor="rank" className="form-label text-danger">
                    *** Please Set This Month&#8217;s Working Days First
                  </h6>
                  <h6 htmlFor="rank" className="form-label text-danger">
                    *** Total Working Days of This Month is {workingDays}
                  </h6>
                </div>
                <div className="mb-3">
                  <label htmlFor="rank" className="form-label">
                    CL This Month
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="clThisMonth"
                    name="clThisMonth"
                    value={editTeacher?.clThisMonth}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setEditTeacher({
                          ...editTeacher,
                          clThisMonth: parseInt(e.target.value),
                          workingDays: workingDays - parseInt(e.target.value),
                        });
                      } else {
                        setEditTeacher({
                          ...editTeacher,
                          clThisMonth: "",
                          workingDays: workingDays,
                        });
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rank" className="form-label">
                    CL This Year
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="clThisYear"
                    name="clThisYear"
                    value={editTeacher?.clThisYear}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setEditTeacher({
                          ...editTeacher,
                          clThisYear: parseInt(e.target.value),
                        });
                      } else {
                        setEditTeacher({
                          ...editTeacher,
                          clThisYear: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rank" className="form-label">
                    Other Leave This Month
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="olThisMonth"
                    name="olThisMonth"
                    value={editTeacher?.olThisMonth}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setEditTeacher({
                          ...editTeacher,
                          olThisMonth: parseInt(e.target.value),
                        });
                      } else {
                        setEditTeacher({
                          ...editTeacher,
                          olThisMonth: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rank" className="form-label">
                    Other Leave This Year
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="olThisYear"
                    name="olThisYear"
                    value={editTeacher?.olThisYear}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setEditTeacher({
                          ...editTeacher,
                          olthisYear: parseInt(e.target.value),
                        });
                      } else {
                        setEditTeacher({
                          ...editTeacher,
                          olThisYear: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rank" className="form-label">
                    Full Pay
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="fullPay"
                    name="fullPay"
                    value={editTeacher?.fullPay}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setEditTeacher({
                          ...editTeacher,
                          fullPay: parseInt(e.target.value),
                        });
                      } else {
                        setEditTeacher({
                          ...editTeacher,
                          fullPay: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rank" className="form-label">
                    Half Pay
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="halfPay"
                    name="halfPay"
                    value={editTeacher?.halfPay}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setEditTeacher({
                          ...editTeacher,
                          halfPay: parseInt(e.target.value),
                        });
                      } else {
                        setEditTeacher({
                          ...editTeacher,
                          halfPay: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rank" className="form-label">
                    Without Pay
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="WOPay"
                    name="WOPay"
                    value={editTeacher?.WOPay}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setEditTeacher({
                          ...editTeacher,
                          WOPay: parseInt(e.target.value),
                        });
                      } else {
                        setEditTeacher({
                          ...editTeacher,
                          WOPay: "",
                        });
                      }
                    }}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  const updatedArray = filteredData
                    .map((t) => (t.id === editTeacher?.id ? editTeacher : t))
                    .sort((a, b) => a.rank - b.rank);
                  setFilteredData(updatedArray);
                  setEditTeacher({
                    cast: "",
                    tname: "",
                    training: "",
                    education: "",
                    dor: "",
                    desig: "",
                    rank: "",
                    dojnow: "",
                    dob: "",
                    id: "",
                    doj: "",
                    clThisMonth: "",
                    clThisYear: "",
                    olThisMonth: "",
                    olThisYear: "",
                    fullPay: "",
                    halfPay: "",
                    WOPay: "",
                  });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {showFrontPage && (
        <div className="mx-auto nobreak p-2" style={{ border: "2px solid" }}>
          <div>
            <h3 className="text-center dejavu fs-4 m-0 p-0">
              HOWRAH DISTRICT PRIMARY SCHOOL COUNCIL
            </h3>
            <h3 className="text-center dejavu fs-5 m-0 p-0">
              MONTHLY RETURN OF SCHOOL
            </h3>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-start mt-2">
            <p>
              U. Dise Code No.{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {UDISE_CODE}
              </span>
            </p>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  position: "absolute",
                  marginLeft: 80,
                  marginTop: -14,
                }}
              >
                <p className="m-0 p-0">
                  <i className="bi bi-check2"></i>
                </p>
              </div>
              <p className="m-0 p-0">
                Contact No.: HT/<del>TIC</del>&nbsp;&nbsp;
                <span
                  className="fw-bold"
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                  }}
                >
                  {HOI_MOBILE_NO}
                </span>
              </p>
              <p className="m-0 p-0">
                Month:&nbsp;&nbsp;
                <span
                  className="fw-bold"
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                  }}
                >
                  {getMonth()}
                </span>
              </p>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-start mt-2">
            <p>
              Name of School{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {SCHOOLNAME}
              </span>
            </p>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  position: "absolute",
                  marginLeft: 45,
                  marginTop: -14,
                }}
              >
                <p className="m-0 p-0">
                  <i className="bi bi-check2"></i>
                </p>
              </div>
              <p className="m-0 p-0">
                <del>Morn.</del>/Day Section time &nbsp;&nbsp;
                <span
                  className="fw-bold"
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                  }}
                >
                  11 A.M. TO 4 P.M.
                </span>
              </p>
            </div>
          </div>
          <div
            className="d-flex flex-wrap justify-content-between align-items-start"
            style={{ marginTop: -15 }}
          >
            <p>
              Vill.{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {VILL}
              </span>
            </p>
            <p>
              P.O.{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {PO}
              </span>
            </p>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  position: "absolute",
                  marginLeft: 45,
                  marginTop: -14,
                }}
              >
                <p className="m-0 p-0">
                  <i className="bi bi-check2"></i>
                </p>
              </div>
              <p className="m-0 p-0">
                Panchayet Samity<del>/Municipality/Municipal Corporation</del>
                &nbsp;&nbsp;
                <span
                  className="fw-bold"
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                  }}
                >
                  {BLOCK}
                </span>
              </p>
            </div>
          </div>
          <div
            className="d-flex flex-wrap justify-content-between align-items-start"
            style={{ marginTop: -15 }}
          >
            <p>
              P.S.{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {PS}
              </span>
            </p>

            <div>
              <div
                style={{
                  fontSize: "18px",
                  position: "absolute",
                  marginLeft: 5,
                  marginTop: -14,
                }}
              >
                <p className="m-0 p-0">
                  <i className="bi bi-check2"></i>
                </p>
              </div>
              <p className="m-0 p-0">
                GP/<del>/Ward</del>
                &nbsp;&nbsp;
                <span
                  className="fw-bold"
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                  }}
                >
                  {WARD_NO}
                </span>
              </p>
            </div>
            <p>
              Mouza{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {MOUZA}
              </span>
            </p>
            <p>
              J.L. No.{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {JLNO}
              </span>
            </p>
            <p>
              School Sl. No.{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {SCHNO}
              </span>
            </p>
          </div>
          <div
            className="d-flex flex-wrap justify-content-start align-items-start"
            style={{ marginTop: -15 }}
          >
            <p>
              Circle{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {CIRCLE}
              </span>
            </p>

            <p style={{ marginLeft: 20 }}>
              Medium{" "}
              <span
                className="fw-bold"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                {MEDIUM}
              </span>
            </p>
          </div>
          <div className="mx-auto">
            <h4 className="dejavu fs-5">PART- 'A': PARTICULARS OF TEACHERS</h4>
          </div>
          <div className="mx-auto">
            <table style={{ border: "1px solid", width: "100%", zoom: 0.9 }}>
              <thead>
                <tr style={{ border: "1px solid" }}>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Sl. No.
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Name of Teacher
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Desig-
                    <br />
                    nation
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Educational
                    <br /> Qualification
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Date of Birth
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Joining date as approved teacher
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Joining date in this school
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    S.C./ S.T./ O.B.C.-A/ O.B.C.-B/ PH
                  </th>
                  <th
                    colSpan={2}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Casual Leave
                  </th>
                  <th
                    colSpan={5}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Other Leave
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Total working days in this month <br />({workingDays})
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Full signature of teacher with date
                  </th>
                  <th
                    rowSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    Remaks
                  </th>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <th
                    rowSpan={2}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    In this month
                  </th>
                  <th
                    rowSpan={2}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    From 1st Jon.
                  </th>
                  <th
                    rowSpan={2}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    In this month
                  </th>
                  <th
                    rowSpan={2}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    From 1st Jan.
                  </th>
                  <th
                    colSpan={3}
                    style={{ border: "1px solid", paddingInline: 2 }}
                  >
                    From 1st Jan.
                  </th>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Full Pay
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Half Pay
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Without Pay
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Teachers data */}
                {filteredData.map((teacher, index) => (
                  <React.Fragment key={index}>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>{index + 1}</td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {teacher.tname}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {teacher.desig}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {teacher.education},
                        <br />
                        {teacher.training}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {teacher.dob}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {teacher.doj}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {teacher.dojnow}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {teacher.cast}
                      </td>
                      <td
                        id={`${teacher.id}-clThisMonth`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        {teacher.clThisMonth ? teacher.clThisMonth : "-"}
                      </td>
                      <td
                        id={`${teacher.id}-clThisYear`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        {teacher.clThisYear ? teacher.clThisYear : "-"}
                      </td>
                      <td
                        id={`${teacher.id}-olThisMonth`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        {teacher.olThisMonth ? teacher.olThisMonth : "-"}
                      </td>
                      <td
                        id={`${teacher.id}-olThisYear`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        {teacher.olThisYear ? teacher.olThisYear : "-"}
                      </td>
                      <td
                        id={`${teacher.id}-olFullpay`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        {teacher.fullPay ? teacher.fullPay : "-"}
                      </td>
                      <td
                        id={`${teacher.id}-olHalfpay`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        {teacher.halfPay ? teacher.halfPay : "-"}
                      </td>
                      <td
                        id={`${teacher.id}-olWOpay`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        {teacher.WOPay ? teacher.WOPay : "-"}
                      </td>
                      <td
                        id={`${teacher.id}-workingDay`}
                        style={{ border: "1px solid", paddingInline: 2 }}
                        onClick={() => console.log(teacher.workingDays)}
                      >
                        {teacher.workingDays ? teacher.workingDays : "-"}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                          width: 300,
                          height: 65,
                        }}
                      ></td>
                      <td
                        style={{ border: "1px solid", paddingInline: 2 }}
                      ></td>
                    </tr>
                    <tr>
                      <td
                        colSpan={18}
                        style={{ border: "1px solid", height: 5 }}
                      ></td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="mt-5 mb-3 d-flex justify-content-between align-items-center">
              <div>
                {" "}
                <h6>
                  1..............................................................2.....................................................................
                </h6>
                <h6>Signature of two members of Committee</h6>
              </div>
              <div>
                {" "}
                <h6>
                  …......................................................................
                </h6>
                <h6>Signature of Head Teacher / Teacher- In-Charge</h6>
              </div>
            </div>
          </div>
        </div>
      )}
      {showBackPage && (
        <div
          className="mx-auto  nobreak p-2"
          style={{ border: "2px solid", zoom: 0.8 }}
        >
          <div
            className="mx-auto"
            style={{ border: "1px solid", width: "100%" }}
          >
            <h4 className="dejavu fs-5">PART- 'B': PARTICULARS OF STUDENTS</h4>
          </div>
          <div
            className="mx-auto"
            style={{ border: "1px solid", width: "100%" }}
          >
            <table style={{ border: "1px solid", width: "100%" }}>
              <thead>
                <tr style={{ border: "1px solid" }}>
                  <th colSpan={2} style={{ border: "1px solid" }}>
                    Required information
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Class-
                    <br />
                    Pre Pry
                    <br /> [Who will
                    <br /> be in
                    <br /> Class-I
                    <br /> next year]
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Class-I
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Class-II
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Class-III
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Class-IV
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Class-V
                  </th>
                  <th style={{ border: "1px solid", paddingInline: 2 }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    Total
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.Boys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.Boys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.Boys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.Boys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.Boys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.Boys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.Boys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.Girls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.Girls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.Girls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.Girls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.Girls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.Girls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.Girls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.Total}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.Total}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.Total}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.Total}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.Total}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.Total}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.Total}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    General (Excluding Minority)
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.GeneralBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.GeneralBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.GeneralBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.GeneralBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.GeneralBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.GeneralBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.GeneralBoys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.GeneralGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.GeneralGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.GeneralGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.GeneralGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.GeneralGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.GeneralGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.GeneralGirls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.GeralTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.GeralTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.GeralTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.GeralTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.GeralTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.GeralTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.GeralTotal}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    Sch. Caste
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ScBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ScBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ScBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ScBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ScBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ScBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ScBoys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ScGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ScGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ScGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ScGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ScGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ScGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ScGirls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ScTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ScTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ScTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ScTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ScTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ScTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ScTotal}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    Sch. Tribe
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.StBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.StBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.StBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.StBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.StBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.StBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.StBoys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.StGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.StGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.StGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.StGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.StGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.StGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.StGirls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.StTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.StTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.StTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.StTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.StTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.StTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.StTotal}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    O.B.C. A Minority
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ObcABoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ObcABoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ObcABoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ObcABoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ObcABoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ObcABoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ObcABoys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ObcAGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ObcAGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ObcAGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ObcAGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ObcAGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ObcAGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ObcAGirls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ObcATotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ObcATotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ObcATotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ObcATotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ObcATotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ObcATotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ObcATotal}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    O.B.C. B
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ObcBBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ObcABoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ObcBBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ObcBBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ObcBBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ObcBBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ObcBBoys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ObcBGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ObcBGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ObcBGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ObcBGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ObcBGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ObcBGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ObcBGirls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.ObcBTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.ObcBTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.ObcBTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.ObcBTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ObcBTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.ObcBTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.ObcBTotal}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    Minority Excluding O.B.C.-A
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.MinorityBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.MinorityBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.MinorityBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.MinorityBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.ObcBBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.MinorityBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.MinorityBoys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.MinorityGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.MinorityGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.MinorityGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.MinorityGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.MinorityGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.MinorityGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.MinorityGirls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.MinorityTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.MinorityTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.MinorityTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.MinorityTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.MinorityTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.MinorityTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.MinorityTotal}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td colSpan={2} style={{ border: "1px solid" }}>
                    Average Attendance of the month
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.averageAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.averageAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.averageAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.averageAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.averageAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.averageAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.averageAttendance}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td colSpan={2} style={{ border: "1px solid" }}>
                    Absentees for all or more of the working days of the month
                  </td>
                  <td style={{ border: "1px solid" }}>-</td>
                  <td style={{ border: "1px solid" }}>-</td>
                  <td style={{ border: "1px solid" }}>-</td>
                  <td style={{ border: "1px solid" }}>-</td>
                  <td style={{ border: "1px solid" }}>-</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.averageAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>-</td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid", height: 80 }}>Remarks</td>
                  <td colSpan={8} style={{ border: "1px solid", height: 80 }}>
                    {showRemark && remarks}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td colSpan={2} style={{ border: "1px solid", height: 80 }}>
                    No. of Attendance of students on the date of last inspection
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.inspectionDateAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.inspectionDateAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.inspectionDateAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.inspectionDateAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.inspectionDateAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.inspectionDateAttendance}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.inspectionDateAttendance}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td rowSpan={3} style={{ border: "1px solid" }}>
                    Total as on last December
                  </td>
                  <td style={{ border: "1px solid" }}>Boys</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.lastYearBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.lastYearBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.lastYearBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.lastYearBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.lastYearBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.lastYearBoys}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.lastYearBoys}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Girls</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.lastYearGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.lastYearGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.lastYearGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.lastYearGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.lastYearGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.lastYearGirls}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.lastYearGirls}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td style={{ border: "1px solid" }}>Total</td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.pp.lastYearTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.i.lastYearTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.ii.lastYearTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iii.lastYearTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.iv.lastYearTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.v.lastYearTotal}
                  </td>
                  <td style={{ border: "1px solid" }}>
                    {ReturnStudentData.total.lastYearTotal}
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td colSpan={9} style={{ border: "1px solid" }}>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        Source of drinking water :{" "}
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          SUBMERSILE
                        </span>
                      </p>
                      <p className="m-0 p-0">
                        Water Supply in Toilets :{" "}
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          Yes
                        </span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        No. of Girls' Toilet :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          4
                        </span>
                      </p>
                      <p className="m-0 p-0">
                        Own Electricity :{" "}
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          Yes
                        </span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        Whether the toilets used by the outsiders :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          No
                        </span>
                      </p>
                      <p className="m-0 p-0">
                        Note : (1 or 2 erected) :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          2
                        </span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        Whether the students use the toilet properly :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          Yes
                        </span>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr style={{ border: "1px solid" }}>
                  <td colSpan={9} style={{ border: "1px solid" }}>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        Date of last Inspection :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          {LAST_DAY_OF_INSPECTION}
                        </span>
                      </p>
                      <p className="m-0 p-0">
                        Recognition date of school :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          {SCHOOL_RECOGNITION_DATE}
                        </span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        Area of school's Land :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          {SCHOOL_AREA}
                        </span>
                      </p>
                      <p className="m-0 p-0">
                        Khatian No.:
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          {KHATIAN_NO}
                        </span>
                      </p>
                      <p className="m-0 p-0">
                        Own or Rented building :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          Own
                        </span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        PLOT/Dag No. :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          {PLOT_NO}
                        </span>
                      </p>
                      <p className="m-0 p-0">
                        If rented amount of rent:
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          N/A
                        </span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <p className="m-0 p-0">
                        If own building Regd deed is available or not Yes/No :
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                          }}
                        >
                          Yes
                        </span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="mx-auto"
            style={{ border: "1px solid", width: "100%" }}
          >
            <h4 className="dejavu fs-5">
              PART - 'C' : ACCOUNTS OF CONTINGENT GRANT
            </h4>
          </div>
          <div
            className="mx-auto"
            style={{ border: "1px solid", width: "100%" }}
          >
            <div className="d-flex justify-content-evenly align-items-center">
              <p className="m-0 p-0">Opening Balance = Rs. 0</p>
              <p className="m-0 p-0">Expenditure in the last month = Rs. 50</p>
            </div>
            <div className="d-flex justify-content-evenly align-items-center">
              <p className="m-0 p-0">Received = Rs. 0</p>
              <p className="m-0 p-0">Closing Balance = Rs. 0</p>
            </div>
            <div className="d-flex justify-content-evenly align-items-center">
              <p className="m-0 p-0">Total = Rs. 0</p>
              <p className="m-0 p-0" style={{ width: 100 }}>
                {"             "}
              </p>
            </div>
            <div className="my-2 d-flex justify-content-evenly align-items-center">
              <h5 className="fw-bold">Countersigned</h5>
              <p className="" style={{ width: 100 }}>
                {"             "}
              </p>
            </div>
            <div className="my-5 d-flex justify-content-evenly align-items-center">
              <h6 className="fw-bold">Sub Inspector of Schools</h6>
              <h6 className="fw-bold">
                Signature of Head Teacher / Teacher- In-Charge
              </h6>
            </div>
          </div>
        </div>
      )}
      {addRemark && (
        <div>
          <div className="form-group m-2">
            <label className="m-2">Remarks</label>
            <textarea
              className="form-control"
              id="remarks"
              rows="5"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add Remarks"
            />
          </div>
          <button
            className="btn btn-success m-2"
            type="button"
            onClick={() => {
              setAddRemark(false);
              setShowFrontPage(true);
              setShowBackPage(true);
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
