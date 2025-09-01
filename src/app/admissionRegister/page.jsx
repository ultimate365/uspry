"use client";
import React, { useEffect, useRef, useState } from "react";

import DataTable from "react-data-table-component";
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  todayInString,
  uniqArray,
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
import { useRouter } from "next/navigation";
export default function AdmissionRegisterData() {
  const { state, admissionRegisterState, setAdmissionRegisterState } =
    useGlobalContext();
  const router = useRouter();
  const [showTable, setShowTable] = useState(false);
  const access = state.ACCESS;
  const docId = uuid().split("-")[0];
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showViewStudent, setShowViewStudent] = useState(false);
  const [yearArray, setYearArray] = useState([]);
  const ref = useRef();
  const [addStudent, setAddStudent] = useState({
    id: "",
    father_name: "",
    student_name: "",
    mother_name: "",
    dob: "",
    year: "",
    ref: "",
  });
  const [viewStudent, setViewStudent] = useState({
    id: "",
    father_name: "",
    student_name: "",
    mother_name: "",
    dob: "",
    year: "",
    ref: "",
  });
  const [editStudent, setEditStudent] = useState({
    id: "",
    father_name: "",
    student_name: "",
    mother_name: "",
    dob: "",
    year: "",
    ref: "",
  });
  const AdmissionRegisterData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "admissionRegister"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setFilteredData(data);
    setShowTable(true);
    setAdmissionRegisterState(data);
    let years = [];
    data.map((item) => {
      years.push(item.year);
    });
    setYearArray(uniqArray(years));
  };
  const addNewStudent = async () => {
    setShowTable(false);
    try {
      await setDoc(
        doc(firestore, "admissionRegister", addStudent.id),
        addStudent
      )
        .then(() => {
          toast.success("New Student Added Successfully");
          setAddStudent({
            id: docId,
            father_name: "",
            student_name: "",
            mother_name: "",
            dob: "",
            year: "",
            ref: "",
          });
          setShowAdd(false);
          const newData = admissionRegisterState.concat(addStudent);
          setAdmissionRegisterState(newData);
          setData(newData);
          setFilteredData(newData);
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
  const submitAdmissionRegisterData = async () => {
    setShowTable(false);
    try {
      await updateDoc(
        doc(firestore, "admissionRegister", editStudent.id),
        editStudent
      )
        .then(() => {
          toast.success("Student Data Updated successfully");
          setEditStudent({
            id: docId,
            father_name: "",
            student_name: "",
            mother_name: "",
            dob: "",
            year: "",
            ref: "",
          });
          setShowEdit(false);
          const newData = admissionRegisterState.map((item) =>
            item.id === editStudent.id ? editStudent : item
          );
          setAdmissionRegisterState(newData);
          setData(newData);
          setFilteredData(newData);
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
      await deleteDoc(doc(firestore, "admissionRegister", id))
        .then(() => {
          const x = admissionRegisterState.filter((item) => item.id !== id);
          setAdmissionRegisterState(x);
          setData(x);
          setFilteredData(x);
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
      selector: (row) => (
        <h6
          className="text-primary text-center"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowViewStudent(true);
            setViewStudent(row);
          }}
        >
          {row.student_name}
        </h6>
      ),
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Father Name",
      selector: (row) => row.father_name,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Admission Year",
      selector: (row) => row.year,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Student Ref",
      selector: (row) => row.ref,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Birth Date",
      selector: (row) => row.dob,
      sortable: +true,
      wrap: +true,
      center: +true,
      omit: access !== "admin",
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <button
            className="btn btn-primary m-1"
            type="button"
            onClick={() => {
              setShowViewStudent(true);
              setViewStudent(row);
            }}
          >
            View
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
    if (access !== "admin") {
      router.push("/");
      toast.error("Unauthorized access");
    } else if (admissionRegisterState.length === 0) {
      AdmissionRegisterData();
    } else {
      setData(admissionRegisterState);
      setFilteredData(admissionRegisterState);
      setYearArray(uniqArray(admissionRegisterState.map((item) => item.year)));
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
          {access === "admin" && (
            <>
              <button
                type="button"
                className="btn btn-primary m-2"
                onClick={() => {
                  createDownloadLink(data, "admissionRegister");
                }}
              >
                Download Data
              </button>
              <button
                type="button"
                className="btn btn-success m-2"
                onClick={() => {
                  setShowAdd(!showAdd);
                }}
              >
                Add New Student
              </button>
            </>
          )}
          <div className="my-3 col-md-6 mx-auto">
            <label htmlFor="admissionYear" className="form-label">
              Select Admission Year
            </label>
            <select
              className="form-select"
              defaultValue={""}
              ref={ref}
              onChange={(e) => {
                if (e.target.value === "") {
                  setFilteredData(data);
                } else {
                  setFilteredData(
                    data.filter((item) => item.year == e.target.value)
                  );
                }
              }}
            >
              <option value="">Select Admission Year</option>
              {yearArray.map((item, ind) => (
                <option key={ind} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {data.length !== filteredData.length && (
              <button
                type="button"
                className="btn btn-danger m-2"
                onClick={() => {
                  setFilteredData(data);
                  setSearch("");
                  ref.current.value = "";
                }}
              >
                Clear
              </button>
            )}
          </div>
          <h3 className="text-center text-primary">
            Student&apos;s Admission Register
          </h3>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={30}
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
                      Add New Student [Id: {docId}]
                    </h3>
                    <button
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setShowAdd(false);
                        setAddStudent({
                          id: docId,
                          father_name: "",
                          student_name: "",
                          mother_name: "",
                          dob: "",
                          year: "",
                          ref: "",
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
                        <label className="m-2">Birthday *</label>
                        <input
                          type="date"
                          className="form-control"
                          defaultValue={getCurrentDateInput(addStudent.dob)}
                          onChange={(e) => {
                            const data = getSubmitDateInput(e.target.value);
                            setAddStudent({
                              ...addStudent,
                              dob: data,
                            });
                          }}
                        />
                      </div>

                      <div className="mb-3 col-md-6">
                        <label className="form-label">Student Ref *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Student Ref"
                          value={addStudent.ref}
                          onChange={(e) => {
                            setAddStudent({
                              ...addStudent,
                              ref: e.target.value,
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
                        } else if (addStudent.ref === "") {
                          toast.error("Please enter Student ID");
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
                          id: docId,
                          father_name: "",
                          student_name: "",
                          mother_name: "",
                          dob: "",
                          year: "",
                          ref: "",
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
          {showViewStudent && (
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
                      Viewing Details of {viewStudent.student_name}
                    </h3>
                    <button
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setShowViewStudent(false);
                        setViewStudent({
                          id: "",
                          father_name: "",
                          student_name: "",
                          mother_name: "",
                          dob: "",
                          year: "",
                          ref: "",
                        });
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row justify-content-center align-items-center">
                      <h5>Student's Name: {viewStudent.student_name}</h5>
                      <h5>Father's Name: {viewStudent.father_name}</h5>
                      {viewStudent.mother_name && (
                        <h5>Mother's Name: {viewStudent.mother_name}</h5>
                      )}
                      <h5>Birthday: {viewStudent.dob}</h5>
                      <h5>Admission Year: {viewStudent.year}</h5>
                      <h5>Student Ref: {viewStudent.ref}</h5>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-warning m-1"
                      type="button"
                      onClick={() => {
                        setEditStudent(viewStudent);
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
                          `Are You Sure To Delete Student ${viewStudent.student_name}`
                        );
                        message
                          ? deleteStudent(viewStudent.id)
                          : toast.error("Student Not Deleted");
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        setShowViewStudent(false);
                        setViewStudent({
                          id: "",
                          father_name: "",
                          student_name: "",
                          mother_name: "",
                          dob: "",
                          year: "",
                          ref: "",
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
                          id: "",
                          father_name: "",
                          student_name: "",
                          mother_name: "",
                          dob: "",
                          year: "",
                          ref: "",
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
                        <label className="m-2">Birthday *</label>
                        <input
                          type="date"
                          className="form-control"
                          defaultValue={getCurrentDateInput(editStudent.dob)}
                          onChange={(e) => {
                            const data = getSubmitDateInput(e.target.value);
                            setEditStudent({
                              ...editStudent,
                              dob: data,
                            });
                          }}
                        />
                      </div>

                      <div className="mb-3 col-md-6">
                        <label className="form-label">Student Ref *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Student Ref"
                          value={editStudent.ref}
                          onChange={(e) => {
                            setEditStudent({
                              ...editStudent,
                              ref: e.target.value,
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
                      onClick={submitAdmissionRegisterData}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        setShowEdit(false);
                        setEditStudent({
                          id: "",
                          father_name: "",
                          student_name: "",
                          mother_name: "",
                          dob: "",
                          year: "",
                          ref: "",
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
