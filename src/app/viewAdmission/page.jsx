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
  DateValueToSring,
  getCurrentDateInput,
  uniqArray,
} from "@/modules/calculatefunctions";
import { classWiseAge } from "@/modules/constants";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CompDownloadAdmissionForm from "@/components/CompDownloadAdmissionForm";
import Image from "next/image";
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
    } else {
      ageMessage = `Student is Invalid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    }
    return ageMessage;
  };

  const delEntry = async (entry) => {
    setLoader(true);
    await deleteDoc(doc(firestore, "admission", entry.id))
      .then(async () => {
        const desertRef = ref(storage, `studentImages/${entry.photoName}`);
        await deleteObject(desertRef)
          .then(() => {
            toast.success("Image deleted successfully");
            toast.success("Application Deleted successfully");
            getData();
            setLoader(false);
          })
          .catch((error) => {
            console.log(error);
            setLoader(false);
            toast.error("Failed to delete Image");
          });
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

                    <td className="p-2" suppressHydrationWarning={true}>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <button
                          type="button"
                          style={{ fontSize: "8px" }}
                          className="btn btn-success mb-1"
                          onClick={() => {
                            setStateObject(student);
                            router.push("/printAdmissionForm");
                          }}
                        >
                          View
                        </button>

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
                              fontSize: "8px",

                              borderRadius: 10,
                            }}
                            className="mb-1 btn"
                          >
                            {({ blob, url, loading, error }) =>
                              loading ? "Loading..." : "Download"
                            }
                          </PDFDownloadLink>
                        )}

                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ fontSize: "8px" }}
                          onClick={() => {
                            // eslint-disable-next-line no-alert
                            if (
                              window.confirm(
                                "Are you sure, you want to delete your Application?"
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
      </div>
    </div>
  );
}
