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
  updateDoc,
} from "firebase/firestore";
import Loader from "@/components/Loader";
import { SCHOOLNAME } from "@/modules/constants";
import { useGlobalContext } from "../../context/Store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createDownloadLink } from "../../modules/calculatefunctions";
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
  const [showEdit, setShowEdit] = useState(false);
  const [editStudentMarks, setEditStudentMarks] = useState({
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
    { fullName: "Work Education", shortName: "work" },
    { fullName: "Health", shortName: "health" },
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
    if (value) {
      setMarksInput((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, mark: parseInt(value) || 0 } : item
        )
      );
    } else {
      setMarksInput((prev) =>
        prev.map((item) => (item.id === id ? { ...item, mark: "" } : item))
      );
    }
  };

  const handleSaveMarks = async () => {
    setShowAddMarks(false);
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
      setFilteredData(updatedData);
      toast.success("Marks updated successfully");
      setSelectPart("");
      setIsPartSelected(false);
      setSelectedClass("");
      setIsClassSelected(false);
      setSelectedSubject("");
      setIsSubjectSelected(false);
    } catch (error) {
      toast.error("Error updating marks");
      console.error("Error updating marks:", error);
    } finally {
      setLoader(false);
    }
  };

  const updateStudentResult = async () => {
    setLoader(true);
    await updateDoc(
      doc(firestore, "studentsResult", editStudentMarks.id),
      editStudentMarks
    )
      .then(() => {
        const newData = studentResultState.map((item) =>
          item.id === editStudentMarks.id ? editStudentMarks : item
        );
        setData(newData);
        setStudentResultState(newData);
        setFilteredData(newData);
        toast.success("Marks updated successfully");
        setLoader(false);
      })
      .catch((e) => {
        toast.error("Failed to update Student Data!");
        setLoader(false);
      });
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, ind) =>
        filteredData.findIndex((i) => i.id === row.id) + 1,
      width: "50px",
    },
    {
      name: "Student ID",
      selector: (row) => (
        <h6
          onClick={() => {
            if (access === "admin") {
              setViewResult(true);
              setViewStudent(row);
            }
          }}
          className="cursor-pointer text-primary"
          style={{
            cursor: access === "admin" ? "pointer" : "default",
          }}
        >
          {row.student_id}
        </h6>
      ),
      sortable: +true,
      wrap: +true,
      center: +true,
      grow: 2,
      width: "130px",
    },
    {
      name: "Student Name",
      selector: (row) => (
        <h6
          onClick={() => {
            if (access === "admin") {
              setViewResult(true);
              setViewStudent(row);
            }
          }}
          className="cursor-pointer text-primary"
          style={{
            cursor: access === "admin" ? "pointer" : "default",
          }}
        >
          {row.student_name}
        </h6>
      ),
      sortable: +true,
      wrap: +true,
      center: +true,
      grow: 2,
      width: "150px",
    },
    {
      name: "Roll",
      selector: (row) => row.roll_no,
      sortable: +true,
      wrap: +true,
      center: +true,
      grow: 2,
      width: "80px",
    },
    ,
    {
      name: "Class",
      selector: (row) => row.class,
      sortable: +true,
      wrap: +true,
      center: +true,
      grow: 2,
      width: "100px",
    },
    {
      name: "Total",
      selector: (row) =>
        (row.ben1 ? row.ben1 : 0) +
        (row.ben2 ? row.ben2 : 0) +
        (row.ben3 ? row.ben3 : 0) +
        (row.eng1 ? row.eng1 : 0) +
        (row.eng2 ? row.eng2 : 0) +
        (row.eng3 ? row.eng3 : 0) +
        (row.math1 ? row.math1 : 0) +
        (row.math2 ? row.math2 : 0) +
        (row.math3 ? row.math3 : 0) +
        (row.health1 ? row.health1 : 0) +
        (row.health2 ? row.health2 : 0) +
        (row.health3 ? row.health3 : 0) +
        (row.work1 ? row.work1 : 0) +
        (row.work2 ? row.work2 : 0) +
        (row.work3 ? row.work3 : 0) +
        (row.envs1 ? row.envs1 : 0) +
        (row.envs2 ? row.envs2 : 0) +
        (row.envs3 ? row.envs3 : 0),
      sortable: +true,
      wrap: +true,
      center: +true,
      grow: 2,
      width: "100px",
    },
  ];

  return (
    <div className="container-fluid text-center my-3">
      <button
        type="button"
        className="btn btn-dark m-2"
        onClick={() => {
          createDownloadLink(data, "studentsResult");
        }}
      >
        Download Data
      </button>
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
                            <th>
                              Marks (0-
                              {selectPart == "PART 1"
                                ? "10"
                                : selectPart == "PART 2"
                                ? "30"
                                : "50"}
                              )
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data
                            .filter((student) => student.class == selectedClass)
                            .sort((a, b) => a.roll_no - b.roll_no)
                            .map((student) => {
                              const markItem = marksInput.find(
                                (item) => item.id == student.id
                              );
                              const mark = markItem ? markItem.mark : 0;
                              return (
                                <tr key={student.id}>
                                  <td>{student.roll_no}</td>
                                  <td>{student.student_name}</td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      min="0"
                                      max={
                                        selectPart == "PART 1"
                                          ? "10"
                                          : selectPart == "PART 2"
                                          ? "30"
                                          : "50"
                                      }
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
                  onClick={() => {
                    setShowAddMarks(false);
                    setSelectPart("");
                    setIsPartSelected(false);
                    setSelectedClass("");
                    setIsClassSelected(false);
                    setSelectedSubject("");
                    setIsSubjectSelected(false);
                  }}
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
                  Results of {viewStudent.student_name}
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
                              mark !== undefined &&
                              mark !== 0 && (
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
                          <h6 className="text-success">
                            Total Marks:{" "}
                            {part === 1
                              ? viewStudent.ben1 +
                                viewStudent.eng1 +
                                viewStudent.math1 +
                                viewStudent.work1 +
                                viewStudent.health1 +
                                viewStudent.envs1
                              : part === 2
                              ? viewStudent.ben2 +
                                viewStudent.eng2 +
                                viewStudent.math2 +
                                viewStudent.work2 +
                                viewStudent.health2 +
                                viewStudent.envs2
                              : viewStudent.ben3 +
                                viewStudent.eng3 +
                                viewStudent.math3 +
                                viewStudent.work3 +
                                viewStudent.health3 +
                                viewStudent.envs3}
                          </h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-3">
                  <h4>
                    Gross Total Marks:{" "}
                    {viewStudent.ben1 +
                      viewStudent.ben2 +
                      viewStudent.ben3 +
                      viewStudent.eng1 +
                      viewStudent.eng2 +
                      viewStudent.eng3 +
                      viewStudent.math1 +
                      viewStudent.math2 +
                      viewStudent.math3 +
                      viewStudent.health2 +
                      viewStudent.health1 +
                      viewStudent.health3 +
                      viewStudent.work1 +
                      viewStudent.work2 +
                      viewStudent.work3 +
                      viewStudent.envs1 +
                      viewStudent.envs2 +
                      viewStudent.envs3}
                  </h4>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setViewResult(false);
                    setShowEdit(true);
                    setEditStudentMarks(viewStudent);
                  }}
                >
                  Edit
                </button>
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
      {/* Edit Result Modal */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edit Marks of {editStudentMarks.student_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEdit(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Class:</strong> {editStudentMarks.class}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Roll No:</strong> {editStudentMarks.roll_no}
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
                          {subjects.map((subject, index) => {
                            const mark =
                              editStudentMarks[`${subject.shortName}${part}`];
                            if (
                              editStudentMarks.class === "CLASS PP" &&
                              index < 3
                            ) {
                              return (
                                <p key={subject.shortName}>
                                  <p>{subject.fullName}:</p>
                                  <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    max={
                                      part === 1
                                        ? "10"
                                        : part === 2
                                        ? "30"
                                        : "50"
                                    }
                                    value={mark}
                                    onChange={(e) => {
                                      const parsedValue = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      setEditStudentMarks({
                                        ...editStudentMarks,
                                        [`${subject.shortName}${part}`]: isNaN(
                                          parsedValue
                                        )
                                          ? ""
                                          : parsedValue,
                                      });
                                    }}
                                    placeholder="Enter marks"
                                  />
                                </p>
                              );
                            } else if (
                              (editStudentMarks.class === "CLASS I" ||
                                editStudentMarks.class === "CLASS II") &&
                              index < 5
                            ) {
                              return (
                                <p key={subject.shortName}>
                                  <p>{subject.fullName}:</p>
                                  <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    max={
                                      part === 1
                                        ? "10"
                                        : part === 2
                                        ? "30"
                                        : "50"
                                    }
                                    value={mark}
                                    onChange={(e) => {
                                      const parsedValue = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      setEditStudentMarks({
                                        ...editStudentMarks,
                                        [`${subject.shortName}${part}`]: isNaN(
                                          parsedValue
                                        )
                                          ? ""
                                          : parsedValue,
                                      });
                                    }}
                                    placeholder="Enter marks"
                                  />
                                </p>
                              );
                            } else if (
                              editStudentMarks.class === "CLASS III" ||
                              editStudentMarks.class === "CLASS IV"
                            ) {
                              return (
                                <p key={subject.shortName}>
                                  <p>{subject.fullName}:</p>
                                  <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    max={
                                      part === 1
                                        ? "10"
                                        : part === 2
                                        ? "30"
                                        : "50"
                                    }
                                    value={mark}
                                    onChange={(e) => {
                                      const parsedValue = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      setEditStudentMarks({
                                        ...editStudentMarks,
                                        [`${subject.shortName}${part}`]: isNaN(
                                          parsedValue
                                        )
                                          ? ""
                                          : parsedValue,
                                      });
                                    }}
                                    placeholder="Enter marks"
                                  />
                                </p>
                              );
                            }
                          })}
                          <h6 className="text-success">
                            Total Marks:{" "}
                            {part === 1
                              ? (editStudentMarks.ben1
                                  ? editStudentMarks.ben1
                                  : 0) +
                                (editStudentMarks.eng1
                                  ? editStudentMarks.eng1
                                  : 0) +
                                (editStudentMarks.math1
                                  ? editStudentMarks.math1
                                  : 0) +
                                (editStudentMarks.health1
                                  ? editStudentMarks.health1
                                  : 0) +
                                (editStudentMarks.envs1
                                  ? editStudentMarks.envs1
                                  : 0) +
                                (editStudentMarks.work1
                                  ? editStudentMarks.work1
                                  : 0)
                              : part === 2
                              ? (editStudentMarks.ben2
                                  ? editStudentMarks.ben2
                                  : 0) +
                                (editStudentMarks.eng2
                                  ? editStudentMarks.eng2
                                  : 0) +
                                (editStudentMarks.math2
                                  ? editStudentMarks.math2
                                  : 0) +
                                (editStudentMarks.health2
                                  ? editStudentMarks.health2
                                  : 0) +
                                (editStudentMarks.work2
                                  ? editStudentMarks.work2
                                  : 0) +
                                (editStudentMarks.envs2
                                  ? editStudentMarks.envs2
                                  : 0)
                              : (editStudentMarks.ben3
                                  ? editStudentMarks.ben3
                                  : 0) +
                                (editStudentMarks.eng3
                                  ? editStudentMarks.eng3
                                  : 0) +
                                (editStudentMarks.math3
                                  ? editStudentMarks.math3
                                  : 0) +
                                (editStudentMarks.work3
                                  ? editStudentMarks.work3
                                  : 0) +
                                (editStudentMarks.health3
                                  ? editStudentMarks.health3
                                  : 0) +
                                (editStudentMarks.envs3
                                  ? editStudentMarks.envs3
                                  : 0)}
                          </h6>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-success m-2"
                        onClick={() => {
                          setShowEdit(false);
                          updateStudentResult();
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary m-2"
                        onClick={() => setShowEdit(false)}
                      >
                        Close
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-3">
                  <h4>
                    Gross Total Marks:{" "}
                    {(editStudentMarks.ben1 ? editStudentMarks.ben1 : 0) +
                      (editStudentMarks.ben2 ? editStudentMarks.ben2 : 0) +
                      (editStudentMarks.ben3 ? editStudentMarks.ben3 : 0) +
                      (editStudentMarks.eng1 ? editStudentMarks.eng1 : 0) +
                      (editStudentMarks.eng2 ? editStudentMarks.eng2 : 0) +
                      (editStudentMarks.eng3 ? editStudentMarks.eng3 : 0) +
                      (editStudentMarks.math1 ? editStudentMarks.math1 : 0) +
                      (editStudentMarks.math2 ? editStudentMarks.math2 : 0) +
                      (editStudentMarks.math3 ? editStudentMarks.math3 : 0) +
                      (editStudentMarks.work1 ? editStudentMarks.work1 : 0) +
                      (editStudentMarks.work2 ? editStudentMarks.work2 : 0) +
                      (editStudentMarks.work3 ? editStudentMarks.work3 : 0) +
                      (editStudentMarks.health1
                        ? editStudentMarks.health1
                        : 0) +
                      (editStudentMarks.health2
                        ? editStudentMarks.health2
                        : 0) +
                      (editStudentMarks.health3
                        ? editStudentMarks.health3
                        : 0) +
                      (editStudentMarks.envs1 ? editStudentMarks.envs1 : 0) +
                      (editStudentMarks.envs2 ? editStudentMarks.envs2 : 0) +
                      (editStudentMarks.envs3 ? editStudentMarks.envs3 : 0)}
                  </h4>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEdit(false)}
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
