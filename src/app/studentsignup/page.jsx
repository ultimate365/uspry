"use client";
import {
  getCurrentDateInput,
  getSubmitDateInput,
} from "@/modules/calculatefunctions";
import { STUDENT_CLASSES } from "@/modules/constants";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const [dobYear, setDobYear] = useState(2016);
  const [inputField, setInputField] = useState({
    studentID: "",
    dob: `01-01-${dobYear}`,
    name: "",
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    console.log(inputField);
  }, [inputField, dobYear]);
  return (
    <div className="container">
      <h3 className="text-primary">Student&#8217;s Sign Up</h3>
      <form
        method="post"
        className="my-3 col-md-6 mx-auto"
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          padding: "20px",
          width: "90%",
          height: "auto",
          maxWidth: "400px",
          backgroundColor: "darkseagreen",
        }}
      >
        <div className=" mb-3">
          <label className="form-label">Student ID *</label>
          <input
            type="number"
            placeholder="Enter 14 Digit Student&#8217;s ID"
            className="form-control"
            required
          />
        </div>
        <div className=" mb-3">
          <label className="form-label">Class *</label>
          <div className="mb-3">
            <select
              className="form-select"
              id="class-select"
              defaultValue={""}
              onChange={(e) => {
                const parsed = JSON.parse(e.target.value);
                if (parsed !== "") {
                  setInputField({ ...inputField, student_class: parsed?.name });
                  setDobYear(parsed?.year);
                } else {
                  setInputField({ ...inputField, student_class: "" });
                  setDobYear(2016);
                  toast.error("Please select a Class");
                }
              }}
              aria-label="Default select example"
            >
              <option value="" className="text-center text-primary">
                Select Class Name
              </option>
              {STUDENT_CLASSES.map((cl, index) => (
                <option
                  className="text-center text-success"
                  key={index}
                  value={JSON.stringify(cl)}
                >
                  {cl.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Student&#8217;s Date of Birth *</label>
          <input
            type="date"
            defaultValue={getCurrentDateInput(inputField.dob)}
            className="form-control"
            required
            id="dob"
            onChange={(e) =>
              setInputField({
                ...inputField,
                dob: getSubmitDateInput(e.target.value),
              })
            }
          />
        </div>
        <div className=" mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            placeholder="Enter Student&#8217;s Name"
            className="form-control"
            required
          />
        </div>
        <div className=" mb-3">
          <label className="form-label">Mobile *</label>
          <input
            type="number"
            placeholder="Enter Mobile Number"
            className="form-control"
            required
          />
        </div>
        <div className=" mb-3">
          <label className="form-label">Username *</label>
          <input
            type="text"
            placeholder="Enter Username"
            className="form-control"
            required
          />
        </div>

        <div className=" mb-3">
          <label className="form-label">Password *</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="form-control"
            required
          />
        </div>
        <div className=" mb-3">
          <label className="form-label">Confirm Password *</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
        <p className="mt-3 text-center text-decoration-none">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
