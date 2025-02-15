"use client";
import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  todayInString,
} from "../../modules/calculatefunctions";
import Loader from "@/components/Loader";
import { firestore } from "@/context/FirbaseContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SCHOOLNAME } from "@/modules/constants";
import { useGlobalContext } from "../../context/Store";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
export default function StudentData() {
  const {
    state,
    studentState,
    studentUpdateTime,
    setStudentState,
    setStudentUpdateTime,
  } = useGlobalContext();
  const [showTable, setShowTable] = useState(false);
  const access = state.ACCESS;
  const docId = uuid().split("-")[0];
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [addStudent, setAddStudent] = useState({
    nclass: 0,
    mobile: "",
    id: docId,
    student_id: "",
    guardians_name: "",
    class: "CLASS PP (A)",
    father_name: "",
    roll_no: 1,
    birthdate: todayInString(),
    student_name: "",
    mother_name: "",
    gender: "BOYS",
    aadhaar: "",
  });
  const [editStudent, setEditStudent] = useState({
    nclass: 0,
    mobile: "",
    id: "",
    student_id: "",
    guardians_name: "",
    class: "",
    father_name: "",
    roll_no: 1,
    birthdate: todayInString(),
    student_name: "",
    mother_name: "",
    gender: "BOYS",
    aadhaar: "",
  });
  const studentData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "students"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setFilteredData(data);
    setShowTable(true);
    setStudentState(data);
    setStudentUpdateTime(Date.now());
  };
  const addNewStudent = async () => {
    setShowTable(false);
    try {
      await setDoc(doc(firestore, "students", addStudent.id), addStudent)
        .then(() => {
          toast.success("New Student Added Successfully");
          setAddStudent({
            nclass: 0,
            mobile: "",
            id: docId,
            student_id: "",
            guardians_name: "",
            class: "CLASS PP (A)",
            father_name: "",
            roll_no: 1,
            birthdate: todayInString(),
            student_name: "",
            mother_name: "",
          });
          setShowAdd(false);
          const newData = studentState.concat(addStudent);
          setStudentState(newData);
          setData(newData);
          setFilteredData(newData);
          setStudentUpdateTime(Date.now());
          setShowTable(true);
        })
        .catch((err) => {
          toast.error("Failed to add New Student!");
          setShowTable(true);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      setShowTable(true);
      toast.error("Something went Wrong!");
    }
  };
  const submitStudentData = async () => {
    setShowTable(false);
    try {
      await updateDoc(doc(firestore, "students", editStudent.id), editStudent)
        .then(() => {
          toast.success("Student Data Updated successfully");
          setEditStudent({
            nclass: 0,
            mobile: "",
            id: "",
            student_id: "",
            guardians_name: "",
            class: "",
            father_name: "",
            roll_no: 1,
            birthdate: todayInString(),
            student_name: "",
            mother_name: "",
          });
          setShowEdit(false);
          const newData = studentState.map((item) =>
            item.id === editStudent.id ? editStudent : item
          );
          setStudentState(newData);
          setData(newData);
          setFilteredData(newData);
          setStudentUpdateTime(Date.now());
          setShowTable(true);
        })
        .catch((err) => {
          toast.error("Failed to update Student Data!");
          setShowTable(true);
        });
    } catch (error) {
      console.log(error);
      setShowTable(true);
      toast.error("Something went Wrong!");
    }
  };

  const deleteStudent = async (id) => {
    try {
      setShowTable(false);
      await deleteDoc(doc(firestore, "students", id))
        .then(() => {
          const x = studentState.filter((item) => item.id !== id);
          setStudentState(x);
          setData(x);
          setFilteredData(x);
          setStudentUpdateTime(Date.now());
          toast.success("Student Deleted Successfully");
          setShowTable(true);
        })
        .catch((e) => {
          toast.error("Failed to delete Student!");
          setShowTable(true);
          console.log(e);
        });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete Student!");
      setShowTable(true);
    }
  };
  const columns = [
    {
      name: "Sl",
      selector: (row, ind) => data.findIndex((i) => i.id === row.id) + 1,
      width: "2",
    },

    {
      name: "Student Name",
      selector: (row) => row.student_name,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Class",
      selector: (row) => row.class.split(" (A)")[0],
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Roll No.",
      selector: (row) => row.roll_no,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Student ID",
      selector: (row) => row.student_id,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Birth Date",
      selector: (row) => row.birthdate,
      sortable: +true,
      wrap: +true,
      center: +true,
      omit: access !== "admin",
    },
    {
      name: "Gurdian's Name",
      selector: (row) => row.guardians_name,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Mobile",
      selector: (row) =>
        row.mobile === "0" ? (
          <p>No Data</p>
        ) : row.mobile === "9999999999" ? (
          <p>No Data</p>
        ) : row.mobile === "7872882343" ? (
          <p>No Data</p>
        ) : row.mobile === "7679230482" ? (
          <p>No Data</p>
        ) : row.mobile === "9933684468" ? (
          <p>No Data</p>
        ) : (
          <p>
            <a
              href={`tel: +91${row.mobile}`}
              className="d-inline-block text-decoration-none text-dark"
            >
              <i className="bi bi-telephone-fill"></i>
              {"  "}
              +91{row.mobile}
            </a>
          </p>
        ),
      sortable: false,
      wrap: +true,
      center: +true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <button
            className="btn btn-warning m-1"
            type="button"
            onClick={() => {
              setEditStudent(row);
              setShowEdit(true);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-danger m-1"
            type="button"
            onClick={() => {
              //eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Delete Student ${row.student_name}`
              );
              message
                ? deleteStudent(row.id)
                : toast.error("Student Not Deleted");
            }}
          >
            Delete
          </button>
        </>
      ),
      sortable: +true,
      wrap: +true,
      center: +true,
      omit: access !== "admin",
    },
  ];
  useEffect(() => {
    document.title = `${SCHOOLNAME}:Students Database`;

    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      studentData();
    } else {
      setData(studentState);
      setShowTable(true);
    }
  }, []);
  useEffect(() => {
    const result = data.filter((el) => {
      return el.student_name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
  }, [search, data]);

  return (
    <div className="container-fluid text-center my-3">
      <h2 className="text-center text-success">{SCHOOLNAME}</h2>
      {showTable ? (
        <>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              createDownloadLink(data, "students");
            }}
          >
            Download Data
          </button>
          {access === "admin" && (
            <button
              type="button"
              className="btn btn-success m-2"
              onClick={() => {
                setShowAdd(!showAdd);
              }}
            >
              Add New Student
            </button>
          )}
          <h3 className="text-center text-primary">Student&apos;s Deatails</h3>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
            subHeaderAlign="right"
          />
          {showAdd && (
            <div
              className="modal fade show"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
              aria-modal="true"
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title fs-5" id="staticBackdropLabel">
                      Add New Student
                    </h3>
                    <h5 className="modal-title fs-5" id="staticBackdropLabel">
                      Id: {docId}
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setShowAdd(false);
                        setAddStudent({
                          nclass: 0,
                          mobile: "",
                          id: docId,
                          student_id: "",
                          guardians_name: "",
                          class: "",
                          father_name: "",
                          roll_no: 1,
                          birthdate: todayInString(),
                          student_name: "",
                          mother_name: "",
                        });
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row justify-content-center align-items-center">
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Student's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Student's Name"
                          value={addStudent.student_name}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              student_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Father's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Father's Name"
                          value={addStudent.father_name}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              father_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Mother's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mother's Name"
                          value={addStudent.mother_name}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              mother_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Gurdian's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Gurdian's Name"
                          value={addStudent.guardians_name}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              guardians_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="m-2">Birthday *</label>
                        <input
                          type="date"
                          className="form-control"
                          defaultValue={getCurrentDateInput(
                            addStudent.birthdate
                          )}
                          onChange={(e) => {
                            const data = getSubmitDateInput(e.target.value);
                            setAddStudent({
                              ...addStudent,
                              birthdate: data,
                            });
                          }}
                        />
                      </div>
                      <div className="mb-3 col-md-4">
                        <label className="form-label">
                          ছাত্র/ছাত্রীর লিঙ্গ*
                        </label>
                        <select
                          className="form-select"
                          aria-label=".form-select-sm example"
                          required
                          id="student_gender"
                          defaultValue={addStudent.gender}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              gender: e.target.value,
                            });
                          }}
                        >
                          <option value="">লিঙ্গ বেছে নিন</option>
                          <option value={"BOYS"}>ছেলে</option>
                          <option value={"GIRLS"}>মেয়ে</option>
                          <option value={"OTHER"}>অন্যান্য</option>
                        </select>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="m-2">Class *</label>
                        <select
                          className="form-select"
                          aria-label=".form-select-sm example"
                          required
                          id="student_class"
                          defaultValue={addStudent.class}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "CLASS PP (A)") {
                              setAddStudent({
                                ...addStudent,
                                class: value,
                                nclass: 0,
                              });
                            } else if (value === "CLASS I (A)") {
                              setAddStudent({
                                ...addStudent,
                                class: value,
                                nclass: 1,
                              });
                            } else if (value === "CLASS II (A)") {
                              setAddStudent({
                                ...addStudent,
                                class: value,
                                nclass: 2,
                              });
                            } else if (value === "CLASS III (A)") {
                              setAddStudent({
                                ...addStudent,
                                class: value,
                                nclass: 3,
                              });
                            } else if (value === "CLASS IV (A)") {
                              setAddStudent({
                                ...addStudent,
                                class: value,
                                nclass: 4,
                              });
                            } else if (value === "CLASS V (A)") {
                              setAddStudent({
                                ...addStudent,
                                class: value,
                                nclass: 5,
                              });
                            }
                          }}
                        >
                          <option value={"CLASS PP (A)"}>প্রাক প্রাথমিক</option>
                          <option value={"CLASS I (A)"}>প্রথম শ্রেনী</option>
                          <option value={"CLASS II (A)"}>দ্বিতীয় শ্রেনী</option>
                          <option value={"CLASS III (A)"}>তৃতীয় শ্রেনী</option>
                          <option value={"CLASS IV (A)"}>চতুর্থ শ্রেনী</option>
                          <option value={"CLASS V (A)"}>পঞ্চম শ্রেনী</option>
                        </select>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Roll No. *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Roll No."
                          value={addStudent.roll_no}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              roll_no: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Mobile No. *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Mobile No."
                          value={addStudent.mobile}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              mobile: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Aadhaar No. *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Aadhaar No."
                          value={addStudent.aadhaar}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              aadhaar: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Student ID *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Student ID"
                          value={addStudent.student_id}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              student_id: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        if (addStudent.student_name === "") {
                          toast.error("Please enter Student Name");
                        } else if (addStudent.father_name === "") {
                          toast.error("Please enter Father Name");
                        } else if (addStudent.mother_name === "") {
                          toast.error("Please enter Mother Name");
                        } else if (addStudent.guardians_name === "") {
                          toast.error("Please enter Guardians Name");
                        } else if (addStudent.class === "") {
                          toast.error("Please select Class");
                        } else if (addStudent.roll_no === "") {
                          toast.error("Please enter Roll No.");
                        } else if (addStudent.student_id === "") {
                          toast.error("Please enter Student ID");
                        } else if (addStudent.mobile === "") {
                          toast.error("Please enter Mobile Number");
                        } else {
                          setShowAdd(false);
                          addNewStudent();
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        setShowAdd(false);
                        setAddStudent({
                          nclass: 0,
                          mobile: "",
                          id: docId,
                          student_id: "",
                          guardians_name: "",
                          class: "",
                          father_name: "",
                          roll_no: 1,
                          birthdate: todayInString(),
                          student_name: "",
                          mother_name: "",
                        });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showEdit && (
            <div
              className="modal fade show"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
              aria-modal="true"
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title fs-5" id="staticBackdropLabel">
                      Edit Details of {editStudent.student_name}
                    </h3>
                    <button
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setShowEdit(false);
                        setEditStudent({
                          nclass: 0,
                          mobile: "",
                          id: "",
                          student_id: "",
                          guardians_name: "",
                          class: "",
                          father_name: "",
                          roll_no: 1,
                          birthdate: todayInString(),
                          student_name: "",
                          mother_name: "",
                        });
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row justify-content-center align-items-center">
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Student's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Student's Name"
                          value={editStudent.student_name}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              student_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Father's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Father's Name"
                          value={editStudent.father_name}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              father_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Mother's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mother's Name"
                          value={editStudent.mother_name}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              mother_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Gurdian's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Gurdian's Name"
                          value={editStudent.guardians_name}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              guardians_name: e.target.value.toUpperCase(),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="m-2">Birthday *</label>
                        <input
                          type="date"
                          className="form-control"
                          defaultValue={getCurrentDateInput(
                            editStudent.birthdate
                          )}
                          onChange={(e) => {
                            const data = getSubmitDateInput(e.target.value);
                            setEditStudent({
                              ...editStudent,
                              birthdate: data,
                            });
                          }}
                        />
                      </div>
                      <div className="mb-3 col-md-4">
                        <label className="form-label">
                          ছাত্র/ছাত্রীর লিঙ্গ*
                        </label>
                        <select
                          className="form-select"
                          aria-label=".form-select-sm example"
                          required
                          id="student_gender"
                          defaultValue={editStudent.gender}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              gender: e.target.value,
                            });
                          }}
                        >
                          <option value="">লিঙ্গ বেছে নিন</option>
                          <option value={"BOYS"}>ছেলে</option>
                          <option value={"GIRLS"}>মেয়ে</option>
                          <option value={"OTHER"}>অন্যান্য</option>
                        </select>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="m-2">Class *</label>
                        <select
                          className="form-select"
                          aria-label=".form-select-sm example"
                          required
                          id="student_class"
                          defaultValue={editStudent.class}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "CLASS PP (A)") {
                              setEditStudent({
                                ...editStudent,
                                class: value,
                                nclass: 0,
                              });
                            } else if (value === "CLASS I (A)") {
                              setEditStudent({
                                ...editStudent,
                                class: value,
                                nclass: 1,
                              });
                            } else if (value === "CLASS II (A)") {
                              setEditStudent({
                                ...editStudent,
                                class: value,
                                nclass: 2,
                              });
                            } else if (value === "CLASS III (A)") {
                              setEditStudent({
                                ...editStudent,
                                class: value,
                                nclass: 3,
                              });
                            } else if (value === "CLASS IV (A)") {
                              setEditStudent({
                                ...editStudent,
                                class: value,
                                nclass: 4,
                              });
                            } else if (value === "CLASS V (A)") {
                              setEditStudent({
                                ...editStudent,
                                class: value,
                                nclass: 5,
                              });
                            }
                          }}
                        >
                          <option value={"CLASS PP (A)"}>প্রাক প্রাথমিক</option>
                          <option value={"CLASS I (A)"}>প্রথম শ্রেনী</option>
                          <option value={"CLASS II (A)"}>দ্বিতীয় শ্রেনী</option>
                          <option value={"CLASS III (A)"}>তৃতীয় শ্রেনী</option>
                          <option value={"CLASS IV (A)"}>চতুর্থ শ্রেনী</option>
                          <option value={"CLASS V (A)"}>পঞ্চম শ্রেনী</option>
                        </select>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Roll No. *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Roll No."
                          value={editStudent.roll_no}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              roll_no: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Mobile No. *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Mobile No."
                          value={editStudent.mobile}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              mobile: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Aadhaar No. *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Aadhaar No."
                          value={editStudent.aadhaar}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              aadhaar: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Student ID *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Student ID"
                          value={editStudent.student_id}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              student_id: e.target.value,
                            });
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={submitStudentData}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        setShowEdit(false);
                        setEditStudent({
                          nclass: 0,
                          mobile: "",
                          id: "",
                          student_id: "",
                          guardians_name: "",
                          class: "",
                          father_name: "",
                          roll_no: 1,
                          birthdate: todayInString(),
                          student_name: "",
                          mother_name: "",
                        });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loader center content="loading" size="lg" />
      )}
    </div>
  );
}
