"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { firestore } from "@/context/FirbaseContext";
import { collection, getDocs, query } from "firebase/firestore";
import {
  CIRCLE,
  HOI_MOBILE_NO,
  SCHOOL_EMAIL,
  SCHOOL_WEBSITE,
  SCHOOLADDRESS,
  SCHOOLNAME,
  UDISE_CODE,
  WARD_NO,
} from "@/modules/constants";
import { useGlobalContext } from "../../context/Store";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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

  const [filteredData, setFilteredData] = useState([]);
  const [showFPage, setShowFpage] = useState(true);
  const [showIPage, setShowIpage] = useState(false);
  const [showSchPart, setShowSchPart] = useState(true);
  const [showStudentPart, setShowStudentPart] = useState(false);
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
    setFilteredData(excPP);
    setShowTable(true);
    setStudentState(data);
    setStudentUpdateTime(Date.now());
  };
  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    document.title = `${SCHOOLNAME}:Holistic Progress Report Card`;

    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      studentData();
    } else {
      const excPP = studentState.filter((student) => student.nclass !== 0);
      setFilteredData(excPP);
      setShowTable(true);
    }
    //eslint-disable-next-line
  }, []);

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
              <div className="row mx-auto text-start timesFont">
                {filteredData.map((el, index) => {
                  return (
                    <div
                      style={{
                        width: 203,
                        height: 417,
                        justifyContent: "flex-start",
                        alignItems: "center",
                        alignSelf: "center",
                        margin: 10,
                        padding: 2,
                        fontSize: 16,
                        // borderWidth: 0.5,
                        // borderStyle: "dashed",
                      }}
                      className="justify-content-center align-items-center text-start nobreak"
                      key={index}
                    >
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">{el?.student_name}</p>
                      </div>
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">{el?.birthdate}</p>
                      </div>
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">{el?.student_id}</p>
                      </div>
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">{el?.aadhaar}</p>
                      </div>
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">{el?.bloodGroup}</p>
                      </div>
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">{el?.father_name}</p>
                      </div>
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">{el?.mother_name}</p>
                      </div>
                      <div
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          alignSelf: "center",
                          width: "100%",
                          height: 50,
                        }}
                      >
                        <p className="m-0 p-0 text-start">
                          {el?.guardians_name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {showIPage && (
              <div>
                <div className="noprint">
                  <button
                    className="btn btn-sm btn-primary my-3 mx-2"
                    onClick={() => {
                      setShowSchPart(true);
                      setShowStudentPart(false);
                    }}
                  >
                    School Part
                  </button>
                  <button
                    className="btn btn-sm btn-warning my-3 mx-2"
                    onClick={() => {
                      setShowSchPart(false);
                      setShowStudentPart(true);
                    }}
                  >
                    Student Part
                  </button>
                </div>
                {showSchPart && (
                  <div>
                    <div className="row mx-auto text-start ben">
                      {filteredData.map((el, index) => {
                        return (
                          <div
                            style={{
                              width: 530,
                              height: 160,
                              // borderWidth: 0.5,
                              justifyContent: "flex-start",
                              alignItems: "center",
                              alignSelf: "center",
                              margin: 5,
                              padding: 5,
                              paddingLeft: 5,
                              // borderStyle: "dashed",
                              marginBottom: 5,
                            }}
                            className="justify-content-center align-items-center text-start nobreak"
                            key={index}
                          >
                            <div
                              className="row justify-content-start align-items-center text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "40%" }}>
                                <p className="m-0 p-0 text-start">
                                  বিদ্যালয়ের নাম (Name of the School) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "60%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {SCHOOLNAME}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-center text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 10,
                              }}
                            >
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "95%",
                                }}
                              >
                                <p className="m-0 p-0 text-start"></p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-start align-items-start text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "20%" }}>
                                <p className="m-0 p-0 text-start">
                                  গ্রাম / ওয়ার্ড :
                                  <br />
                                  Village / Ward
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "20%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">{WARD_NO}</p>
                              </div>
                              <div style={{ width: "10%" }}>
                                <p className="m-0 p-0 text-start">
                                  চক্র :
                                  <br />
                                  (CIRCLE)
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "15%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">{CIRCLE}</p>
                              </div>
                              <div style={{ width: "15%" }}>
                                <p className="m-0 p-0 text-start">
                                  জেলা :
                                  <br />
                                  (DISTRICT)
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "15%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">HOWRAH</p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-start align-items-center text-start mt-2"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "30%" }}>
                                <p className="m-0 p-0 text-start">
                                  বিদ্যালয়ের ইউডাইস + কোড :
                                  <br />
                                  UDISE + Code of School
                                </p>
                              </div>
                              {UDISE_CODE.split("").map((code, ind) => (
                                <div
                                  style={{
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderLeftWidth: ind > 0 ? 0 : 1,
                                    width: "4%",
                                  }}
                                  key={ind}
                                >
                                  <p className="m-0 p-0 text-start">{code}</p>
                                </div>
                              ))}
                            </div>
                            <div
                              className="row justify-content-start align-items-center text-start mt-2"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 15,
                              }}
                            >
                              <div style={{ width: "20%" }}>
                                <p className="m-0 p-0 text-start">
                                  বিদ্যালয়ের ই-মেল :
                                  <br />
                                  Email of School
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",

                                  width: "30%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {SCHOOL_EMAIL}
                                </p>
                              </div>
                              <div style={{ width: "25%" }}>
                                <p className="m-0 p-0 text-start">
                                  বিদ্যালয়ের ওয়েবসাইট :
                                  <br />
                                  School Website
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",

                                  width: "25%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {""}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-start align-items-center text-start mt-3"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "30%" }}>
                                <p className="m-0 p-0 text-start">
                                  বিদ্যালয়ের দূরাভাষ নং :
                                  <br />
                                  Phone No. of School
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",

                                  width: "30%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {HOI_MOBILE_NO}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {showStudentPart && (
                  <div>
                    <div className="row mx-auto text-start ben">
                      {filteredData.map((el, index) => {
                        return (
                          <div
                            style={{
                              width: 570,
                              height: 280,
                              // borderWidth: 0.5,
                              justifyContent: "flex-start",
                              alignItems: "center",
                              alignSelf: "center",
                              margin: 5,
                              padding: 5,
                              paddingLeft: 5,
                              // borderStyle: "dashed",
                              marginBottom: 5,
                            }}
                            className="justify-content-center align-items-center text-start nobreak"
                            key={index}
                          >
                            <div
                              className="row justify-content-center align-items-start text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div className="col-md-5">
                                <p className="m-0 p-0 text-start">
                                  ছাত্রী/ছাত্রের নাম (Name of the student):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                }}
                                className="col-md-7"
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.student_name}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-start text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "14%" }}>
                                <p className="m-0 p-0 text-start">
                                  শ্রেণী (Class) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "11%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.class?.split(" (A)")[0]}
                                </p>
                              </div>
                              <div style={{ width: "17%" }}>
                                <p className="m-0 p-0 text-start">
                                  বিভাগ (Section) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "6%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">A</p>
                              </div>
                              <div style={{ width: "20%" }}>
                                <p className="m-0 p-0 text-start">
                                  ক্রমিক নং (Roll no.) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "6%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.roll_no}
                                </p>
                              </div>
                              <div style={{ width: "16%" }}>
                                <p className="m-0 p-0 text-start">
                                  লিঙ্গ (Gender) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "8%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.gender}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-end text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "25%" }}>
                                <p className="m-0 p-0 text-start">
                                  জন্ম তারিখ (Date of Birth):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "75%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.birthdate}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                justifyContent: "left",
                                alignItems: "flex-start",
                                height: 20,
                              }}
                            >
                              <div style={{ width: "40%" }}>
                                <p className="m-0 p-0 text-start">
                                  বাংলার শিক্ষা পোর্টালে শিক্ষার্থীর ক্রমাঙ্ক :
                                  <br />
                                  Student's ID of BSP
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "60%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.student_id}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-start align-items-center text-start mt-2"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "30%" }}>
                                <p className="m-0 p-0 text-start">
                                  আধার নং (Aadhaar No.) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "70%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.aadhaar}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-start align-items-center text-start"
                              style={{ width: "100%", fontSize: 8, height: 25 }}
                            >
                              <div style={{ width: "22%" }}>
                                <p className="m-0 p-0 text-start">
                                  রক্তের গ্রুপ (Blood Group) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "10.71%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.bloodGroup}
                                </p>
                              </div>
                              <div style={{ width: "15%" }}>
                                <p className="m-0 p-0 text-start">
                                  উচ্চতা (Height) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "10%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.height}
                                </p>
                              </div>
                              <div style={{ width: "18%" }}>
                                <p className="m-0 p-0 text-start">
                                  ওজন (Weight) :
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "8%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.weight}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-end text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "40%" }}>
                                <p className="m-0 p-0 text-start">
                                  পিতার নাম (Father's Name):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "60%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.father_name}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-end text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "40%" }}>
                                <p className="m-0 p-0 text-start">
                                  মাতার নাম (Mother's Name):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "60%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.mother_name}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-end text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "40%" }}>
                                <p className="m-0 p-0 text-start">
                                  অভিভাবিকা / অভিভাবকের নাম (Gurdian's Name):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "60%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.guardians_name}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-end text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "35%" }}>
                                <p className="m-0 p-0 text-start">
                                  দূরাভাষ নং (Contact No.):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "65%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.mobile === "0"
                                    ? ""
                                    : el?.mobile === "9999999999"
                                    ? ""
                                    : el?.mobile === "7872882343"
                                    ? ""
                                    : el?.mobile === "7679230482"
                                    ? ""
                                    : el?.mobile === "9933684468"
                                    ? ""
                                    : el?.mobile}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-center align-items-end text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "35%" }}>
                                <p className="m-0 p-0 text-start">
                                  শিক্ষার্থীর ঠিকানা (Student's Address):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "65%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.address ? el?.address : SCHOOLADDRESS}
                                </p>
                              </div>
                            </div>
                            <div
                              className="row justify-content-start align-items-end text-start"
                              style={{
                                width: "100%",
                                fontSize: 10,
                                height: 20,
                              }}
                            >
                              <div style={{ width: "35%" }}>
                                <p className="m-0 p-0 text-start">
                                  Whether 'Divyang' (CWSN) (Yes /No):{" "}
                                </p>
                              </div>
                              <div
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomStyle: "dotted",
                                  width: "50%",
                                }}
                              >
                                <p className="m-0 p-0 text-start">
                                  {el?.disability ? el.disability : "NO"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
