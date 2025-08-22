"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context/Store";
import {
  decryptObjData,
  deleteCookie,
  getCookie,
  setCookie,
} from "../../modules/encryption";
import { TELEGRAM_TEACHER_GROUP } from "../../modules/constants";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import CustomInput from "../../components/CustomInput";
import axios from "axios";
import Link from "next/link";
export default function VerifyLogin() {
  const { setState } = useGlobalContext();
  const router = useRouter();
  const ref = useRef();
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const nonverifieduid = getCookie("nonverifieduid");

  const sendVerificationOTP = async (phone, name) => {
    setDisplayLoader(true);
    // const res = await axios.post("/api/sendMobileOTP", {
    //   phone,
    //   name,
    // });
    const res = await axios.post("/api/sendVerificationOTP", {
      phone,
      name,
    });
    const record = res.data;
    if (record.success) {
      toast.success("OTP sent to your Mobile Number!");
      setDisplayLoader(false);
      setOtpSent(true);
      setShowRetryBtn(false);
      setTimeout(() => {
        setShowRetryBtn(true);
      }, 15000);
    } else {
      setShowRetryBtn(true);
      toast.error("Failed to send OTP!");
      setDisplayLoader(false);
    }
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (mobileOTP !== "" && mobileOTP.length === 6) {
      setDisplayLoader(true);
      try {
        const res = await axios.post("/api/verifyMobileOTP", {
          phone,
          phoneCode: mobileOTP,
          name: name,
        });
        const record = res.data;
        if (record.success) {
          toast.success("Your Mobile Number is successfully verified!");
          setDisplayLoader(false);
          const userTeacherData = decryptObjData("nonverifieduid");
          setCookie("uid", nonverifieduid, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          deleteCookie("nonverifieduid");
          setTimeout(() => {
            setState({
              USER: userTeacherData,
              LOGGEDAT: Date.now(),
              ACCESS: userTeacherData?.userType,
            });
            router.push("/dashboard");
          }, 500);
        } else {
          toast.error("Please enter a Valid 6 Digit OTP");
          setDisplayLoader(false);
        }
      } catch (error) {
        toast.error("Failed to verify OTP!");
        setDisplayLoader(false);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!nonverifieduid) {
      router.push("/logout");
    } else {
      const teacherData = decryptObjData("nonverifieduid");
      setPhone(teacherData.mobile);
      setName(teacherData.name);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      {displayLoader ? <Loader /> : null}
      <h3>Verify Login</h3>

      {!otpSent ? (
        <button
          type="button"
          className="btn btn-primary m-1"
          onClick={() => sendVerificationOTP(phone, name)}
        >
          Send Verification OTP
        </button>
      ) : (
        <div>
          <p>Please check your OTP on Our Telegram Group</p>
          {/* <p>
            Please check your phone +91-
            {`${phone?.slice(0, 4)}XXXX${phone?.slice(8, 10)}`} for an OTP.
          </p> */}
          <div className="col-md-6 mx-auto">
            <form action="" autoComplete="off" onSubmit={verifyOTP}>
              <input
                className="form-control mb-3"
                ref={(input) => input && input.focus()}
                title={"Enter Your OTP"}
                type={"number"}
                placeholder={"Enter Your 6 digit OTP"}
                value={mobileOTP}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Set a maxLength (e.g., 6 digits)
                  if (inputValue.length <= 6) {
                    setMobileOTP(inputValue);
                  }
                }}
              />
            </form>

            <button
              type="submit"
              className="btn btn-primary m-1"
              onClick={verifyOTP}
            >
              Verify
            </button>
            {showRetryBtn && (
              <button
                type="button"
                className="btn btn-primary m-1"
                onClick={() => sendVerificationOTP(phone, name)}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* <div className="my-5">
        <Link
          className="btn btn-success m-1 fs-5"
          href={TELEGRAM_TEACHER_GROUP}
          target="_blank"
        >
          <i className="bi bi-telegram"></i> Our Telegram Group
        </Link>
      </div> */}
    </div>
  );
}
