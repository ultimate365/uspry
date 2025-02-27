"use client";
import {
  BLOCK,
  CCH_NAME,
  PRIMARY_STUDENTS,
  SCHOOL_TYPE,
  SCHOOLNAME,
  TOTAL_STUDENTS,
  WARD_NO,
} from "@/modules/constants";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { firestore } from "../../context/FirbaseContext";
import { getDocs, query, collection } from "firebase/firestore";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import {
  createDownloadLink,
  IndianFormat,
  round2dec,
  sortMonthwise,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context/Store";
import MDMPrint from "@/components/MDMPrint";
export default function MDMmonthlyReport() {
  const { monthlyReportState, setMonthlyReportState, state } =
    useGlobalContext();
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const [thisMonthlyData, setThisMonthlyData] = useState({
    id: "",
    month: "",
    year: "",
    financialYear: "",
    worrkingDays: "",
    totalWorkingDays: "",
    ppTotal: "",
    pryTotal: "",
    monthlyPPCost: "",
    monthlyPRYCost: "",
    totalCost: "",
    ricePPOB: "",
    ricePryOB: "",
    riceOB: "",
    ricePPRC: "",
    ricePryRC: "",
    ricePPEX: "",
    ricePryEX: "",
    ricePPCB: "",
    ricePryCB: "",
    riceCB: "",
    riceConsunption: "",
    riceGiven: "",
    ppOB: "",
    pryOB: "",
    ppRC: "",
    pryRC: "",
    ppCB: "",
    pryCB: "",
    prevPpRC: "",
    prevPryRC: "",
    prevMonthlyPPCost: "",
    prevMonthlyPRYCost: "",
    prevRicePPRC: "",
    prevRicePryRC: "",
    prevRicePPEX: "",
    prevRicePryEX: "",
    remarks: "",
    ppStudent: "",
    pryStudent: "",
    totalStudent: "",
    date: todayInString(),
  });
  const access = state?.ACCESS;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [allEnry, setAllEnry] = useState([]);
  const [showData, setShowData] = useState(false);
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [entryMonthsMonths, setEntryMonths] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [showZoom, setShowZoom] = useState(false);
  const [newFormatZoom, setNewFormatZoom] = useState(100);
  const [oldFormatZoom, setOldFormatZoom] = useState(100);
  const calledData = (array) => {
    let x = [];
    array.map((entry) => {
      const entryYear = entry.year;
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setServiceArray(x);

    setLoader(false);
    setAllEnry(array);
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
        const entryYear = entry.year;
        const entryMonth = entry.month;

        if (entryYear === selectedValue) {
          x.push(entry);
          y.push(entryMonth);
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setEntryMonths(uniqArray(y));
      console.log(uniqArray(y));
    } else {
      setSelectedYear("");
      setShowMonthSelection(false);
      toast.error("Please select a year");
    }
  };
  const handleMonthChange = (month) => {
    let x = [];

    allEnry.map((entry) => {
      const entryYear = entry.year;
      const entryMonth = entry.month;
      if (entryYear === selectedYear && entryMonth === month) {
        x.push(entry);
        setThisMonthlyData(entry);
        setShowData(true);
      }
    });
  };

  const getMonthlyData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "mothlyMDMData"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    const monthwiseSorted = sortMonthwise(data);
    setMonthlyReportState(monthwiseSorted);
    setLoader(false);
    calledData(monthwiseSorted);
  };

  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (monthlyReportState.length === 0) {
      getMonthlyData();
    } else {
      calledData(monthlyReportState);
    }

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    document.title = `MDM RETURN ${thisMonthlyData?.month.toUpperCase()} ${
      thisMonthlyData?.year
    }`;
    // eslint-disable-next-line
  }, [allEnry, thisMonthlyData]);

  return (
    <div className="container-fluid my-2">
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="noprint">
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
                            id="newFormatZoom"
                            name="newFormatZoom"
                            placeholder="New Format Zoom"
                            value={newFormatZoom}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setNewFormatZoom(parseInt(e.target.value));
                              } else {
                                setNewFormatZoom("");
                              }
                            }}
                          />
                          <input
                            type="number"
                            className="form-control m-2 col-md-4"
                            id="oldFormatZoom"
                            name="oldFormatZoom"
                            placeholder="Old Format Zoom"
                            value={oldFormatZoom}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setOldFormatZoom(parseInt(e.target.value));
                              } else {
                                setOldFormatZoom("");
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      {newFormatZoom > 0 && oldFormatZoom > 0 && (
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => {
                            setShowZoom(false);
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
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                createDownloadLink(monthlyReportState, "mothlyMDMData");
              }}
            >
              Download Monthly Report Data
            </button>
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
                {serviceArray.map((el, i) => (
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
                {entryMonthsMonths.length > 0 && (
                  <h4 className="text-center text-primary">Select Month</h4>
                )}
              </div>
            ) : null}
            {showMonthSelection && (
              <div className="row d-flex justify-content-center noprint">
                {entryMonthsMonths.length > 0 && (
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
                      {monthlyReportState.length === 1
                        ? monthlyReportState
                            .slice(1, monthlyReportState.length)
                            .map((month, index) => (
                              <option
                                className="text-center text-success"
                                key={index}
                                value={month}
                              >
                                {month}
                              </option>
                            ))
                        : entryMonthsMonths.map((month, index) => (
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
        </>
      )}
      {showData && (
        <div>
          <div className="noprint">
            <PDFDownloadLink
              document={<MDMPrint data={{ thisMonthlyData }} />}
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
                loading
                  ? "Loading..."
                  : `Download ${thisMonthlyData.id} MDM Return PDF`
              }
            </PDFDownloadLink>
            <button
              className={`btn btn-primary m-2`}
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  setTimeout(() => {
                    window.print();
                  }, 200);
                }
              }}
            >
              Print New Format
            </button>
            <button
              type="button"
              className="btn btn-success m-2"
              onClick={() => {
                setShowZoom(true);
              }}
            >
              Set Page Zoom
            </button>
          </div>

          <div>
            <div
              className="nobreak"
              style={{
                width: "100%",
                overflowX: "scroll",
                flexWrap: "wrap",
                zoom: newFormatZoom / 100 || 100,
              }}
            >
              <table
                suppressHydrationWarning={true}
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <th colSpan={9}>Monthly Progress Report of Mid Day Meal</th>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Name of the Month:- {thisMonthlyData?.month}&#8217;
                      {thisMonthlyData?.year}
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Financial Year:- {thisMonthlyData?.financialYear}
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Ward No.:- {WARD_NO}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Municipality/ Corporation (HMC)
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Name of the School:-
                    </td>
                    <td colSpan={4} style={{ border: "1px solid" }}>
                      {SCHOOLNAME}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      {BLOCK}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Basic Information of School:-
                    </td>
                    <td colSpan={4} style={{ border: "1px solid" }}>
                      {SCHOOL_TYPE}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}></td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        border: "1px solid",
                        textAlign: "left",
                        paddingLeft: 5,
                      }}
                    >
                      <p>
                        Total no. of the Students Bal Vatika:-{" "}
                        {thisMonthlyData?.ppStudent}
                      </p>
                      <p>
                        Total no. of the Students Primary:-{" "}
                        {thisMonthlyData?.pryStudent}
                      </p>
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Total Mid Day meal Served:-{" "}
                      {thisMonthlyData?.ppTotal + thisMonthlyData?.pryTotal}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      No. of days Mid Day Meal Served:-{" "}
                      {thisMonthlyData?.worrkingDays}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td
                      style={{ border: "1px solid", height: 10 }}
                      colSpan={9}
                    ></td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <th style={{ border: "1px solid" }} colSpan={9}>
                      Utilization Certificate (COOKING COST)
                    </th>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total allotment received <br />
                      (2+3(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 5(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance <br />
                      (4-6)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3(a)</td>
                    <td style={{ border: "1px solid" }}>3(b)</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5(a)</td>
                    <td style={{ border: "1px solid" }}>5(b)</td>
                    <td style={{ border: "1px solid" }}>6</td>
                    <td style={{ border: "1px solid" }}>7</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.ppOB)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.prevPpRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.ppRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{" "}
                      {IndianFormat(
                        round2dec(thisMonthlyData?.ppOB + thisMonthlyData?.ppRC)
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.prevMonthlyPPCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.monthlyPPCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.monthlyPPCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.ppCB)}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.pryOB)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.prevPryRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.pryRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{" "}
                      {IndianFormat(
                        round2dec(
                          thisMonthlyData?.pryOB + thisMonthlyData?.pryRC
                        )
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.prevMonthlyPRYCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.monthlyPRYCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.monthlyPRYCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹ {IndianFormat(thisMonthlyData?.pryCB)}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td
                      style={{ border: "1px solid", height: 10 }}
                      colSpan={9}
                    ></td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <th style={{ border: "1px solid" }} colSpan={9}>
                      Utilization Certificate (FOOD GRAIN)
                    </th>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of Food grains received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Food grains received <br />
                      (2+3(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 5(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance <br />
                      (4-6)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3(a)</td>
                    <td style={{ border: "1px solid" }}>3(b)</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5(a)</td>
                    <td style={{ border: "1px solid" }}>5(b)</td>
                    <td style={{ border: "1px solid" }}>6</td>
                    <td style={{ border: "1px solid" }}>7</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPOB + thisMonthlyData?.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryOB + thisMonthlyData?.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>

                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td
                      style={{ border: "1px solid", height: 10 }}
                      colSpan={9}
                    ></td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <th style={{ border: "1px solid" }} colSpan={9}>
                      Utilization Certificate (HONORARIUM TO COOK)
                    </th>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of Food grains received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Food grains received <br />
                      (2+3(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 5(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance <br />
                      (4-6)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3(a)</td>
                    <td style={{ border: "1px solid" }}>3(b)</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5(a)</td>
                    <td style={{ border: "1px solid" }}>5(b)</td>
                    <td style={{ border: "1px solid" }}>6</td>
                    <td style={{ border: "1px solid" }}>7</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Bal Vatika & Primary & UpPrimary
                    </td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-end mr-4">
                <h6>
                  .............................................................................
                </h6>
                <h6>Signature of Head Teacher / TIC</h6>
              </div>
              <div className="mx-auto mt-5">
                {thisMonthlyData?.remarks?.length && (
                  <p>
                    <b>Remarks:</b> {thisMonthlyData?.remarks}
                  </p>
                )}
              </div>
            </div>
            <div
              className="nobreak"
              style={{
                width: "100%",
                overflowX: "scroll",
                flexWrap: "wrap",
              }}
            >
              <table
                suppressHydrationWarning={true}
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <th colSpan={12}>Utilization Certificate (COOKING COST)</th>
                  </tr>
                  <tr>
                    <td colSpan={4} style={{ border: "1px solid" }}>
                      Name of the Month:- {thisMonthlyData?.month}&#8217;
                      {thisMonthlyData?.year}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Financial Year:- {thisMonthlyData?.financialYear}
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Ward No.:- {WARD_NO}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Municipality/ Corporation (HMC)
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      Total no of Students
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      Total Meal Served during the month
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      No of Days Mid day meal Served
                    </td>
                    <td colSpan={5} style={{ border: "1px solid" }}>
                      School Name:- {SCHOOLNAME}
                    </td>

                    <td colSpan={3} style={{ border: "1px solid" }}>
                      {BLOCK}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total allotment received <br />
                      (5+6(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 8(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance
                      <br />
                      (7-9)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5</td>
                    <td style={{ border: "1px solid" }}>6(a)</td>
                    <td style={{ border: "1px solid" }}>6(b)</td>
                    <td style={{ border: "1px solid" }}>7</td>
                    <td style={{ border: "1px solid" }}>8(a)</td>
                    <td style={{ border: "1px solid" }}>8(b)</td>
                    <td style={{ border: "1px solid" }}>9</td>
                    <td style={{ border: "1px solid" }}>10</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ppStudent}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ppTotal}
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      {thisMonthlyData?.worrkingDays}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.ppOB)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.prevPpRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.ppRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹
                      {IndianFormat(
                        round2dec(thisMonthlyData?.ppOB + thisMonthlyData?.ppRC)
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.prevMonthlyPPCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.monthlyPPCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.monthlyPPCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.ppCB)}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.pryStudent}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.pryTotal}
                    </td>

                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.pryOB)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.prevPryRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.pryRC)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹
                      {IndianFormat(
                        round2dec(
                          thisMonthlyData?.pryOB + thisMonthlyData?.pryRC
                        )
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.prevMonthlyPRYCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.monthlyPRYCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.monthlyPRYCost)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      ₹{IndianFormat(thisMonthlyData?.pryCB)}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <th colSpan={12}>Utilization Certificate (FOOD GRAINS)</th>
                  </tr>

                  <tr>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total no of Students
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Meal Served during the month
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      No of Days Mid day meal Served
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Food grains received <br />
                      (5+6(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 8(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance
                      <br />
                      (7-9)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5</td>
                    <td style={{ border: "1px solid" }}>6(a)</td>
                    <td style={{ border: "1px solid" }}>6(b)</td>
                    <td style={{ border: "1px solid" }}>7</td>
                    <td style={{ border: "1px solid" }}>8(a)</td>
                    <td style={{ border: "1px solid" }}>8(b)</td>
                    <td style={{ border: "1px solid" }}>9</td>
                    <td style={{ border: "1px solid" }}>10</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ppStudent}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ppTotal}
                    </td>

                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      {thisMonthlyData?.worrkingDays}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPOB + thisMonthlyData?.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePPCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.pryStudent}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.pryTotal}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryOB + thisMonthlyData?.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.prevRicePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.ricePryCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <th colSpan={12}>
                      Utilization Certificate (HONORARIUM TO COOK)
                    </th>
                  </tr>

                  <tr>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total no of Students
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      No of Cook engaged
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      No of Days Mid day meal Served
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total allotment received <br />
                      (5+6(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 8(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance
                      <br />
                      (7-9)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5</td>
                    <td style={{ border: "1px solid" }}>6(a)</td>
                    <td style={{ border: "1px solid" }}>6(b)</td>
                    <td style={{ border: "1px solid" }}>7</td>
                    <td style={{ border: "1px solid" }}>8(a)</td>
                    <td style={{ border: "1px solid" }}>8(b)</td>
                    <td style={{ border: "1px solid" }}>9</td>
                    <td style={{ border: "1px solid" }}>10</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.totalStudent}
                    </td>
                    <td style={{ border: "1px solid" }}>{CCH_NAME.length}</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-end mr-4">
                <h6>
                  .............................................................................
                </h6>
                <h6>Signature of Head Teacher / TIC</h6>
              </div>
            </div>
          </div>

          {/* {showOldFormat && (
            <div className="mx-auto text-center">
              <div
                className="nobreak"
                style={{
                  width: "100%",
                  overflowX: "scroll",
                  flexWrap: "wrap",
                  zoom: oldFormatZoom / 100 || 100,
                }}
              >
                <h4>Pradhan Mantri Poshan Shakti Nirman (PM POSHAN)</h4>
                <h4>School Monthly Data Capture Format (MDCF)</h4>
                <p>
                  Instructions: Keep following registers at the time of filling
                  the form:-
                </p>
                <h6 className="text-start">
                  1) Enrolment Register, 2) Account, 3) Bank Account Pass Book,
                  4) Cooking cost details etc.
                </h6>
                <h5 className="text-start" style={{ marginLeft: 30 }}>
                  1. School Details
                </h5>
                <table
                  suppressHydrationWarning={true}
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: "20px",
                    border: "1px solid",
                  }}
                  className="nobreak my-4"
                >
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                  >
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Month-Year
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                      colSpan={2}
                    >
                      {thisMonthlyData?.month}&#8217;
                {thisMonthlyData?.year}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      UDISE Code
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {UDISE_CODE}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      School Name
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {SCHOOLNAME}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                  >
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Type
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                      colSpan={7}
                    >
                      <div
                        className="d-flex flex-row p-2 justify-content-center align-items-center"
                        style={{ height: 30 }}
                      >
                        <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                          <p className="m-0 p-0 mx-2">Government</p>
                          <input type="checkbox" checked readOnly />
                        </div>
                        <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                          <p className="m-0 p-0 mx-2">Local Body</p>
                          <input type="checkbox" />
                        </div>
                        <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                          <p className="m-0 p-0 mx-2">EGS/AIE Centres</p>
                          <input type="checkbox" />
                        </div>
                        <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                          <p className="m-0 p-0 mx-2">NCLP</p>
                          <input type="checkbox" />
                        </div>
                        <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                          <p className="m-0 p-0 mx-2">Madrasa/Maqtab</p>
                          <input type="checkbox" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      State / UT-
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      WEST BENGAL
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      District:-
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      HOWRAH
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Block/NP-{" "}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {BLOCK}{" "}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {" "}
                      Village/Ward:-{" "}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {WARD_NO}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Kitchen Type-
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      PUCCA
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      NGO / SHG
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {NGO_SHG}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                      colSpan={3}
                    >
                      Enrolment-
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {thisMonthlyData?.totalStudent}
                    </td>
                  </tr>
                </table>
                <h5 className="text-start" style={{ marginLeft: 30 }}>
                  2. Meals Availed Status
                </h5>
                <table
                  suppressHydrationWarning={true}
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: "20px",
                    border: "1px solid",
                  }}
                  className="nobreak my-4"
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      ></td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Bal Vatika
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Primary
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Upper Primary
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Number of School days during month
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        {thisMonthlyData?.totalWorkingDays}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        {thisMonthlyData?.totalWorkingDays}
                      </td>

                      <td
                        style={{
                          paddingInline: 2,
                        }}
                        rowSpan={3}
                      >
                        N/A
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Actual Number of days Mid-Day Meal served
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        {thisMonthlyData?.worrkingDays}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        {thisMonthlyData?.worrkingDays}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Total Meals served during the month
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        {thisMonthlyData?.ppTotal}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        {thisMonthlyData?.pryTotal}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h5 className="text-start" style={{ marginLeft: 30 }}>
                  3. Fund Details (In Rs.)
                </h5>
                <table
                  suppressHydrationWarning={true}
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: "20px",
                    border: "1px solid",
                  }}
                  className="nobreak my-4"
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Component
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Opening Balance
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Received During the Month
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Expenditure During the Month
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Closing Balance
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Cooking Cost- Bal Vatika
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹{" "}
                        {IndianFormat(
                          ftFound
                            ? thisMonthFromFirstTransaction?.ppOB
                            : thisMonthFromTransaction?.ppOB
                        )}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹ {balRCThisMonth}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹ {IndianFormat(thisMonthlyData?.monthlyPPCost)}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹{" "}
                        {IndianFormat(
                          round2dec(
                            ftFound
                              ? thisMonthFromFirstTransaction?.ppOB +
                                  balRCThisMonth -
                                  thisMonthlyData?.monthlyPPCost
                              : thisMonthFromTransaction?.ppOB +
                                  balRCThisMonth -
                                  thisMonthlyData?.monthlyPPCost
                          )
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Cooking Cost- Primary
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹{" "}
                        {IndianFormat(
                          ftFound
                            ? thisMonthFromFirstTransaction?.pryOB
                            : thisMonthFromTransaction?.pryOB
                        )}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹ {pryRCThisMonth}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹ {thisMonthlyData?.monthlyPRYCost}
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        ₹{" "}
                        {IndianFormat(
                          round2dec(
                            ftFound
                              ? thisMonthFromFirstTransaction?.pryOB +
                                  pryRCThisMonth -
                                  thisMonthlyData?.monthlyPRYCost
                              : thisMonthFromTransaction?.pryOB +
                                  pryRCThisMonth -
                                  thisMonthlyData?.monthlyPRYCost
                          )
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Cooking Cost- Upper Primary
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Cook Cum Helper
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        School Expenses: MME Expenses
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        N/A
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h5 className="text-start" style={{ marginLeft: 30 }}>
                  4. Cook Cum Helper Payment Detail
                </h5>
                <table
                  suppressHydrationWarning={true}
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: "20px",
                    border: "1px solid",
                  }}
                  className="nobreak my-4"
                >
                  <thead>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                        rowSpan={2}
                      >
                        Sl. No
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                        rowSpan={2}
                      >
                        Opening Balance
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                        rowSpan={2}
                      >
                        Cook Name
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Gender
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Category
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        Payment Mode
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                        rowSpan={2}
                      >
                        Amount Received During Month (In Rs.)
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        (M/F)
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        (SC/ST/OBC/GEN)
                      </td>
                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                        }}
                      >
                        (Cash/ Bank)
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {CCH_NAME.map((cch, index) => (
                      <tr key={index}>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {index + 1}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          -
                        </td>

                        <td
                          style={{
                            border: "1px solid",
                            paddingInline: 2,
                            width: "30%",
                          }}
                        >
                          {cch.name}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {cch.gender}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {cch.cast}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {cch.payment}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          -
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  <h6 className="m-0 p-0">MID DAY MEAL REPORT (UC)</h6>
                  <table
                    suppressHydrationWarning={true}
                    style={{
                      width: "100%",
                      overflowX: "auto",
                      marginBottom: "20px",
                      border: "1px solid",
                      zoom: 0.9,
                    }}
                    className="nobreak my-4"
                  >
                    <thead>
                      <tr>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          Category
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          TOTAL NO OF STUDENTS
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          TOTAL MEAL SERVED
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          MDM RATE
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          EXPENDITURE
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          BAL VATIKA
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {thisMonthlyData?.ppStudent}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {thisMonthlyData?.ppTotal}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          ₹ {thisMonthMDMAllowance}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {thisMonthlyData?.ppTotal} × ₹ {thisMonthMDMAllowance}{" "}
                          = ₹ 
                          {Math.round(
                            thisMonthlyData?.ppTotal * thisMonthMDMAllowance
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          PRIMARY
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {thisMonthlyData?.pryStudent}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {thisMonthlyData?.pryTotal}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          ₹ {thisMonthMDMAllowance}
                        </td>
                        <td style={{ border: "1px solid", paddingInline: 2 }}>
                          {thisMonthlyData?.pryTotal} × ₹{" "}
                          {thisMonthMDMAllowance} = ₹{" "}
                          
                          {Math.round(
                            thisMonthlyData?.pryTotal * thisMonthMDMAllowance
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="nobreak mt-2">
                <h5 className="text-start">5. Food Grain Details (In KG.)</h5>
                <table
                  suppressHydrationWarning={true}
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: "20px",
                    border: "1px solid",
                  }}
                  className="nobreak my-4"
                >
                  <thead>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Category
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Food Item
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Opening Balance
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Received During the Month
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Consumption during the Month
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Closing Balance
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        rowSpan={2}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        BAL VATIKA
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Wheat
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Rice
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePPOB}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePPRC}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePPEX}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePPCB}
                      </td>
                    </tr>
                    <tr>
                      <td
                        rowSpan={2}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        PRIMARY
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Wheat
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Rice
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePryOB}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePryRC}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePryEX}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {thisMonthlyData?.ricePryCB}
                      </td>
                    </tr>
                    <tr>
                      <td
                        rowSpan={2}
                        style={{ border: "1px solid", paddingInline: 2 }}
                      >
                        UPPER PRIMARY
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Wheat
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Rice
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h5 className="text-start">6. Children Health Status</h5>
                <table
                  suppressHydrationWarning={true}
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: "20px",
                    border: "1px solid",
                  }}
                  className="nobreak my-4"
                >
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        No. of children from Class 1 to 8 who had received 4 IFA
                        tablets (Boys)-
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {PRIMARY_BOYS}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        No. of children from Class 1 to 8 who had received 4 IFA
                        tablets (Girls)-
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {PRIMARY_GIRLS}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        No. of children screened by mobile health (RBSK) team
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        NIL
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        No. of children referred by mobile health (RBSK) team
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        NIL
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h5 className="text-start">7. School Inspection</h5>
                <table
                  suppressHydrationWarning={true}
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: "20px",
                  }}
                  className="nobreak my-4"
                >
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        School Inspection done during the month
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        <div className="">
                          Yes{" "}
                          <input
                            type="checkbox"
                            checked={showDash}
                            onChange={(e) => setShowDash(e.target.checked)}
                          />{" "}
                          No{" "}
                          <input
                            type="checkbox"
                            checked={!showDash}
                            onChange={(e) => {}}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        By Members of Task Force
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {!showDash && "-"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        By District Officials
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {!showDash && "-"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        By Block/Taluka Level Officials
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {!showDash && "-"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        By SMC Members
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {!showDash && "-"}
                      </td>
                    </tr>
                    <tr style={{ height: 20, border: 0 }}></tr>
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        Number of unwanted incidents occurred
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        NIL
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className="d-flex flex-row justify-content-between p-2"
                  style={{ marginTop: 200, flexWrap: "wrap" }}
                >
                  <div>
                    <h6>
                      ..........................................................................................
                    </h6>
                    <h6>Signature of the SMC Chairperson/ Gram Pradhan</h6>
                  </div>
                  <div>
                    <h6>
                      .............................................................................
                    </h6>
                    <h6>Signature of Head Teacher / TIC</h6>
                  </div>
                </div>
                <div className="mx-auto mt-5">
                  {showRemarksPage4 && remarks.length && (
                    <p>
                      <b>Remarks:</b> {remarks}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
