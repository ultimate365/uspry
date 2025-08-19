"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
import { firestore } from "../../context/FirbaseContext";
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  sortMonthwise,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import { getDocs, query, collection, doc, updateDoc } from "firebase/firestore";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

export default function UserTeachers() {
  const { state, teacherLeaveState, setTeacherLeaveState } = useGlobalContext();

  const access = state?.ACCESS;
  const router = useRouter();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [yearArray, setYearArray] = useState([]);
  const [allEnry, setAllEnry] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredEntry, setFilteredEntry] = useState([]);
  const [moreFilteredEntry, setMoreFilteredEntry] = useState([]);
  const [entryMonths, setEntryMonths] = useState("");
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "January-2025",
    month: "January",
    year: 2025,
    leaves: [
      {
        desig: "HT",
        rank: 1,
        clThisYear: 0,
        tname: "SK MAIDUL ISLAM",
        id: "teachers381",
        clThisMonth: 0,
        olThisMonth: 0,
        olThisYear: 0,
      },
      {
        id: "teachers382",
        clThisMonth: 0,
        olThisMonth: 0,
        olThisYear: 0,
        desig: "AT",
        rank: 2,
        clThisYear: 0,
        tname: "MALLIKA GAYEN",
      },
      {
        id: "teachers383",
        tname: "SURASHREE SADHUKHAN SAHA",
        olThisMonth: 0,
        olThisYear: 0,
        desig: "AT",
        rank: 3,
        clThisYear: 0,
        clThisMonth: 0,
      },
      {
        rank: 4,
        olThisMonth: 0,
        olThisYear: 0,
        clThisYear: 0,
        id: "teachers384",
        clThisMonth: 0,
        tname: "ABDUS SALAM MOLLICK",
        desig: "AT",
      },
    ],
  });
  const [showData, setShowData] = useState(false);
  const [filteredData, setFilteredData] = useState();
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
        setFilteredData(entry?.leaves);
        setMonth(entry?.month);
        setYear(entry?.year);
        return x;
      }
    });
    setFilteredEntry(x);
  };

  const getMonthlyData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "teachersLeaves"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    const monthwiseSorted = sortMonthwise(data);
    setTeacherLeaveState(monthwiseSorted);
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
    if (teacherLeaveState.length === 0) {
      getMonthlyData();
    } else {
      calledData(teacherLeaveState);
    }
  }, []);
  useEffect(() => {
    document.title = `${filteredEntry[0]?.id} Teachers Leave Details`;
    //eslint-disable-next-line
  }, [filteredEntry]);
  return (
    <div className="container">
      {loader && <Loader />}
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
        <>
          <div className="noprint">
            <h4 className="text-center text-primary">
              {getMonth()} Teachers Leave Details
            </h4>
            <button
              className="btn btn-primary m-4"
              onClick={() => {
                setEditData({
                  id: filteredEntry[0]?.id,
                  month: filteredEntry[0]?.month,
                  year: filteredEntry[0]?.year,
                  leaves: filteredData,
                });
                setShowEditModal(true);
              }}
            >
              Edit
            </button>
          </div>
          <div
            style={{
              width: "100%",
              overflowX: "scroll",
              flexWrap: "wrap",
            }}
          >
            <table
              className="table table-responsive table-bordered table-striped"
              style={{
                width: "100%",
                overflowX: "scroll",
                flexWrap: "wrap",
                marginBottom: "20px",
                border: "1px solid",
              }}
            >
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Teacher's name</th>
                  <th>CL This Month</th>
                  <th>OL This Month</th>
                  <th>CL This Year</th>
                  <th>OL This Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, i) => {
                  return (
                    <tr key={i} style={{ verticalAlign: "middle" }}>
                      <td>{i + 1}</td>
                      <td>{entry.tname}</td>
                      <td>{entry.clThisMonth}</td>
                      <td>{entry.olThisMonth}</td>
                      <td>{entry.clThisYear}</td>
                      <td>{entry.olThisYear}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showEditModal && (
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
                  Edit Teachers Leave of {editData?.month} - {editData?.year}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowData(true);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <p htmlFor="id" className="form-label">
                    ID: {editData?.id}
                  </p>
                  <p htmlFor="month" className="form-label">
                    Month: {editData?.month}
                  </p>
                  <p htmlFor="year" className="form-label">
                    Year: {editData?.year}
                  </p>
                </div>
                <div className="mx-auto my-2 noprint">
                  {editData.leaves.map((teacher, index) => (
                    <div className="p-2 bg-info m-2 rounded" key={index}>
                      <p className="m-1">{teacher.tname}</p>
                      <div className="form-group m-2">
                        <label className="m-2">CL This Month</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="CL This Month"
                          value={teacher.clThisMonth}
                          onChange={(e) => {
                            let x = [...editData.leaves];
                            x[index].clThisMonth = parseInt(e.target.value);
                            setEditData({ ...editData, leaves: x });
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">OL This Month</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="OL This Month"
                          value={teacher.olThisMonth}
                          onChange={(e) => {
                            let x = [...editData.leaves];
                            x[index].olThisMonth = parseInt(e.target.value);
                            setEditData({ ...editData, leaves: x });
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">CL This Year</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="CL This Year"
                          value={teacher.clThisYear}
                          onChange={(e) => {
                            let x = [...editData.leaves];
                            x[index].clThisYear = parseInt(e.target.value);
                            setEditData({ ...editData, leaves: x });
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">OL This Year</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="OL This Year"
                          value={teacher.olThisYear}
                          onChange={(e) => {
                            let x = [...editData.leaves];
                            x[index].olThisYear = parseInt(e.target.value);
                            setEditData({ ...editData, leaves: x });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowData(true);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
