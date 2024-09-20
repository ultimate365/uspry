"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "../../context/FirbaseContext";
import {
  getDocs,
  query,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import { useGlobalContext } from "@/context/Store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  btnArray,
  DateValueToSring,
  uniqArray,
} from "@/modules/calculatefunctions";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CompDownloadAdmissionForm from "@/components/CompDownloadAdmissionForm";
export default function ViewAdmission() {
  const { state, setStateObject } = useGlobalContext();
  const user = state?.USER;
  const name = user?.name;
  const access = state?.ACCESS;
  const router = useRouter();
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [applicationYear, setApplicationYear] = useState([]);
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [showData, setShowData] = useState(false);
  const [admissionStatus, setAdmissionStatus] = useState(true);
  const statusID = process.env.NEXT_PUBLIC_ADMISSION_STATUS;
  const getData = async () => {
    setLoader(true);
    const q = query(collection(firestore, "admission"));
    try {
      const querySnapshot = await getDocs(q);
      const datas = querySnapshot.docs
        .map((doc) => ({
          // doc.data() is never undefined for query doc snapshots
          ...doc.data(),
          id: doc.id,
        }))
        .sort(
          (a, b) =>
            b.student_addmission_dateAndTime - a.student_addmission_dateAndTime
        );
      setAllData(datas);
      setFilteredData(datas);
      let x = [];
      const getYears = datas.map((entry) => {
        return (x = [...x, entry.student_addmission_year]);
      });
      await Promise.all(getYears).then(() => {
        x = uniqArray(x);
        x = x.sort((a, b) => b - a);
        setApplicationYear(x);
        setLoader(false);
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoader(false);
      toast.error("Something went Wrong!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: +true,
        draggable: +true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const getAdmissionStatus = async () => {
    setLoader(true);
    const ref = doc(firestore, "admissionStatus", statusID);
    try {
      const snap = await getDoc(ref);
      const data = snap.data();
      setAdmissionStatus(data?.status);
      if (data?.status) {
        toast.success("Admission is Open");
      } else {
        toast.error("Admission is Closed");
      }
      setLoader(false);
    } catch (error) {
      toast.error("Admission ID Not Found!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoader(false);
    }
  };
  const changeAdmissionStatus = async (status) => {
    setLoader(true);
    try {
      const docRef = doc(firestore, "admissionStatus", statusID);
      await updateDoc(docRef, { status })
        .then(() => {
          if (status) {
            toast.success("Admission Window Opend Successfully!");
          } else {
            toast.success("Admission Window Closed Successfully!");
          }
          setLoader(false);
        })
        .catch((err) => {
          console.error("Error updating document: ", err);
          setLoader(false);
          toast.error("Something went Wrong!");
        });
    } catch (error) {
      console.error("Error updating document: ", error);
      setLoader(false);
      toast.error("Something went Wrong!");
    }
  };

  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    getData();
    getAdmissionStatus();
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    //eslint-disable-next-line
  }, [admissionStatus]);
  return (
    <div className="container">
      {loader && <Loader />}
      <button
        type="button"
        className="btn btn-success m-2"
        onClick={() => router.push("/admission")}
      >
        Add / Edit Entry
      </button>
      <div className="d-flex flex-row mx-auto mb-3 justify-content-evenly px-2 align-items-center form-check form-switch">
        <h4 className="col-md-2 text-danger m-2">Admission Close</h4>
        <input
          className="form-check-input col-md-2 m-2"
          type="checkbox"
          id="checkbox"
          role="switch"
          checked={admissionStatus}
          onChange={(e) => {
            // eslint-disable-next-line no-alert
            if (
              window.confirm(
                `Are you sure you want to ${
                  e.target.checked ? "Open" : "Close"
                } Admission Window?`
              )
            ) {
              setAdmissionStatus(e.target.checked);
              changeAdmissionStatus(e.target.checked);
            } else {
              toast.success("No Changes were made!");
            }
          }}
          style={{ width: 60, height: 30 }}
        />
        <h4 className="col-md-2 text-success m-2">Admission Open</h4>
      </div>
      <div>
        <h3>Admission Application Data</h3>
        {applicationYear.map((year, index) => {
          return (
            <button
              type="button"
              className={`btn btn-${btnArray[index].color} m-1`}
              onClick={() => {
                let x = allData.filter(
                  (entry) => entry.student_addmission_year === year
                );
                setFilteredData(x);
                setShowData(true);
                setYear(year);
                setSearch("");
              }}
              key={index}
            >
              {year}
            </button>
          );
        })}

        {showData && (
          <div
            className="my-3"
            style={{
              overflowX: "scroll",
            }}
          >
            <h4>{`Year: ${year}`}</h4>
            <div className="d-flex justify-content-end col-md-6">
              <input
                type="text"
                placeholder="Search"
                className="form-control my-2 col-md-6"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value) {
                    let x = allData.filter(
                      (entry) => entry.student_addmission_year === year
                    );
                    x = x.filter((entry) =>
                      entry.student_eng_name
                        .toLowerCase()
                        .match(e.target.value.toLowerCase())
                    );
                    setFilteredData(x);
                  } else {
                    setFilteredData(
                      allData.filter(
                        (entry) => entry.student_addmission_year === year
                      )
                    );
                  }
                }}
              />
            </div>
            <table
              style={{
                width: "100%",
                overflowX: "scroll",
                marginBottom: "20px",
                border: "1px solid",
                verticalAlign: "middle",
              }}
              className="table table-responsive table-hover table-striped table-primary rounded-4 container px-lg-3 py-lg-2"
            >
              <thead>
                <tr
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    SL
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    Application No
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    STUDENT NAME
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    FATHER&#8217;S NAME
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    ADMISSION CLASS
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    ADMISSION DATE
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student, index) => (
                  <tr
                    key={student?.id}
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center p-1"
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center p-1"
                    >
                      {student?.id}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center p-1"
                    >
                      {student?.student_eng_name}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center p-1"
                    >
                      {student?.father_eng_name}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center p-1"
                    >
                      {student?.student_addmission_class}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center p-1"
                    >
                      {DateValueToSring(
                        student?.student_addmission_dateAndTime
                      )}

                      {student?.updatedAt && (
                        <p>
                          Updated At:
                          <br /> {DateValueToSring(student?.updatedAt)}
                        </p>
                      )}
                    </td>

                    <td className="p-2">
                      <div className="d-flex justify-content-evenly align-items-center">
                        <div>
                          <button
                            type="button"
                            className="btn btn-success btn-sm m-2"
                            onClick={() => {
                              setStateObject(student);
                              router.push("/printAdmissionForm");
                            }}
                          >
                            View
                          </button>
                        </div>

                        <div>
                          {student?.id != "" && (
                            <PDFDownloadLink
                              document={
                                <CompDownloadAdmissionForm data={student} />
                              }
                              fileName={`Apllication Form of ${student?.student_eng_name}.pdf`}
                              style={{
                                textDecoration: "none",
                                padding: "10px",
                                color: "#fff",
                                backgroundColor: "navy",
                                border: "1px solid #4a4a4a",
                                width: "40%",
                                borderRadius: 10,
                              }}
                              className="m-2"
                            >
                              {({ blob, url, loading, error }) =>
                                loading ? "Loading..." : "Download"
                              }
                            </PDFDownloadLink>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
