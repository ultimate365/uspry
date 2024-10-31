"use client";
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  sortMonthwise,
  todayInString,
  uniqArray,
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
import { doc, setDoc, getDocs, query, collection } from "firebase/firestore";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function Teachersreturn() {
  const { state, returnState, setReturnState } = useGlobalContext();

  const access = state?.ACCESS;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [students, setStudents] = useState({});
  const [showAvrAtt, setShowAvrAtt] = useState(false);
  const [beforeSubmit, setBeforeSubmit] = useState(false);
  const currentDate = new Date();
  const month =
    monthNamesWithIndex[
      currentDate?.getDate() > 10
        ? currentDate?.getMonth()
        : currentDate?.getMonth() - 1
    ].monthName;
  const year = currentDate?.getFullYear();

  const getMonth = () => {
    return `${month.toUpperCase()} of ${year}`;
  };
  const getID = () => {
    return `${month}-${year}`;
  };
  const [showModal, setShowModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [frontPageZoom, setFrontPageZoom] = useState(93);
  const [backPageZoom, setBackPageZoom] = useState(80);
  const [showZoom, setShowZoom] = useState(false);
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
  const id = getID();
  const entry = {
    id,
    month,
    year,
    teachers: filteredData,
    students,
    workingDays,
    inspection,
    date: todayInString(),
    remarks,
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
    appedData(monthwiseSorted[monthwiseSorted.length - 1]);
  };
  const appedData = (data) => {
    setTeachers(data.teachers);
    setFilteredData(data.teachers);
    setStudents(data.students);
    setInspection(data.inspection);
    setWorkingDays(data.workingDays);
    setShowModal(true);
  };
  const calledData = (array) => {
    let x = [];
    array.map((entry) => {
      const entryYear = entry.id.split("-")[1];
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });

    setLoader(false);
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
      appedData(returnState[returnState.length - 1]);
    }
    //eslint-disable-next-line
  }, []);

  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      await setDoc(doc(firestore, "monthlyTeachersReturn", id), entry);
      setReturnState([...returnState, entry]);
      toast.success("Monthly Data Submitted Successfully!", {
        position: "top-right",
      });
      setLoader(false);
      setShowFrontPage(true);
      setShowBackPage(true);
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error("Failed to Submit Monthly Data");
    }
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

      <div className="col-md-6 mx-auto my-2 noprint">
        <div className="mb-3 mx-auto col-md-6">
          <button
            type="button"
            id="launchModalTrigger"
            className="btn btn-sm btn-dark m-1"
            onClick={() => setBeforeSubmit(true)}
          >
            Submit Return Data
          </button>
          <button
            type="button"
            id="launchModalTrigger"
            className="btn btn-sm btn-primary m-1"
            onClick={() => setShowModal(true)}
          >
            Set Working Days
          </button>
          <button
            type="button"
            id="launchModalTrigger"
            className="btn btn-sm btn-success m-1"
            onClick={() => setShowInspectionModal(true)}
          >
            Edit Inspection Section
          </button>
          <button
            type="button"
            className="btn btn-sm btn-dark m-1"
            onClick={() => {
              setShowAvrAtt(true);
              setShowBackPage(false);
              setShowFrontPage(false);
            }}
          >
            Edit Average Attaindance
          </button>
        </div>
      </div>

      {showInspectionModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Set Inspection Days
                </h1>
              </div>
              <div className="modal-body">
                <div className="col-md-6 mx-auto my-2 noprint">
                  <div className="mb-3 mx-auto">
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Inspection Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        defaultValue={getCurrentDateInput(
                          inspection?.inspectionDate
                        )}
                        onChange={(e) => {
                          const date = getSubmitDateInput(e.target.value);
                          setInspection({
                            ...inspection,
                            inspectionDate: date,
                          });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        PP Attaindance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter PP Attaindance"}
                        value={inspection?.pp}
                        onChange={(e) => {
                          if (e.target.value) {
                            setInspection({
                              ...inspection,
                              pp: parseInt(e.target.value),
                              total:
                                parseInt(e.target.value) +
                                inspection?.i +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          } else {
                            setInspection({
                              ...inspection,
                              pp: "",
                              total:
                                inspection?.i +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Class I Attaindance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter Class I Attaindance"}
                        value={inspection?.i}
                        onChange={(e) => {
                          if (e.target.value) {
                            setInspection({
                              ...inspection,
                              i: parseInt(e.target.value),
                              total:
                                parseInt(e.target.value) +
                                inspection?.pp +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          } else {
                            setInspection({
                              ...inspection,
                              i: "",
                              total:
                                inspection?.pp +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Class II Attaindance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter Class II Attaindance"}
                        value={inspection?.ii}
                        onChange={(e) => {
                          if (e.target.value) {
                            setInspection({
                              ...inspection,
                              ii: parseInt(e.target.value),
                              total:
                                parseInt(e.target.value) +
                                inspection?.pp +
                                inspection?.i +
                                inspection?.iii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          } else {
                            setInspection({
                              ...inspection,
                              ii: "",
                              total:
                                inspection?.i +
                                inspection?.pp +
                                inspection?.iii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Class III Attaindance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter Class III Attaindance"}
                        value={inspection?.iii}
                        onChange={(e) => {
                          if (e.target.value) {
                            setInspection({
                              ...inspection,
                              iii: parseInt(e.target.value),
                              total:
                                parseInt(e.target.value) +
                                inspection?.pp +
                                inspection?.i +
                                inspection?.ii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          } else {
                            setInspection({
                              ...inspection,
                              iii: "",
                              total:
                                inspection?.i +
                                inspection?.pp +
                                inspection?.ii +
                                inspection?.iv +
                                inspection?.v,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Class IV Attaindance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter Class IV Attaindance"}
                        value={inspection?.iv}
                        onChange={(e) => {
                          if (e.target.value) {
                            setInspection({
                              ...inspection,
                              iv: parseInt(e.target.value),
                              total:
                                parseInt(e.target.value) +
                                inspection?.pp +
                                inspection?.i +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.v,
                            });
                          } else {
                            setInspection({
                              ...inspection,
                              iv: "",
                              total:
                                inspection?.i +
                                inspection?.pp +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.v,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Class V Attaindance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter Class V Attaindance"}
                        value={inspection?.v}
                        onChange={(e) => {
                          if (e.target.value) {
                            setInspection({
                              ...inspection,
                              v: parseInt(e.target.value),
                              total:
                                parseInt(e.target.value) +
                                inspection?.pp +
                                inspection?.i +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.iv,
                            });
                          } else {
                            setInspection({
                              ...inspection,
                              v: "",
                              total:
                                inspection?.i +
                                inspection?.pp +
                                inspection?.ii +
                                inspection?.iii +
                                inspection?.iv,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Total Attaindance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter Class Total Attaindance"}
                        value={inspection?.total}
                        readOnly
                        onChange={() => toast.error("Can't change Total")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setShowInspectionModal(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {beforeSubmit && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-xl flex-wrap text-center">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Showing Data to Be Submitted
                </h1>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="mb-3 mx-auto">
                    <h3 htmlFor="rank" className="text-danger">
                      ***Data you are Going to Submit
                    </h3>
                    <h5>ID:{entry?.id}</h5>
                    <h5>Year:{entry?.year}</h5>
                    <h5>Month:{entry?.month}</h5>
                    <h5>InspectionDate:{entry?.inspectionDate}</h5>
                    <h5>WorkingDays:{entry?.workingDays}</h5>
                    <h5>Date:{entry?.date}</h5>
                    <h5>Remarks:{entry?.remarks}</h5>
                    <div className="my-2">
                      <h5>Teachers:</h5>
                      {entry?.teachers.map((teacher, index) => (
                        <div key={index}>
                          <p>Name:{teacher?.tname}</p>
                          <p>
                            Data:{JSON.stringify(teacher).split(`"`).join("").split("{").join("").split("}").join("")}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="my-2">
                      <h5>Students:</h5>
                      <h5>PP:</h5>
                      <p className="text-center text-break">
                        {JSON.stringify(entry?.students?.pp)
                          .split(`"`)
                          .join("").split("{").join("").split("}").join("")}
                      </p>
                      <h5>Class I:</h5>
                      <p className="text-center text-break">
                        {JSON.stringify(entry?.students?.i).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                      <h5>Class II:</h5>
                      <p className="text-center text-break">
                        {JSON.stringify(entry?.students?.ii)
                          .split(`"`)
                          .join("").split("{").join("").split("}").join("")}
                      </p>
                      <h5>Class III:</h5>
                      <p className="text-center text-break">
                        {JSON.stringify(entry?.students?.iii)
                          .split(`"`)
                          .join("").split("{").join("").split("}").join("")}
                      </p>
                      <h5>Class IV:</h5>
                      <p className="text-center text-break">
                        {JSON.stringify(entry?.students?.iv)
                          .split(`"`)
                          .join("").split("{").join("").split("}").join("")}
                      </p>
                      {entry?.students?.v?.Total !== "-" && (
                        <div>
                          <h5>Class V:</h5>
                          <p className="text-center text-break">
                            {JSON.stringify(entry?.students?.iv)
                              .split(`"`)
                              .join("").split("{").join("").split("}").join("")}
                          </p>
                        </div>
                      )}
                      <h5>Total:</h5>
                      <p className="text-center text-break">
                        {JSON.stringify(entry?.students?.total)
                          .split(`"`)
                          .join("").split("{").join("").split("}").join("")}
                      </p>
                    </div>
                    <div className="my-2">
                      <h5>Inspection:</h5>
                      <p>Date:</p>
                      <p className="text-center text-break">
                        {JSON.stringify(inspection?.inspectionDate).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                      <p>PP:</p>
                      <p className="text-center text-break">
                        {JSON.stringify(inspection?.pp).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                      <p>Class I:</p>
                      <p className="text-center text-break">
                        {JSON.stringify(inspection?.i).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                      <p>Class II:</p>
                      <p className="text-center text-break">
                        {JSON.stringify(inspection?.ii).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                      <p>Class III:</p>
                      <p className="text-center text-break">
                        {JSON.stringify(inspection?.iii).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                      <p>Class IV:</p>
                      <p className="text-center text-break">
                        {JSON.stringify(inspection?.iv).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                      {inspection?.v?.Total !== "-" && (
                        <div>
                          <p>Class V:</p>
                          <p className="text-center text-break">
                            {JSON.stringify(inspection?.v).split(`"`).join("").split("{").join("").split("}").join("")}
                          </p>
                        </div>
                      )}
                      <p>Total Student:</p>
                      <p className="text-center text-break">
                        {JSON.stringify(inspection?.total).split(`"`).join("").split("{").join("").split("}").join("")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => setBeforeSubmit(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure, you want to Submit this Data?"
                      )
                    ) {
                      setBeforeSubmit(false);
                      submitMonthlyData();
                    }
                  }}
                >
                  Final Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal ? (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Set Working Days
                </h1>
              </div>
              <div className="modal-body">
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
                      placeholder="Enter Working Days"
                      value={workingDays}
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          setWorkingDays(parseInt(e.target.value));
                          try {
                            // Map over teachers and create the updated array
                            const myData = teachers.map((data) => {
                              if (data.clThisMonth) {
                                // Update the workingDays field
                                return {
                                  ...data,
                                  workingDays:
                                    parseInt(e.target.value) - data.clThisMonth,
                                };
                              }
                              return data;
                            });
                            // Update the filtered data with the new array
                            setFilteredData(myData);
                          } catch (error) {
                            console.log(error);
                          }
                        } else {
                          setWorkingDays("");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {workingDays > 0 && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => setShowModal(false)}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            overflowX: "scroll",
            flexWrap: "wrap",
          }}
        >
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
              {remarks.length > 0 && !addRemark && (
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
              <button
                type="button"
                className="btn btn-warning m-2"
                onClick={() => {
                  setShowZoom(true);
                }}
              >
                Set Page Zoom
              </button>
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
                        onClick={() => {
                          setEditTeacher(teacher);
                          setShowEditForm(true);
                          setShowBackPage(false);
                          setShowFrontPage(false);
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
          {showEditForm && (
            <div
              className="modal fade show"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
              aria-modal="true"
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
                      aria-label="Close"
                      onClick={() => {
                        setShowEditForm(false);
                        setShowBackPage(true);
                        setShowFrontPage(true);
                      }}
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
                                workingDays:
                                  workingDays -
                                  parseInt(e.target.value) -
                                  editTeacher.olThisMonth,
                              });
                            } else {
                              setEditTeacher({
                                ...editTeacher,
                                clThisMonth: "",
                                workingDays:
                                  workingDays - editTeacher.olThisMonth,
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
                                workingDays:
                                  workingDays - parseInt(e.target.value),
                              });
                            } else {
                              setEditTeacher({
                                ...editTeacher,
                                olThisMonth: "",
                                workingDays:
                                  workingDays - editTeacher.clThisMonth,
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
                      onClick={() => {
                        setShowEditForm(false);
                        setShowBackPage(true);
                        setShowFrontPage(true);
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        const updatedArray = filteredData
                          .map((t) =>
                            t.id === editTeacher?.id ? editTeacher : t
                          )
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
                        setShowEditForm(false);
                        setShowBackPage(true);
                        setShowFrontPage(true);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                      :&nbsp;&nbsp;
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
                        S.C./ S.T./ O?.B.C.-A/ O?.B.C.-B/ PH
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
                            style={{ border: "1px solid", paddingInline: 2 }}
                          ></td>
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
                    <h6>Signature of Head Teacher / Teacher- In-Charge</h6>
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
                        {students?.pp?.Boys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.Boys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.Boys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.Boys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.Boys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.Boys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.Boys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.Girls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.Girls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.Girls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.Girls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.Girls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.Girls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.Girls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.Total}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.Total}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.Total}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.Total}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.Total}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.Total}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.Total}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        General (Excluding Minority)
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.GeneralBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.GeneralBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.GeneralBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.GeneralBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.GeneralBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.GeneralBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.GeneralBoys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.GeneralGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.GeneralGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.GeneralGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.GeneralGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.GeneralGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.GeneralGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.GeneralGirls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.GeralTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.GeralTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.GeralTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.GeralTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.GeralTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.GeralTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.GeralTotal}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        Sch. Caste
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ScBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ScBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ScBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ScBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ScBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ScBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ScBoys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ScGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ScGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ScGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ScGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ScGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ScGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ScGirls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ScTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ScTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ScTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ScTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ScTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ScTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ScTotal}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        Sch. Tribe
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.StBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.StBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.StBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.StBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.StBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.StBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.StBoys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.StGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.StGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.StGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.StGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.StGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.StGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.StGirls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.StTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.StTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.StTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.StTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.StTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.StTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.StTotal}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        O?.B.C. A Minority
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcABoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcABoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcABoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcABoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcABoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcABoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcABoys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcAGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcAGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcAGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcAGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcAGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcAGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcAGirls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcATotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcATotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcATotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcATotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcATotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcATotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcATotal}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        O?.B.C. B
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcBBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcABoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcBBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcBBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcBBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcBBoys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcBGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcBGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcBGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcBGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcBGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcBGirls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.ObcBTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.ObcBTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.ObcBTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.ObcBTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.ObcBTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.ObcBTotal}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td rowSpan={3} style={{ border: "1px solid" }}>
                        Minority Excluding O?.B.C.-A
                      </td>
                      <td style={{ border: "1px solid" }}>Boys</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.MinorityBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.MinorityBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.MinorityBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.MinorityBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.ObcBBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.MinorityBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.MinorityBoys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.MinorityGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.MinorityGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.MinorityGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.MinorityGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.MinorityGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.MinorityGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.MinorityGirls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.MinorityTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.MinorityTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.MinorityTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.MinorityTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.MinorityTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.MinorityTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.MinorityTotal}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td colSpan={2} style={{ border: "1px solid" }}>
                        Average Attendance of the month
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.averageAttendance}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.averageAttendance}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.averageAttendance}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.averageAttendance}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.averageAttendance}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.averageAttendance > 0
                          ? students?.v?.averageAttendance
                          : "-"}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.averageAttendance}
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
                        {students?.v?.averageAttendance}
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
                        {students?.pp?.lastYearBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.lastYearBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.lastYearBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.lastYearBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.lastYearBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.lastYearBoys}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.lastYearBoys}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Girls</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.lastYearGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.lastYearGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.lastYearGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.lastYearGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.lastYearGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.lastYearGirls}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.lastYearGirls}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td style={{ border: "1px solid" }}>Total</td>
                      <td style={{ border: "1px solid" }}>
                        {students?.pp?.lastYearTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.i?.lastYearTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.ii?.lastYearTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iii?.lastYearTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.iv?.lastYearTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.v?.lastYearTotal}
                      </td>
                      <td style={{ border: "1px solid" }}>
                        {students?.total?.lastYearTotal}
                      </td>
                    </tr>
                    <tr style={{ border: "1px solid" }}>
                      <td colSpan={9} style={{ border: "1px solid" }}>
                        <div className="d-flex justify-content-evenly align-items-center">
                          <p className="m-0 p-0">
                            Source of drinking water :&nbsp;&nbsp;
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
                            Water Supply in Toilets :&nbsp;&nbsp;
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
                            Own Electricity :&nbsp;&nbsp;
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
                  <h6 className="fw-bold">
                    Signature of Head Teacher / Teacher- In-Charge
                  </h6>
                </div>
              </div>
            </div>
          )}
          {addRemark && (
            <div className="col-md-6 mx-auto">
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
              {remarks.length > 0 && (
                <button
                  className="btn btn-danger m-2"
                  type="button"
                  onClick={() => {
                    setRemarks("");
                  }}
                >
                  Clear
                </button>
              )}
              <button
                className="btn btn-dark m-2"
                type="button"
                onClick={() => {
                  setAddRemark(false);
                  setShowBackPage(true);
                  setShowFrontPage(true);
                }}
              >
                close
              </button>
            </div>
          )}
          {showAvrAtt && (
            <div
              className="modal fade show"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
              aria-modal="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">
                      Set Average Attaindance
                    </h1>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label htmlFor="avgAttaindance">PP</label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            students?.pp?.averageAttendance !== undefined &&
                            students?.pp?.averageAttendance !== null
                              ? students?.pp?.averageAttendance
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudents({
                              ...students,
                              pp: {
                                ...students?.pp,
                                averageAttendance:
                                  value === "" ? null : parseInt(value, 10),
                              },
                              total: {
                                ...students?.total,
                                averageAttendance:
                                  parseInt(value) +
                                  students?.i?.averageAttendance +
                                  students?.ii?.averageAttendance +
                                  students?.iii?.averageAttendance +
                                  students?.iv?.averageAttendance +
                                  students?.v?.averageAttendance,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="avgAttaindance">I</label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            students?.i?.averageAttendance !== undefined &&
                            students?.i?.averageAttendance !== null
                              ? students?.i?.averageAttendance
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudents({
                              ...students,
                              i: {
                                ...students?.i,
                                averageAttendance:
                                  value === "" ? null : parseInt(value, 10),
                              },
                              total: {
                                ...students?.total,
                                averageAttendance:
                                  students?.pp?.averageAttendance +
                                  parseInt(value) +
                                  students?.ii?.averageAttendance +
                                  students?.iii?.averageAttendance +
                                  students?.iv?.averageAttendance +
                                  students?.v?.averageAttendance,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="avgAttaindance">II</label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            students?.ii?.averageAttendance !== undefined &&
                            students?.ii?.averageAttendance !== null
                              ? students?.ii?.averageAttendance
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudents({
                              ...students,
                              ii: {
                                ...students?.ii,
                                averageAttendance:
                                  value === "" ? null : parseInt(value, 10),
                              },
                              total: {
                                ...students?.total,
                                averageAttendance:
                                  students?.pp?.averageAttendance +
                                  students?.i?.averageAttendance +
                                  parseInt(value) +
                                  students?.iii?.averageAttendance +
                                  students?.iv?.averageAttendance +
                                  students?.v?.averageAttendance,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="avgAttaindance">III</label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            students?.iii?.averageAttendance !== undefined &&
                            students?.iii?.averageAttendance !== null
                              ? students?.iii?.averageAttendance
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudents({
                              ...students,
                              iii: {
                                ...students?.iii,
                                averageAttendance:
                                  value === "" ? null : parseInt(value, 10),
                              },
                              total: {
                                ...students?.total,
                                averageAttendance:
                                  students?.pp?.averageAttendance +
                                  students?.i?.averageAttendance +
                                  students?.ii?.averageAttendance +
                                  parseInt(value) +
                                  students?.iv?.averageAttendance +
                                  students?.v?.averageAttendance,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="avgAttaindance">IV</label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            students?.iv?.averageAttendance !== undefined &&
                            students?.iv?.averageAttendance !== null
                              ? students?.iv?.averageAttendance
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudents({
                              ...students,
                              iv: {
                                ...students?.iv,
                                averageAttendance:
                                  value === "" ? null : parseInt(value, 10),
                              },
                              total: {
                                ...students?.total,
                                averageAttendance:
                                  students?.pp?.averageAttendance +
                                  students?.i?.averageAttendance +
                                  students?.ii?.averageAttendance +
                                  students?.iii?.averageAttendance +
                                  parseInt(value) +
                                  students?.v?.averageAttendance,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="avgAttaindance">V</label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            students?.v?.averageAttendance !== undefined &&
                            students?.v?.averageAttendance !== null
                              ? students?.v?.averageAttendance
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudents({
                              ...students,
                              v: {
                                ...students?.v,
                                averageAttendance:
                                  value === "" ? null : parseInt(value, 10),
                              },
                              total: {
                                ...students?.total,
                                averageAttendance:
                                  students?.pp?.averageAttendance +
                                  students?.i?.averageAttendance +
                                  students?.ii?.averageAttendance +
                                  students?.iii?.averageAttendance +
                                  students?.iv?.averageAttendance +
                                  parseInt(value),
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="avgAttaindance">Total</label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            students?.total?.averageAttendance !== undefined &&
                            students?.total?.averageAttendance !== null
                              ? students?.total?.averageAttendance
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            setStudents({
                              ...students,
                              total: {
                                ...students?.total, // Corrected this to use `students?.total`
                                averageAttendance:
                                  value === "" ? null : parseInt(value, 10),
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        setShowAvrAtt(false);
                        setShowBackPage(true);
                        setShowFrontPage(true);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                          ***Write percent without "%" e?.g.(80, 90)
                        </h5>
                        <input
                          type="number"
                          className="form-control m-2 col-md-4"
                          id="frontPageZoom"
                          name="frontPageZoom"
                          placeholder="Enter Front Page Zoom"
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
                          placeholder="Enter Back Page Zoom"
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
        </div>
      )}
    </div>
  );
}
