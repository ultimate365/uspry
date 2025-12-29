"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import { useGlobalContext } from "../../context/Store";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { firestore, firbaseAuth } from "../../context/FirbaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../../components/Loader";
import {
  decryptObjData,
  encryptObjData,
  getCookie,
  setCookie,
} from "../../modules/encryption";
import {
  comparePassword,
  encryptPassword,
  getCurrentDateInput,
  getSubmitDateInput,
} from "@/modules/calculatefunctions";
import CustomInput from "../../components/CustomInput";
import axios from "axios";
export default function Login() {
  const router = useRouter();
  const { state, setState, teachersState } = useGlobalContext();
  const [loader, setLoader] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [teacherData, setTeacherData] = useState({
    dojnow: "",
    pan: "",
    udise: "",
    gp: "",
    dob: "",
    question: "",
    email: "",
    access: "",
    registered: false,
    ifsc: "",
    dor: "",
    id: "",
    showAccount: false,
    circle: "",
    fname: "",
    disability: "",
    association: "",
    address: "",
    account: "",
    hoi: "",
    dataYear: 2024,
    school: "",
    doj: "",
    training: "",
    education: "",
    tname: "",
    desig: "",
    phone: "",
    rank: 4,
    gender: "",
    cast: "",
    service: "",
    bank: "",
    empid: "",
    userType: "",
  });
  const formRef = useRef(null);
  const [studentIDERR, setStudentIDERR] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [loginType, setLoginType] = useState(true);
  const [studentID, setStudentID] = useState("");
  const today = new Date();
  const [dob, setDob] = useState(`01-01-${today.getFullYear() - 10}`);
  const [mobileOTP, setMobileOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const onChangeRadio = () => {
    setLoginType(!loginType);
  };

  const submitStudentData = async (e) => {
    e.preventDefault();
    if (validFormStudent()) {
      try {
        setLoader(true);
        const collectionRef = collection(firestore, "students");
        const q = query(collectionRef, where("student_id", "==", studentID));
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.docs[0].data().pan);
        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();

          // if (data.password === password) {
          if (dob === data.birthdate) {
            setLoader(false);
            toast.success(
              `Congrats! ${data.student_name} You are Logined Successfully!`
            );
            const Obj = {
              name: data.student_name,
              class: data.class,
              roll: data.roll_no,
              father_name: data.father_name,
              mother_name: data.mother_name,
              student_id: data.student_id,
              mobile: data.mobile,
              id: data.id,
              birthdate: data.birthdate,
              userType: data.userType,
            };
            setState({
              USER: Obj,
              LOGGEDAT: Date.now(),
              ACCESS: "student",
            });
            encryptObjData("uid", Obj, 10080);
            setCookie("loggedAt", Date.now(), 10080);
            router.push("/dashboard");
          } else {
            setLoader(false);
            toast.error("Wrong Date of Birth!");
          }
        } else {
          setLoader(false);
          toast.error("Invalid Student ID!");
        }
      } catch (error) {
        setLoader(false);
        toast.error("Something Went Wrong!");
        console.log(error);
      }
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  const validFormStudent = () => {
    let isValid = false;
    if (studentID.length !== 14) {
      setStudentIDERR("14 Digit Student ID is required");
      isValid = false;
    } else {
      setStudentIDERR("");
      isValid = true;
    }

    return isValid;
  };

  const submitTeacherData = async (e) => {
    e.preventDefault();
    if (validForm()) {
      try {
        setLoader(true);
        const collectionRef = collection(firestore, "teachers");
        const q = query(collectionRef, where("phone", "==", phone.toString()));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();
          setLoader(false);
          setTeacherData(data);
          setName(data.tname);
          await sendVerificationOTP(phone, data.tname);
        } else {
          setLoader(false);
          toast.error("Invalid Mobile Number!");
        }
      } catch (error) {
        setLoader(false);
        toast.error("Something Went Wrong!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log(error);
      }
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  const validForm = () => {
    let isValid = false;

    if (phone.toString().length === 0) {
      setPhoneErr("Mobile Number is required");
      isValid = false;
    } else if (phone.toString().length !== 10) {
      setPhoneErr("10 Digit Mobile Number is required");
      isValid = false;
    } else {
      setPhoneErr("");
      isValid = true;
    }
    return isValid;
  };

  let userdetails, loggedAt;
  let details = getCookie("uid");
  const sendVerificationOTP = async (phone, name) => {
    setLoader(true);
    const res = await axios.post("/api/sendVerificationOTP", {
      phone,
      name,
    });
    const record = res.data;
    if (record.success) {
      toast.success("OTP sent to your Mobile Number!");
      setLoader(false);
      setOtpSent(true);
    } else {
      toast.error("Failed to send OTP!");
      setLoader(false);
    }
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (mobileOTP !== "" && mobileOTP.length === 6) {
      setLoader(true);
      try {
        const res = await axios.post("/api/verifyMobileOTP", {
          phone: phone.toString(),
          phoneCode: mobileOTP,
          name: name,
        });
        const record = res.data;
        if (record.success) {
          toast.success("Your Mobile Number is successfully verified!");
          setLoader(false);
          encryptObjData("uid", teacherData, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: teacherData,
              LOGGEDAT: Date.now(),
              ACCESS: "admin",
            });
            router.push("/dashboard");
          }, 500);
        } else {
          toast.error("Please enter a Valid 6 Digit OTP");
          setLoader(false);
        }
      } catch (error) {
        toast.error("Failed to verify OTP!");
        setLoader(false);
        console.error(error);
      }
    }
  };
  useEffect(() => {}, [loginType]);

  useEffect(() => {
    if (details) {
      userdetails = decryptObjData("uid");
      loggedAt = getCookie("loggedAt");
      setState({
        USER: userdetails,
        loggedAt: loggedAt,
        ACCESS: userdetails?.userType,
      });
      router.push("/dashboard");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container text-black p-2 my-4">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />

      {loader ? <Loader /> : null}
      <h3 className="text-primary">Login</h3>
      <div
        className="text-center col-md-6 mx-auto p-4 rounded-3"
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          padding: "20px",
          width: "100%",
          height: "auto",
          maxWidth: "400px",
          backgroundColor: "darkseagreen",
        }}
      >
        <div className="my-5 text-center">
          <div className="bg-dark p-2 rounded rounded-4 d-flex justify-content-between align-items-center">
            <div className="form-check m-1 d-flex justify-content-between align-items-center">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={loginType}
                onChange={onChangeRadio}
                style={{ width: 30, height: 30 }}
              />
              <label
                className="form-check-label m-2 text-white fs-6"
                htmlFor="flexRadioDefault1"
              >
                Student&#8217;s Login
              </label>
            </div>
            <div className="form-check m-1 d-flex justify-content-between align-items-center">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefaul2"
                id="flexRadioDefault2"
                checked={!loginType}
                onChange={onChangeRadio}
                style={{ width: 30, height: 30 }}
              />
              <label
                className="form-check-label m-2 text-white fs-6"
                htmlFor="flexRadioDefault2"
              >
                Teacher&#8217;s Login
              </label>
            </div>
          </div>
          {loginType ? (
            <div>
              <form
                method="post"
                className="mx-auto my-2"
                autoComplete="off"
                onSubmit={submitStudentData}
              >
                <h4 className="text-black timesNewRoman">
                  Student&#8217;s Login
                </h4>
                <label className="form-label my-3 fs-5">
                  Plese Enter Your 14 Digit Student ID
                </label>
                <div className="input-group mb-3">
                  {/* <span className="input-group-text" id="basic-addon1">
                    <i className="bi bi-input-cursor-text"></i>
                  </span> */}
                  <input
                    type="number"
                    className="form-control"
                    id="studentID"
                    maxLength={8}
                    value={studentID}
                    onChange={(e) => {
                      if (e.target.value.length <= 14) {
                        setStudentID(e.target.value);
                      }
                    }}
                    placeholder="14 Digits of Student ID"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fs-5">
                    Student&#8217;s Date of Birth *
                  </label>
                  <input
                    type="date"
                    defaultValue={getCurrentDateInput(dob)}
                    className="form-control"
                    required
                    id="dob"
                    onChange={(e) => setDob(getSubmitDateInput(e.target.value))}
                  />
                </div>

                {studentIDERR.length > 0 && (
                  <div className="mb-3">
                    <p className="text-danger">{studentIDERR}</p>
                  </div>
                )}

                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => router.push("/studentdata")}
                >
                  To Know Student ID Click Here
                </button>
              </form>
            </div>
          ) : (
            <div>
              {!otpSent ? (
                <form
                  method="post"
                  className="mx-auto my-2"
                  autoComplete="off"
                  onSubmit={submitTeacherData}
                >
                  <h4 className="text-black timesNewRoman">
                    Teacher&#8217;s Login
                  </h4>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Mobile No.</span>
                    <input
                      type="number"
                      className="form-control"
                      id="phone"
                      value={phone}
                      onChange={(e) => {
                        if (e.target.value.toString().length <= 10) {
                          setPhone(e.target.value);
                        }
                      }}
                      placeholder="Enter Mobile No."
                    />
                  </div>
                  {phoneErr.length > 0 && (
                    <p className="text-danger my-2">{phoneErr}</p>
                  )}

                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                  <div className="my-2">
                    <p className="text-white fs-4">Having Trouble in Login? </p>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => setShowTip(true)}
                    >
                      Click Here
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p>
                    OTP Sent to your phone +91-
                    {`${phone?.toString()?.slice(0, 4)}XXXX${phone
                      ?.toString()
                      ?.slice(8, 10)}`}{" "}
                    for an OTP.
                  </p>
                  <p>Please check your OTP in your Telegram App</p>
                  <div className="mx-auto">
                    <form ref={formRef} autoComplete="off" onSubmit={verifyOTP}>
                      <input
                        className="form-control mb-3"
                        autoFocus
                        title="Enter Your OTP"
                        type="text" // ✅ use text so maxlength works
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter Your 6 digit OTP"
                        value={mobileOTP}
                        onChange={(e) => {
                          // Only digits, max 6
                          const inputValue = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          setMobileOTP(inputValue);
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData
                            .getData("Text")
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          setMobileOTP(pasted);
                        }}
                      />
                      <button type="submit" className="btn btn-primary m-1">
                        Verify
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {showTip && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-sm flex-wrap text-center">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Teacher&#8217;s Login Tip
                  </h1>
                </div>
                <div className="modal-body">
                  <div className="mx-auto my-2 noprint">
                    <div className="mb-3 mx-auto">
                      <h6 htmlFor="rank" className="text-danger text-break">
                        You Must have the Telegram App in your Mobile to login
                      </h6>
                      <h6 htmlFor="rank" className="text-danger text-break">
                        You can ask the HT to alter any change in your Mobile
                        No.
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => setShowTip(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
