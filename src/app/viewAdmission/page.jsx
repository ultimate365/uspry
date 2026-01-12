"use client";
import React, { useEffect, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../context/FirbaseContext";
import { firestore } from "../../context/FirbaseContext";
import {
  getDocs,
  query,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import { useGlobalContext } from "@/context/Store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  btnArray,
  createDownloadLink,
  formatDateAndTime,
  getCurrentDateInput,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import {
  classWiseAge,
  SCHOOLBENGALIADDRESS,
  SCHOOLBENGALINAME,
} from "@/modules/constants";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CompDownloadAdmissionForm from "@/pdf/CompDownloadAdmissionForm";
import Image from "next/image";
import schoolLogo from "@/../public/assets/images/logoweb.png";
import { deleteFileFromGithub } from "@/modules/gitFileHndler";
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
  const [showDetails, setShowDetails] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    id: "",
    url: "",
    photoName: "",
    student_eng_name: "",
    father_eng_name: "",
    mother_eng_name: "",
    guardian_eng_name: "",
    student_birthday: `01-01-${new Date().getFullYear() - 5}`,
    student_gender: "",
    student_mobile: "",
    student_aadhaar: "",
    student_religion: "",
    student_race: "GENERAL",
    student_bpl_status: "NO",
    student_bpl_number: "",
    student_village: "SEHAGORI",
    student_post_office: "KHOROP",
    student_police_station: "JOYPUR",
    student_pin_code: "711401",
    student_addmission_class: "PRE PRIMARY",
    student_previous_class: "FIRST TIME ADDMISSION",
    student_previous_class_year: "",
    student_previous_school: "",
    student_previous_student_id: "",
    student_addmission_date: todayInString(),
    student_addmission_year: "",
    student_addmission_dateAndTime: Date.now(),
  });
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
            a.student_addmission_dateAndTime - b.student_addmission_dateAndTime
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

  const calculateAge = (inputDate, students_class) => {
    const birthDate = new Date(inputDate);
    const today = new Date();

    const month = today.getMonth() + 1;
    let year = today.getFullYear();
    if (month > 3) {
      year = year + 1;
    } else {
      year = year;
    }

    const referenceDate = new Date(`${year}-01-01`);

    // Calculate the difference in years, months, and days
    let years = referenceDate.getFullYear() - birthDate.getFullYear();
    let months = referenceDate.getMonth() - birthDate.getMonth();
    let days = referenceDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastMonth = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        0
      ); // Get the last day of the previous month
      days += lastMonth.getDate(); // Add the days from the last month
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    const validAge = classWiseAge.filter(
      (item) => item.className === students_class
    )[0].age;
    let ageMessage;
    if (validAge === years) {
      ageMessage = `Student is Valid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    } else if (validAge - 1 === years && months >= 8) {
      ageMessage = `Student is Valid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    } else {
      ageMessage = `Student is Invalid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    }
    return ageMessage;
  };

  const delEntry = async (entry) => {
    setLoader(true);
    await deleteDoc(doc(firestore, "admission", entry.id))
      .then(async () => {
        try {
          const desertRef = ref(storage, `studentImages/${entry.photoName}`);
          await deleteObject(desertRef);
        } catch (error) {
          console.log(error);
        }
        try {
          const isDelFromGithub = await deleteFileFromGithub(
            entry.photoName,
            "admission"
          );
          if (isDelFromGithub) {
            toast.success("File deleted successfully From Github!");
          } else {
            toast.error("Error Deleting File From Github!");
          }
        } catch (error) {
          console.log(error);
        }
        toast.success("Image deleted successfully");
        toast.success("Application Deleted successfully");
        getData();
        setLoader(false);
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
        toast.error("Failed to delete Application");
      });
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
      <button
        type="button"
        className="btn btn-primary m-2"
        onClick={() => {
          createDownloadLink(allData, "admission");
        }}
      >
        Download Admission Data
      </button>
      <div className="d-flex flex-row mx-auto mb-3 justify-content-evenly px-2 align-items-center form-check form-switch">
        <h4 className="col-md-2 text-danger m-2">Close Admission</h4>
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
        <h4 className="col-md-2 text-success m-2">Open Admission</h4>
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
                fontSize: "12px",
              }}
              className="table table-responsive table-hover table-striped rounded-4 container px-lg-3 py-lg-2"
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
                    Photo
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
                    VALIDATION
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
                      suppressHydrationWarning
                    >
                      <div className="d-flex flex-column">
                        <Image
                          src={student?.url}
                          alt="uploadedImage"
                          style={{
                            width: 70,
                            height: 90,
                            alignSelf: "center",
                          }}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="rounded-2 mx-auto text-center"
                        />

                        <a
                          href={student?.url}
                          // className="text-decoration-none"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginTop: -30,
                            marginLeft: 40,
                          }}
                        >
                          <i
                            className="bi bi-arrow-down-square-fill text-white fs-5"
                            style={{ cursor: "pointer" }}
                          ></i>
                        </a>
                      </div>
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
                      {calculateAge(
                        getCurrentDateInput(student?.student_birthday),
                        student?.student_addmission_class
                      )}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center p-1"
                    >
                      {formatDateAndTime(
                        student?.student_addmission_dateAndTime
                      )}

                      {student?.updatedAt && (
                        <p>
                          Updated At:
                          <br /> {formatDateAndTime(student?.updatedAt)}
                        </p>
                      )}
                    </td>

                    <td className="p-2" suppressHydrationWarning={true}>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <button
                          type="button"
                          style={{ fontSize: "8px" }}
                          className="btn btn-success mb-1"
                          onClick={() => {
                            setStudentDetails(student);
                            setShowDetails(true);
                          }}
                        >
                          View
                        </button>

                        {/* {student?.id != "" && (
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
                              fontSize: "8px",

                              borderRadius: 10,
                            }}
                            className="mb-1 btn"
                          >
                            {({ blob, url, loading, error }) =>
                              loading ? "Loading..." : "Download"
                            }
                          </PDFDownloadLink>
                        )} */}

                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ fontSize: "8px" }}
                          onClick={() => {
                            // eslint-disable-next-line no-alert
                            if (
                              window.confirm(
                                "Are you sure, you want to delete this Application?"
                              )
                            ) {
                              delEntry(student);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showDetails && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Details of {studentDetails.student_eng_name}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setShowDetails(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body ben">
                  <div className="d-flex flex-column justify-content-start align-items-start flex-wrap">
                    <div className="mx-auto d-flex justify-content-between align-items-center">
                      <Image
                        // src="https://raw.githubusercontent.com/usprys/usprysdata/main/logoweb.png"
                        src={schoolLogo}
                        alt="LOGO"
                        style={{ width: 100, height: 100 }}
                      />
                      <div>
                        <h3 className="mx-4 fw-bold" style={{ fontSize: 35 }}>
                          {SCHOOLBENGALINAME}
                        </h3>
                        <h6 className="text-center my-1">
                          {SCHOOLBENGALIADDRESS}
                        </h6>
                      </div>
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=UTTAR SEHAGORI PRIMARY SCHOOL: STUDENT NAME:${" "}${
                          studentDetails?.student_eng_name
                        }, Father's name:${" "}${
                          studentDetails?.father_eng_name
                        },Mother's name:${" "}${
                          studentDetails?.mother_eng_name
                        }, Mobile Number:${" "}${
                          studentDetails?.student_mobile
                        }, Gender:${" "}${
                          studentDetails?.student_gender
                        },  Addmission Class:${" "} ${
                          studentDetails?.student_addmission_class
                        }, Application Number:${" "} ${
                          studentDetails?.id
                        }, Application Date:${" "} ${
                          studentDetails?.student_addmission_date
                        }`}
                        className="m-0 p-0"
                        width={100}
                        height={100}
                        alt="QRCode"
                      />
                    </div>
                    <h2 className="mx-auto text-center ben my-2">
                      ভর্তির আবেদন পত্র (Online Admission)
                    </h2>

                    <div className="mx-auto">
                      <div className="d-flex flex-column justify-content-center">
                        <Image
                          src={studentDetails?.url}
                          alt="uploadedImage"
                          style={{
                            width: "20%",
                            height: "auto",
                            alignSelf: "center",
                          }}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="rounded-2 mx-auto text-center"
                        />
                        <a
                          href={studentDetails?.url}
                          // className="text-decoration-none"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginTop: 5,
                          }}
                        >
                          <i
                            className="bi bi-arrow-down-square-fill text-primary fs-5"
                            style={{ cursor: "pointer" }}
                          ></i>
                        </a>
                      </div>
                      <div className="d-flex justify-content-around my-1 timesFont">
                        <h5>
                          Application Form No.:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.id}
                          </span>
                        </h5>
                        <h5>&nbsp;&nbsp;&nbsp;&nbsp;</h5>

                        <h5>
                          Application Date:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {formatDateAndTime(
                              studentDetails?.student_addmission_dateAndTime
                            )}
                          </span>
                        </h5>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5>
                          ছাত্র / ছাত্রীর নাম :{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_eng_name}
                          </span>
                        </h5>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5 className="text-start">
                          অভিভাবকের মোবাইল নাম্বার:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_mobile}
                          </span>
                        </h5>

                        <h5>
                          ছাত্র/ছাত্রীর লিঙ্গ:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_gender}
                          </span>
                        </h5>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5 className="text-start">
                          জন্ম তারিখ:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_birthday}
                          </span>
                        </h5>

                        <h5>
                          আধার নং:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_aadhaar}
                          </span>
                        </h5>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5>
                          পিতার নাম :{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.father_eng_name}
                          </span>
                        </h5>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5>
                          মাতার নাম :{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.mother_eng_name}
                          </span>
                        </h5>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5>
                          অভিভাবকের নাম:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.guardian_eng_name}
                          </span>
                        </h5>
                      </div>

                      <div className="d-flex justify-content-around my-1">
                        <h5>
                          ছাত্র/ছাত্রীর ধর্ম:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_religion}
                          </span>
                        </h5>

                        <h5>
                          ছাত্র/ছাত্রীর জাতি:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_race}
                          </span>
                        </h5>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5>
                          ছাত্র/ছাত্রী বি.পি.এল. কিনা?:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_bpl_status}
                          </span>
                        </h5>
                        {studentDetails?.student_bpl_status === "YES" && (
                          <h5>
                            অভিভাবকের বি.পি.এল. নাম্বার:{" "}
                            <span
                              style={{
                                textDecoration: "underline 1px dotted",
                                textUnderlineOffset: 6,
                              }}
                            >
                              {studentDetails?.student_bpl_number}
                            </span>
                          </h5>
                        )}
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5>ছাত্র/ছাত্রীর ঠিকানা: </h5>
                        <h5>&nbsp;&nbsp;</h5>
                        <span
                          style={{
                            textDecoration: "underline 1px dotted",
                            textUnderlineOffset: 6,
                          }}
                        >
                          Vill.: {studentDetails?.student_village},P.O.:{" "}
                          {studentDetails?.student_post_office}
                          ,P.S.: {studentDetails?.student_police_station}, PIN:
                          {studentDetails?.student_pin_code}
                        </span>
                      </div>
                      <div className="d-flex justify-content-around my-1">
                        <h5>
                          ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী:{" "}
                          <span
                            style={{
                              textDecoration: "underline 1px dotted",
                              textUnderlineOffset: 6,
                            }}
                          >
                            {studentDetails?.student_addmission_class}
                          </span>
                        </h5>
                      </div>
                      {studentDetails?.student_previous_class !== "" && (
                        <div className="d-flex justify-content-around my-1">
                          <h5>
                            ছাত্র/ছাত্রীর পূর্বের শ্রেণী:{" "}
                            <span
                              style={{
                                textDecoration: "underline 1px dotted",
                                textUnderlineOffset: 6,
                              }}
                            >
                              {studentDetails?.student_previous_class}
                            </span>
                          </h5>
                          <h5>
                            ছাত্র/ছাত্রীর পূর্বের বর্ষ:{" "}
                            <span
                              style={{
                                textDecoration: "underline 1px dotted",
                                textUnderlineOffset: 6,
                              }}
                            >
                              {studentDetails?.student_previous_class_year}
                            </span>
                          </h5>
                        </div>
                      )}
                      {studentDetails?.student_previous_class !== "" && (
                        <div className="d-flex justify-content-around my-1">
                          <h5>
                            ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি:{" "}
                            <span
                              style={{
                                textDecoration: "underline 1px dotted",
                                textUnderlineOffset: 6,
                              }}
                            >
                              {studentDetails?.student_previous_student_id}
                            </span>
                          </h5>
                        </div>
                      )}
                      {studentDetails?.student_previous_class !== "" && (
                        <div className="d-flex justify-content-around my-1">
                          <h5>
                            ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা:{" "}
                            <h6
                              style={{
                                textDecoration: "underline 1px dotted",
                                textUnderlineOffset: 4,
                              }}
                            >
                              {studentDetails?.student_previous_school}
                            </h6>
                          </h5>
                        </div>
                      )}
                      {studentDetails?.updatedAt && (
                        <div className="d-flex justify-content-around my-1">
                          <h5>
                            Updated At:{" "}
                            <span
                              style={{
                                textDecoration: "underline 1px dotted",
                                textUnderlineOffset: 4,
                              }}
                            >
                              {formatDateAndTime(studentDetails?.updatedAt)}
                            </span>
                          </h5>
                        </div>
                      )}
                      <div className="mx-auto">
                        <PDFDownloadLink
                          document={
                            <CompDownloadAdmissionForm data={studentDetails} />
                          }
                          fileName={`Apllication Form of ${studentDetails?.student_eng_name}.pdf`}
                          className="m-2 btn btn-success"
                        >
                          {({ blob, url, loading, error }) =>
                            loading ? "Loading..." : "Download"
                          }
                        </PDFDownloadLink>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="my-2">
                    <button
                      type="button"
                      className="btn btn-danger m-2"
                      onClick={() => {
                        setShowDetails(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
