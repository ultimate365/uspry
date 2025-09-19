"use client";
import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "../../context/Store";
import { firestore } from "../../context/FirbaseContext";
import {
  createDownloadLink,
  findEmptyValues,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  months,
  sortMonthwise,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import {
  getDocs,
  query,
  collection,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
export default function UserTeachers() {
  const {
    state,
    teacherLeaveState,
    setTeacherLeaveState,
    leaveDateState,
    setLeaveDateState,
  } = useGlobalContext();
  const docId = uuid().split("-")[0].substring(0, 6);
  const access = state?.ACCESS;
  const leaveRef = useRef();
  const isHT = state.USER.desig === "HT" ? true : false;
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
  const [showAddModal, setShowAddModal] = useState(false);
  const leavesArray = [
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
  ];
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [techLeaves, setTechLeaves] = useState(leavesArray);
  const [addData, setAddData] = useState({
    id: "January-2025",
    month: "January",
    year: 2025,
    leaves: leavesArray,
  });
  const [addLeaveDateData, setAddLeaveDateData] = useState({
    id: docId,
    techID: "",
    month: "",
    year: "",
    leaveType: "",
    date: todayInString(),
    sl: "",
  });
  const [showLeaveDateAdd, setShowLeaveDateAdd] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showCLAdd, setShowCLAdd] = useState(false);
  const [showClDel, setShowClDel] = useState(false);
  const [clDelObj, setClDelObj] = useState({
    id: "",
    value: "",
    field: "",
    tname: "",
    cl: [],
  });
  const [olDelObj, setOlDelObj] = useState({
    id: "",
    value: "",
    field: "",
    tname: "",
    ol: [],
  });

  const [selectedDelDate, setSelectedDelDate] = useState("");
  const [clDelId, setClDelId] = useState("");
  const [showOlAdd, setShowOlAdd] = useState(false);
  const [showOlDel, setShowOlDel] = useState(false);
  const [olDelId, setOlDelId] = useState("");

  const [editLeaveDateObj, setEditLeaveDateObj] = useState({
    year: 2025,
    techID: "",
    leaveType: "",
    id: "",
    month: "",
    sl: "",
    date: "01-01-2025",
  });
  const [showEditLeaveDateData, setShowEditLeaveDateData] = useState(false);
  const [showData, setShowData] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const currentDate = new Date();
  const monthName =
    monthNamesWithIndex[
      currentDate.getDate() > 10
        ? currentDate.getMonth()
        : currentDate.getMonth() === 0
        ? 11
        : currentDate.getMonth() - 1
    ].monthName;
  const yearName = currentDate.getFullYear();
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
      let cl1 = 0;
      let cl2 = 0;
      let cl3 = 0;
      let cl4 = 0;
      let ol1 = 0;
      let ol2 = 0;
      let ol3 = 0;
      let ol4 = 0;
      let t = leavesArray;
      allEnry.map((entry) => {
        const entryYear = entry.id.split("-")[1];
        const entryMonth = entry.id.split("-")[0];
        if (entryYear == selectedValue) {
          x.push(entry);
          y.push(entryMonth);
          entry.leaves.map((el) => {
            if (el.rank === 1) {
              cl1 += el.clThisMonth;
              ol1 += el.olThisMonth;
            } else if (el.rank === 2) {
              cl2 += el.clThisMonth;
              ol2 += el.olThisMonth;
            } else if (el.rank === 3) {
              cl3 += el.clThisMonth;
              ol3 += el.olThisMonth;
            } else {
              cl4 += el.clThisMonth;
              ol4 += el.olThisMonth;
            }
          });

          t[0].clThisYear = cl1;
          t[0].olThisYear = ol1;
          t[1].clThisYear = cl2;
          t[1].olThisYear = ol2;
          t[2].clThisYear = cl3;
          t[2].olThisYear = ol3;
          t[3].clThisYear = cl4;
          t[3].olThisYear = ol4;
        }
      });
      setTechLeaves(t);
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setFilteredEntry(x);
      setMoreFilteredEntry(x);
      setEntryMonths(uniqArray(y));
      const fLDate = leaveDateState.filter((el) => el.year === selectedValue);
      setFilteredLeaveData(fLDate);
      setAddLeaveDateData({
        ...addLeaveDateData,
        year: parseInt(selectedValue),
      });
    } else {
      setFilteredEntry([]);
      setSelectedYear("");
      setShowMonthSelection(false);
      setShowData(false);
      toast.error("Please select a year");
    }
  };
  const handleMonthChange = (month) => {
    console.log(month);
    let x = [];

    allEnry.map((entry, index) => {
      const entryYear = entry.id.split("-")[1];
      const entryMonth = entry.id.split("-")[0];
      if (entryYear == selectedYear && entryMonth === month) {
        x.push(entry);
        setShowData(true);
        setFilteredData(entry?.leaves);
        const fLDate = leaveDateState.filter(
          (el) => el.year == selectedYear && el.month == month
        );
        setFilteredLeaveData(fLDate);
        setAddLeaveDateData({ ...addLeaveDateData, month });
        setMonth(entry?.month);
        setYear(entry?.year);
        document.title = `${entry?.month} ${entry?.year} Teachers Leave Details`;
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

    const querySnapshot2 = await getDocs(
      query(collection(firestore, "leaveDates"))
    );
    const data2 = querySnapshot2.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    const monthwiseSorted2 = sortLeaves(data2);
    setLeaveDateState(monthwiseSorted2);
    setFilteredLeaveData(monthwiseSorted2);
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
  const addLeaveData = async () => {
    if (!addData.id || !addData.month || !addData.year) {
      toast.error("Please fill all the fields");
      return;
    }
    setShowAddModal(false);
    setLoader(true);
    try {
      await setDoc(doc(firestore, "teachersLeaves", addData.id), addData)
        .then(() => {
          setLoader(false);
          setShowAddModal(false);
          setShowData(true);
          toast.success("Teachers Leave Data Added Successfully");
          setTeacherLeaveState((prev) => {
            const updatedData = [...prev, addData];
            return sortMonthwise(updatedData);
          });
          calledData(sortMonthwise([...allEnry, addData]));
          setFilteredEntry((prev) => {
            const updatedData = [...prev, addData];
            return sortMonthwise(updatedData);
          });
          setEntryMonths((prev) => {
            const updatedMonths = uniqArray([...prev, addData.month]).sort(
              (a, b) =>
                monthNamesWithIndex.indexOf(a) - monthNamesWithIndex.indexOf(b)
            );
            return updatedMonths;
          });
        })
        .catch((error) => {
          setLoader(false);
          toast.error("Error adding data: " + error.message);
        });
    } catch (error) {
      setLoader(false);
      toast.error("Error adding data: " + error.message);
    }
  };
  const updateLeaveData = async (id, value, field, isDecrement = false) => {
    setLoader(true);
    const updatedValue = isDecrement ? value - 1 : value + 1;
    const updatedData = filteredData.map((entry) => {
      if (entry.id === id) {
        return {
          ...entry,
          [field]: updatedValue,
          clThisYear:
            field === "clThisMonth"
              ? entry.clThisYear + (isDecrement ? -1 : 1)
              : entry.clThisYear,
          olThisYear:
            field === "olThisMonth"
              ? entry.olThisYear + (isDecrement ? -1 : 1)
              : entry.olThisYear,
        };
      }
      return entry;
    });
    await updateDoc(doc(firestore, "teachersLeaves", month + "-" + year), {
      leaves: updatedData,
    })
      .then(async () => {
        if (field === "clThisMonth" && !isDecrement) {
          await setDoc(
            doc(firestore, "leaveDates", addLeaveDateData.id),
            addLeaveDateData
          ).then(() => {
            toast.success("Teachers Cl Added Successfully");
            const x = [...leaveDateState, addLeaveDateData];
            const monthwiseSorted = sortLeaves(x);
            setLeaveDateState(monthwiseSorted);
            const y = monthwiseSorted.filter(
              (el) => el.year == selectedYear && el.month == month
            );
            setFilteredLeaveData(y);
          });
        } else if (field === "clThisMonth" && isDecrement) {
          await deleteDoc(doc(firestore, "leaveDates", clDelId)).then(() => {
            const x = leaveDateState.filter((el) => el.id !== clDelId);
            const y = x.filter(
              (el) => el.year == selectedYear && el.month == month
            );
            setLeaveDateState(x);
            setFilteredLeaveData(y);
            toast.success("Teachers Cl Deleted Successfully");
          });
        } else if (field === "olThisMonth" && !isDecrement) {
          await setDoc(
            doc(firestore, "leaveDates", addLeaveDateData.id),
            addLeaveDateData
          ).then(() => {
            toast.success("Teachers Cl Added Successfully");
            const x = [...leaveDateState, addLeaveDateData];
            const monthwiseSorted = sortLeaves(x);
            setLeaveDateState(monthwiseSorted);
            const y = monthwiseSorted.filter(
              (el) => el.year == selectedYear && el.month == month
            );
            setFilteredLeaveData(y);
          });
        } else if (field === "olThisMonth" && isDecrement) {
          await deleteDoc(doc(firestore, "leaveDates", olDelId)).then(() => {
            const x = leaveDateState.filter((el) => el.id !== clDelId);
            const y = x.filter(
              (el) => el.year == selectedYear && el.month == month
            );
            setLeaveDateState(x);
            setFilteredLeaveData(y);
            toast.success("Teachers Cl Deleted Successfully");
          });
        }

        let x = techLeaves;
        x.map((el) => {
          if (el.id === id) {
            field === "clThisMonth"
              ? (el.clThisYear = isDecrement
                  ? el.clThisYear - 1
                  : el.clThisYear + 1)
              : (el.olThisYear = isDecrement
                  ? el.olThisYear - 1
                  : el.olThisYear + 1);
          }
        });
        setTechLeaves(x);
        setFilteredEntry(updatedData);
        setFilteredData(updatedData);
        setTeacherLeaveState((prev) => {
          const updatedNewData = prev.map((entry) => {
            if (entry.id === month + "-" + year) {
              return {
                ...entry,
                leaves: updatedData,
              };
            }
            return entry;
          });
          return sortMonthwise(updatedNewData);
        });
        calledData(sortMonthwise(teacherLeaveState));
      })
      .catch((error) => {
        toast.error("Error updating data: " + error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const uploadLeaveDateData = async () => {
    setLoader(true);
    setShowLeaveDateAdd(false);
    await setDoc(
      doc(firestore, "leaveDates", addLeaveDateData.id),
      addLeaveDateData
    )
      .then(() => {
        toast.success("Teachers Leave Date Added Successfully");
        const x = [...leaveDateState, addLeaveDateData];
        const monthwiseSorted = sortLeaves(x);
        setLeaveDateState(monthwiseSorted);
        const z =
          monthwiseSorted.filter(
            (el) => el.year == selectedYear && el.month == month
          ) || [];
        setFilteredLeaveData(z);
        setLoader(false);
        setAddLeaveDateData({
          id: docId,
          techID: "",
          month: monthName,
          year: yearName,
          leaveType: "",
          date: todayInString(),
          sl: "",
        });
        setSelectedTeacher("");
      })
      .catch((e) => {
        setLoader(false);
        toast.error("Error updating data: " + e.message);
      });
  };
  const updateLeaveDate = async () => {
    setLoader(true);
    setShowEditLeaveDateData(false);
    await updateDoc(
      doc(firestore, "leaveDates", editLeaveDateObj.id),
      editLeaveDateObj
    )
      .then(() => {
        toast.success("Teachers Leave Date Updated Successfully");
        const x = leaveDateState.filter((el) => el.id !== editLeaveDateObj.id);
        const y = [...x, editLeaveDateObj];
        const monthwiseSorted = sortLeaves(y);
        setLeaveDateState(monthwiseSorted);
        const z =
          monthwiseSorted.filter(
            (el) => el.year == selectedYear && el.month == month
          ) || [];
        setFilteredLeaveData(z);
        setLoader(false);
      })
      .catch((e) => {
        setLoader(false);
        toast.error("Error updating data: " + e.message);
      });
  };
  const deleteLeaveDate = async () => {
    setLoader(true);
    setShowEditLeaveDateData(false);
    await deleteDoc(doc(firestore, "leaveDates", editLeaveDateObj.id))
      .then(() => {
        toast.success("Teachers Leave Date Deleted Successfully");
        const x = leaveDateState.filter((el) => el.id !== editLeaveDateObj.id);
        const y = x.filter(
          (el) =>
            el.year == editLeaveDateObj.year &&
            el.month == editLeaveDateObj.month
        );
        setLeaveDateState(x);
        setFilteredLeaveData(y);
        setLoader(false);
      })
      .catch((e) => {
        setLoader(false);
        toast.error("Error deleting data: " + e.message);
      });
  };
  function sortLeaves(leaves) {
    const monthOrder = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    return leaves.sort((a, b) => {
      // 1. Year (descending)
      if (a.year !== b.year) {
        return b.year - a.year;
      }

      // 2. Month (descending)
      if (a.month !== b.month) {
        return monthOrder[b.month] - monthOrder[a.month];
      }

      // 3. Date (descending, extract day from dd-mm-yyyy)
      const dayA = parseInt(a.date.split("-")[0], 10);
      const dayB = parseInt(b.date.split("-")[0], 10);
      if (dayA !== dayB) {
        return dayA - dayB;
      }

      // 4. techID (ascending)
      if (a.techID !== b.techID) {
        return a.techID.localeCompare(b.techID);
      }

      // 5. techID (ascending)
      if (a.leaveType !== b.leaveType) {
        return b.leaveType.localeCompare(a.leaveType);
      }

      // 6. sl (ascending)
      return a.sl - b.sl;
    });
  }

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
    //eslint-disable-next-line
  }, [filteredEntry]);
  useEffect(() => {
    //eslint-disable-next-line
  }, [techLeaves, addLeaveDateData]);

  return (
    <div className="container">
      {loader && <Loader />}
      <div>
        <button
          type="button"
          className="btn btn-dark m-2"
          onClick={() => {
            createDownloadLink(teacherLeaveState, "teachersLeaves");
          }}
        >
          Download Leaves Data
        </button>
        <button
          type="button"
          className="btn btn-success m-2"
          onClick={() => {
            createDownloadLink(leaveDateState, "leaveDates");
          }}
        >
          Download Leave Date Data
        </button>
        <h3 className="text-primary">Teacher's Leave Details</h3>
        {isHT && (
          <div>
            <button
              className="btn btn-primary m-4"
              onClick={() => {
                setShowAddModal(true);
                setShowData(false);
                setAddData({
                  ...addData,
                  id: `${monthName}-${yearName}`,
                  month: monthName,
                  year: yearName,
                  leaves: allEnry[allEnry.length - 1]?.leaves.map((el) => {
                    return {
                      ...el,
                      clThisMonth: 0,
                      olThisMonth: 0,
                    };
                  }),
                });
                teacherLeaveState.filter(
                  (el) => el.id === `${monthName}-${yearName}`
                ).length > 0 &&
                  toast.error("Data for this month already exists.");
              }}
            >
              Add Month
            </button>
            <button
              className="btn btn-success m-4"
              onClick={() => {
                setShowLeaveDateAdd(true);
                setAddLeaveDateData({
                  id: docId,
                  techID: "",
                  month: monthName,
                  year: yearName,
                  leaveType: "",
                  date: todayInString(),
                  sl: "",
                });
                setSelectedTeacher("");
              }}
            >
              Add Leave Date
            </button>
          </div>
        )}
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
                  <th>
                    Teacher's
                    <br />
                    name
                  </th>
                  <th>
                    CL This
                    <br /> Month
                  </th>
                  <th>
                    OL This
                    <br /> Month
                  </th>
                  <th>
                    CL Till
                    <br />
                    This Month
                  </th>
                  <th>
                    OL Till
                    <br />
                    This Month
                  </th>
                  <th>
                    Total CL
                    <br />
                    This Year
                  </th>
                  <th>
                    Total OL
                    <br />
                    This Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, i) => {
                  const techLDates = filteredLeaveData.filter(
                    (el) => el.techID === entry.id
                  );
                  return (
                    <tr key={i} style={{ verticalAlign: "middle" }}>
                      <td>{i + 1}</td>
                      <td suppressHydrationWarning>
                        {entry?.tname?.split(" ")?.map((el, i) => (
                          <p className="m-0 p-0" key={i}>
                            {el}
                            <br />
                          </p>
                        ))}
                      </td>
                      <td className="fs-5" suppressHydrationWarning>
                        {isHT && (
                          <i
                            style={{
                              cursor: "pointer",
                            }}
                            className="bi bi-plus-circle-fill"
                            onClick={() => {
                              // updateLeaveData(
                              //   entry.id,
                              //   entry.clThisMonth,
                              //   "clThisMonth"
                              // );
                              setShowCLAdd(true);
                              setAddLeaveDateData({
                                ...addLeaveDateData,
                                techID: entry.id,
                                leaveType: "CL",
                                sl:
                                  techLDates.filter(
                                    (el) => el.leaveType === "CL"
                                  ).length + 1,
                                date: `01-${(months.indexOf(month) + 1)
                                  .toString()
                                  .padStart(2, "0")}-${selectedYear}`,
                              });
                              setSelectedTeacher(entry.tname);
                            }}
                          ></i>
                        )}
                        <br /> {entry.clThisMonth}
                        <br />
                        {entry.clThisMonth > 0 && isHT && (
                          <i
                            style={{
                              cursor: "pointer",
                            }}
                            className="bi bi-dash-circle-fill"
                            onClick={() => {
                              // updateLeaveData(
                              //   entry.id,
                              //   entry.clThisMonth,
                              //   "clThisMonth",
                              //   true
                              // );
                              setShowClDel(true);
                              setClDelObj({
                                id: entry.id,
                                value: entry.clThisMonth,
                                field: "clThisMonth",
                                tname: entry.tname,
                                cl: techLDates.filter(
                                  (el) => el.leaveType === "CL"
                                ),
                              });
                            }}
                          ></i>
                        )}
                        <br />
                        {techLDates.filter((el) => el.leaveType === "CL")
                          .length > 0 &&
                          techLDates
                            .filter((el) => el.leaveType === "CL")
                            .map((el, ind) => (
                              <p
                                className="fs-6 m-0 p-0"
                                key={ind}
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  if (isHT) {
                                    setEditLeaveDateObj(el);
                                    setShowEditLeaveDateData(true);
                                  }
                                }}
                              >
                                {el.date.split("-").map((l, x) => {
                                  if (x === 0) {
                                    return l + "/";
                                  } else if (x == 1) {
                                    return l;
                                  }
                                })}
                              </p>
                            ))}
                      </td>
                      <td className="fs-5" suppressHydrationWarning>
                        {isHT && (
                          <i
                            style={{
                              cursor: "pointer",
                            }}
                            className="bi bi-plus-circle-fill"
                            onClick={() => {
                              // updateLeaveData(
                              //   entry.id,
                              //   entry.olThisMonth,
                              //   "olThisMonth"
                              // );
                              setShowOlAdd(true);
                              setAddLeaveDateData({
                                ...addLeaveDateData,
                                techID: entry.id,
                                leaveType: "OL",
                                sl:
                                  techLDates.filter(
                                    (el) => el.leaveType === "OL"
                                  ).length + 1,
                                date: `01-${(months.indexOf(month) + 1)
                                  .toString()
                                  .padStart(2, "0")}-${selectedYear}`,
                              });
                              setSelectedTeacher(entry.tname);
                            }}
                          ></i>
                        )}
                        <br />
                        {entry.olThisMonth}
                        <br />
                        {entry.olThisMonth > 0 && isHT && (
                          <i
                            style={{
                              cursor: "pointer",
                            }}
                            className="bi bi-dash-circle-fill"
                            onClick={() => {
                              // updateLeaveData(
                              //   entry.id,
                              //   entry.olThisMonth,
                              //   "olThisMonth",
                              //   true
                              // )
                              setShowOlDel(true);
                              setOlDelObj({
                                id: entry.id,
                                value: entry.olThisMonth,
                                field: "olThisMonth",
                                tname: entry.tname,
                                ol: techLDates.filter(
                                  (el) => el.leaveType === "OL"
                                ),
                              });
                            }}
                          ></i>
                        )}
                        <br />
                        {techLDates.filter((el) => el.leaveType === "OL")
                          .length > 0 &&
                          techLDates
                            .filter((el) => el.leaveType === "OL")
                            .map((el, ind) => (
                              <p
                                className="fs-6 m-0 p-0"
                                key={ind}
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  if (isHT) {
                                    setEditLeaveDateObj(el);
                                    setShowEditLeaveDateData(true);
                                  }
                                }}
                              >
                                {el.date.split("-").map((l, x) => {
                                  if (x === 0) {
                                    return l + "/";
                                  } else if (x == 1) {
                                    return l;
                                  }
                                })}
                              </p>
                            ))}
                      </td>
                      <td className="fs-5" suppressHydrationWarning>
                        {entry.clThisYear}
                      </td>
                      <td className="fs-5" suppressHydrationWarning>
                        {entry.olThisYear}
                      </td>
                      <td className="fs-5" suppressHydrationWarning>
                        {techLeaves[i].clThisYear}
                      </td>
                      <td className="fs-5" suppressHydrationWarning>
                        {techLeaves[i].olThisYear}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showAddModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Add Teachers Leave of {addData?.month} - {addData?.year}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowAddModal(false);
                    selectedYear && showMonthSelection && setShowData(true);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="input-group p-1">
                    <label className="input-group-text">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ID"
                      value={addData?.id}
                      onChange={(e) => {
                        setAddData({
                          ...addData,
                          id: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="input-group p-1">
                    <label className="input-group-text">Month</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Month"
                      value={addData?.month}
                      onChange={(e) => {
                        setAddData({
                          ...addData,
                          month: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="input-group p-1">
                    <label className="input-group-text">Year</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Year"
                      value={addData?.year}
                      onChange={(e) => {
                        setAddData({
                          ...addData,
                          year: e.target.value,
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
                  onClick={addLeaveData}
                  disabled={
                    teacherLeaveState.filter(
                      (el) => el.id === `${addData?.month}-${addData?.year}`
                    ).length > 0
                  }
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowAddModal(false);
                    selectedYear && showMonthSelection && setShowData(true);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showLeaveDateAdd && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Add Leave Date
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowLeaveDateAdd(false);
                    setAddLeaveDateData({
                      id: docId,
                      techID: "",
                      month: monthName,
                      year: yearName,
                      leaveType: "",
                      date: todayInString(),
                      sl: "",
                    });
                    setSelectedTeacher("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="input-group p-1">
                    <label className="input-group-text">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ID"
                      value={addLeaveDateData?.id}
                      onChange={(e) => {
                        setAddLeaveDateData({
                          ...addLeaveDateData,
                          id: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label className="input-group-text">Select Teacher</label>
                    <select
                      className="form-select"
                      defaultValue={""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          setAddLeaveDateData({
                            ...addLeaveDateData,
                            techID: value.split("+")[0],
                            leaveType: "",
                            sl: "",
                          });
                          setSelectedTeacher(value.split("+")[1]);
                          if (leaveRef.current) {
                            leaveRef.current.value = "";
                          }
                        } else {
                          toast.error("Please Select A Teacher");
                        }
                      }}
                      aria-label="Default select example"
                    >
                      <option className="text-center text-primary" value="">
                        Select Teacher
                      </option>
                      {leavesArray.map((el, i) => (
                        <option
                          className="text-center text-success text-wrap"
                          key={i}
                          value={`${el.id}+${el.tname}`}
                        >
                          {el.tname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <label className="input-group-text">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={getCurrentDateInput(addLeaveDateData.date)}
                      onChange={(e) => {
                        const value = e.target.value;
                        const date = getSubmitDateInput(e.target.value);
                        setAddLeaveDateData({
                          ...addLeaveDateData,
                          date,
                          year: new Date(value).getFullYear(),
                          month:
                            monthNamesWithIndex[new Date(value).getMonth()]
                              .monthName,
                        });
                      }}
                    />
                  </div>
                  <div className="input-group p-1">
                    <label className="input-group-text">Month</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Month"
                      value={addLeaveDateData?.month}
                      onChange={(e) => {
                        setAddLeaveDateData({
                          ...addLeaveDateData,
                          month: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="input-group p-1">
                    <label className="input-group-text">Year</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Year"
                      value={addLeaveDateData?.year}
                      onChange={(e) => {
                        setAddLeaveDateData({
                          ...addLeaveDateData,
                          year: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {addLeaveDateData.techID && (
                    <div className="input-group mb-3">
                      <label className="input-group-text">
                        Select Leave Type
                      </label>
                      <select
                        className="form-select"
                        ref={leaveRef}
                        defaultValue={""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const techLeaveSl = leaveDateState.filter(
                            (el) =>
                              el.techID === addLeaveDateData.techID &&
                              el.leaveType === value &&
                              el.month === addLeaveDateData.month &&
                              el.year === addLeaveDateData.year
                          );
                          if (value) {
                            setAddLeaveDateData({
                              ...addLeaveDateData,
                              leaveType: value,
                              sl:
                                techLeaveSl.length > 0
                                  ? techLeaveSl.length + 1
                                  : 1,
                            });
                          } else {
                            toast.error("Please Select A Leave Type");
                          }
                        }}
                        aria-label="Default select example"
                      >
                        <option className="text-center text-primary" value="">
                          Select Leave Type
                        </option>
                        <option
                          className="text-center text-success text-wrap"
                          value="CL"
                        >
                          CL
                        </option>
                        <option
                          className="text-center text-success text-wrap"
                          value="OL"
                        >
                          OL
                        </option>
                      </select>
                    </div>
                  )}

                  {addLeaveDateData.leaveType && addLeaveDateData.techID && (
                    <div className="input-group p-1">
                      <label className="input-group-text">Leave Serial</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Leave Serial"
                        value={addLeaveDateData?.sl || ""}
                        onChange={(e) => {
                          setAddLeaveDateData({
                            ...addLeaveDateData,
                            sl: parseInt(e.target.value),
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={uploadLeaveDateData}
                  disabled={!findEmptyValues(addLeaveDateData)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowLeaveDateAdd(false);
                    setAddLeaveDateData({
                      id: docId,
                      techID: "",
                      month: monthName,
                      year: yearName,
                      leaveType: "",
                      date: todayInString(),
                      sl: "",
                    });
                    setSelectedTeacher("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCLAdd && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5" id="staticBackdropLabel">
                  Add CL{" "}
                  {`${addLeaveDateData.sl} of ${addLeaveDateData.month}-${addLeaveDateData.year} of ${selectedTeacher}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowCLAdd(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="input-group mb-3">
                    <label className="input-group-text">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ID"
                      value={addLeaveDateData?.id}
                      onChange={(e) => {
                        setAddLeaveDateData({
                          ...addLeaveDateData,
                          id: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label className="input-group-text">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={getCurrentDateInput(addLeaveDateData.date)}
                      onChange={(e) => {
                        const date = getSubmitDateInput(e.target.value);
                        setAddLeaveDateData({ ...addLeaveDateData, date });
                      }}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <label className="input-group-text">SL</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SL"
                      value={addLeaveDateData?.sl}
                      onChange={(e) => {
                        if (e.target.value) {
                          setAddLeaveDateData({
                            ...addLeaveDateData,
                            sl: parseInt(e.target.value),
                          });
                        } else {
                          setAddLeaveDateData({
                            ...addLeaveDateData,
                            sl: "",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={async () => {
                    updateLeaveData(
                      addLeaveDateData.techID,
                      addLeaveDateData.sl - 1,
                      "clThisMonth",
                      false
                    );
                    setShowCLAdd(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowCLAdd(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showClDel && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5" id="staticBackdropLabel">
                  Delete CL of {clDelObj.tname}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowClDel(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="input-group mb-3">
                    <label className="input-group-text">Date</label>
                    <select
                      className="form-select"
                      defaultValue={""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          setClDelId(value.split("+")[0]);
                          setSelectedDelDate(value.split("+")[1]);
                        } else {
                          toast.error("Please Select A Date");
                        }
                      }}
                      aria-label="Default select example"
                    >
                      <option className="text-center text-primary" value="">
                        Select Date
                      </option>
                      {clDelObj.cl.map((el, i) => (
                        <option
                          className="text-center text-success text-wrap"
                          key={i}
                          value={`${el.id}+${el.date}`}
                        >
                          {el.date}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedDelDate && (
                    <h5 className="">Selected Date: {selectedDelDate}</h5>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    updateLeaveData(
                      clDelObj.id,
                      clDelObj.value,
                      "clThisMonth",
                      true
                    );
                    setShowClDel(false);
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setShowClDel(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOlAdd && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5" id="staticBackdropLabel">
                  Add OL{" "}
                  {`${addLeaveDateData.sl} of ${addLeaveDateData.month}-${addLeaveDateData.year} of ${selectedTeacher}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowOlAdd(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="input-group mb-3">
                    <label className="input-group-text">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ID"
                      value={addLeaveDateData?.id}
                      onChange={(e) => {
                        setAddLeaveDateData({
                          ...addLeaveDateData,
                          id: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label className="input-group-text">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={getCurrentDateInput(addLeaveDateData.date)}
                      onChange={(e) => {
                        const date = getSubmitDateInput(e.target.value);
                        setAddLeaveDateData({ ...addLeaveDateData, date });
                      }}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <label className="input-group-text">SL</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SL"
                      value={addLeaveDateData?.sl}
                      onChange={(e) => {
                        if (e.target.value) {
                          setAddLeaveDateData({
                            ...addLeaveDateData,
                            sl: parseInt(e.target.value),
                          });
                        } else {
                          setAddLeaveDateData({
                            ...addLeaveDateData,
                            sl: "",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={async () => {
                    updateLeaveData(
                      addLeaveDateData.techID,
                      addLeaveDateData.sl - 1,
                      "olThisMonth",
                      false
                    );
                    setShowOlAdd(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowOlAdd(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOlDel && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5" id="staticBackdropLabel">
                  Delete OL of {olDelObj.tname}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowOlDel(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="input-group mb-3">
                    <label className="input-group-text">Date</label>
                    <select
                      className="form-select"
                      defaultValue={""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          setOlDelId(value.split("+")[0]);
                          setSelectedDelDate(value.split("+")[1]);
                        } else {
                          toast.error("Please Select A Date");
                        }
                      }}
                      aria-label="Default select example"
                    >
                      <option className="text-center text-primary" value="">
                        Select Date
                      </option>
                      {olDelObj.ol.map((el, i) => (
                        <option
                          className="text-center text-success text-wrap"
                          key={i}
                          value={`${el.id}+${el.date}`}
                        >
                          {el.date}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedDelDate && (
                    <h5 className="">Selected Date: {selectedDelDate}</h5>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    updateLeaveData(
                      olDelObj.id,
                      olDelObj.value,
                      "olThisMonth",
                      true
                    );
                    setShowOlDel(false);
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setShowOlDel(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditLeaveDateData && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5" id="staticBackdropLabel">
                  Edit {editLeaveDateObj.leaveType} of{" "}
                  {
                    leavesArray.filter(
                      (el) => el.id === editLeaveDateObj.techID
                    )[0].tname
                  }
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowEditLeaveDateData(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2 noprint">
                  <div className="input-group mb-3">
                    <label className="input-group-text">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={getCurrentDateInput(editLeaveDateObj.date)}
                      onChange={(e) => {
                        const date = getSubmitDateInput(e.target.value);
                        setEditLeaveDateObj({ ...editLeaveDateObj, date });
                      }}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <select
                      className="form-select"
                      defaultValue={
                        editLeaveDateObj.leaveType
                          ? editLeaveDateObj.leaveType
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          setEditLeaveDateObj({
                            ...editLeaveDateObj,
                            leaveType: value,
                          });
                        } else {
                          toast.error("Please Select A Leave Type");
                        }
                      }}
                      aria-label="Default select example"
                    >
                      <option className="text-center text-primary" value="">
                        Select Leave Type
                      </option>
                      <option
                        className="text-center text-success text-wrap"
                        value="CL"
                      >
                        CL
                      </option>
                      <option
                        className="text-center text-success text-wrap"
                        value="OL"
                      >
                        OL
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    updateLeaveDate();
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    deleteLeaveDate();
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setShowEditLeaveDateData(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
