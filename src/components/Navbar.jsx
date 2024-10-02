"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { decryptObjData, getCookie } from "../modules/encryption";
import { firestore } from "../context/FirbaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/Store";
import { Loader } from "rsuite";
import Image from "next/image";
import schoolLogo from "@/../public/assets/images/logoweb.png";
export default function Navbar() {
  const {
    state,
    setState,

    setTeacherUpdateTime,
    studentUpdateTime,
    setStudentUpdateTime,
    slideUpdateTime,
    setSlideUpdateTime,
    noticeUpdateTime,
    setNoticeUpdateTime,
    userUpdateTime,
    setUserUpdateTime,
  } = useGlobalContext();
  const router = useRouter();
  let userdetails, loggedAt;
  let details = getCookie("uid");

  const [showLoader, setShowLoader] = useState(false);
  const handleNavCollapse = () => {
    if (typeof window !== "undefined") {
      // browser code
      if (
        document
          .querySelector("#navbarSupportedContent")
          .classList.contains("show")
      ) {
        document
          .querySelector("#navbarSupportedContent")
          .classList.remove("show");
      }
    }
  };

  useEffect(() => {
    if (details) {
      userdetails = decryptObjData("uid");
      loggedAt = getCookie("loggedAt");
      setState({
        USER: userdetails,
        loggedAt: loggedAt,
        ACCESS: userdetails?.userType,
      });
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {}, [state]);
  const RenderMenu = () => {
    if (state?.ACCESS === "admin") {
      return (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/"
              onClick={handleNavCollapse}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/dashboard"
              onClick={handleNavCollapse}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/admission"
              onClick={handleNavCollapse}
            >
              Addmission
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/viewAdmission"
              onClick={handleNavCollapse}
            >
              View Admission
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/Notification"
              onClick={handleNavCollapse}
            >
              Notifications
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/result"
              onClick={handleNavCollapse}
            >
              Result
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/autoresult"
              onClick={handleNavCollapse}
            >
              Auto Table
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/mdmdata"
              onClick={handleNavCollapse}
            >
              MDM Data
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/MDMmonthlyReport"
              onClick={handleNavCollapse}
            >
              Generate Monthly MDM Data
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/accounts"
              onClick={handleNavCollapse}
            >
              Accounts
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/vecAccount"
              onClick={handleNavCollapse}
            >
              VEC Account
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/updateunp"
              onClick={handleNavCollapse}
            >
              Update Username And Password
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/downloads"
              onClick={handleNavCollapse}
            >
              Downloads
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/complain"
              onClick={handleNavCollapse}
            >
              Complain or Suggest Us
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/logout"
              onClick={handleNavCollapse}
            >
              Logout
            </Link>
          </li>
        </>
      );
    } else if (state?.ACCESS === "student") {
      return (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/"
              onClick={handleNavCollapse}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/dashboard"
              onClick={handleNavCollapse}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/admission"
              onClick={handleNavCollapse}
            >
              Addmission
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/Notification"
              onClick={handleNavCollapse}
            >
              Notifications
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/downloads"
              onClick={handleNavCollapse}
            >
              Downloads
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/complain"
              onClick={handleNavCollapse}
            >
              Complain or Suggest Us
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/logout"
              onClick={handleNavCollapse}
            >
              Logout
            </Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/"
              onClick={handleNavCollapse}
            >
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/Notification"
              onClick={handleNavCollapse}
            >
              Notifications
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/admission"
              onClick={handleNavCollapse}
            >
              Addmission
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/studentdata"
              onClick={handleNavCollapse}
            >
              Student Data
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/downloads"
              onClick={handleNavCollapse}
            >
              Downloads
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/complain"
              onClick={handleNavCollapse}
            >
              Complain or Suggest Us
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/login"
              onClick={handleNavCollapse}
            >
              Login / Sign Up
            </Link>
          </li>
        </>
      );
    }
  };

  return (
    <nav className="navbar align-items-end navbar-expand-lg bg-white px-lg-3 py-lg-2 shadow-sm sticky-top p-2 overflow-auto bg-body-tertiary noprint">
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
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image
            src={schoolLogo}
            alt="LOGO"
            style={{ width: 70, height: 70 }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <RenderMenu />
          </ul>
        </div>
      </div>
    </nav>
  );
}
