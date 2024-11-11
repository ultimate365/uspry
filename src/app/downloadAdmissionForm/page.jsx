"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { firestore } from "../../context/FirbaseContext";
import { getDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CompDownloadAdmissionForm from "@/components/CompDownloadAdmissionForm";
import { DateValueToSring } from "../../modules/calculatefunctions";
import { useGlobalContext } from "@/context/Store";
export default function page() {
  const { setStateObject } = useGlobalContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const mobile = searchParams.get("mobile");
  const [loader, setLoader] = useState(false);
  const [showSearchedResult, setShowSearchedResult] = useState(false);
  const [searchedApplicationNo, setSearchedApplicationNo] = useState({
    id: "",
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
    student_birthday: "",
    student_gender: "",
    student_mobile: "",
    student_aadhaar: "",
    student_religion: "",
    student_race: "",
    student_bpl_status: "",
    student_bpl_number: "",
    student_village: "",
    student_post_office: "",
    student_police_station: "",
    student_pin_code: "",
    student_addmission_class: "",
    student_previous_class: "",
    student_previous_class_year: "",
    student_previous_school: "",
    student_previous_student_id: "",
    student_addmission_date: "",
    student_addmission_dateAndTime: "",
  });
  const searchApplication = async () => {
    setLoader(true);
    const ref = doc(firestore, "admission", id);
    try {
      await getDoc(ref)
        .then((data) => {
          const adata = data.data();
          if (adata && adata.student_mobile === mobile) {
            setSearchedApplicationNo(adata);
            setShowSearchedResult(true);
            setLoader(false);
          } else {
            setShowSearchedResult(false);
            toast.error("Application Not Found!");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error("Application Not Found!");
          setShowSearchedResult(false);
          setLoader(false);
          console.log(error);
        });
    } catch (error) {
      toast.error("Application Not Found!");
      setShowSearchedResult(false);
      setLoader(false);
    }
  };
  useEffect(() => {
    if (id && mobile) {
      searchApplication();
    } else {
      router.push("/");
      toast.error("Invalid Application ID or Mobile Number");
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      {loader ? <Loader /> : null}
      <h3>Download Admission Form</h3>
      {showSearchedResult && (
        <div className="container">
          <table
            className="table table-bordered table-striped border-black border-1 my-4 p-4"
            style={{ border: "1px solid black" }}
          >
            <thead>
              <th style={{ border: "1px solid black" }}>Application No.</th>
              <th style={{ border: "1px solid black" }}>ছাত্র/ছাত্রীর নাম</th>
              <th style={{ border: "1px solid black" }}>পিতার নাম</th>
              <th style={{ border: "1px solid black" }}>
                ফর্ম জমা দেওয়ার তারিখ
              </th>
              <th style={{ border: "1px solid black" }}>Action</th>
            </thead>
            <tbody style={{ verticalAlign: "center" }}>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {searchedApplicationNo?.id}
              </td>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {searchedApplicationNo?.student_eng_name}
              </td>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {searchedApplicationNo?.father_eng_name}
              </td>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {DateValueToSring(
                  searchedApplicationNo?.student_addmission_dateAndTime
                )}
              </td>
              <td className="p-2" suppressHydrationWarning={true}>
                <div>
                  <button
                    type="button"
                    className="btn btn-success btn-sm m-2"
                    onClick={() => {
                      setStateObject(searchedApplicationNo);
                      router.push("/printAdmissionForm");
                    }}
                  >
                    View
                  </button>

                  {searchedApplicationNo?.id != undefined && (
                    <PDFDownloadLink
                      document={
                        <CompDownloadAdmissionForm
                          data={searchedApplicationNo}
                        />
                      }
                      fileName={`Apllication Form of ${searchedApplicationNo?.student_eng_name}.pdf`}
                      style={{
                        textDecoration: "none",
                        padding: "10px",
                        color: "#fff",
                        backgroundColor: "navy",
                        border: "1px solid #4a4a4a",
                        width: "40%",
                        borderRadius: 10,
                      }}
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? "Loading..." : "Download"
                      }
                    </PDFDownloadLink>
                  )}
                </div>
              </td>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
