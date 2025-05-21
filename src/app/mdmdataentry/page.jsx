"use client";
import {
  MDM_COST,
  PP_STUDENTS,
  PRIMARY_STUDENTS,
  SCHOOLNAME,
  PREV_MDM_COST,
} from "@/modules/constants";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  todayInString,
  uniqArray,
  sortMonthwise,
  IndianFormat,
  round2dec,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context/Store";

export default function MDMData() {
  const {
    state,
    mealState,
    setMealState,
    riceState,
    setRiceState,
    monthlyReportState,
    setMonthlyReportState,
    StudentDataState,
    setStudentDataState,
  } = useGlobalContext();
  const router = useRouter();
  const access = state?.ACCESS;
  const [date, setDate] = useState(todayInString());
  const today = new Date();
  const [pp, setPp] = useState("");
  const [pry, setPry] = useState("");
  const [showEntry, setShowEntry] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [mdmDone, setMdmDone] = useState(false);
  const [riceDone, setRiceDone] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [showRiceData, setShowRiceData] = useState(false);
  const [errPP, setErrPP] = useState("");
  const [errPry, setErrPry] = useState("");
  const [docId, setDocId] = useState(todayInString());
  const [loader, setLoader] = useState(false);
  const [allEnry, setAllEnry] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [moreFilteredData, setMoreFilteredData] = useState([]);
  const [monthlyReportData, setMonthlyReportData] = useState([]);
  const [thisMonthMDMAllowance, setThisMonthMDMAllowance] =
    useState(PREV_MDM_COST);
  const [ppTotalMeal, setPpTotalMeal] = useState("");
  const [pryTotalMeal, setPryTotalMeal] = useState("");
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [monthText, setMonthText] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [entryMonths, setEntryMonths] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [showDataTable, setShowDataTable] = useState(false);
  const [riceData, setRiceData] = useState([]);
  const [filteredRiceData, setFilteredRiceData] = useState([]);
  const [riceOB, setRiceOB] = useState("");
  const [riceCB, setRiceCB] = useState("");
  const [ricePPOB, setRicePPOB] = useState("");
  const [ricePPRC, setRicePPRC] = useState("");
  const [ricePPEX, setRicePPEX] = useState("");
  const [ricePPCB, setRicePPCB] = useState("");
  const [ricePryOB, setRicePryOB] = useState("");
  const [ricePryRC, setRicePryRC] = useState("");
  const [ricePryEX, setRicePryEX] = useState("");
  const [ricePryCB, setRicePryCB] = useState("");
  const [riceGiven, setRiceGiven] = useState("");
  const [totalRiceGiven, setTotalRiceGiven] = useState("");
  const [riceExpend, setRiceExpend] = useState("");
  const [errRice, setErrRice] = useState("");
  const [showSubmitMonthlyReport, setShowSubmitMonthlyReport] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [monthToSubmit, setMonthToSubmit] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [monthWorkingDays, setMonthWorkingDays] = useState("");
  const [totalWorkingDays, setTotalWorkingDays] = useState("");
  const [monthPPTotal, setMonthPPTotal] = useState("");
  const [monthlyPPCost, setMonthlyPPCost] = useState("");
  const [monthPRYTotal, setMonthPRYTotal] = useState("");
  const [monthlyPRYCost, setMonthlyPRYCost] = useState("");
  const [monthTotalCost, setMonthTotalCost] = useState("");
  const [thisMonthTotalCost, setThisMonthTotalCost] = useState("");
  const [monthRiceOB, setMonthRiceOB] = useState("");
  const [monthRiceGiven, setMonthRiceGiven] = useState("");
  const [monthRiceConsunption, setMonthRiceConsunption] = useState("");
  const [thisMonthTotalRiceConsumption, setThisMonthTotalRiceConsumption] =
    useState("");
  const [monthRiceCB, setMonthRiceCB] = useState("");
  const [monthYearID, setMonthYearID] = useState("");
  const [mdmTransaction, setMdmTransaction] = useState({
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
  });
  const [mdmRice, setMdmRice] = useState({
    prevRicePPRC: "",
    prevRicePryRC: "",
    prevRicePPEX: "",
    prevRicePryEX: "",
  });
  const [showStudentDataEntryForm, setShowStudentDataEntryForm] =
    useState(false);
  const [showStudentDataAddForm, setShowStudentDataAddForm] = useState(false);
  const [showStudentDataEditForm, setShowStudentDataEditForm] = useState(false);
  const [StudentData, setStudentData] = useState({
    PP_STUDENTS: 8,
    PRIMARY_BOYS: 21,
    PRIMARY_GIRLS: 25,
    PRIMARY_STUDENTS: 40,
    TOTAL_STUDENTS: 46,
    YEAR: "2025",
    id: "2025",
  });
  const [StudentEditData, setStudentEditData] = useState({
    PP_STUDENTS: 8,
    PRIMARY_BOYS: 21,
    PRIMARY_GIRLS: 25,
    PRIMARY_STUDENTS: 40,
    TOTAL_STUDENTS: 46,
    YEAR: "2025",
    id: "2025",
  });
  const [StudentEntryData, setStudentEntryData] = useState({
    PP_STUDENTS: 8,
    PRIMARY_BOYS: 21,
    PRIMARY_GIRLS: 25,
    PRIMARY_STUDENTS: 40,
    TOTAL_STUDENTS: 46,
    YEAR: "2025",
    id: "2025",
  });
  const submitData = async () => {
    if (validForm()) {
      setLoader(true);
      await setDoc(doc(firestore, "mdmData", date), {
        pp: parseInt(pp),
        pry: parseInt(pry),
        date: date,
        id: date,
      })
        .then(() => {
          toast.success("Data submitted successfully");
          let x = allEnry;
          x = [
            ...x,
            { pp: parseInt(pp), pry: parseInt(pry), date: date, id: date },
          ].sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date))
          );
          setAllEnry(x);
          setMealState(x);
          setMdmDone(true);
          setPp("");
          setPry("");
          setDate(todayInString());
          setShowEntry(false);
          setLoader(false);
        })
        .catch((e) => {
          toast.error("Failed to submit data. Please try again");
          console.error(e);
          setLoader(false);
        });
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  const validForm = () => {
    let isValid = true;
    if (pp.length === 0) {
      setErrPP("PP Number is required");
      isValid = false;
    } else {
      setErrPP("");
      isValid = true;
    }
    if (pry.length === 0) {
      setErrPry("PRY Number is required");
      isValid = false;
    } else {
      setErrPry("");
      isValid = true;
    }

    return isValid;
  };

  const searchTodaysData = async () => {
    const todaysData = allEnry.filter(
      (entry) => entry.date === todayInString()
    );
    if (todaysData.length > 0) {
      const data = todaysData[0];
      setPp(data.pp);
      setPry(data.pry);
      setDate(getCurrentDateInput(data.date));
      setDocId(data.date);
      setShowUpdate(true);
    } else {
      setShowUpdate(true);
      setDocId(todayInString());
      toast.error("Todays Enry Not Done Yet!");
    }
    setShowDataTable(false);
    setShowMonthSelection(false);
    setShowEntry(false);
    setShowMonthlyReport(false);
    setShowRiceData(false);
  };
  const updateData = async () => {
    if (validForm()) {
      setLoader(true);
      try {
        await setDoc(doc(firestore, "mdmData", docId), {
          pp: parseInt(pp),
          pry: parseInt(pry),
          date: docId,
          id: docId,
        })
          .then(() => {
            toast.success("Data updated successfully");
            let x = [];
            x = allEnry.filter((entry) => entry.id !== docId);
            x = [
              ...x,
              { pp: parseInt(pp), pry: parseInt(pry), date: docId, id: docId },
            ].sort(
              (a, b) =>
                Date.parse(getCurrentDateInput(a.date)) -
                Date.parse(getCurrentDateInput(b.date))
            );
            setAllEnry(x);
            setMealState(x);
            setPp("");
            setPry("");
            setDate(todayInString());
            setDocId(todayInString());
            setShowEntry(false);
            setLoader(false);
          })
          .catch((e) => {
            console.log(e);
            setLoader(false);
            toast.error("Something went Wrong!");
          });
      } catch (error) {
        console.log(error);
        setLoader(false);
        toast.error("Something went Wrong!");
      }
    } else {
      toast.error("Please Fillup Required Details!");
    }
  };

  const getMainData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "mdmData"))
    );
    const data = querySnapshot.docs
      .map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }))
      .sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date))
      );
    setLoader(false);
    setAllEnry(data);
    setMealState(data);
    findMDMEntry(data);
  };
  const findMDMEntry = (array) => {
    if (array.filter((el) => el?.id === todayInString()).length > 0) {
      setMdmDone(true);
    } else {
      setMdmDone(false);
    }
  };
  const getRiceData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(query(collection(firestore, "rice")));
    const data = querySnapshot.docs
      .map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }))
      .sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date))
      );
    setLoader(false);
    setRiceData(data);
    setRiceState(data);
    setRiceOB(data[data.length - 1].riceCB);
    setRiceCB(data[data.length - 1].riceCB);
    findRiceEntry(data);
  };
  const getStudentData = async () => {
    const year = date?.split("-")[2];
    if (StudentDataState.length === 0) {
      const querySnapshot = await getDocs(
        query(collection(firestore, "studentYearData"))
      );
      const data = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }));
      setStudentDataState(data);

      setStudentData(data.filter((s) => s.YEAR === year)[0]);
    } else {
      setStudentData(StudentDataState.filter((s) => s.YEAR === year)[0]);
    }
  };
  const findRiceEntry = (array) => {
    if (array.filter((el) => el?.id === todayInString()).length > 0) {
      setRiceDone(true);
      setRiceOB(array[array.length - 1].riceOB);
      setRiceCB(array[array.length - 1].riceCB);
      setRiceExpend(array[array.length - 1].riceExpend);
      setRiceGiven(array[array.length - 1].riceGiven);
    } else {
      setRiceDone(false);
    }
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
    const thisMonthlyData = monthwiseSorted.filter(
      (data) => data.id === monthYearID
    );
    if (thisMonthlyData.length > 0) {
      filterMonthlyData(thisMonthlyData[0]);
    }
    const thisMonthIndex = monthwiseSorted.findIndex(
      (data) => data.id === monthYearID
    );
    let prevMonthData = monthwiseSorted[monthwiseSorted.length - 1];
    if (thisMonthIndex !== -1) {
      prevMonthData = monthwiseSorted[monthwiseSorted.length - 1];
    } else {
      setMdmTransaction({
        ...mdmTransaction,
        ppOB: prevMonthData?.ppCB,
        pryOB: prevMonthData?.pryCB,
        prevPpRC: prevMonthData?.ppRC,
        prevPryRC: prevMonthData?.pryRC,
        prevMonthlyPPCost: prevMonthData?.monthlyPPCost,
        prevMonthlyPRYCost: prevMonthData?.monthlyPRYCost,
      });
      setMdmRice({
        ...mdmRice,
        prevRicePPRC: prevMonthData?.ricePPRC,
        prevRicePryRC: prevMonthData?.ricePryRC,
        prevRicePPEX: prevMonthData?.ricePPCB,
        prevRicePryEX: prevMonthData?.ricePryCB,
      });
      setRicePPOB(prevMonthData?.ricePPCB);
      setRicePryOB(prevMonthData?.ricePryCB);
      setRiceOB(prevMonthData?.riceCB);
      setMonthlyPPCost(Math.round(ppTotalMeal * thisMonthMDMAllowance));
      setMonthlyPRYCost(Math.round(pryTotalMeal * thisMonthMDMAllowance));
      setMonthTotalCost(
        Math.round(
          ppTotalMeal * thisMonthMDMAllowance +
            pryTotalMeal * thisMonthMDMAllowance
        )
      );
      setMonthRiceConsunption(thisMonthTotalRiceConsumption);
      setMonthRiceGiven(totalRiceGiven);
      setMonthRiceCB(
        prevMonthData?.riceCB + totalRiceGiven - thisMonthTotalRiceConsumption
      );
    }

    setLoader(false);
  };

  const filterMonthlyData = (entry) => {
    setMonthWorkingDays(entry.worrkingDays);
    setTotalWorkingDays(entry.totalWorkingDays);
    setMonthPPTotal(entry.ppTotal);
    setMonthPRYTotal(entry.pryTotal);
    setMonthlyPPCost(entry.monthlyPPCost);
    setMonthlyPRYCost(entry.monthlyPRYCost);
    setMonthTotalCost(entry.totalCost);
    setRicePPOB(entry.ricePPOB);
    setRicePryOB(entry.ricePryOB);
    setMonthRiceOB(entry.riceOB);
    setRicePPRC(entry.ricePPRC);
    setRicePryRC(entry.ricePryRC);
    setMonthRiceGiven(entry.riceGiven);
    setRicePPEX(entry.ricePPEX);
    setRicePryEX(entry.ricePryEX);
    setMonthRiceConsunption(entry.riceConsunption);
    setRicePPCB(entry.ricePPCB);
    setRicePryCB(entry.ricePryCB);
    setMonthRiceCB(entry.riceCB);
    setRemarks(entry.remarks);

    setMdmTransaction({
      ppOB: entry.ppOB,
      pryOB: entry.pryOB,
      ppRC: entry.ppRC,
      pryRC: entry.pryRC,
      ppCB: entry.ppCB,
      pryCB: entry.pryCB,
      prevPpRC: entry.prevPpRC,
      prevPryRC: entry.prevPryRC,
      prevMonthlyPPCost: entry.prevMonthlyPPCost,
      prevMonthlyPRYCost: entry.prevMonthlyPRYCost,
    });
    setMdmRice({
      prevRicePPRC: entry.prevRicePPRC,
      prevRicePryRC: entry.prevRicePryRC,
      prevRicePPEX: entry.prevRicePPEX,
      prevRicePryEX: entry.prevRicePryEX,
    });
  };

  const calledData = (array) => {
    let x = [];
    array.map((entry) => {
      const entryYear = entry.date.split("-")[2];
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setServiceArray(x);
    let ppTotal = 0;
    let pryTotal = 0;
    array.map((entry) => {
      ppTotal += entry.pp;
      pryTotal += entry.pry;
    });
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);

    setLoader(false);
    setAllEnry(array);
    setFilteredData(array);
    setShowEntry(false);
    setShowUpdate(false);
    setShowRiceData(false);
    setShowMonthlyReport(true);
  };

  const handleChange = (e) => {
    if (e.target.value !== "") {
      if (typeof window !== undefined) {
        let monthSelect = document.getElementById("month-select");
        if (monthSelect) {
          monthSelect.value = "";
        }
      }
      setMonthText("");
      const selectedValue = e.target.value;
      let x = [];
      let y = [];
      allEnry.map((entry) => {
        const entryYear = entry.date.split("-")[2];
        const entryMonth = entry.date.split("-")[1];
        if (entryYear === selectedValue) {
          x.push(entry);
        }
        if (entryYear === selectedValue) {
          monthNamesWithIndex.map((month) => {
            if (entryMonth === month.index) {
              y.push(month);
            }
          });
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setFilteredData(x);
      setMoreFilteredData(x);
      setEntryMonths(uniqArray(y));
    } else {
      setFilteredData([]);
      setSelectedYear("");
    }
  };
  const handleMonthChange = (month) => {
    console.log("called");
    let x = [];
    let y = [];
    allEnry.map((entry) => {
      const entryYear = entry.date.split("-")[2];
      const entryMonth = entry.date.split("-")[1];
      if (entryYear === selectedYear && entryMonth === month.index) {
        return x.push(entry);
      }
    });
    riceData.map((entry) => {
      const entryYear = entry.date.split("-")[2];
      const entryMonth = entry.date.split("-")[1];
      if (entryYear === selectedYear && entryMonth === month.index) {
        return y.push(entry);
      }
    });

    if (month.rank < 4) {
      setFinancialYear(`${parseInt(selectedYear) - 1}-${selectedYear}`);
    } else {
      setFinancialYear(`${selectedYear}-${parseInt(selectedYear) + 1}`);
    }

    setFilteredData(x);
    setFilteredRiceData(
      y.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date))
      )
    );

    let riceGiven = 0;
    let thisMonthRiceData = y.sort(
      (a, b) =>
        Date.parse(getCurrentDateInput(a.date)) -
        Date.parse(getCurrentDateInput(b.date))
    );
    y.map((entry) => {
      riceGiven += entry.riceGiven;
    });
    setTotalRiceGiven(riceGiven);
    let ppTotal = 0;
    let pryTotal = 0;
    x.map((entry) => {
      ppTotal += entry.pp;
      pryTotal += entry.pry;
    });
    let mdmCost = PREV_MDM_COST;
    const entryMonth = x[0]?.date.split("-")[1];
    if (parseInt(selectedYear) <= 2024 && parseInt(entryMonth) <= 11) {
      setThisMonthMDMAllowance(PREV_MDM_COST);
      mdmCost = PREV_MDM_COST;
    } else {
      setThisMonthMDMAllowance(MDM_COST);
      mdmCost = MDM_COST;
    }
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);
    setMonthYearID(`${month.monthName}-${selectedYear}`);
    setMonthToSubmit(month.monthName);
    setMonthWorkingDays(x.length);
    setTotalWorkingDays(x.length);
    setMonthPPTotal(ppTotal);
    setMonthPRYTotal(pryTotal);
    setMonthlyPPCost(Math.round(ppTotal * mdmCost));
    setThisMonthTotalCost(Math.round(ppTotal * mdmCost + pryTotal * mdmCost));
    setMonthlyPRYCost(
      Math.round(ppTotal * mdmCost + pryTotal * mdmCost) -
        Math.round(ppTotal * mdmCost)
    );
    setMonthRiceOB(thisMonthRiceData[0]?.riceOB);
    setMonthRiceCB(thisMonthRiceData[0]?.riceCB);
    setMonthRiceGiven(riceGiven);
    setMonthRiceCB(thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB);
    setThisMonthTotalRiceConsumption(
      thisMonthRiceData[0]?.riceOB +
        riceGiven -
        thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB
    );
    setShowDataTable(true);
    setMonthText(month.monthName);
  };

  const submitRice = async () => {
    setLoader(true);
    try {
      await setDoc(doc(firestore, "rice", date), {
        id: date,
        date: date,
        riceOB: riceOB,
        riceGiven: riceGiven === "" ? 0 : riceGiven,
        riceExpend: riceExpend,
        riceCB: riceCB,
      })
        .then(() => {
          toast.success("Rice Data added successfully");
          setRiceGiven(0);
          setRiceOB(riceOB + (riceGiven === "" ? 0 : riceGiven) - riceExpend);
          let x = riceState;
          x = [
            ...x,
            {
              id: date,
              date: date,
              riceOB: riceOB,
              riceGiven: riceGiven === "" ? 0 : riceGiven,
              riceExpend: riceExpend,
              riceCB: riceCB,
            },
          ].sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date))
          );
          setRiceState(x);
          setRiceData(x);
          // getRiceData();
          setDocId(todayInString());
          setDate(todayInString());
          setRiceExpend("");
          setRiceGiven("");
          setShowRiceData(false);
          setShowEntry(false);
          setShowDataTable(false);
          setShowMonthlyReport(false);
          setShowMonthSelection(false);
          setLoader(false);
          setRiceDone(true);
        })
        .catch((e) => {
          console.log(e);
          setLoader(false);
          toast.error("Something went Wrong!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      toast.error("Something went Wrong!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      const entry = {
        id: monthYearID,
        month: monthToSubmit,
        year: selectedYear.toString(),
        financialYear: financialYear,
        worrkingDays: monthWorkingDays !== "" ? monthWorkingDays : 0,
        totalWorkingDays: totalWorkingDays !== "" ? totalWorkingDays : 0,
        ppTotal: monthPPTotal !== "" ? monthPPTotal : 0,
        pryTotal: monthPRYTotal !== "" ? monthPRYTotal : 0,
        monthlyPPCost: monthlyPPCost !== "" ? monthlyPPCost : 0,
        monthlyPRYCost: monthlyPRYCost !== "" ? monthlyPRYCost : 0,
        totalCost: monthTotalCost !== "" ? monthTotalCost : 0,
        ricePPOB: ricePPOB !== "" ? ricePPOB : 0,
        ricePryOB: ricePryOB !== "" ? ricePryOB : 0,
        riceOB: monthRiceOB !== "" ? monthRiceOB : 0,
        ricePPRC: ricePPRC !== "" ? ricePPRC : 0,
        ricePryRC: ricePryRC !== "" ? ricePryRC : 0,
        ricePPEX: ricePPEX !== "" ? ricePPEX : 0,
        ricePryEX: ricePryEX !== "" ? ricePryEX : 0,
        ricePPCB: ricePPCB !== "" ? ricePPCB : 0,
        ricePryCB: ricePryCB !== "" ? ricePryCB : 0,
        riceCB: monthRiceCB !== "" ? monthRiceCB : 0,
        riceConsunption: monthRiceConsunption !== "" ? monthRiceConsunption : 0,
        riceGiven: monthRiceGiven !== "" ? monthRiceGiven : 0,
        ppOB: mdmTransaction.ppOB !== "" ? mdmTransaction.ppOB : 0,
        pryOB: mdmTransaction.pryOB !== "" ? mdmTransaction.pryOB : 0,
        ppRC: mdmTransaction.ppRC !== "" ? mdmTransaction.ppRC : 0,
        pryRC: mdmTransaction.pryRC !== "" ? mdmTransaction.pryRC : 0,
        ppCB: mdmTransaction.ppCB !== "" ? mdmTransaction.ppCB : 0,
        pryCB: mdmTransaction.pryCB !== "" ? mdmTransaction.pryCB : 0,
        prevPpRC: mdmTransaction.prevPpRC !== "" ? mdmTransaction.prevPpRC : 0,
        prevPryRC:
          mdmTransaction.prevPryRC !== "" ? mdmTransaction.prevPryRC : 0,
        prevMonthlyPPCost:
          mdmTransaction.prevMonthlyPPCost !== ""
            ? mdmTransaction.prevMonthlyPPCost
            : 0,
        prevMonthlyPRYCost:
          mdmTransaction.prevMonthlyPRYCost !== ""
            ? mdmTransaction.prevMonthlyPRYCost
            : 0,
        prevRicePPRC: mdmRice.prevRicePPRC !== "" ? mdmRice.prevRicePPRC : 0,
        prevRicePryRC: mdmRice.prevRicePryRC !== "" ? mdmRice.prevRicePryRC : 0,
        prevRicePPEX: mdmRice.prevRicePPEX !== "" ? mdmRice.prevRicePPEX : 0,
        prevRicePryEX: mdmRice.prevRicePryEX !== "" ? mdmRice.prevRicePryEX : 0,
        remarks: remarks,
        ppStudent: StudentData.PP_STUDENTS,
        pryStudent: StudentData.PRIMARY_STUDENTS,
        totalStudent: StudentData.TOTAL_STUDENTS,
        date: todayInString(),
      };
      await setDoc(doc(firestore, "mothlyMDMData", monthYearID), entry)
        .then(() => {
          toast.success("Monthly MDM Data Submitted successfully");
          setLoader(false);
          let z = monthlyReportState.filter((item) => item.id !== monthYearID);
          z = [...z, entry];
          setMonthlyReportState(sortMonthwise(z));
          setShowSubmitMonthlyReport(false);
        })
        .catch((e) => {
          console.log(e);
          setLoader(false);
          toast.error("Something went Wrong!");
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      toast.error("Something went Wrong!");
    }
  };
  const delEntry = async (entry) => {
    setLoader(true);
    try {
      await deleteDoc(doc(firestore, "mdmData", entry.id))
        .then(async () => {
          try {
            await deleteDoc(doc(firestore, "rice", entry.id));
          } catch (error) {
            console.log("Rice Data not Found", error);
            toast.error("Rice Data not Found");
          }
          setLoader(false);
          const filteredEntry = mealState.filter((el) => el.id !== entry.id);
          setMealState(filteredEntry);
          setAllEnry(filteredEntry);
          setMoreFilteredData(
            moreFilteredData.filter((el) => el.id !== entry.id)
          );
          setFilteredData(filteredData.filter((el) => el.id !== entry.id));
          findRiceEntry(filteredEntry);
          toast.success("MDM Data Deleted successfully");
          // getMainData();
          // getRiceData();
          setShowMonthlyReport(false);
          setShowMonthSelection(false);
          setShowDataTable(false);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
          toast.error("Something went Wrong!");
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      toast.error("Something went Wrong!");
    }
  };
  const handleStudentDataEditSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await updateDoc(
        doc(firestore, "studentYearData", StudentEditData.id),
        StudentEditData
      ).then(() => {
        toast.success("Student Data Updated successfully");
        setStudentEditData({
          PP_STUDENTS: 8,
          PRIMARY_BOYS: 21,
          PRIMARY_GIRLS: 25,
          PRIMARY_STUDENTS: 40,
          TOTAL_STUDENTS: 46,
          YEAR: "2025",
          id: "2025",
        });
        setShowStudentDataEditForm(false);
        const filteredEntry = StudentDataState.filter(
          (el) => el.id !== StudentEntryData.id
        );
        const updatedEntry = [...filteredEntry, StudentEntryData];
        setStudentDataState(updatedEntry);
        setLoader(false);
      });
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error("Something went Wrong!");
    }
  };
  const handleStudentDataNewAddSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await setDoc(
        doc(firestore, "studentYearData", StudentEntryData.YEAR),
        StudentEntryData
      )
        .then(() => {
          toast.success("Student Data Submitted successfully");
          setShowStudentDataAddForm(false);
          const updatedEntry = [...StudentDataState, StudentEntryData];
          setStudentDataState(updatedEntry);
          setLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
          toast.error("Something went Wrong!");
        });
    } catch (error) {
      console.log(StudentEntryData);
      console.log(error);
      setLoader(false);
      toast.error("Something went Wrong!");
    }
  };
  const deleteStudentData = async (id) => {
    setLoader(true);
    try {
      await deleteDoc(doc(firestore, "studentYearData", id))
        .then(() => {
          toast.success("Student Data Deleted successfully");
          setLoader(false);
          const filteredEntry = StudentDataState.filter((el) => el.id !== id);
          setStudentDataState(filteredEntry);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
          toast.error("Something went Wrong!");
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error("Something went Wrong!");
    }
  };
  useEffect(() => {}, [
    allEnry,
    filteredData,
    pp,
    pry,
    date,
    ppTotalMeal,
    pryTotalMeal,
    docId,
    riceOB,
    monthYearID,
    financialYear,
    monthlyPPCost,
    monthlyPRYCost,
    filteredRiceData,
  ]);
  useEffect(() => {
    if (riceState.length === 0) {
      getRiceData();
    } else {
      setRiceData(riceState);
      setRiceOB(riceState[riceState.length - 1].riceCB);
      findRiceEntry(riceState);
    }
    if (mealState.length === 0) {
      getMainData();
    } else {
      setAllEnry(mealState);
      findMDMEntry(mealState);
    }
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    getStudentData();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const year = date?.split("-")[2];
    if (StudentDataState.length !== 0) {
      setStudentData(StudentDataState.filter((s) => s.YEAR === year)[0]);
    }
  }, [date]);

  return (
    <div className="container">
      {loader && <Loader />}
      <h3>MDM DATA OF {SCHOOLNAME}</h3>

      <button
        type="button"
        className={`btn btn-${mdmDone ? "danger" : "success"} m-1`}
        onClick={() => {
          allEnry.map((entry) => {
            if (entry.date === todayInString()) {
              toast.error("Todays Entry Already Done!");
              setPp(entry.pp);
              setPry(entry.pry);
              setErrPP("");
              setErrPry("");
            } else {
              setPp("");
              setPry("");
              setErrPP("");
              setErrPry("");
            }
            setShowEntry(true);
            setShowUpdate(false);
            setShowMonthlyReport(false);
            setDate(todayInString());
            setShowDataTable(false);
            setShowMonthSelection(false);
            setShowRiceData(false);
          });
        }}
      >
        Coverage Entry
      </button>
      <button
        type="button"
        className={`btn btn-${!mdmDone ? "danger" : "success"} m-1`}
        onClick={() => {
          searchTodaysData();
          setShowStudentDataEntryForm(false);
        }}
      >
        Coverage Update
      </button>
      <button
        type="button"
        className="btn btn-success m-1"
        onClick={() => {
          calledData(allEnry);
          setShowStudentDataEntryForm(false);
        }}
      >
        Monthly Report
      </button>
      <button
        type="button"
        className={`btn btn-${riceDone ? "danger" : "success"} m-1`}
        onClick={() => {
          if (riceDone) {
            toast.error("Todays Rice Entry Already Done!");
          }
          setRiceOB(riceState[riceState.length - 1].riceCB);
          setRiceCB(riceState[riceState.length - 1].riceCB);
          setRiceExpend("");
          setRiceGiven("");
          setShowRiceData(true);
          setShowMonthlyReport(false);
          setShowDataTable(false);
          setShowMonthSelection(false);
          setShowEntry(false);
          setShowUpdate(false);
          setShowStudentDataEntryForm(false);
          setDate(todayInString());
          setDocId(todayInString());
        }}
      >
        Rice Data
      </button>
      <button
        type="button"
        className={`btn btn-dark m-1`}
        onClick={() => {
          setShowStudentDataEntryForm(true);
          setShowRiceData(false);
          setShowMonthlyReport(false);
          setShowDataTable(false);
          setShowMonthSelection(false);
          setShowEntry(false);
          setShowUpdate(false);
        }}
      >
        Student Data Entry
      </button>
      {showEntry && (
        <form>
          <h4 className="my-3">Coverage Entry</h4>
          <div className="form-group m-2">
            <label className="m-2">Date</label>
            <input
              type="date"
              className="form-control"
              defaultValue={getCurrentDateInput(date)}
              onChange={(e) => setDate(getSubmitDateInput(e.target.value))}
            />
          </div>
          <div className="form-group m-2">
            <label className="m-2">PP</label>
            <input
              type="number"
              className="form-control"
              placeholder={`Max Limit: ${StudentData?.PP_STUDENTS}`}
              value={pp}
              onChange={(e) => {
                if (e.target.value > StudentData?.PP_STUDENTS) {
                  toast.error("PP Limit Exceeded!");
                  setPp(StudentData?.PP_STUDENTS);
                } else {
                  setPp(e.target.value);
                }
              }}
            />
            {errPP && <p className="text-danger">{errPP}</p>}
          </div>
          <div className="form-group m-2">
            <label className="m-2">Primary</label>
            <input
              type="number"
              className="form-control"
              placeholder={`Max Limit: ${StudentData?.PRIMARY_STUDENTS}`}
              value={pry}
              onChange={(e) => {
                if (e.target.value > StudentData?.PRIMARY_STUDENTS) {
                  toast.error("Primary Limit Exceeded!");
                  setPry(StudentData?.PRIMARY_STUDENTS);
                } else {
                  setPry(e.target.value);
                }
              }}
            />
            {errPry && <p className="text-danger">{errPry}</p>}
          </div>
          <div className="my-2">
            <button
              type="submit"
              className="btn btn-primary m-1"
              onClick={(e) => {
                setShowEntry(false);
                e.preventDefault();
                submitData();
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger m-1"
              onClick={() => setShowEntry(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {showUpdate && (
        <form>
          <h4 className="my-3">Coverage Update</h4>
          <div className="form-group m-2">
            <label className="m-2">Date</label>
            <input
              type="date"
              className="form-control"
              defaultValue={date}
              onChange={(e) => {
                setDate(getSubmitDateInput(e.target.value));
                setDocId(getSubmitDateInput(e.target.value));
                const filteredData = allEnry.filter(
                  (entry) => entry.date === getSubmitDateInput(e.target.value)
                );
                if (filteredData.length > 0) {
                  const selectedDateData = filteredData[0];
                  setPp(selectedDateData.pp);
                  setPry(selectedDateData.pry);
                } else {
                  setPp("");
                  setPry("");
                  toast.error("No Data Found on selected Date!", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }
              }}
            />
          </div>
          <div className="form-group m-2">
            <label className="m-2">PP</label>
            <input
              type="number"
              className="form-control"
              placeholder={`Max Limit: ${StudentData?.PP_STUDENTS}`}
              value={pp}
              onChange={(e) => {
                if (e.target.value > StudentData?.PP_STUDENTS) {
                  toast.error("PP Limit Exceeded!");
                  setPp(StudentData?.PP_STUDENTS);
                } else {
                  setPp(e.target.value);
                }
              }}
            />
            {errPP && <p className="text-danger">{errPP}</p>}
          </div>
          <div className="form-group m-2">
            <label className="m-2">Primary</label>
            <input
              type="number"
              className="form-control"
              placeholder={`Max Limit: ${StudentData?.PRIMARY_STUDENTS}`}
              value={pry}
              onChange={(e) => {
                if (e.target.value > StudentData?.PRIMARY_STUDENTS) {
                  toast.error("Primary Limit Exceeded!");
                  setPry(StudentData?.PRIMARY_STUDENTS);
                } else {
                  setPry(e.target.value);
                }
              }}
            />
            {errPry && <p className="text-danger">{errPry}</p>}
          </div>
          <div className="my-2">
            <button
              type="submit"
              className="btn btn-primary m-1"
              onClick={(e) => {
                setShowEntry(false);
                e.preventDefault();
                updateData();
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger m-1"
              onClick={() => {
                setShowUpdate(false);
                setDocId(todayInString());
                setPp("");
                setPry("");
                setDate(todayInString());
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {showMonthlyReport && (
        <div className="my-3">
          <button
            type="button"
            className="btn btn-sm m-3 btn-success"
            onClick={() => {
              router.push("/MDMmonthlyReport");
            }}
          >
            Generate Monthly Report
          </button>
          <h3>Monthly Report</h3>
          <div className="col-md-4 mx-auto mb-3 noprint">
            <select
              className="form-select"
              defaultValue={""}
              onChange={handleChange}
              aria-label="Default select example"
            >
              <option className="text-center text-primary" value="">
                Select MDM Year
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
              {entryMonths.length > 0 && (
                <h4 className="text-center text-primary">Filter By Month</h4>
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
                        handleMonthChange(JSON.parse(e.target.value));
                      } else {
                        setMonthText("");
                        setFilteredData(moreFilteredData);

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
                    {entryMonths.map((month, index) => (
                      <option
                        className="text-center text-success"
                        key={index}
                        value={JSON.stringify(month)}
                      >
                        {month.monthName +
                          " - " +
                          moreFilteredData.filter(
                            (m) => m.date.split("-")[1] === month.index
                          ).length +
                          ` ${
                            moreFilteredData.filter(
                              (m) => m.date.split("-")[1] === month.index
                            ).length > 1
                              ? " Entries"
                              : " Entry"
                          }`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {today.getDate() >= 20 &&
                moreFilteredData.filter(
                  (m) => m.date.split("-")[1] === today.getMonth() + 1
                ).length === 0 && (
                  <div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => router.push("/blankMDMEntry")}
                    >
                      Blank Entry
                    </button>
                  </div>
                )}
            </div>
          )}
          {showDataTable && (
            <>
              <h4>Mothly MDM Report of {monthText} Month</h4>
              <div>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-primary"
                  onClick={() => {
                    createDownloadLink(allEnry, "mdmData");
                  }}
                >
                  Download All MDM SMS Data
                </button>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-dark"
                  onClick={() => {
                    createDownloadLink(riceData, "rice");
                  }}
                >
                  Download All Rice Data
                </button>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-info"
                  onClick={() => {
                    createDownloadLink(filteredData, `${monthText}-mdmData`);
                  }}
                >
                  Download {monthText} Month&#8217;s MDM SMS Data
                </button>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-dark"
                  onClick={() => {
                    createDownloadLink(filteredRiceData, `${monthText}-rice`);
                  }}
                >
                  Download {monthText} Month&#8217;s Rice Data
                </button>
                {/* <button
                  type="button"
                  className="btn btn-sm m-3 btn-success"
                  onClick={() => {
                    router.push("/MDMmonthlyReport");
                    setStateObject({
                      month: monthText,
                      year: selectedYear,
                      ppTotalMeal: ppTotalMeal,
                      pryTotalMeal: pryTotalMeal,
                      totalMeal: ppTotalMeal + pryTotalMeal,
                      totalDays: filteredData.length,
                      riceOB: filteredRiceData[0].riceOB,
                      riceCB:
                        filteredRiceData[filteredRiceData.length - 1].riceCB,
                      riceGiven: totalRiceGiven,
                    });
                  }}
                >
                  Generate Monthly Report
                </button> */}
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
                      <th>Day</th>
                      <th>Date</th>
                      <th>PP</th>
                      <th>Primary</th>
                      <th>Rice Data (in KG)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((entry, i) => {
                      const findRiceData = filteredRiceData.filter(
                        (r) => r.id === entry.id
                      );
                      const foundRData = findRiceData[0];
                      return (
                        <tr key={i} style={{ verticalAlign: "middle" }}>
                          <td>Day-{i + 1}</td>
                          <td>{entry.date}</td>
                          <td>{entry.pp}</td>
                          <td>{entry.pry}</td>
                          <td suppressHydrationWarning>
                            {findRiceData.length > 0 && (
                              <div className="d-flex justify-content-evenly align-items-center">
                                <p className="m-0 p-0 fs-7">
                                  OB: {foundRData.riceOB},{" "}
                                </p>
                                {foundRData?.riceGiven > 0 && (
                                  <p className="m-0 p-0 fs-7">
                                    RC: {foundRData?.riceGiven},{" "}
                                  </p>
                                )}

                                <p className="m-0 p-0 fs-7">
                                  EX: {foundRData?.riceExpend},{" "}
                                </p>
                                <p className="m-0 p-0 fs-7">
                                  CB: {foundRData?.riceCB}
                                </p>
                              </div>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary m-1"
                              onClick={() => {
                                setPp(entry.pp);
                                setPry(entry.pry);
                                setDate(getCurrentDateInput(entry.date));

                                setDocId(entry.date);
                                setLoader(false);
                                setShowEntry(false);
                                setShowUpdate(true);
                                setShowMonthlyReport(false);
                                setShowDataTable(false);
                                setShowMonthSelection(false);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger m-1"
                              onClick={() => {
                                // eslint-disable-next-line no-alert
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this entry?"
                                  )
                                ) {
                                  delEntry(entry);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th>Total</th>
                      <th>
                        {filteredData.length > 1
                          ? `${filteredData.length} Days`
                          : `${filteredData.length} Day`}
                      </th>
                      <th>{ppTotalMeal}</th>
                      <th>{pryTotalMeal}</th>
                      <th
                        colSpan={2}
                        style={{ verticalAlign: "center" }}
                        suppressHydrationWarning={true}
                      >
                        <p style={{ margin: 0, padding: 0 }}>
                          Total PP Meal- {ppTotalMeal}
                        </p>
                        <p style={{ margin: 0, padding: 0 }}>
                          Total Primary Meal- {pryTotalMeal}
                        </p>
                        <p style={{ margin: 0, padding: 0 }}>
                          Total Meal- {ppTotalMeal + pryTotalMeal}
                        </p>
                        <p style={{ margin: 0, padding: 0 }}>
                          PP MDM Cost ={" "}
                          {`${ppTotalMeal} X ₹ ${thisMonthMDMAllowance} = `}₹{" "}
                          {IndianFormat(
                            Math.round(ppTotalMeal * thisMonthMDMAllowance)
                          )}
                        </p>
                        <p style={{ margin: 0, padding: 0 }}>
                          Primary MDM Cost ={" "}
                          {`${pryTotalMeal} X ₹${thisMonthMDMAllowance} = `}₹{" "}
                          {IndianFormat(
                            Math.round(pryTotalMeal * thisMonthMDMAllowance)
                          )}
                        </p>
                        <p style={{ margin: 0, padding: 0 }}>
                          Total MDM Cost ={" "}
                          {`${ppTotalMeal} X ₹ ${thisMonthMDMAllowance} + ${pryTotalMeal} X ₹${thisMonthMDMAllowance} = `}
                          ₹ {IndianFormat(thisMonthTotalCost)}
                        </p>
                        <p style={{ margin: 0, padding: 0 }}>
                          Total Rice Given: {totalRiceGiven}Kg.
                        </p>
                        <p style={{ margin: 0, padding: 0 }}>
                          Rice Consumption: {thisMonthTotalRiceConsumption}Kg.
                        </p>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>

              {!showSubmitMonthlyReport && (
                <button
                  type="button"
                  className="btn btn-dark m-3"
                  onClick={() => {
                    setShowSubmitMonthlyReport(true);
                    if (monthlyReportState.length === 0) {
                      getMonthlyData();
                    } else {
                      setMonthlyReportData(monthlyReportState);
                      const thisMonthlyData = monthlyReportState.filter(
                        (data) => data.id === monthYearID
                      );
                      if (thisMonthlyData.length > 0) {
                        filterMonthlyData(thisMonthlyData[0]);
                      }
                      const thisMonthIndex = monthlyReportState.findIndex(
                        (data) => data.id === monthYearID
                      );
                      let prevMonthData =
                        monthlyReportState[monthlyReportState.length - 1];
                      if (thisMonthIndex !== -1) {
                        prevMonthData =
                          monthlyReportState[monthlyReportState.length - 1];
                      } else {
                        setMdmTransaction({
                          ...mdmTransaction,
                          ppOB: prevMonthData?.ppCB,
                          pryOB: prevMonthData?.pryCB,
                          prevPpRC: prevMonthData?.ppRC,
                          prevPryRC: prevMonthData?.pryRC,
                          prevMonthlyPPCost: prevMonthData?.monthlyPPCost,
                          prevMonthlyPRYCost: prevMonthData?.monthlyPRYCost,
                        });
                        setMdmRice({
                          ...mdmRice,
                          prevRicePPRC: prevMonthData?.ricePPRC,
                          prevRicePryRC: prevMonthData?.ricePryRC,
                          prevRicePPEX: prevMonthData?.ricePPCB,
                          prevRicePryEX: prevMonthData?.ricePryCB,
                        });
                        setRicePPOB(prevMonthData?.ricePPCB);
                        setRicePryOB(prevMonthData?.ricePryCB);
                        setRiceOB(prevMonthData?.riceCB);
                        setMonthlyPPCost(
                          Math.round(ppTotalMeal * thisMonthMDMAllowance)
                        );
                        setMonthlyPRYCost(
                          Math.round(pryTotalMeal * thisMonthMDMAllowance)
                        );
                        setMonthTotalCost(
                          Math.round(
                            ppTotalMeal * thisMonthMDMAllowance +
                              pryTotalMeal * thisMonthMDMAllowance
                          )
                        );
                        setMonthRiceConsunption(thisMonthTotalRiceConsumption);
                        setMonthRiceGiven(totalRiceGiven);
                        setMonthRiceCB(
                          prevMonthData?.riceCB +
                            totalRiceGiven -
                            thisMonthTotalRiceConsumption
                        );
                      }
                    }
                  }}
                >
                  Submit Monthly Report
                </button>
              )}
              {showSubmitMonthlyReport && (
                <div className="my-2">
                  <h4 className="text-primary">Submit Monthly Report</h4>
                  <div className="col-md-6 mx-auto my-2">
                    <form action="">
                      <div className="form-group m-2">
                        <label className="m-2">Month Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Enter Month Name`}
                          value={monthToSubmit}
                          onChange={(e) => {
                            setMonthToSubmit(e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total MDM Days</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total MDM Days`}
                          value={monthWorkingDays}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthWorkingDays(parseInt(e.target.value));
                            } else {
                              setMonthWorkingDays("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">PP Students</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP Students`}
                          value={StudentData.PP_STUDENTS}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setStudentData({
                                ...StudentData,
                                PP_STUDENTS: e.target.value,
                              });
                            } else {
                              setStudentData({
                                ...StudentData,
                                PP_STUDENTS: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">PRIMARY Students</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PRIMARY Students`}
                          value={StudentData.PRIMARY_STUDENTS}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setStudentData({
                                ...StudentData,
                                PRIMARY_STUDENTS: e.target.value,
                              });
                            } else {
                              setStudentData({
                                ...StudentData,
                                PRIMARY_STUDENTS: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total Working Days</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total Working Days`}
                          value={totalWorkingDays}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setTotalWorkingDays(parseInt(e.target.value));
                            } else {
                              setTotalWorkingDays("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total PP Meals</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total PP Meals`}
                          value={monthPPTotal}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthPPTotal(parseInt(e.target.value));
                            } else {
                              setMonthPPTotal("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total Primary Meals</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total Primary Meals`}
                          value={monthPRYTotal}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthPRYTotal(parseInt(e.target.value));
                            } else {
                              setMonthPRYTotal("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total PP MDM Cost</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total PP MDM Cost`}
                          value={monthlyPPCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthlyPPCost(parseInt(e.target.value));
                            } else {
                              setMonthlyPPCost("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total PRIMARY MDM Cost</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total PRIMARY MDM Cost`}
                          value={monthlyPRYCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthlyPRYCost(parseInt(e.target.value));
                            } else {
                              setMonthlyPRYCost("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total MDM Cost</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total MDM Cost`}
                          value={monthTotalCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthTotalCost(parseInt(e.target.value));
                            } else {
                              setMonthTotalCost("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          This Month PP A/C Opening Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP A/C OB This Month`}
                          value={mdmTransaction.ppOB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                ppOB: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                ppOB: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          This Month PRIMARY A/C Opening Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PRIMARY A/C OB This Month`}
                          value={mdmTransaction.pryOB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                pryOB: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                pryOB: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          This Month PP A/C Total Credit
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP A/C Total Credit This Month`}
                          value={mdmTransaction.ppRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                ppRC: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                ppRC: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          This Month PRIMARY A/C Total Credit
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PRIMARY A/C Total Credit This Month`}
                          value={mdmTransaction.pryRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                pryRC: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                pryRC: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          This Month PP A/C Closing Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP A/C Closing Balance This Month`}
                          value={mdmTransaction.ppCB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                ppCB: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                ppCB: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          This Month PRIMARY A/C Closing Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PRIMARY A/C Closing Balance This Month`}
                          value={mdmTransaction.pryCB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                pryCB: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                pryCB: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Previous Month PP A/C Total Credit
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP A/C Total Credit Previous Month`}
                          value={mdmTransaction.prevPpRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevPpRC: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevPpRC: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Previous Month PRIMARY A/C Total Credit
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PRIMARY A/C Total Credit Previous Month`}
                          value={mdmTransaction.prevPryRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevPryRC: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevPryRC: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Previous Month PP Expense</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Previous Month PP Expense`}
                          value={mdmTransaction.prevMonthlyPPCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevMonthlyPPCost: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevMonthlyPPCost: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Previous Month PRIMARY Expense
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Previous Month PRIMARY Expense`}
                          value={mdmTransaction.prevMonthlyPRYCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevMonthlyPRYCost: parseFloat(e.target.value),
                              });
                            } else {
                              setMdmTransaction({
                                ...mdmTransaction,
                                prevMonthlyPRYCost: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">PP Rice Opening Balance</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP Rice Opening Balance`}
                          value={ricePPOB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePPOB(parseInt(e.target.value));
                            } else {
                              setRicePPOB("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Primary Rice Opening Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Primary Rice Opening Balance`}
                          value={ricePryOB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePryOB(parseInt(e.target.value));
                            } else {
                              setRicePryOB("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Total Rice Opening Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Opening Balance`}
                          value={monthRiceOB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceOB(parseInt(e.target.value));
                            } else {
                              setMonthRiceOB("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">PP Rice Received</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP Rice Received`}
                          value={ricePPRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePPRC(parseInt(e.target.value));
                            } else {
                              setRicePPRC("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Primary Rice Received</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Primary Rice Received`}
                          value={ricePryRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePryRC(parseInt(e.target.value));
                            } else {
                              setRicePryRC("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total Rice Received</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Received`}
                          value={monthRiceGiven}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceGiven(parseInt(e.target.value));
                            } else {
                              setMonthRiceGiven("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">PP Rice Consumption</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP Rice Consumption`}
                          value={ricePPEX}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePPEX(parseInt(e.target.value));
                            } else {
                              setRicePPEX("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Primary Rice Consumption</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Primary Rice Consumption`}
                          value={ricePryEX}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePryEX(parseInt(e.target.value));
                            } else {
                              setRicePryEX("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total Rice Consumption</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Consumption`}
                          value={monthRiceConsunption}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceConsunption(parseInt(e.target.value));
                            } else {
                              setMonthRiceConsunption("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">PP Rice Closing Balance</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter PP Rice Closing Balance`}
                          value={ricePPCB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePPCB(parseInt(e.target.value));
                            } else {
                              setRicePPCB("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Primary Rice Closing Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Primary Rice Closing Balance`}
                          value={ricePryCB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setRicePryCB(parseInt(e.target.value));
                            } else {
                              setRicePryCB("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Total Rice Closing Balance
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Closing Balance`}
                          value={monthRiceCB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceCB(parseInt(e.target.value));
                            } else {
                              setMonthRiceCB("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Previous Month PP Rice Received
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Previous Month PP Rice Received`}
                          value={mdmRice.prevRicePPRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePPRC: parseInt(e.target.value),
                              });
                            } else {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePPRC: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Previous Month PRIMARY Rice Received
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Previous Month PRIMARY Rice Received`}
                          value={mdmRice.prevRicePryRC}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePryRC: parseInt(e.target.value),
                              });
                            } else {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePryRC: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Previous Month PP Rice Expense
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Previous Month PP Rice Expense`}
                          value={mdmRice.prevRicePPEX}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePPEX: parseInt(e.target.value),
                              });
                            } else {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePPEX: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">
                          Previous Month PRIMARY Rice Expense
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Previous Month PRIMARY Rice Expense`}
                          value={mdmRice.prevRicePryEX}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePryEX: parseInt(e.target.value),
                              });
                            } else {
                              setMdmRice({
                                ...mdmRice,
                                prevRicePryEX: "",
                              });
                            }
                          }}
                        />
                      </div>

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
                        className="btn btn-success"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          submitMonthlyData();
                        }}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => setShowSubmitMonthlyReport(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {showRiceData && (
        <div className="my-3">
          <h4 className="my-3">Rice Data</h4>
          <form>
            <div className="form-group m-2 col-md-4 mx-auto">
              <label className="m-2">Date</label>
              <input
                type="date"
                className="form-control"
                defaultValue={getCurrentDateInput(date)}
                onChange={(e) => {
                  const data = getSubmitDateInput(e.target.value);
                  setDate(data);
                  const Year = data.split("-")[2];
                  const Month = data.split("-")[1];
                  const Day = parseInt(data.split("-")[0]);
                  let prevDay = Day - 1;
                  if (prevDay < 10) {
                    prevDay = "0" + prevDay;
                  }
                  const prevDate = `${prevDay}-${Month}-${Year}`;
                  let beforePrevDay = Day - 2;
                  if (beforePrevDay < 10) {
                    beforePrevDay = "0" + beforePrevDay;
                  }
                  const beforePrevDate = `${beforePrevDay}-${Month}-${Year}`;
                  const filteredData = riceData.filter(
                    (entry) => entry.date === prevDate
                  );
                  const filteredPrevDayData = riceData.filter(
                    (entry) => entry.date === beforePrevDate
                  );
                  if (filteredData.length > 0) {
                    setRiceOB(filteredData[0]?.riceCB);
                  } else if (filteredPrevDayData.length > 0) {
                    setRiceOB(filteredPrevDayData[0]?.riceCB);
                  } else {
                    toast.error(`Could not find entry`);
                  }
                  // monthNamesWithIndex.filter((month) => {
                  //   if (month.index === Month) {
                  //     setMonYear(`${month.monthName}-${Year}`);
                  //   }
                  // });
                  // const reportData = monthlyReportState.filter(
                  //   (entry) => entry.id === monYear
                  // );
                  // if (reportData.length > 0) {
                  //   setRiceOB(reportData[0]?.riceCB);
                  // }
                }}
              />
            </div>

            <h4 className="m-2 text-success">Rice Balance {riceOB} Kg.</h4>

            <div className="form-group m-2 col-md-4 mx-auto">
              <label className="m-2">Rice Opening Balance (in Kg.)</label>
              <input
                type="number"
                className="form-control "
                placeholder={`Enter Rice Opening Balance`}
                value={riceOB}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setRiceOB(parseFloat(e.target.value));
                    setRiceCB(
                      parseFloat(e.target.value) +
                        (riceGiven === "" ? 0 : riceGiven) -
                        (riceExpend === "" ? 0 : riceExpend)
                    );
                  } else {
                    setRiceOB("");
                  }
                }}
              />
            </div>
            <div className="form-group m-2 col-md-4 mx-auto">
              <label className="m-2">Rice Expenditure (in Kg.)</label>
              <input
                type="number"
                className="form-control "
                placeholder={`Enter Rice Expenditure`}
                value={riceExpend}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setRiceExpend(parseFloat(e.target.value));
                    setRiceCB(
                      riceOB -
                        (riceGiven === "" ? 0 : riceGiven) -
                        parseFloat(e.target.value)
                    );
                  } else {
                    setRiceExpend("");
                    setRiceCB(riceOB - (riceGiven === "" ? 0 : riceGiven));
                  }
                }}
              />
              {errRice && <p className="text-danger m-2">{errRice}</p>}
            </div>
            <div className="form-group m-2 col-md-4 mx-auto">
              <label className="m-2">Rice Received (in Kg.)</label>
              <input
                type="number"
                className="form-control "
                placeholder={`Enter Rice Received (in Kg.)`}
                value={riceGiven}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setRiceGiven(parseFloat(e.target.value));
                    setRiceCB(riceOB + parseFloat(e.target.value) - riceExpend);
                  } else {
                    setRiceGiven("");
                    setRiceCB(riceOB - riceExpend);
                  }
                }}
              />
            </div>
            <div className="form-group m-2 col-md-4 mx-auto">
              <label className="m-2">Rice Closing Balance (in Kg.)</label>
              <input
                type="number"
                className="form-control "
                placeholder={`Enter Rice Closing Balance (in Kg.)`}
                value={riceCB}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setRiceCB(parseFloat(e.target.value));
                  } else {
                    setRiceCB("");
                  }
                }}
              />
            </div>

            <h4 className="text-info m-2">Closing Balance {riceCB} Kg.</h4>

            <button
              type="submit"
              className="btn btn-success m-2"
              onClick={(e) => {
                e.preventDefault();
                if (riceExpend === 0 || riceExpend === "") {
                  setErrRice("Please Enter Rice Expenditure");
                  return;
                }
                setErrRice("");

                submitRice();
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger m-2"
              onClick={() => {
                setShowRiceData(false);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      {showStudentDataEntryForm && (
        <div className="my-3 mx-auto">
          <h4 className="my-3">Student Data Entry</h4>
          <button
            className="btn btn-warning m-2"
            onClick={() => {
              setShowStudentDataAddForm(true);
            }}
          >
            New Entry
          </button>
          <table
            className="table table-responsive table-bordered table-striped"
            style={{
              width: "100%",
              overflowX: "auto",
              marginBottom: "20px",
              border: "1px solid",
            }}
          >
            <thead>
              <tr>
                <th>Sl</th>
                <th>Year</th>
                <th>PP</th>
                <th>Primary</th>
                <th>Total</th>
                <th>Boys</th>
                <th>Girls</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {StudentDataState.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.YEAR}</td>
                  <td>{student.PP_STUDENTS}</td>
                  <td>{student.PRIMARY_STUDENTS}</td>
                  <td>{student.TOTAL_STUDENTS}</td>
                  <td>{student.PRIMARY_BOYS}</td>
                  <td>{student.PRIMARY_GIRLS}</td>
                  <td suppressHydrationWarning={true}>
                    <button
                      className="btn btn-warning m-2"
                      onClick={() => {
                        setStudentEditData(student);
                        setShowStudentDataEditForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger m-2"
                      onClick={() => {
                        // eslint-disable-next-line no-alert
                        if (
                          window.confirm(
                            `Are you sure you want to delete student data for ${student.YEAR}`
                          )
                        ) {
                          deleteStudentData(student.id);
                        } else {
                          toast.success("Student data Not deleted");
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showStudentDataEditForm && (
            <div className="my-3 ax-auto">
              <h4>Student Data Edit Form</h4>
              <form onSubmit={handleStudentDataEditSubmit}>
                <div className="form-group mb-3">
                  <label>Year</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEditData.YEAR}
                    onChange={(e) =>
                      setStudentEditData({
                        ...StudentEditData,
                        YEAR: e.target.value,
                        id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label>PP Students</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEditData.PP_STUDENTS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEditData({
                          ...StudentEditData,
                          PP_STUDENTS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PP_STUDENTS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Primary Students</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEditData.PRIMARY_STUDENTS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_STUDENTS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_STUDENTS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Total Students</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEditData.TOTAL_STUDENTS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEditData({
                          ...StudentEditData,
                          TOTAL_STUDENTS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          TOTAL_STUDENTS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Primary Boys</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEditData.PRIMARY_BOYS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_BOYS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_BOYS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Primary Girls</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEditData.PRIMARY_GIRLS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_GIRLS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEditData({
                          ...StudentEditData,
                          PRIMARY_GIRLS: "",
                        });
                      }
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-success m-2">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-dark m-2"
                  onClick={() => {
                    setShowStudentDataEditForm(false);
                  }}
                >
                  Close Form
                </button>
              </form>
            </div>
          )}
          {showStudentDataAddForm && (
            <div className="my-3 ax-auto">
              <h4>Student Data Entry Form</h4>
              <form onSubmit={handleStudentDataNewAddSubmit}>
                <div className="form-group mb-3">
                  <label>Year</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEntryData.YEAR}
                    onChange={(e) =>
                      setStudentEntryData({
                        ...StudentEntryData,
                        YEAR: e.target.value,
                        id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label>PP Students</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEntryData.PP_STUDENTS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PP_STUDENTS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PP_STUDENTS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Primary Students</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEntryData.PRIMARY_STUDENTS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_STUDENTS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_STUDENTS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Total Students</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEntryData.TOTAL_STUDENTS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEntryData({
                          ...StudentEntryData,
                          TOTAL_STUDENTS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          TOTAL_STUDENTS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Primary Boys</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEntryData.PRIMARY_BOYS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_BOYS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_BOYS: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Primary Girls</label>
                  <input
                    type="text"
                    className="form-control"
                    value={StudentEntryData.PRIMARY_GIRLS}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_GIRLS: parseInt(e.target.value),
                        });
                      } else {
                        setStudentEntryData({
                          ...StudentEntryData,
                          PRIMARY_GIRLS: "",
                        });
                      }
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-success m-2">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-dark m-2"
                  onClick={() => {
                    setShowStudentDataAddForm(false);
                  }}
                >
                  Close Form
                </button>
              </form>
            </div>
          )}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              setShowStudentDataEntryForm(false);
              setShowStudentDataEditForm(false);
              setShowStudentDataAddForm(false);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
