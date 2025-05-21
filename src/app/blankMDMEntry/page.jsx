"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { firestore } from "../../context/FirbaseContext";
import { getDocs, query, collection, setDoc, doc } from "firebase/firestore";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import {
  GetMonthName,
  sortMonthwise,
  todayInString,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context/Store";

export default function BlankMDMEntry() {
  const { monthlyReportState, setMonthlyReportState, state } =
    useGlobalContext();
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
  const today = new Date();
  const monthIndex = today.getMonth();
  const thisYear = today.getFullYear();
  const financialYear =
    monthIndex > 3
      ? thisYear + "-" + (thisYear + 1)
      : thisYear - 1 + "-" + thisYear;
  const monthName = GetMonthName(monthIndex);
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
  const calledData = (array) => {
    let lastMonth = array[array.length - 1];
    if (lastMonth.id === `${monthName}-${thisYear}`) {
      toast.error("Monthly data already submitted for this month");
      setThisMonthlyData(lastMonth);
    } else {
      setThisMonthlyData({
        riceConsunption: 0,
        monthlyPPCost: 0,
        financialYear: financialYear,
        riceGiven: 0,
        riceCB: lastMonth.riceCB,
        ppStudent: lastMonth.ppStudent,
        prevRicePPRC: lastMonth.ricePPRC,
        id: `${monthName}-${thisYear}`,
        pryStudent: lastMonth.pryStudent,
        year: thisYear.toString(),
        prevMonthlyPRYCost: lastMonth.monthlyPRYCost,
        ricePryOB: lastMonth.ricePryCB,
        ricePPCB: lastMonth.ricePPCB,
        prevRicePryEX: lastMonth.ricePryEX,
        totalStudent: lastMonth.totalStudent,
        remarks: "",
        ppRC: 0,
        ricePPOB: lastMonth.ricePPCB,
        monthlyPRYCost: 0,
        ricePPRC: 0,
        riceOB: lastMonth.riceCB,
        prevPryRC: lastMonth.pryRC,
        ricePryCB: lastMonth.ricePryCB,
        ricePPEX: 0,
        totalWorkingDays: 0,
        prevRicePryRC: lastMonth.ricePryRC,
        prevPpRC: lastMonth.ppRC,
        month: monthName,
        prevRicePPEX: lastMonth.ricePPEX,
        ricePryEX: 0,
        pryOB: lastMonth.pryCB,
        ppTotal: 0,
        totalCost: 0,
        ricePryRC: 0,
        pryTotal: 0,
        prevMonthlyPPCost: lastMonth.monthlyPPCost,
        pryRC: 0,
        worrkingDays: 0,
        ppCB: lastMonth.ppCB,
        pryCB: lastMonth.pryCB,
        date: todayInString(),
        ppOB: lastMonth.ppCB,
      });
    }
  };
  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      await setDoc(
        doc(firestore, "mothlyMDMData", thisMonthlyData.id),
        thisMonthlyData
      )
        .then(() => {
          toast.success("Monthly MDM Data Submitted successfully");
          setLoader(false);
          let z = monthlyReportState.filter(
            (item) => item.id !== thisMonthlyData.id
          );
          z = [...z, thisMonthlyData];
          setMonthlyReportState(sortMonthwise(z));
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
  }, [thisMonthlyData]);
  return (
    <div className="container my-2">
      {loader && <Loader />}
      <h3 className="text-center text-primary">
        Submit MDM RETURN of {thisMonthlyData?.month.toUpperCase()}{" "}
        {thisMonthlyData?.year}
      </h3>
      <div className="my-3 mx-auto d-flex flex-row justify-content-center align-items-center gap-4 flex-wrap">
        {JSON.stringify(thisMonthlyData)
          .split(`"`)
          .join("")
          .split("{")
          .join("")
          .split("}")
          .join("")
          .split(",")
          .map((item, index) => (
            <div
              class="mb-3"
              key={index}
              style={{
                flex: "1 1 calc(50% - 1rem)",
                maxWidth: "calc(50% - 1rem)",
              }}
            >
              <span
                className="text-capitalize mb-3"
                id={`basic-addon1-${index}`}
              >
                {item.split(":")[0]}
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={item.split(":")[0]}
                aria-label={item.split(":")[0]}
                aria-describedby={`basic-addon1-${index}`}
                value={thisMonthlyData[item.split(":")[0]]}
                onChange={(e) => {
                  setThisMonthlyData({
                    ...thisMonthlyData,
                    [item.split(":")[0]]: e.target.value,
                  });
                }}
              />
            </div>
          ))}
        {thisMonthlyData.id !== "" && (
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitMonthlyData}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
