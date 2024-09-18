"use client";
import React, { useState, useContext, useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { firestore, firbaseAuth } from "../../context/FirbaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../../components/Loader";
import { encryptObjData, getCookie, setCookie } from "../../modules/encryption";
import {
  comparePassword,
  getCurrentDateInput,
  getSubmitDateInput,
} from "@/modules/calculatefunctions";
import Link from "next/link";
import Students from "./students.json";
export default function Login() {
  const router = useRouter();
  const { state, setState } = useGlobalContext();
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userNameErr, setUserNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [studentIDERR, setStudentIDERR] = useState("");
  const [dobErr, setDobErr] = useState("");
  const [loginType, setLoginType] = useState(true);
  const [studentID, setStudentID] = useState("");
  const today = new Date();
  const [dob, setDob] = useState(`01-01-${today.getFullYear() - 6}`);
  const onChangeRadio = () => {
    setLoginType(!loginType);
  };

  const submitStudentData = async (e) => {
    e.preventDefault();
    if (validFormStudent()) {
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
        if (comparePassword(dob, data.dob)) {
          const collectionRef2 = collection(firestore, "students");
          const q2 = query(collectionRef2, where("id", "==", data.id));
          const querySnapshot2 = await getDocs(q2);
          if (querySnapshot2.docs.length > 0) {
            const sdata = querySnapshot2.docs[0].data();
            setLoader(false);
            toast.success("Congrats! You are Logined Successfully!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,

              draggable: true,
              progress: undefined,
              theme: "light",
            });
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

  useEffect(() => {}, [loginType]);

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
          width: "80%",
          height: "auto",
          maxWidth: "400px",
          backgroundColor: "darkseagreen",
        }}
      >
        <div className="my-5">
          <div className="bg-dark p-2 rounded rounded-2 d-flex justify-content-between align-items-between">
            <div className="form-check m-1">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={loginType}
                onChange={onChangeRadio}
              />
              <label
                className="form-check-label text-white"
                htmlFor="flexRadioDefault1"
              >
                Student&#8217;s Login
              </label>
            </div>
            <div className="form-check m-1">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefaul2"
                id="flexRadioDefault1"
                checked={!loginType}
                onChange={onChangeRadio}
              />
              <label
                className="form-check-label text-white"
                htmlFor="flexRadioDefault1"
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
                <div className="mb-3">
                  <span className="form-label my-3 fs-6">
                    Last 8 Digits of Student ID, after 028793
                  </span>
                  <input
                    type="text"
                    className="form-control my-2"
                    id="studentID"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    placeholder="Last 8 Digits of Student ID"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
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
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
              <p className="mt-3 text-center">
                Do Not have an account?{" "}
                <Link className="btn btn-success btn-sm" href="/studentsignup">
                  Sign Up
                </Link>
              </p>
              <p className="mt-3 text-center">
                Forgot your password?{" "}
                <Link className="btn btn-info btn-sm" href="/forgotpassword">
                  Reset Password
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <form
                method="post"
                className="mx-auto my-2"
                autoComplete="off"
                onSubmit={submitData}
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
              </form>
              <p className="mt-3 text-center">
                Do Not have an account?{" "}
                <Link className="btn btn-success btn-sm" href="/teachersignup">
                  Sign Up
                </Link>
              </p>
              <p className="mt-3 text-center">
                Forgot your password?{" "}
                <Link className="btn btn-info btn-sm" href="/forgotpassword">
                  Reset Password
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
