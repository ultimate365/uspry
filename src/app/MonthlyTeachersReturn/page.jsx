"use client";
import {
  createDownloadLink,
  sortMonthwise,
  uniqArray,
} from "@/modules/calculatefunctions";
import {
  BLOCK,
  BUILDING,
  CIRCLE,
  DRINKING_WATER,
  GIRLS_TOILET,
  HOI_DESIGNATION,
  HOI_MOBILE_NO,
  JLNO,
  KHATIAN_NO,
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
import { getDocs, query, collection } from "firebase/firestore";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import ReturnPrint from "@/pdf/ReturnPrint";
export default function MonthlyTeachersReturn() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const { state, returnState, setReturnState } = useGlobalContext();
  const access = state?.ACCESS;
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [yearArray, setYearArray] = useState([]);
  const [allEnry, setAllEnry] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [remarks, setRemarks] = useState("");
  const [filteredEntry, setFilteredEntry] = useState([]);
  const [moreFilteredEntry, setMoreFilteredEntry] = useState([]);
  const [entryMonths, setEntryMonths] = useState("");
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [showRemark, setShowRemark] = useState(true);
  const [inspection, setInspection] = useState({
    inspectionDate: "",
    pp: "",
    i: "",
    ii: "",
    iii: "",
    iv: "",
    v: "",
    total: "",
  });
  const [showFrontPage, setShowFrontPage] = useState(true);
  const [showBackPage, setShowBackPage] = useState(false);
  const [frontPageZoom, setFrontPageZoom] = useState(93);
  const [backPageZoom, setBackPageZoom] = useState(80);
  const [showZoom, setShowZoom] = useState(false);
  const [workingDays, setWorkingDays] = useState(24);
  const [filteredData, setFilteredData] = useState();
  const [students, setStudents] = useState();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showData, setShowData] = useState(false);
  const [thisMonthReturnData, setThisMonthReturnData] = useState({});
  const getMonth = () => {
    return `${month.toUpperCase()} of ${year}`;
  };
  const handleChange = (e) => {
    if (e.target.value !== "") {
      if (typeof window !== undefined) {
        let monthSelect = document.getElementById("month-select");
        if (monthSelect) {
          monthSelect.value = "";
        }
      }
      const selectedValue = e.target.value;
      let x = [];
      let y = [];
      allEnry.map((entry) => {
        const entryYear = entry.id.split("-")[1];
        const entryMonth = entry.id.split("-")[0];

        if (entryYear === selectedValue) {
          x.push(entry);
          y.push(entryMonth);
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setFilteredEntry(x);
      setMoreFilteredEntry(x);
      setEntryMonths(uniqArray(y));
    } else {
      setFilteredEntry([]);
      setSelectedYear("");
      setShowMonthSelection(false);
      toast.error("Please select a year");
    }
  };
  const handleMonthChange = (month) => {
    console.log(month);
    let x = [];

    allEnry.map((entry, index) => {
      const entryYear = entry.id.split("-")[1];
      const entryMonth = entry.id.split("-")[0];
      if (entryYear === selectedYear && entryMonth === month) {
        x.push(entry);
        setShowData(true);
        setRemarks(entry?.remarks);
        setWorkingDays(entry?.workingDays);
        setInspection(entry?.inspection);
        setFilteredData(entry?.teachers);
        setStudents(entry?.students);
        setMonth(entry?.month);
        setYear(entry?.year);
        setThisMonthReturnData(entry);
        return x;
      }
    });
    setFilteredEntry(x);
  };

  const getMonthlyData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "monthlyTeachersReturn"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    const monthwiseSorted = sortMonthwise(data);
    setReturnState(monthwiseSorted);
    setLoader(false);
    calledData(monthwiseSorted);
  };
  const calledData = (array) => {
    let x = [];
    array.map((entry) => {
      const entryYear = entry.id.split("-")[1];
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setYearArray(x);

    setLoader(false);
    setAllEnry(array);
    setFilteredEntry(array);
  };

  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    if (returnState.length === 0) {
      getMonthlyData();
    } else {
      calledData(returnState);
    }
  }, []);
  useEffect(() => {
    document.title = `${filteredEntry[0]?.id} Teachers Return`;
    //eslint-disable-next-line
  }, [filteredEntry]);
  return (
    <div className="container-fluid">
      <div className="noprint">
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => {
            createDownloadLink(allEnry, "monthlyTeachersReturn");
          }}
        >
          Download Monthly Return Data
        </button>
        {showZoom && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Set Page Zoom
                  </h1>
                </div>
                <div className="modal-body">
                  <div className="mx-auto my-2 noprint">
                    <div className="mb-3 mx-auto">
                      <h5 htmlFor="rank" className="text-danger">
                        ***Write percent without "%" e.g.(80, 90)
                      </h5>
                      <input
                        type="number"
                        className="form-control m-2 col-md-4"
                        id="frontPageZoom"
                        name="frontPageZoom"
                        placeholder="Front Page Zoom"
                        value={frontPageZoom}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setFrontPageZoom(parseInt(e.target.value));
                          } else {
                            setFrontPageZoom("");
                          }
                        }}
                      />
                      <input
                        type="number"
                        className="form-control m-2 col-md-4"
                        id="frontPageZoom"
                        name="frontPageZoom"
                        placeholder="Back Page Zoom"
                        value={backPageZoom}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setBackPageZoom(parseInt(e.target.value));
                          } else {
                            setBackPageZoom("");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  {frontPageZoom > 0 && backPageZoom > 0 && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        setShowZoom(false);
                        setShowData(true);
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <h4>Select Year</h4>
          <div className="col-md-4 mx-auto mb-3 noprint">
            <select
              className="form-select"
              defaultValue={""}
              onChange={handleChange}
              aria-label="Default select example"
            >
              <option className="text-center text-primary" value="">
                Select Data Year
              </option>
              {yearArray.map((el, i) => (
                <option
                  className="text-center text-success text-wrap"
                  key={i}
                  value={el}
                >
                  {"Year - " + el}
                </option>
              ))}
            </select>
          </div>
          {selectedYear && showMonthSelection ? (
            <div className="noprint">
              {entryMonths.length > 1 && (
                <h4 className="text-center text-primary">Select Month</h4>
              )}
            </div>
          ) : null}
          {showMonthSelection && (
            <div className="row d-flex justify-content-center noprint">
              {entryMonths.length > 0 && (
                <div className="col-md-4 mx-auto mb-3 noprint">
                  <select
                    className="form-select"
                    id="month-select"
                    defaultValue={""}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleMonthChange(e.target.value);
                        console.log(e.target.value);
                      } else {
                        setFilteredEntry(moreFilteredEntry);
                        setShowData(false);
                        toast.error("Please select a Month");
                        if (typeof window !== undefined) {
                          document.getElementById("month-select").value = "";
                        }
                      }
                    }}
                    aria-label="Default select example"
                  >
                    <option value="" className="text-center text-primary">
                      Select Month
                    </option>
                    {entryMonths
                      // .slice(1, entryMonths.length)
                      .map((month, index) => (
                        <option
                          className="text-center text-success"
                          key={index}
                          value={month}
                        >
                          {month}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
        {showData && (
          <div className="allButtons">
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                createDownloadLink(
                  filteredEntry,
                  `${filteredEntry[0]?.id} Teachers Return`
                );
              }}
            >
              Download {month} {year} Return Data
            </button>
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                createDownloadLink(returnState, `monthlyTeachersReturn`);
              }}
            >
              Download All Return Data
            </button>
            {/* <button
              type="button"
              className="btn btn-dark m-2"
              onClick={() => {
                const data = JSON.stringify(thisMonthReturnData);
                router.push(`/downloadTeachersReturn?data=${data}`);
              }}
            >
              Download {month} {year} PDF
            </button> */}
            <PDFDownloadLink
              document={<ReturnPrint data={thisMonthReturnData} />}
              fileName={`${filteredEntry[0]?.id} Teachers Return.pdf`}
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
                loading ? "Loading..." : "Download Teachers Return PDF"
              }
            </PDFDownloadLink>
            {/* <ReturnPrint data={thisMonthReturnData} /> */}
            <button
              type="button"
              className="btn btn-warning m-2"
              onClick={() => {
                setShowZoom(true);
                setShowData(false);
              }}
            >
              Set Page Zoom
            </button>
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
            {showBackPage && (
              <button
                className={`btn btn-dark m-2`}
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    setShowFrontPage(true);
                    setShowBackPage(false);
                  }
                }}
              >
                Show Front Page
              </button>
            )}
            {showFrontPage && (
              <button
                className={`btn btn-info m-2`}
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    setShowBackPage(true);
                    setShowFrontPage(false);
                  }
                }}
              >
                Show Back Page
              </button>
            )}
            {remarks.length > 0 && (
              <button
                className={`btn btn-primary m-2`}
                type="button"
                onClick={() => {
                  setShowRemark(!showRemark);
                }}
              >
                {showRemark ? "Hide Remark" : "Show Remark"}
              </button>
            )}
          </div>
        )}
      </div>
      {loader && <Loader />}
      {showData && (
        <div
          style={{
            width: "100%",
            overflowX: "scroll",
            flexWrap: "wrap",
          }}
        >
          {showFrontPage && (
            <div
              className="mx-auto nobreak p-2"
              style={{ border: "2px solid", zoom: frontPageZoom / 100 || 0.93 }}
            >
              <div className="p-2">
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
                    U. Dise Code No.:&nbsp;&nbsp;
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
                    Name of School:&nbsp;&nbsp;
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
                    Vill.:&nbsp;&nbsp;
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
                    P.O.:&nbsp;&nbsp;
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
                      Panchayet Samity
                      <del>/Municipality/Municipal Corporation</del>
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
                    P.S.:&nbsp;&nbsp;
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
                    Mouza:&nbsp;&nbsp;
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
                    J.L. No.:&nbsp;&nbsp;
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
                    School Sl. No.:&nbsp;&nbsp;
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
                    Circle:&nbsp;&nbsp;
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
                    Medium:&nbsp;&nbsp;
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
              </div>
              <div className="mx-auto">
                <h4 className="dejavu fs-5">
                  PART- 'A': PARTICULARS OF TEACHERS
                </h4>
              </div>
              <div className="mx-auto">
                <table
                  style={{
                    border: "1px solid",
                    width: "100%",
                    overflowX: "scroll",
                    flexWrap: "wrap",
                  }}
                >
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
                              height: 75,
                            }}
                          ></td>
                          <td
                            style={{
                              border: "1px solid",
                              paddingInline: 2,
                              fontSize: 10,
                            }}
                          >
                            {teacher.remarks ? teacher.remarks : ""}
                          </td>
                        </tr>
                        {index !== filteredData.length - 1 && (
                          <tr>
                            <td
                              colSpan={18}
                              style={{ border: "1px solid", height: 5 }}
                            ></td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="mt-5 mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    &nbsp;&nbsp;
                    <h6>
                      1..............................................................2.....................................................................
                    </h6>
                    <h6>Signature of two members of Committee</h6>
                  </div>
                  <div>
                    &nbsp;&nbsp;
                    <h6>
                      …......................................................................
                    </h6>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h6>Signature of&nbsp; </h6>
                      <h6
                        style={{
                          textDecoration:
                            HOI_DESIGNATION === "HT" ? "none" : "line-through",
                        }}
                      >
                        Head Teacher&nbsp;
                      </h6>
                      <h6
                        style={{
                          textDecoration:
                            HOI_DESIGNATION === "HT" ? "line-through" : "none",
                        }}
                      >
                        &nbsp; /&nbsp;
                      </h6>
                      <h6
                        style={{
                          textDecoration:
                            HOI_DESIGNATION === "HT" ? "line-through" : "none",
                        }}
                      >
                        Teacher- In-Charge
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showBackPage && (
            <div
              className="mx-auto  nobreak p-2"
              style={{ border: "2px solid", zoom: backPageZoom / 100 || 0.8 }}
            >
              <div className="mx-auto" style={{ width: "100%" }}>
                <h4 className="dejavu fs-5">
                  PART- 'B': PARTICULARS OF STUDENTS
                </h4>
              </div>
              <div className="mx-auto" style={{ width: "100%" }}>
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
                        {students?.pp?.Boys ? students?.pp?.Boys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.Boys ? students?.i?.Boys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.Boys ? students?.ii?.Boys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.Boys ? students?.iii?.Boys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.Boys ? students?.iv?.Boys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.Boys ? students?.v?.Boys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.Boys ? students?.total?.Boys : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.Girls ? students?.pp?.Girls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.Girls ? students?.i?.Girls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.Girls ? students?.ii?.Girls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.Girls ? students?.iii?.Girls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.Girls ? students?.iv?.Girls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.Girls ? students?.v?.Girls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.Girls ? students?.total?.Girls : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.Total ? students?.pp?.Total : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.Total ? students?.i?.Total : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.Total ? students?.ii?.Total : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.Total ? students?.iii?.Total : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.Total ? students?.iv?.Total : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.Total ? students?.v?.Total : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.Total ? students?.total?.Total : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        General (Excluding Minority)
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.GeneralBoys
                          ? students?.pp?.GeneralBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.GeneralBoys
                          ? students?.i?.GeneralBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.GeneralBoys
                          ? students?.ii?.GeneralBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.GeneralBoys
                          ? students?.iii?.GeneralBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.GeneralBoys
                          ? students?.iv?.GeneralBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.GeneralBoys
                          ? students?.v?.GeneralBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.GeneralBoys
                          ? students?.total?.GeneralBoys
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.GeneralGirls
                          ? students?.pp?.GeneralGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.GeneralGirls
                          ? students?.i?.GeneralGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.GeneralGirls
                          ? students?.ii?.GeneralGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.GeneralGirls
                          ? students?.iii?.GeneralGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.GeneralGirls
                          ? students?.iv?.GeneralGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.GeneralGirls
                          ? students?.v?.GeneralGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.GeneralGirls
                          ? students?.total?.GeneralGirls
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.GeneralTotal
                          ? students?.pp?.GeneralTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.GeneralTotal
                          ? students?.i?.GeneralTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.GeneralTotal
                          ? students?.ii?.GeneralTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.GeneralTotal
                          ? students?.iii?.GeneralTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.GeneralTotal
                          ? students?.iv?.GeneralTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.GeneralTotal
                          ? students?.v?.GeneralTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.GeneralTotal
                          ? students?.total?.GeneralTotal
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        Sch. Caste
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ScBoys ? students?.pp?.ScBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ScBoys ? students?.i?.ScBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ScBoys ? students?.ii?.ScBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ScBoys ? students?.iii?.ScBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ScBoys ? students?.iv?.ScBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ScBoys ? students?.v?.ScBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ScBoys
                          ? students?.total?.ScBoys
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ScGirls ? students?.pp?.ScGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ScGirls ? students?.i?.ScGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ScGirls ? students?.ii?.ScGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ScGirls ? students?.iii?.ScGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ScGirls ? students?.iv?.ScGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ScGirls ? students?.v?.ScGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ScGirls
                          ? students?.total?.ScGirls
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ScTotal ? students?.pp?.ScTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ScTotal ? students?.i?.ScTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ScTotal ? students?.ii?.ScTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ScTotal ? students?.iii?.ScTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ScTotal ? students?.iv?.ScTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ScTotal ? students?.v?.ScTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ScTotal
                          ? students?.total?.ScTotal
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        Sch. Tribe
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.StBoys ? students?.pp?.StBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.StBoys ? students?.i?.StBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.StBoys ? students?.ii?.StBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.StBoys ? students?.iii?.StBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.StBoys ? students?.iv?.StBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.StBoys ? students?.v?.StBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.StBoys
                          ? students?.total?.StBoys
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.StGirls ? students?.pp?.StGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.StGirls ? students?.i?.StGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.StGirls ? students?.ii?.StGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.StGirls ? students?.iii?.StGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.StGirls ? students?.iv?.StGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.StGirls ? students?.v?.StGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.StGirls
                          ? students?.total?.StGirls
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.StTotal ? students?.pp?.StTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.StTotal ? students?.i?.StTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.StTotal ? students?.ii?.StTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.StTotal ? students?.iii?.StTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.StTotal ? students?.iv?.StTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.StTotal ? students?.v?.StTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.StTotal
                          ? students?.total?.StTotal
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        O.B.C. A Minority
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcABoys ? students?.pp?.ObcABoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcABoys ? students?.i?.ObcABoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcABoys ? students?.ii?.ObcABoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcABoys
                          ? students?.iii?.ObcABoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcABoys ? students?.iv?.ObcABoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcABoys ? students?.v?.ObcABoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcABoys
                          ? students?.total?.ObcABoys
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcAGirls
                          ? students?.pp?.ObcAGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcAGirls ? students?.i?.ObcAGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcAGirls
                          ? students?.ii?.ObcAGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcAGirls
                          ? students?.iii?.ObcAGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcAGirls
                          ? students?.iv?.ObcAGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcAGirls ? students?.v?.ObcAGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcAGirls
                          ? students?.total?.ObcAGirls
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcATotal
                          ? students?.pp?.ObcATotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcATotal ? students?.i?.ObcATotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcATotal
                          ? students?.ii?.ObcATotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcATotal
                          ? students?.iii?.ObcATotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcATotal
                          ? students?.iv?.ObcATotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcATotal ? students?.v?.ObcATotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcATotal
                          ? students?.total?.ObcATotal
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        O.B.C. B
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcBBoys ? students?.pp?.ObcBBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcABoys ? students?.i?.ObcABoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcBBoys ? students?.ii?.ObcBBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcBBoys
                          ? students?.iii?.ObcBBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBBoys ? students?.iv?.ObcBBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcBBoys ? students?.v?.ObcBBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcBBoys
                          ? students?.total?.ObcBBoys
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcBGirls
                          ? students?.pp?.ObcBGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcBGirls ? students?.i?.ObcBGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcBGirls
                          ? students?.ii?.ObcBGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcBGirls
                          ? students?.iii?.ObcBGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBGirls
                          ? students?.iv?.ObcBGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcBGirls ? students?.v?.ObcBGirls : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcBGirls
                          ? students?.total?.ObcBGirls
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcBTotal
                          ? students?.pp?.ObcBTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcBTotal ? students?.i?.ObcBTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcBTotal
                          ? students?.ii?.ObcBTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcBTotal
                          ? students?.iii?.ObcBTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBTotal
                          ? students?.iv?.ObcBTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcBTotal ? students?.v?.ObcBTotal : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcBTotal
                          ? students?.total?.ObcBTotal
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        Minority Excluding O.B.C.-A
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.MinorityBoys
                          ? students?.pp?.MinorityBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.MinorityBoys
                          ? students?.i?.MinorityBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.MinorityBoys
                          ? students?.ii?.MinorityBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.MinorityBoys
                          ? students?.iii?.MinorityBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBBoys ? students?.iv?.ObcBBoys : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.MinorityBoys
                          ? students?.v?.MinorityBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.MinorityBoys
                          ? students?.total?.MinorityBoys
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.MinorityGirls
                          ? students?.pp?.MinorityGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.MinorityGirls
                          ? students?.i?.MinorityGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.MinorityGirls
                          ? students?.ii?.MinorityGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.MinorityGirls
                          ? students?.iii?.MinorityGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.MinorityGirls
                          ? students?.iv?.MinorityGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.MinorityGirls
                          ? students?.v?.MinorityGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.MinorityGirls
                          ? students?.total?.MinorityGirls
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.MinorityTotal
                          ? students?.pp?.MinorityTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.MinorityTotal
                          ? students?.i?.MinorityTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.MinorityTotal
                          ? students?.ii?.MinorityTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.MinorityTotal
                          ? students?.iii?.MinorityTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.MinorityTotal
                          ? students?.iv?.MinorityTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.MinorityTotal
                          ? students?.v?.MinorityTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.MinorityTotal
                          ? students?.total?.MinorityTotal
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td colSpan={2} style={{ border: "1px solid" }}>
                        Average Attendance of the month
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.averageAttendance
                          ? students?.pp?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.averageAttendance
                          ? students?.i?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.averageAttendance
                          ? students?.ii?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.averageAttendance
                          ? students?.iii?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.averageAttendance
                          ? students?.iv?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.averageAttendance > 0
                          ? students?.v?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.averageAttendance
                          ? students?.total?.averageAttendance
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td colSpan={2} style={{ border: "1px solid" }}>
                        Absentees for all or more of the working days of the
                        month
                      </td>
                      <td style={{ border: "1px solid" }}>-</td>
                      <td style={{ border: "1px solid" }}>-</td>
                      <td style={{ border: "1px solid" }}>-</td>
                      <td style={{ border: "1px solid" }}>-</td>
                      <td style={{ border: "1px solid" }}>-</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.averageAttendance
                          ? students?.v?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>-</td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid", height: 80 }}>
                        Remarks
                      </td>
                      <td
                        colSpan={8}
                        style={{ border: "1px solid", height: 80 }}
                        className="text-break"
                      >
                        {showRemark && remarks}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td
                        colSpan={2}
                        style={{ border: "1px solid", height: 80 }}
                      >
                        No. of Attendance of students on the date of last
                        inspection
                      </td>
                      <td style={{ border: "1px solid" }}>{inspection?.pp}</td>
                      <td style={{ border: "1px solid" }}>{inspection?.i}</td>
                      <td style={{ border: "1px solid" }}>{inspection?.ii}</td>
                      <td style={{ border: "1px solid" }}>{inspection?.iii}</td>
                      <td style={{ border: "1px solid" }}>{inspection?.iv}</td>
                      <td style={{ border: "1px solid" }}>
                        {inspection?.v > 0 ? inspection?.v : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {inspection?.total}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        Total as on last December
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.lastYearBoys
                          ? students?.pp?.lastYearBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.lastYearBoys
                          ? students?.i?.lastYearBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.lastYearBoys
                          ? students?.ii?.lastYearBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.lastYearBoys
                          ? students?.iii?.lastYearBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.lastYearBoys
                          ? students?.iv?.lastYearBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.lastYearBoys
                          ? students?.v?.lastYearBoys
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.lastYearBoys
                          ? students?.total?.lastYearBoys
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.lastYearGirls
                          ? students?.pp?.lastYearGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.lastYearGirls
                          ? students?.i?.lastYearGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.lastYearGirls
                          ? students?.ii?.lastYearGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.lastYearGirls
                          ? students?.iii?.lastYearGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.lastYearGirls
                          ? students?.iv?.lastYearGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.lastYearGirls
                          ? students?.v?.lastYearGirls
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.lastYearGirls
                          ? students?.total?.lastYearGirls
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.lastYearTotal
                          ? students?.pp?.lastYearTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.lastYearTotal
                          ? students?.i?.lastYearTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.lastYearTotal
                          ? students?.ii?.lastYearTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.lastYearTotal
                          ? students?.iii?.lastYearTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.lastYearTotal
                          ? students?.iv?.lastYearTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.lastYearTotal
                          ? students?.v?.lastYearTotal
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.lastYearTotal
                          ? students?.total?.lastYearTotal
                          : "-"}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td colSpan={9} style={{ border: "1px solid" }}>
                        <div className="d-flex justify-content-evenly align-items-center">
                          <p className="m-0 p-0">
                            Source of drinking water:&nbsp;&nbsp;
                            <span
                              className="fw-bold"
                              style={{
                                textDecoration: "underline",
                                textDecorationStyle: "dotted",
                              }}
                            >
                              {DRINKING_WATER}
                            </span>
                          </p>
                          <p className="m-0 p-0">
                            Water Supply in Toilets:&nbsp;&nbsp;
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
                              {GIRLS_TOILET}
                            </span>
                          </p>
                          <p className="m-0 p-0">
                            Own Electricity:&nbsp;&nbsp;
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
                            No. of floor : (1 or 2 erected) :
                            <span
                              className="fw-bold"
                              style={{
                                textDecoration: "underline",
                                textDecorationStyle: "dotted",
                              }}
                            >
                              {BUILDING}
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
                              YES
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
                              {inspection?.inspectionDate}
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
                            If own building Regd deed is available or not Yes/No
                            :
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

              <h4 className="dejavu fs-5 my-1">
                PART - 'C' : ACCOUNTS OF CONTINGENT GRANT
              </h4>

              <div
                className="mx-auto"
                style={{ border: "1px solid", width: "100%" }}
              >
                <div className="d-flex justify-content-evenly align-items-center">
                  <p className="m-0 p-0">Opening Balance = Rs. 0</p>
                  <p className="m-0 p-0">
                    Expenditure in the last month = Rs. 50
                  </p>
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h6>Signature of&nbsp; </h6>
                    <h6
                      style={{
                        textDecoration:
                          HOI_DESIGNATION === "HT" ? "none" : "line-through",
                      }}
                    >
                      Head Teacher&nbsp;
                    </h6>
                    <h6
                      style={{
                        textDecoration:
                          HOI_DESIGNATION === "HT" ? "line-through" : "none",
                      }}
                    >
                      &nbsp; /&nbsp;
                    </h6>
                    <h6
                      style={{
                        textDecoration:
                          HOI_DESIGNATION === "HT" ? "line-through" : "none",
                      }}
                    >
                      Teacher- In-Charge
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
