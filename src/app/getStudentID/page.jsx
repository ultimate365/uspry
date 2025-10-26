"use client";
import Loader from "@/components/Loader";
import axios from "axios";
import React, { useState } from "react";
import { dateObjToDateFormat } from "../../modules/calculatefunctions";
export default function GetStudentID() {
  const [showAadhaar, setShowAadhaar] = useState(true);
  const [showMobile, setShowMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [aadhaar_number, setAadhaar_number] = useState("");
  const [gurdian_mobile_number, setGurdian_mobile_number] = useState("");
  const [name, setName] = useState("");
  const [father_name, setFather_name] = useState("");
  const [mother_name, setMother_name] = useState("");
  const [dob, setDob] = useState("");
  const [type, setType] = useState("aadhaar");
  const [loader, setLoader] = useState(false);
  const [showData, setShowData] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    student_code: "",
    studentname: "",
    fathername: "",
    mothername: "",
    dob: "",
  });
  const getBSPDetails = async () => {
    setLoader(true);
    setShowData(false);
    await axios
      .post("/api/getStudentID", {
        aadhaar_number: aadhaar_number.toString(),
        gurdian_mobile_number: gurdian_mobile_number.toString(),
        name: name,
        father_name: father_name,
        mother_name: mother_name,
        dob: dob,
        type,
      })
      .then((data) => {
        setLoader(false);
        setShowData(true);
        if (type === "aadhaar" || type === "mobile") {
          setStudentDetails(data.data.data);
          setName("");
          setFather_name("");
          setMother_name("");
          setDob("");
          setAadhaar_number("");
          setGurdian_mobile_number("");
        } else {
          setStudentDetails({
            student_code: data.data.data.student_code,
            studentname: name,
            fathername: father_name,
            mothername: mother_name,
            dob: dob,
          });
        }
      })
      .catch((error) => {
        setLoader(false);
        setShowData(false);
        console.log(error);
      });
  };
  return (
    <div className="container mt-5">
      <h4 className="text-primary">Search Student ID</h4>
      <div className="d-flex flex-row justify-content-center align-tems-center gap-4 my-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowAadhaar(true);
            setShowMobile(false);
            setShowDetails(false);
            setAadhaar_number("");
            setGurdian_mobile_number("");
            setName("");
            setFather_name("");
            setMother_name("");
            setDob("");
            setStudentDetails({
              student_code: "",
              studentname: "",
              fathername: "",
              mothername: "",
              dob: "",
            });
            setType("aadhaar");
            setShowData(false);
          }}
        >
          Search By Aadhaar
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {
            setShowAadhaar(false);
            setShowMobile(true);
            setShowDetails(false);
            setAadhaar_number("");
            setGurdian_mobile_number("");
            setName("");
            setFather_name("");
            setMother_name("");
            setDob("");
            setStudentDetails({
              student_code: "",
              studentname: "",
              fathername: "",
              mothername: "",
              dob: "",
            });
            setType("mobile");
            setShowData(false);
          }}
        >
          Search By Mobile
        </button>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => {
            setShowAadhaar(false);
            setShowMobile(false);
            setShowDetails(true);
            setAadhaar_number("");
            setGurdian_mobile_number("");
            setName("");
            setFather_name("");
            setMother_name("");
            setDob("");
            setStudentDetails({
              student_code: "",
              studentname: "",
              fathername: "",
              mothername: "",
              dob: "",
            });
            setType("details");
            setShowData(false);
          }}
        >
          Search By Details
        </button>
      </div>

      <div className="my-3 col-md-6 mx-auto">
        {showAadhaar && (
          <div className="mb-3">
            <label htmlFor="aadhaar_number" className="form-label">
              Aadhaar Number
            </label>
            <input
              type="number"
              className="form-control"
              id="aadhaar_number"
              value={aadhaar_number}
              maxLength={12}
              placeholder="Enter Student Aadhaar Number"
              autoComplete="off"
              required
              onChange={(e) => setAadhaar_number(e.target.value)}
            />
          </div>
        )}
        {showMobile && (
          <div className="mb-3">
            <label htmlFor="gurdian_mobile_number" className="form-label">
              Gurdian Mobile Number
            </label>
            <input
              type="number"
              className="form-control"
              id="gurdian_mobile_number"
              value={gurdian_mobile_number}
              maxLength={10}
              placeholder="Enter Student Gurdian Mobile Number"
              autoComplete="off"
              required
              onChange={(e) => setGurdian_mobile_number(e.target.value)}
            />
          </div>
        )}
        {showDetails && (
          <div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Student's Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                placeholder="Enter Student Name"
                autoComplete="off"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Father's Name
              </label>
              <input
                type="text"
                className="form-control"
                id="father_name"
                value={father_name}
                placeholder="Enter Student Father Name"
                autoComplete="off"
                required
                onChange={(e) => setFather_name(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Mother's Name
              </label>
              <input
                type="text"
                className="form-control"
                id="mother_name"
                value={mother_name}
                placeholder="Enter Student Mother Name"
                autoComplete="off"
                required
                onChange={(e) => setMother_name(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">
                Date Of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dob"
                value={dob}
                placeholder="Enter Student Date Of Birth"
                autoComplete="off"
                required
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>
        )}
        <div>
          <button
            type="button"
            className="btn btn-success m-3"
            onClick={getBSPDetails}
          >
            Search
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              setType("aadhaar");
              setAadhaar_number("");
              setGurdian_mobile_number("");
              setName("");
              setFather_name("");
              setMother_name("");
              setDob("");
              setShowData(false);
              setStudentDetails({
                student_code: "",
                studentname: "",
                fathername: "",
                mothername: "",
                dob: "",
              });
              setShowAadhaar(true);
              setShowMobile(false);
              setShowDetails(false);
            }}
          >
            Clear
          </button>
        </div>
        {showData && (
          <div>
            <h5>Student Code: {studentDetails?.student_code}</h5>
            <h5>Student Name: {studentDetails?.studentname}</h5>
            <h5>Father Name: {studentDetails?.fathername}</h5>
            <h5>Mother Name: {studentDetails?.mothername}</h5>
            <h5>DOB: {dateObjToDateFormat(new Date(studentDetails?.dob))}</h5>
          </div>
        )}
      </div>

      {loader && <Loader />}
    </div>
  );
}
