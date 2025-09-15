"use client";
import { firestore } from "@/context/FirbaseContext";
import { SCHOOLNAME } from "@/modules/constants";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Result() {
  const [loader, setLoader] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [showSearchedResult, setShowSearchedResult] = useState(false);
  const [viewStudent, setViewStudent] = useState({
    id: "",
    student_id: "",
    student_name: "",
    nclass: 0,
    roll_no: 1,
    class: "CLASS PP",
    ben1: 0,
    eng1: 0,
    math1: 0,
    health1: 0,
    work1: 0,
    envs1: 0,
    ben2: 0,
    eng2: 0,
    math2: 0,
    envs2: 0,
    health2: 0,
    work2: 0,
    ben3: 0,
    eng3: 0,
    math3: 0,
    envs3: 0,
    health3: 0,
    work3: 0,
    total: 0,
    new_roll_no: 1,
  });
  const subjects = [
    { fullName: "Bengali", shortName: "ben" },
    { fullName: "English", shortName: "eng" },
    { fullName: "Mathematics", shortName: "math" },
    { fullName: "Work Education", shortName: "work" },
    { fullName: "Health", shortName: "health" },
    { fullName: "ENVS", shortName: "envs" },
  ];
  const searchApplication = async () => {
    setLoader(true);
    try {
      const collectionRef = collection(firestore, "studentsResult");
      const q = query(collectionRef, where("student_id", "==", studentId));
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot.docs[0].data().pan);
      if (querySnapshot.docs.length > 0) {
        const data = querySnapshot.docs[0].data();

        if (data.student_id === studentId && data.roll_no == rollNo) {
          setViewStudent(data);
          setShowSearchedResult(true);
          setLoader(false);
        } else {
          setShowSearchedResult(false);
          toast.error("Result Not Found!");
          setLoader(false);
        }
      }
    } catch (error) {
      toast.error("Result Not Found!");
      setShowSearchedResult(false);
      setLoader(false);
      console.log(error);
    }
  };

  const getPartTotal = (part) => {
    return subjects.reduce((total, sub) => {
      const subjectPartKey = `${sub.shortName}${part}`;
      return total + (viewStudent[subjectPartKey] || 0);
    }, 0);
  };
  const totalMarks =
    viewStudent.ben1 +
    viewStudent.ben2 +
    viewStudent.ben3 +
    viewStudent.eng1 +
    viewStudent.eng2 +
    viewStudent.eng3 +
    viewStudent.math1 +
    viewStudent.math2 +
    viewStudent.math3 +
    viewStudent.work1 +
    viewStudent.work2 +
    viewStudent.work3 +
    viewStudent.health1 +
    viewStudent.health2 +
    viewStudent.health3 +
    viewStudent.envs1 +
    viewStudent.envs2 +
    viewStudent.envs3;
  const getGrade = () => {
    const maxMarks =
      getPartTotal(3) > 0
        ? viewStudent.nclass === 0
          ? 300
          : viewStudent.nclass < 3
          ? 450
          : 600
        : viewStudent.nclass === 0
        ? 150
        : viewStudent.nclass < 3
        ? 200
        : 250 + getPartTotal(2) > 0
        ? viewStudent.nclass === 0
          ? 150
          : viewStudent.nclass < 3
          ? 200
          : 250
        : viewStudent.nclass === 0
        ? 100
        : viewStudent.nclass < 3
        ? 150
        : 200;

    const percentage = (totalMarks / maxMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 45) return "C+";
    if (percentage >= 25) return "C";
    return "D";
  };
  return (
    <div className="container text-black p-2 my-4">
      <h3 className="text-primary my-3">{SCHOOLNAME}</h3>

      {!showSearchedResult ? (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow">
              <h3 className="text-center mb-4">Check Result</h3>
              <div className="mb-3">
                <label htmlFor="studentId" className="form-label">
                  Student ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="studentId"
                  value={studentId}
                  maxLength={14}
                  placeholder="Enter Student ID"
                  autoComplete="off"
                  required
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="rollNo" className="form-label">
                  Roll No
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="rollNo"
                  value={rollNo}
                  placeholder="Enter Roll No"
                  autoComplete="off"
                  required
                  min={1}
                  max={20}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={searchApplication}
                disabled={loader}
              >
                {loader ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <div className="card p-4 shadow">
              <h3 className="text-center mb-4">Result</h3>
              <p>
                <strong>Student Name:</strong> {viewStudent.student_name}
              </p>
              <p>
                <strong>Class:</strong> {viewStudent.class}
              </p>
              <p>
                <strong>Roll No:</strong> {viewStudent.roll_no}
              </p>
              <p>
                <strong>Student ID:</strong> {viewStudent.student_id}
              </p>
              {[1, 2, 3].map((part, ind) => {
                const studentClass = viewStudent.nclass;
                const partTotal = getPartTotal(part);

                return partTotal > 0 ? (
                  <div key={part} className="card p-4 shadow mb-4">
                    <h5 className="text-center mb-3">Part {part}</h5>
                    <table className="table table-bordered table-striped border-dark">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Marks Obtained</th>
                          <th>Full Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((sub, index) => {
                          const subjectPartKey = `${sub.shortName}${part}`;
                          const mark = viewStudent[subjectPartKey];
                          return (
                            mark !== undefined &&
                            mark !== 0 && (
                              <tr key={index}>
                                <td>{sub.fullName}</td>
                                <td>{mark}</td>
                                <td>
                                  {sub.shortName === "work" ||
                                  sub.shortName === "health"
                                    ? part === 1
                                      ? 10
                                      : part === 2
                                      ? 15
                                      : 25
                                    : part === 1
                                    ? 20
                                    : part === 2
                                    ? 30
                                    : 50}
                                </td>
                              </tr>
                            )
                          );
                        })}
                      </tbody>
                    </table>
                    <h6 className="text-center">
                      <strong>Total Marks : </strong>
                      {partTotal} /{" "}
                      {part === 1
                        ? studentClass === 0
                          ? 60
                          : studentClass < 3
                          ? 80
                          : 100
                        : part === 2
                        ? studentClass === 0
                          ? 90
                          : studentClass < 3
                          ? 120
                          : 150
                        : studentClass === 0
                        ? 150
                        : studentClass < 3
                        ? 200
                        : 250}
                    </h6>
                  </div>
                ) : null;
              })}
              {getPartTotal(1) + getPartTotal(2) + getPartTotal(3) > 0 ? (
                <div className="text-center">
                  <h4>
                    Total Marks: {totalMarks} /{" "}
                    {getPartTotal(3) > 0
                      ? viewStudent.nclass === 0
                        ? 300
                        : viewStudent.nclass < 3
                        ? 450
                        : 600
                      : viewStudent.nclass === 0
                      ? 150
                      : viewStudent.nclass < 3
                      ? 200
                      : 250 + getPartTotal(2) > 0
                      ? viewStudent.nclass === 0
                        ? 150
                        : viewStudent.nclass < 3
                        ? 200
                        : 250
                      : viewStudent.nclass === 0
                      ? 100
                      : viewStudent.nclass < 3
                      ? 150
                      : 200}
                  </h4>
                  <h4>
                    Percentage:{" "}
                    {(
                      (totalMarks /
                        (getPartTotal(3) > 0
                          ? viewStudent.nclass === 0
                            ? 300
                            : viewStudent.nclass < 3
                            ? 450
                            : 600
                          : getPartTotal(2) > 0
                          ? viewStudent.nclass === 0
                            ? 150
                            : viewStudent.nclass < 3
                            ? 200
                            : 250
                          : viewStudent.nclass === 0
                          ? 100
                          : viewStudent.nclass < 3
                          ? 150
                          : 200)) *
                      100
                    ).toFixed(2)}
                    %
                  </h4>
                  <h4>Grade: {getGrade()}</h4>
                </div>
              ) : (
                <h4 className="text-center">No Marks Available</h4>
              )}
            </div>
          </div>
          <div className="text-center mt-3">
            <button
              className="btn btn-warning"
              onClick={() => {
                setShowSearchedResult(false);
                setStudentId("");
                setRollNo("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
