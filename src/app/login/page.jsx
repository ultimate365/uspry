"use client";
import React, { useState, useContext, useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import Link from "next/link";
export default function Login() {
  const router = useRouter();
  const { state, setState, teachersState } = useGlobalContext();
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userNameErr, setUserNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [loginType, setLoginType] = useState(true);
  const [studentID, setStudentID] = useState("");
  const today = new Date();
  const [dob, setDob] = useState(`01-01-${today.getFullYear() - 10}`);
  const onChangeRadio = () => {
    setLoginType(!loginType);
  };

  const submitStudentData = async (e) => {
    e.preventDefault();
    if (validFormStudent()) {
      try {
        setLoader(true);
        const collectionRef = collection(firestore, "userStudents");
        const q = query(
          collectionRef,
          where("studentID", "==", `028793${studentID}`)
        );
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.docs[0].data().pan);
        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();

          // if (data.password === password) {
          if (await comparePassword(dob, data.dob)) {
            const collectionRef2 = collection(firestore, "students");
            const q2 = query(collectionRef2, where("id", "==", data.id));
            const querySnapshot2 = await getDocs(q2);
            if (querySnapshot2.docs.length > 0) {
              const sdata = querySnapshot2.docs[0].data();
              setLoader(false);
              toast.success(
                `Congrats! ${sdata.student_name} You are Logined Successfully!`,
                {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,

                  draggable: true,
                  progress: undefined,
                  theme: "light",
                }
              );
              const Obj = {
                name: sdata.student_name,
                class: sdata.class,
                roll: sdata.roll_no,
                father_name: sdata.father_name,
                mother_name: sdata.mother_name,
                student_id: sdata.student_id,
                mobile: sdata.mobile,
                id: data.id,
                birthdate: data.birthdate,
                userType: data.userType,
              };
              setState({
                USER: Obj,
                LOGGEDAT: Date.now(),
                ACCESS: data.userType,
              });
              encryptObjData("uid", Obj, 10080);
              setCookie("loggedAt", Date.now(), 10080);
              router.push("/dashboard");
            }
          } else {
            setLoader(false);
            toast.error("Wrong Date of Birth!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,

              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        } else {
          setLoader(false);
          toast.error("Invalid Student ID!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,

            draggable: true,
            progress: undefined,
            theme: "light",
          });
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

  const validFormStudent = () => {
    let isValid = false;
    if (studentID.length === 0) {
      setStudentIDERR("Student ID is required");
      isValid = false;
    } else {
      setStudentIDERR("");
      isValid = true;
    }

    return isValid;
  };

  const submitTeacherData = async (e) => {
    e.preventDefault();
    e.preventDefault();
    if (validForm()) {
      try {
        setLoader(true);
        const collectionRef = collection(firestore, "userTeachers");
        const q = query(
          collectionRef,
          where("username", "==", username.toUpperCase())
        );
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.docs[0].data().pan);
        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0].data();
          const userPassword = password;
          const serverPassword = data.password;
          // if (data.password === password) {
          if (await comparePassword(userPassword, serverPassword)) {
            const collectionRef2 = collection(firestore, "teachers");
            const q2 = query(collectionRef2, where("id", "==", data.id));
            const querySnapshot2 = await getDocs(q2);
            if (querySnapshot2.docs.length > 0) {
              const sdata = querySnapshot2.docs[0].data();
              setLoader(false);
              toast.success(
                `Congrats! ${sdata.tname} You are Logined Successfully!`,
                {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,

                  draggable: true,
                  progress: undefined,
                  theme: "light",
                }
              );
              const Obj = {
                name: sdata.tname,
                desig: sdata.desig,
                mobile: sdata.phone,
                id: data.id,
                username: data.username,
                userType: data.access,
              };
              setState({
                USER: Obj,
                LOGGEDAT: Date.now(),
                ACCESS: data.access,
              });
              encryptObjData("uid", Obj, 10080);
              setCookie("loggedAt", Date.now(), 10080);
              router.push("/dashboard");
            }
          } else {
            setLoader(false);
            toast.error("Wrong Password!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,

              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        } else {
          setLoader(false);
          toast.error("Invalid Username!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,

            draggable: true,
            progress: undefined,
            theme: "light",
          });
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
    if (username.length === 0) {
      setUserNameErr("Username is required");
    } else {
      setUserNameErr("");
    }
    if (password.length === 0) {
      setPasswordErr("Password is required");
    } else {
      setPasswordErr("");
    }
    isValid = username.length > 0 && password.length > 0;
    return isValid;
  };

  let userdetails, loggedAt;
  let details = getCookie("uid");

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
                  Last 8 Digits of Student ID
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    028793
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="studentID"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    placeholder="Last 8 Digits of Student ID"
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
                  <span className="input-group-text">Username</span>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                {userNameErr.length > 0 && (
                  <p className="text-danger my-2">{userNameErr}</p>
                )}
                <div className="input-group mb-3">
                  <span className="input-group-text">Password</span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                {passwordErr.length > 0 && (
                  <p className="text-danger my-2">{passwordErr}</p>
                )}
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <div className="my-2">
                  <p className="text-white fs-4">
                    {" "}
                    Forgot Username or Password?{" "}
                  </p>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => setShowTip(true)}
                  >
                    Click Here
                  </button>
                </div>
              </form>
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
                        Your Default Username is Your Employeed ID and Your
                        Default password is your PAN
                      </h6>
                      <h6 htmlFor="rank" className="text-danger text-break">
                        However You can Chage it anytime after login
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
