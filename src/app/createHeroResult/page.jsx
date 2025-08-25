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
import { useRouter } from "next/navigation";
import { set } from "mongoose";
export default function CreateHeroResult() {
  const { state, studentResultState, setStudentResultState } =
    useGlobalContext();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const access = state.ACCESS;
  const docId = uuid().split("-")[0];
  const studentUpdateTime = Date.now();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [addStudent, setAddStudent] = useState({
    nclass: 0,
    mobile: "",
    id: docId,
    student_id: "",
    class: "CLASS PP",
    roll_no: 1,
    student_name: "",
    ben1: 0,
    ben2: 0,
    ben3: 0,
    eng1: 0,
    eng2: 0,
    eng3: 0,
    math1: 0,
    math2: 0,
    math3: 0,
    envs1: 0,
    envs2: 0,
    envs3: 0,
    health1: 0,
    health2: 0,
    health3: 0,
    work1: 0,
    work2: 0,
    work3: 0,
    total: 0,
    new_roll_no: 1,
  });
  const [editStudent, setEditStudent] = useState({
    nclass: 0,
    mobile: "",
    id: docId,
    student_id: "",
    class: "CLASS PP",
    roll_no: 1,
    student_name: "",
    ben1: 0,
    ben2: 0,
    ben3: 0,
    eng1: 0,
    eng2: 0,
    eng3: 0,
    math1: 0,
    math2: 0,
    math3: 0,
    envs1: 0,
    envs2: 0,
    envs3: 0,
    health1: 0,
    health2: 0,
    health3: 0,
    work1: 0,
    work2: 0,
    work3: 0,
    total: 0,
    new_roll_no: 1,
  });
  const [viewStudent, setViewStudent] = useState({
    nclass: 0,
    mobile: "",
    id: docId,
    student_id: "",
    class: "CLASS PP",
    roll_no: 1,
    student_name: "",
    ben1: 0,
    ben2: 0,
    ben3: 0,
    eng1: 0,
    eng2: 0,
    eng3: 0,
    math1: 0,
    math2: 0,
    math3: 0,
    envs1: 0,
    envs2: 0,
    envs3: 0,
    health1: 0,
    health2: 0,
    health3: 0,
    work1: 0,
    work2: 0,
    work3: 0,
    total: 0,
    new_roll_no: 1,
  });
  const studentData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "studentsResult"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setFilteredData(data);
    setLoader(false);
    setStudentResultState(data);
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
      selector: (row) => row.class,
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
      name: "Action",
      selector: (row) => (
        <>
          <button
            className="btn btn-primary m-1"
            type="button"
            onClick={() => {
              setViewResult(true);
              setShowEdit(false);
              setViewStudent(row);
            }}
          >
            View
          </button>
          <button
            className="btn btn-warning m-1"
            type="button"
            onClick={() => {
              setEditStudent(row);
              setShowEdit(true);
              setViewResult(false);
            }}
          >
            Edit
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
    if (studentDifference >= 1 || studentResultState.length === 0) {
      studentData();
    } else {
      setData(studentResultState);
      setLoader(false);
    }
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
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
      <h3 className="text-center text-primary">
        Student&apos;s Result Deatails
      </h3>
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
            placeholder="Search"
            className="w-50 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
        subHeaderAlign="right"
      />
      {viewResult && (
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
                  Viewing Result of {viewStudent.student_name}
                </h3>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setViewResult(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row justify-content-center align-items-center">
                  <h5 className="text-center text-success">
                    Student's Name: {viewStudent.student_name}
                  </h5>
                  <h5 className="text-center text-success">
                    Class: {viewStudent.class}
                  </h5>
                  <h5 className="text-center text-success">
                    Roll: {viewStudent.roll_no}
                  </h5>
                  <h4 className="text-center text-black">Part 1</h4>
                  {/* {viewStudent.ben1 > 0 ? ( */}
                  <div className="my-2">
                    <h5 className="text-center text-black">
                      Bengali Part 1: {viewStudent.ben1}
                    </h5>
                    <h5 className="text-center text-black">
                      English Part 1: {viewStudent.eng1}
                    </h5>
                    <h5 className="text-center text-black">
                      Mathematics Part 1: {viewStudent.math1}
                    </h5>
                    {viewStudent.nclass > 2 && (
                      <>
                        <h5 className="text-center text-black">
                          ENVS Part 1: {viewStudent.envs1}
                        </h5>
                      </>
                    )}
                    {viewStudent.nclass > 0 && (
                      <>
                        <h5 className="text-center text-black">
                          Health Part 1: {viewStudent.health1}
                        </h5>
                        <h5 className="text-center text-black">
                          Work Education Part 1: {viewStudent.work1}
                        </h5>
                      </>
                    )}
                  </div>
                  {/* ) : (
                    <div className="my-2">
                      <h5 className="text-center text-black">No Result Yet</h5>
                    </div>
                  )} */}
                  <h4 className="text-center text-black">Part 2</h4>
                  {/* {viewStudent.ben2 > 0 ? ( */}
                  <div className="my-2">
                    <h5 className="text-center text-black">
                      Bengali Part 2: {viewStudent.ben2}
                    </h5>
                    <h5 className="text-center text-black">
                      English Part 2: {viewStudent.eng2}
                    </h5>
                    <h5 className="text-center text-black">
                      Mathematics Part 2: {viewStudent.math2}
                    </h5>
                    {viewStudent.nclass > 2 && (
                      <>
                        <h5 className="text-center text-black">
                          ENVS Part 2: {viewStudent.envs2}
                        </h5>
                      </>
                    )}
                    {viewStudent.nclass > 0 && (
                      <>
                        <h5 className="text-center text-black">
                          Health Part 2: {viewStudent.health2}
                        </h5>
                        <h5 className="text-center text-black">
                          Work Education Part 2: {viewStudent.work2}
                        </h5>
                      </>
                    )}
                  </div>
                  {/* ) : (
                    <div className="my-2">
                      <h5 className="text-center text-black">No Result Yet</h5>
                    </div>
                  )} */}
                  {/* ) : (
                    <div className="my-2">
                      <h5 className="text-center text-black">No Result Yet</h5>
                    </div>
                  )} */}
                  {/* {viewStudent.ben2 > 0 ? ( */}
                  <h4 className="text-center text-black">Part 3</h4>
                  <div className="my-2">
                    <h5 className="text-center text-black">
                      Bengali Part 3: {viewStudent.ben3}
                    </h5>
                    <h5 className="text-center text-black">
                      English Part 3: {viewStudent.eng3}
                    </h5>
                    <h5 className="text-center text-black">
                      Mathematics Part 3: {viewStudent.math3}
                    </h5>
                    {viewStudent.nclass > 2 && (
                      <>
                        <h5 className="text-center text-black">
                          ENVS Part 3: {viewStudent.envs3}
                        </h5>
                      </>
                    )}
                    {viewStudent.nclass > 0 && (
                      <>
                        <h5 className="text-center text-black">
                          Health Part 3: {viewStudent.health3}
                        </h5>
                        <h5 className="text-center text-black">
                          Work Education Part 3: {viewStudent.work3}
                        </h5>
                      </>
                    )}
                  </div>
                  {/* ) : (
                    <div className="my-2">
                      <h5 className="text-center text-black">No Result Yet</h5>
                    </div>
                  )} */}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setViewResult(false);
                  }}
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
