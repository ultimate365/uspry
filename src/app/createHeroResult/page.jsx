"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { firestore } from "@/context/FirbaseContext";
import {
  collection,
  getDocs,
  query,
  writeBatch,
  doc,
} from "firebase/firestore";
import Loader from "@/components/Loader";
import { SCHOOLNAME } from "@/modules/constants";
import { useGlobalContext } from "../../context/Store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateHeroResult() {
  const { state, studentResultState, setStudentResultState } =
    useGlobalContext();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const access = state.ACCESS;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddMarks, setShowAddMarks] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [viewStudent, setViewStudent] = useState({});

  // Selection states
  const [selectPart, setSelectPart] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isPartSelected, setIsPartSelected] = useState(false);
  const [isClassSelected, setIsClassSelected] = useState(false);
  const [isSubjectSelected, setIsSubjectSelected] = useState(false);

  // Marks input state
  const [marksInput, setMarksInput] = useState([]);

  const subjects = [
    { fullName: "Bengali", shortName: "ben" },
    { fullName: "English", shortName: "eng" },
    { fullName: "Mathematics", shortName: "math" },
    { fullName: "Health", shortName: "health" },
    { fullName: "Work Education", shortName: "work" },
    { fullName: "ENVS", shortName: "envs" },
  ];

  const studentData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "studentsResult"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setFilteredData(data);
    setLoader(false);
    setStudentResultState(data);
  };

  useEffect(() => {
    document.title = `${SCHOOLNAME}:Students Database`;
    if (access !== "admin") {
      router.push("/");
      toast.error("Unauthorized access");
    } else if (studentResultState.length === 0) {
      studentData();
    } else {
      setData(studentResultState);
    }
  }, []);

  useEffect(() => {
    const result = data.filter((el) => {
      return el.student_name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
  }, [search, data]);

  // When subject is selected, initialize marks input
  useEffect(() => {
    if (isSubjectSelected) {
      const partNumber = selectPart.split(" ")[1];
      const subjectPartKey = `${selectedSubject}${partNumber}`;
      const studentsInClass = data.filter(
        (student) => student.class === selectedClass
      );
      const initialMarks = studentsInClass.map((student) => ({
        id: student.id,
        mark: student[subjectPartKey] || 0,
      }));
      setMarksInput(initialMarks);
    }
  }, [isSubjectSelected, selectedClass, selectedSubject, selectPart, data]);

  const handleMarkChange = (id, value) => {
    setMarksInput((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, mark: parseInt(value) || 0 } : item
      )
    );
  };

  const handleSaveMarks = async () => {
    setLoader(true);
    const partNumber = selectPart.split(" ")[1];
    const subjectPartKey = `${selectedSubject}${partNumber}`;

    try {
      const batch = writeBatch(firestore);

      for (const item of marksInput) {
        const studentRef = doc(firestore, "studentsResult", item.id);
        batch.update(studentRef, {
          [subjectPartKey]: item.mark,
        });
      }

      await batch.commit();

      // Update local state
      const updatedData = data.map((student) => {
        const markItem = marksInput.find((item) => item.id === student.id);
        if (markItem) {
          return {
            ...student,
            [subjectPartKey]: markItem.mark,
          };
        }
        return student;
      });

      setData(updatedData);
      setStudentResultState(updatedData);
      toast.success("Marks updated successfully");
      setShowAddMarks(false);
    } catch (error) {
      toast.error("Error updating marks");
      console.error("Error updating marks:", error);
    } finally {
      setLoader(false);
    }
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, ind) =>
        filteredData.findIndex((i) => i.id === row.id) + 1,
      width: "50px",
    },
    {
      name: "Student Name",
      selector: (row) => row.student_name,
      sortable: true,
    },
    {
      name: "Class",
      selector: (row) => row.class,
      sortable: true,
    },
    {
      name: "Roll No.",
      selector: (row) => row.roll_no,
      sortable: true,
    },
    {
      name: "Student ID",
      selector: (row) => row.student_id,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <button
            className="btn btn-primary m-1"
            type="button"
            onClick={() => {
              setViewResult(true);
              setViewStudent(row);
            }}
          >
            View
          </button>
        </>
      ),
      omit: access !== "admin",
    },
  ];

  return (
    <div className="container-fluid text-center my-3">
      <h2 className="text-center text-success">{SCHOOLNAME}</h2>
      <div className="my-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddMarks(true)}
        >
          Enter Marks
        </button>
      </div>
      <h3 className="text-center text-primary">Student's Result Details</h3>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        fixedHeader
        subHeader
        paginationPerPage={30}
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search by name"
            className="w-50 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />

      {/* Marks Entry Modal */}
      {showAddMarks && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Student Marks</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddMarks(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Select Part</label>
                    <select
                      className="form-select"
                      value={selectPart}
                      onChange={(e) => {
                        setSelectPart(e.target.value);
                        setIsPartSelected(!!e.target.value);
                        setIsClassSelected(false);
                        setIsSubjectSelected(false);
                        setSelectedClass("");
                        setSelectedSubject("");
                      }}
                    >
                      <option value="">Select Part</option>
                      <option value="PART 1">Part 1</option>
                      <option value="PART 2">Part 2</option>
                      <option value="PART 3">Part 3</option>
                    </select>
                  </div>

                  {isPartSelected && (
                    <div className="col-md-4">
                      <label className="form-label">Select Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setIsClassSelected(!!e.target.value);
                          setIsSubjectSelected(false);
                          setSelectedSubject("");
                        }}
                      >
                        <option value="">Select Class</option>
                        <option value="CLASS PP">CLASS PP</option>
                        <option value="CLASS I">CLASS I</option>
                        <option value="CLASS II">CLASS II</option>
                        <option value="CLASS III">CLASS III</option>
                        <option value="CLASS IV">CLASS IV</option>
                      </select>
                    </div>
                  )}

                  {isClassSelected && (
                    <div className="col-md-4">
                      <label className="form-label">Select Subject</label>
                      <select
                        className="form-select"
                        value={selectedSubject}
                        onChange={(e) => {
                          setSelectedSubject(e.target.value);
                          setIsSubjectSelected(!!e.target.value);
                        }}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((sub, index) => {
                          if (selectedClass === "CLASS PP" && index < 3) {
                            return (
                              <option value={sub.shortName} key={index}>
                                {sub.fullName}
                              </option>
                            );
                          } else if (
                            (selectedClass === "CLASS I" ||
                              selectedClass === "CLASS II") &&
                            index < 5
                          ) {
                            return (
                              <option value={sub.shortName} key={index}>
                                {sub.fullName}
                              </option>
                            );
                          } else if (
                            selectedClass === "CLASS III" ||
                            selectedClass === "CLASS IV"
                          ) {
                            return (
                              <option value={sub.shortName} key={index}>
                                {sub.fullName}
                              </option>
                            );
                          }
                          return null;
                        })}
                      </select>
                    </div>
                  )}
                </div>

                {isSubjectSelected && (
                  <div className="mt-4">
                    <h5>
                      Entering marks for {selectedClass} - {selectedSubject} -{" "}
                      {selectPart}
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead className="table-dark">
                          <tr>
                            <th>Roll No</th>
                            <th>Student Name</th>
                            <th>Marks (0-100)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data
                            .filter(
                              (student) => student.class === selectedClass
                            )
                            .sort((a, b) => a.roll_no - b.roll_no)
                            .map((student) => {
                              const markItem = marksInput.find(
                                (item) => item.id === student.id
                              );
                              const mark = markItem ? markItem.mark : 0;
                              console.log(student);
                              return (
                                <tr key={student.id}>
                                  <td>{student.roll_no}</td>
                                  <td>{student.student_name}</td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      min="0"
                                      max="100"
                                      value={mark}
                                      onChange={(e) =>
                                        handleMarkChange(
                                          student.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {isSubjectSelected && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveMarks}
                  >
                    Save Marks
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setSelectPart("");
                    setIsPartSelected(false);
                    setSelectedClass("");
                    setIsClassSelected(false);
                    setSelectedSubject("");
                    setIsSubjectSelected(false);
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddMarks(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Result Modal */}
      {viewResult && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Results for {viewStudent.student_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewResult(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Class:</strong> {viewStudent.class}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Roll No:</strong> {viewStudent.roll_no}
                    </p>
                  </div>
                </div>

                <div className="row">
                  {[1, 2, 3].map((part) => (
                    <div className="col-md-4" key={part}>
                      <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                          Part {part}
                        </div>
                        <div className="card-body">
                          {subjects.map((subject) => {
                            const mark =
                              viewStudent[`${subject.shortName}${part}`];
                            return (
                              mark !== undefined && (
                                <p
                                  key={subject.shortName}
                                  className="d-flex justify-content-between"
                                >
                                  <span>{subject.fullName}:</span>
                                  <span>{mark}</span>
                                </p>
                              )
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-3">
                  <h4>Total Marks: {viewStudent.total}</h4>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewResult(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loader && <Loader center content="loading" size="lg" />}
    </div>
  );
}
