import React from "react";
import Link from "next/link";
import { SCHOOLADDRESS, SCHOOLNAME } from "@/modules/constants";
const Footer = () => {
  return (
    <div
      className="noprint text-black"
      style={{ bottom: 0, position: "-webkit-sticky" }}
    >
      <div className="container-fluid bg-white mt-2 p-1">
        <div
          className="container-fluid bg-dark my-2"
          style={{ height: "2px", opacity: 0.5 }}
        ></div>
        <div className="row align-items-start justify-content-center p-1">
          <div className="col-lg-6">
            <h5 className="container text-left">Reach Us:</h5>
            <h6 className="h-font fw-bold fs-6">{SCHOOLNAME}</h6>
            <h6 className="h-font fw-bold fs-6">{SCHOOLADDRESS}</h6>
          </div>

          {/* <div className="col-lg-6">
            <h5 className="container text-left">Call Us:</h5>
            <Link
              href="tel: +919933684468"
              className="d-inline-block mb-2 text-decoration-none text-dark"
            >
              <i className="bi bi-telephone-fill"></i>+ 91 9933 684468, SK
              MAIDUL ISLAM, HEAD TEACHER
            </Link>
            <br />

            <Link
              href="tel: +917872882343"
              className="d-inline-block mb-2 text-decoration-none text-dark"
            >
              <i className="bi bi-telephone-fill"></i>+ 91 7872 882343, MALLIKA
              GAYEN, ASSISTANT TEACHER
            </Link>
            <br />
            <Link
              href="tel: +917679230482"
              className="d-inline-block mb-2 text-decoration-none text-dark"
            >
              <i className="bi bi-telephone-fill"></i>+ 91 7679 230482,
              SURASHREE SADHUKHAN SAHA, ASSISTANT TEACHER
            </Link>
            <br />
            <Link
              href="tel: +919735747630"
              className="d-inline-block mb-2 text-decoration-none text-dark"
            >
              <i className="bi bi-telephone-fill"></i>+ 91 9735 747630, ABDUS
              SALAM MOLLICK, ASSISTANT TEACHER
            </Link>
            <br />
          </div> */}
          <div className="col-lg-6">
            <h5 className="container text-left">Our Teacher&#8217;s:</h5>
            <Link
              href="tel: +919933684468"
              className="d-inline-block mb-2 fs-5 fw-bold text-decoration-none text-dark"
            >
              <i className="bi bi-telephone-fill"></i>+ 91 9933 684468, SK
              MAIDUL ISLAM, HEAD TEACHER
            </Link>
            <br />

            <h5 className="d-inline-block mb-2 text-decoration-none text-dark">
              MALLIKA GAYEN, ASSISTANT TEACHER
            </h5>
            <br />
            <h5 className="d-inline-block mb-2 text-decoration-none text-dark">
              SURASHREE SADHUKHAN SAHA, ASSISTANT TEACHER
            </h5>
            <br />
            <h5 className="d-inline-block mb-2 text-decoration-none text-dark">
              ABDUS SALAM MOLLICK, ASSISTANT TEACHER
            </h5>
            <br />
          </div>
        </div>
      </div>

      <div className="container m-auto pt-2 text-primary">
        <h5 className="container text-center">Important Links:</h5>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://banglarshiksha.gov.in/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> Banglarsiksha Portal
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://school.banglarshiksha.gov.in/sms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> SMS Portal
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://www.wbbpe.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> WBBPE
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://wbbse.wb.gov.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> WBBSE
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://www.wb.gov.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> West Bengal State Portal
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://www.facebook.com/share/1MAgAPj49x/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-facebook"></i> Follow Us On Facebook
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="mailto: usprys@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-envelope-at-fill"></i> Email Us
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://wbresults.nic.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> WB Results
        </Link>
        <Link
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://drive.google.com/file/d/1FDcOHPETUb5iOA32SnOEUqPUiUkrljKE/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-android2"></i> Our App
        </Link>
      </div>

      <h6 className="text-center bg-dark text-white p-2 mb-0 h-font">
        © Copyright UTTAR SEHAGORI PRIMARY SCHOOL. This Site is Designed and
        Maintained By UTTAR SEHAGORI PRIMARY SCHOOL.
      </h6>
    </div>
  );
};

export default Footer;
