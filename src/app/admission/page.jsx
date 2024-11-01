"use client";
import React, { useEffect, useState } from "react";
import {
  getCurrentDateInput,
  getSubmitDateInput,
  todayInString,
  setInputNumberMaxLength,
  compareObjects,
} from "../../modules/calculatefunctions";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { firestore } from "../../context/FirbaseContext";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  collection,
} from "firebase/firestore";
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import { useGlobalContext } from "../../context/Store";
import { DateValueToSring } from "../../modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { SCHOOLNAME, classWiseAge } from "@/modules/constants";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CompDownloadAdmissionForm from "@/components/CompDownloadAdmissionForm";
export default function Admission() {
  const { setStateObject, setApplicationFormState, applicationFormState } =
    useGlobalContext();
  const router = useRouter();
  const [admissionID, setAdmissionID] = useState("");
  const [inputField, setInputField] = useState({
    id: "",
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
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
    student_addmission_year: new Date().getFullYear(),
    student_addmission_dateAndTime: Date.now(),
  });
  const [errInputField, setErrInputField] = useState({
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
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
    student_previous_class_year: "",
    student_previous_school: "",
    student_previous_student_id: "",
  });
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [applicationNo, setAplicationNo] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSearchedResult, setShowSearchedResult] = useState(false);
  const statusID = process.env.NEXT_PUBLIC_ADMISSION_STATUS;
  const [admissionStatus, setAdmissionStatus] = useState(false);
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
  const [searchedOrgApplicationNo, setSearchedOrgApplicationNo] = useState({
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

  const [showEditForm, setShowEditForm] = useState(false);

  const validForm = () => {
    let formIsValid = true;
    setErrInputField({
      student_beng_name: "",
      student_eng_name: "",
      father_beng_name: "",
      father_eng_name: "",
      mother_beng_name: "",
      mother_eng_name: "",
      guardian_beng_name: "",
      guardian_eng_name: "",
      student_gender: "",
      student_mobile: "",

      student_religion: "",
      student_race: "",
      student_bpl_number: "",
      student_village: "",
      student_post_office: "",
      student_police_station: "",
      student_pin_code: "",
      student_addmission_class: "",
      student_previous_class_year: "",
      student_previous_school: "",
      student_previous_student_id: "",
    });
    if (inputField.student_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_beng_name: "দয়া করে ছাত্র/ছাত্রীর বাংলা নাম লিখুন",
      }));
    }
    if (inputField.student_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_eng_name: "দয়া করে ছাত্র/ছাত্রীর ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.father_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        father_beng_name: "দয়া করে বাবার বাংলা নাম লিখুন",
      }));
    }
    if (inputField.father_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        father_eng_name: "দয়া করে বাবার ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.mother_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        mother_beng_name: "দয়া করে মাতার বাংলা নাম লিখুন",
      }));
    }
    if (inputField.mother_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        mother_eng_name: "দয়া করে মাতার ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.guardian_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        guardian_beng_name: "দয়া করে অভিভাবকের বাংলা নাম লিখুন",
      }));
    }
    if (inputField.guardian_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        guardian_eng_name: "দয়া করে অভিভাবকের ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.student_gender === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_gender: "দয়া করে ছাত্র/ছাত্রীর লিঙ্গ বেছে নিন",
      }));
    }
    if (inputField.student_mobile === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_mobile: "দয়া করে অভিভাবকের মোবাইল নাম্বার লিখুন",
      }));
    }
    if (inputField.student_religion === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_religion: "দয়া করে ছাত্র/ছাত্রীর ধর্ম বেছে নিন",
      }));
    }
    if (inputField.student_race === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_race: "দয়া করে ছাত্র/ছাত্রীর জাতি বেছে নিন",
      }));
    }
    if (inputField.student_bpl_status === "YES") {
      if (inputField.student_bpl_number === "") {
        formIsValid = false;
        setErrInputField((prevState) => ({
          ...prevState,
          student_bpl_number: "দয়া করে ছাত্র/ছাত্রীর BPL নাম্বার লিখুন",
        }));
      }
    }
    if (inputField.student_village === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_village: "দয়া করে ছাত্র/ছাত্রীর গ্রামের নাম লিখুন",
      }));
    }
    if (inputField.student_post_office === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_post_office: "দয়া করে ছাত্র/ছাত্রীর পোস্ট অফিসের নাম লিখুন",
      }));
    }
    if (inputField.student_police_station === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_police_station:
          "দয়া করে ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম লিখুন",
      }));
    }
    if (inputField.student_pin_code === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_pin_code: "দয়া করে ছাত্র/ছাত্রীর পিনকোড লিখুন",
      }));
    }
    if (inputField.student_addmission_class === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_addmission_class:
          "দয়া করে ছাত্র/ছাত্রীর ভর্তি হওয়ার শ্রেনী বেছে নিন",
      }));
    }
    if (inputField.student_previous_class !== "FIRST TIME ADDMISSION") {
      if (inputField.student_previous_class_year === "") {
        formIsValid = false;
        setErrInputField((prevState) => ({
          ...prevState,
          student_previous_class_year:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের শ্রেনীর বছর লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (inputField.student_previous_student_id === "") {
        formIsValid = false;
        setErrInputField((prevState) => ({
          ...prevState,
          student_previous_student_id:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের ১৪ সংখ্যার স্টুডেন্ট আইডিটি লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (inputField.student_previous_school === "") {
        formIsValid = false;
        setErrInputField((prevState) => ({
          ...prevState,
          student_previous_school:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
    }
    return formIsValid;
  };

  const getAdmission = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, "admission"))
      );
      const data = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        id: doc.id,
        ...doc.data(),
      }));
      const YEAR = new Date().getFullYear();
      const dataLength = data.length;
      let countLength = dataLength;
      if (dataLength <= 9) {
        countLength = "0" + (countLength + 1);
      } else {
        countLength = countLength + 1;
      }
      const genID = `USPRYS-ONLINE-${YEAR}-${countLength}`;
      setAdmissionID(genID);
      return genID;
    } catch (error) {
      setLoader(false);
      console.error("Error getting documents: ", error);
    }
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (validForm()) {
      //submit
      try {
        setLoader(true);

        // const ID =
        //   new Date().getFullYear().toString() +
        //   (new Date().getMonth() + 1 > 9
        //     ? new Date().getMonth()
        //     : ("0" + (new Date().getMonth() + 1)).toString()) +
        //   new Date().getDate().toString() +
        //   new Date().getHours().toString() +
        //   new Date().getMinutes().toString() +
        //   new Date().getSeconds().toString();
        const genID = await getAdmission();
        console.log(genID, "received during submission");
        const entry = {
          id: genID,
          student_beng_name: inputField.student_beng_name,
          student_eng_name: inputField.student_eng_name.toUpperCase(),
          father_beng_name: inputField.father_beng_name,
          father_eng_name: inputField.father_eng_name.toUpperCase(),
          mother_beng_name: inputField.mother_beng_name,
          mother_eng_name: inputField.mother_eng_name.toUpperCase(),
          guardian_beng_name: inputField.guardian_beng_name,
          guardian_eng_name: inputField.guardian_eng_name.toUpperCase(),
          student_birthday: inputField.student_birthday,
          student_gender: inputField.student_gender,
          student_mobile: inputField.student_mobile,
          student_aadhaar: inputField.student_aadhaar,
          student_religion: inputField.student_religion,
          student_race: inputField.student_race,
          student_bpl_status: inputField.student_bpl_status,
          student_bpl_number: inputField.student_bpl_number,
          student_village: inputField.student_village.toUpperCase(),
          student_post_office: inputField.student_post_office.toUpperCase(),
          student_police_station:
            inputField.student_police_station.toUpperCase(),
          student_pin_code: inputField.student_pin_code,
          student_addmission_class: inputField.student_addmission_class,
          student_previous_class: inputField.student_previous_class,
          student_previous_class_year: inputField.student_previous_class_year,
          student_previous_school:
            inputField.student_previous_school.toUpperCase(),
          student_previous_student_id: inputField.student_previous_student_id,
          student_addmission_date: todayInString(),
          student_addmission_year: new Date().getFullYear(),
          student_addmission_dateAndTime: Date.now(),
        };
        await setDoc(doc(firestore, "admission", genID), entry)
          .then(() => {
            setLoader(false);
            toast.success(
              "Congrats! Form Has Been Submitted to Us Successfully!",
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
            setFormSubmitted(true);
            setShowForm(false);
            setStateObject(entry);
            setInputField({
              id: "",
              student_beng_name: "",
              student_eng_name: "",
              father_beng_name: "",
              father_eng_name: "",
              mother_beng_name: "",
              mother_eng_name: "",
              guardian_beng_name: "",
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
              student_addmission_dateAndTime: Date.now(),
            });
          })

          .catch((error) => {
            setLoader(false);
            toast.error("Something went Wrong", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            console.log(error);
          });
      } catch (e) {
        setLoader(false);
        toast.error("Something went Wrong", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log(e);
      }
    } else {
      setLoader(false);
      toast.error("Please Fillup Required Details!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
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
      toast.error("Application Not Found!", {
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
  const searchApplication = async () => {
    setLoader(true);
    const ref = doc(firestore, "admission", applicationNo);
    try {
      await getDoc(ref)
        .then((data) => {
          const adata = data.data();
          if (adata && adata.student_mobile === mobileNumber) {
            setSearchedApplicationNo(adata);
            setApplicationFormState(adata);
            setShowSearchedResult(true);
            setShowUpdateForm(false);
            setLoader(false);
          } else {
            setShowSearchedResult(false);
            toast.error("Application Not Found!", {
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
        })
        .catch((error) => {
          toast.error("Application Not Found!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setShowSearchedResult(false);
          setLoader(false);
          console.log(error);
        });
    } catch (error) {
      toast.error("Application Not Found!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setShowSearchedResult(false);
      setLoader(false);
    }
  };

  const [editInputField, setEditInputField] = useState({
    id: "",
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
    student_birthday: ``,
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
    student_updatation_dateAndTime: Date.now(),
  });

  const [errEditInputField, setErrEditInputField] = useState({
    id: "",
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
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
    student_previous_class_year: "",
    student_previous_school: "",
    student_previous_student_id: "",
  });

  const updateData = async (e) => {
    e.preventDefault();
    if (validEditForm()) {
      if (!compareObjects(searchedOrgApplicationNo, editInputField)) {
        setLoader(true);
        try {
          editInputField.updatedAt = Date.now();
          const docRef = doc(firestore, "admission", editInputField.id);
          await updateDoc(docRef, editInputField)
            .then(() => {
              toast.success("Form Has Been Updated Successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setShowEditForm(false);
              setLoader(false);
              setEditInputField({
                id: "",
                student_beng_name: "",
                student_eng_name: "",
                father_beng_name: "",
                father_eng_name: "",
                mother_beng_name: "",
                mother_eng_name: "",
                guardian_beng_name: "",
                guardian_eng_name: "",
                student_birthday: ``,
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
            })
            .catch((e) => {
              console.log(e);
              setLoader(false);
              toast.error("Something went Wrong!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            });
        } catch (error) {
          console.log(error);
          setLoader(false);
          toast.error("Something went Wrong!", {
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
        toast.error("No Changes Detected!", {
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
      toast.error("Please Fillup Required Details!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const validEditForm = () => {
    let formIsValid = true;
    setErrEditInputField({
      student_beng_name: "",
      student_eng_name: "",
      father_beng_name: "",
      father_eng_name: "",
      mother_beng_name: "",
      mother_eng_name: "",
      guardian_beng_name: "",
      guardian_eng_name: "",
      student_gender: "",
      student_mobile: "",

      student_religion: "",
      student_race: "",
      student_bpl_number: "",
      student_village: "",
      student_post_office: "",
      student_police_station: "",
      student_pin_code: "",
      student_addmission_class: "",
      student_previous_class_year: "",
      student_previous_school: "",
      student_previous_student_id: "",
    });
    if (editInputField.student_beng_name === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_beng_name: "দয়া করে ছাত্র/ছাত্রীর বাংলা নাম লিখুন",
      }));
    }
    if (editInputField.student_eng_name === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_eng_name: "দয়া করে ছাত্র/ছাত্রীর ইংরাজী নাম লিখুন",
      }));
    }
    if (editInputField.father_beng_name === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        father_beng_name: "দয়া করে বাবার বাংলা নাম লিখুন",
      }));
    }
    if (editInputField.father_eng_name === "") {
      formIsValid = false;
      editInputField((prevState) => ({
        ...prevState,
        father_eng_name: "দয়া করে বাবার ইংরাজী নাম লিখুন",
      }));
    }
    if (editInputField.mother_beng_name === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        mother_beng_name: "দয়া করে মাতার বাংলা নাম লিখুন",
      }));
    }
    if (editInputField.mother_eng_name === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        mother_eng_name: "দয়া করে মাতার ইংরাজী নাম লিখুন",
      }));
    }
    if (editInputField.guardian_beng_name === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        guardian_beng_name: "দয়া করে অভিভাবকের বাংলা নাম লিখুন",
      }));
    }
    if (editInputField.guardian_eng_name === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        guardian_eng_name: "দয়া করে অভিভাবকের ইংরাজী নাম লিখুন",
      }));
    }
    if (editInputField.student_gender === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_gender: "দয়া করে ছাত্র/ছাত্রীর লিঙ্গ বেছে নিন",
      }));
    }
    if (editInputField.student_mobile === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_mobile: "দয়া করে অভিভাবকের মোবাইল নাম্বার লিখুন",
      }));
    }
    if (editInputField.student_religion === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_religion: "দয়া করে ছাত্র/ছাত্রীর ধর্ম বেছে নিন",
      }));
    }
    if (editInputField.student_race === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_race: "দয়া করে ছাত্র/ছাত্রীর জাতি বেছে নিন",
      }));
    }
    if (editInputField.student_bpl_status === "YES") {
      if (editInputField.student_bpl_number === "") {
        formIsValid = false;
        setErrEditInputField((prevState) => ({
          ...prevState,
          student_bpl_number: "দয়া করে ছাত্র/ছাত্রীর BPL নাম্বার লিখুন",
        }));
      }
    }
    if (editInputField.student_village === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_village: "দয়া করে ছাত্র/ছাত্রীর গ্রামের নাম লিখুন",
      }));
    }
    if (editInputField.student_post_office === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_post_office: "দয়া করে ছাত্র/ছাত্রীর পোস্ট অফিসের নাম লিখুন",
      }));
    }
    if (editInputField.student_police_station === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_police_station:
          "দয়া করে ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম লিখুন",
      }));
    }
    if (editInputField.student_pin_code === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_pin_code: "দয়া করে ছাত্র/ছাত্রীর পিনকোড লিখুন",
      }));
    }
    if (editInputField.student_addmission_class === "") {
      formIsValid = false;
      setErrEditInputField((prevState) => ({
        ...prevState,
        student_addmission_class:
          "দয়া করে ছাত্র/ছাত্রীর ভর্তি হওয়ার শ্রেনী বেছে নিন",
      }));
    }
    if (editInputField.student_previous_class !== "FIRST TIME ADDMISSION") {
      if (editInputField.student_previous_class_year === "") {
        formIsValid = false;
        setErrEditInputField((prevState) => ({
          ...prevState,
          student_previous_class_year:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের শ্রেনীর বছর লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (editInputField.student_previous_school === "") {
        formIsValid = false;
        setErrEditInputField((prevState) => ({
          ...prevState,
          student_previous_school:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (editInputField.student_previous_student_id === "") {
        formIsValid = false;
        setErrEditInputField((prevState) => ({
          ...prevState,
          student_previous_student_id:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের ১৪ সংখ্যার স্টুডেন্ট আইডিটি লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
    }
    return formIsValid;
  };

  const delEntry = async (id) => {
    setLoader(true);
    await deleteDoc(doc(firestore, "admission", id))
      .then(() => {
        toast.success("You Application Deleted successfully");
        setShowSearchedResult(false);
        setLoader(false);
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
        toast.error("Failed to delete Application");
      });
  };
  const [ageStatus, setAgeStatus] = useState("");
  const [birthdayStatus, setBirthdayStatus] = useState(false);
  const [calcAge, setCalcAge] = useState(5);
  const calculateAge = (inputDate) => {
    const birthDate = new Date(inputDate);
    const today = new Date();

    const month = today.getMonth() + 1;
    let year = today.getFullYear();
    if (month > 3) {
      year = year + 1;
    } else {
      year = year;
    }

    // Validate if the birth date is in the future
    if (birthDate > today) {
      setAgeStatus("The birth date cannot be in the future.");
      return;
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

    // Prepare age status message
    const ageMessage = `The age is ${years} years, ${months} months, and ${days} days.`;

    // Check if age is equal or above 5 years
    if (
      years > 5 ||
      (years === 5 && months > 0) ||
      (years === 5 && months === 0 && days > 0)
    ) {
      setAgeStatus(ageMessage);
    } else {
      setAgeStatus(ageMessage);
    }
    setCalcAge(years);
    if (years >= 5) {
      setBirthdayStatus(true);
    } else {
      setBirthdayStatus(false);
    }
  };
  const [validStudentClass, setValidStudentClass] = useState(false);
  const validateAge = (students_class) => {
    const validAge = classWiseAge.filter(
      (item) => item.className === students_class
    )[0].age;
    if (validAge === calcAge) {
      setValidStudentClass(true);
    } else {
      setValidStudentClass(false);
    }
  };
  useEffect(() => {
    //eslint-disable-next-line
  }, [
    inputField,
    editInputField,
    errEditInputField,
    errInputField,
    applicationFormState,
    admissionID,
  ]);
  useEffect(() => {
    getAdmissionStatus();
    // validateAge(inputField.student_addmission_class);
    //eslint-disable-next-line
  }, []);

  return (
    <div className="container ben">
      {loader ? <Loader /> : null}
      <h3 className="timesNewRoman">WELCOME TO {SCHOOLNAME}</h3>
      <h3 className="timesNewRoman">ADMISSION SECTION</h3>

      {admissionStatus && (
        <button
          type="button"
          className={`btn btn-${showForm ? "warning" : "success"} m-2`}
          onClick={() => {
            setShowForm(!showForm);
            setShowUpdateForm(false);
            setAplicationNo("");
            setMobileNumber("");
            setShowSearchedResult(false);
            setShowEditForm(false);
          }}
        >
          {showForm ? "Close Form" : "Fillup Form"}
        </button>
      )}
      <button
        type="button"
        className={`btn btn-${showUpdateForm ? "warning" : "primary"} m-2`}
        onClick={() => {
          setShowUpdateForm(!showUpdateForm);
          setShowForm(false);
          setShowSearchedResult(false);
          setShowEditForm(false);
          setAplicationNo("");
          setMobileNumber("");
        }}
      >
        {showUpdateForm ? "Close Form" : "Edit / Print Filled Form"}
      </button>
      {showForm && admissionStatus && (
        <div className="my-4">
          <div className="my-4">
            <h5 className="text-danger">* চিহ্ন দেওয়া অংশগুলি আবশ্যিক।</h5>
            <h5 className="text-danger">
              *** যে অংশগুলি বাংলায় বলা আছে শুধুমাত্র সেইগুলিই বাংলায় করবেন বাকি
              সমস্ত অংশ ইংরাজীতে লিখবেন।
            </h5>
            <h5 className="text-danger ben">
              ** অনুগ্রহ করে ফর্ম ফিলাপের সময় আপনার ছাত্র/ছাত্রীর সমস্ত
              প্রয়োজনীয় ডকুমেন্টস আপনার সাথে রাখুন।
            </h5>
            <h5 className="text-danger">
              *** ফর্ম ফিলাপের পর প্রদত্ত অ্যাপ্লিকেশন নাম্বার অবশ্যই আপনার কাছে
              সংরক্ষিত রাখবেন।
            </h5>
            <h3 className="text-primary timesNewRoman">ADMISSION FORM</h3>
          </div>
          <div className="text-center text-black">
            <form
              action=""
              method="post"
              className="row mx-auto"
              autoComplete="off"
              onSubmit={submitData}
            >
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_beng_name}
                  placeholder="ছাত্র/ছাত্রীর বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.student_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.student_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর ইংরাজীতে নাম*
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_eng_name}
                  placeholder="ছাত্র/ছাত্রীর ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.student_eng_name.length > 0 && (
                  <span className="error">
                    {errInputField.student_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জন্ম তারিখ*</label>
                <input
                  type="date"
                  className="form-control"
                  id="student_birthday"
                  name="student_birthday"
                  placeholder="ছাত্র/ছাত্রীর জন্ম তারিখ"
                  defaultValue={getCurrentDateInput(
                    inputField.student_birthday
                  )}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_birthday: getSubmitDateInput(e.target.value),
                    });
                    // calculateAge(e.target.value);
                    // validateAge(inputField.student_addmission_class)
                  }}
                />
                {/* {ageStatus.length > 0 && birthdayStatus && validStudentClass ? (
                  <p className="text-success m-0 p-0">{ageStatus}</p>
                ) : (
                  <p className="text-danger m-0 p-0">{ageStatus}</p>
                )}
                {validStudentClass?(
                  <p className="text-success m-0 p-0">Student Valid!</p>
                ) : (
                  <p className="text-danger m-0 p-0">Student Need to Check!</p>
                )} */}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর আধার নাম্বার</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_aadhaar}
                  placeholder="ছাত্র/ছাত্রীর আধার নাম্বার"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_aadhaar: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর লিঙ্গ*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_gender"
                  defaultValue={inputField.student_gender}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_gender: e.target.value,
                    });
                  }}
                >
                  <option value="">লিঙ্গ বেছে নিন</option>
                  <option value={"BOYS"}>ছেলে</option>
                  <option value={"GIRLS"}>মেয়ে</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errInputField.student_gender.length > 0 && (
                  <span className="error">{errInputField.student_gender}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের মোবাইল নাম্বার*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={10}
                  value={inputField.student_mobile}
                  placeholder="অভিভাবকের মোবাইল নাম্বার"
                  className="form-control"
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_mobile: setInputNumberMaxLength(
                        e.target.value,
                        10
                      ),
                    });
                  }}
                />
                {errInputField.student_mobile.length > 0 && (
                  <span className="error">{errInputField.student_mobile}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.father_beng_name}
                  placeholder="পিতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      father_beng_name: e.target.value,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.father_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.father_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.father_eng_name}
                  placeholder="পিতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      father_eng_name: e.target.value,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.father_eng_name.length > 0 && (
                  <span className="error">{errInputField.father_eng_name}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.mother_beng_name}
                  placeholder="মাতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      mother_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.mother_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.mother_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.mother_eng_name}
                  placeholder="মাতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      mother_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.mother_eng_name.length > 0 && (
                  <span className="error">{errInputField.mother_eng_name}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.guardian_beng_name}
                  placeholder="অভিভাবকের বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.guardian_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.guardian_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.guardian_eng_name}
                  placeholder="অভিভাবকের ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.guardian_eng_name.length > 0 && (
                  <span className="error">
                    {errInputField.guardian_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর ধর্ম*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_religion"
                  defaultValue={inputField.student_religion}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_religion: e.target.value,
                    });
                  }}
                >
                  <option value="">ধর্ম বেছে নিন</option>
                  <option value={"HINDU"}>হিন্দু</option>
                  <option value={"ISLAM"}>ইসলাম</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errInputField.student_religion.length > 0 && (
                  <span className="error">
                    {errInputField.student_religion}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জাতি*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_race"
                  defaultValue={inputField.student_race}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_race: e.target.value,
                    });
                  }}
                >
                  <option value="">জাতি বেছে নিন</option>
                  <option value={"GENERAL"}>GENERAL</option>
                  <option value={"OBC-A"}>OBC-A</option>
                  <option value={"OBC-B"}>OBC-B</option>
                  <option value={"SC"}>SC</option>
                  <option value={"ST"}>ST</option>
                </select>
                {errInputField.student_race.length > 0 && (
                  <span className="error">{errInputField.student_race}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রী বি.পি.এল. কিনা? *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_bpl_status"
                  defaultValue={inputField.student_bpl_status}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_bpl_status: e.target.value,
                    });
                    if (e.target.value === "NO") {
                      setInputField({
                        ...inputField,
                        student_bpl_status: e.target.value,
                        student_bpl_number: "",
                      });
                    }
                  }}
                >
                  <option value="">বি.পি.এল. কিনা?</option>
                  <option value={"YES"}>হ্যাঁ</option>
                  <option value={"NO"}>না</option>
                </select>
              </div>
              {inputField.student_bpl_status === "YES" && (
                <div className="mb-3 col-md-4">
                  <label className="form-label">
                    অভিভাবকের বি.পি.এল. নাম্বার *
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={inputField.student_bpl_number}
                    placeholder="অভিভাবকের বি.পি.এল. নাম্বার"
                    className="form-control"
                    onChange={(e) =>
                      setInputField({
                        ...inputField,
                        student_bpl_number: e.target.value,
                      })
                    }
                  />
                  {errInputField.student_bpl_number.length > 0 && (
                    <span className="error">
                      {errInputField.student_bpl_number}
                    </span>
                  )}
                </div>
              )}
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর গ্রামের নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_village}
                  placeholder="ছাত্র/ছাত্রীর গ্রামের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_village: e.target.value,
                    })
                  }
                />
                {errInputField.student_village.length > 0 && (
                  <span className="error">{errInputField.student_village}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_post_office}
                  placeholder="ছাত্র/ছাত্রীর পোস্ট অফিসের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_post_office: e.target.value,
                    })
                  }
                />
                {errInputField.student_post_office.length > 0 && (
                  <span className="error">
                    {errInputField.student_post_office}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_police_station}
                  placeholder="ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_police_station: e.target.value,
                    })
                  }
                />
                {errInputField.student_police_station.length > 0 && (
                  <span className="error">
                    {errInputField.student_police_station}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর পিনকোড*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={6}
                  value={inputField.student_pin_code}
                  placeholder="ছাত্র/ছাত্রীর পিনকোড"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_pin_code: setInputNumberMaxLength(
                        e.target.value,
                        6
                      ),
                    })
                  }
                />
                {errInputField.student_pin_code.length > 0 && (
                  <span className="error">
                    {errInputField.student_pin_code}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4  mx-auto">
                <label className="form-label">
                  ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_addmission_class"
                  defaultValue={inputField.student_addmission_class}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_addmission_class: e.target.value,
                    });
                    // validateAge(e.target.value)
                  }}
                >
                  <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                  <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                  <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                  <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                  <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                </select>
                {errInputField.student_addmission_class.length > 0 && (
                  <span className="error">
                    {errInputField.student_addmission_class}
                  </span>
                )}
              </div>
              <hr className="text-danger" />
              <h4 className="text-danger">
                *** এই অংশ যদি ছাত্র/ছাত্রী অন্য স্কুল থেকে ট্রান্সফার নিয়ে আসে
                সেটির জন্য
              </h4>
              <div
                className="rounded rounded-2 p-2 m-2 row"
                style={{ backgroundColor: "pink" }}
              >
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের শ্রেণী *
                  </label>
                  <select
                    className="form-select"
                    aria-label=".form-select-sm example"
                    required
                    id="student_previous_class"
                    defaultValue={inputField.student_previous_class}
                    onChange={(e) => {
                      setInputField({
                        ...inputField,
                        student_previous_class: e.target.value,
                      });
                    }}
                  >
                    <option value="FIRST TIME ADDMISSION">
                      শ্রেণী বেছে নিন
                    </option>
                    <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                    <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                    <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                    <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                    <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বর্ষ *
                  </label>
                  <input
                    type="number"
                    name=""
                    id=""
                    value={inputField.student_previous_class_year}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বর্ষ"
                    className="form-control"
                    onChange={(e) => {
                      if (e.target.value.length <= 4) {
                        setInputField({
                          ...inputField,
                          student_previous_class_year: e.target.value,
                        });
                      }
                    }}
                  />
                  {errInputField.student_previous_class_year.length > 0 && (
                    <span className="error">
                      {errInputField.student_previous_class_year}
                    </span>
                  )}
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি *
                  </label>
                  <input
                    type="number"
                    name=""
                    id=""
                    value={inputField.student_previous_student_id}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি"
                    className="form-control"
                    onChange={(e) => {
                      setInputField({
                        ...inputField,
                        student_previous_student_id: setInputNumberMaxLength(
                          e.target.value,
                          14
                        ),
                      });
                    }}
                  />
                  {errInputField.student_previous_student_id.length > 0 && (
                    <span className="error">
                      {errInputField.student_previous_student_id}
                    </span>
                  )}
                </div>
                <div className="mb-3 col-md-6 mx-auto">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা *
                  </label>

                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="7"
                    value={inputField.student_previous_school}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা"
                    className="form-control"
                    onChange={(e) =>
                      setInputField({
                        ...inputField,
                        student_previous_school: e.target.value,
                      })
                    }
                  ></textarea>
                  {errInputField.student_previous_school.length > 0 && (
                    <span className="error">
                      {errInputField.student_previous_school}
                    </span>
                  )}
                </div>
              </div>
              <hr className="text-danger" />
              <div className="mb-3 col-md-4 mx-auto">
                <button
                  type="submit"
                  className="btn btn-success m-2"
                  onClick={submitData}
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className="btn btn-danger m-2"
                  onClick={() => {
                    setInputField({
                      id: "",
                      student_beng_name: "",
                      student_eng_name: "",
                      father_beng_name: "",
                      father_eng_name: "",
                      mother_beng_name: "",
                      mother_eng_name: "",
                      guardian_beng_name: "",
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
                      student_addmission_dateAndTime: Date.now(),
                    });
                    if (typeof window !== undefined) {
                      document.getElementById("student_gender").value = "";
                      document.getElementById("student_birthday").value = `${
                        new Date().getFullYear() - 5
                      }-01-01`;
                      document.getElementById("student_religion").value = "";
                      document.getElementById("student_race").value = "";
                      document.getElementById("student_bpl_status").value = "";
                      document.getElementById(
                        "student_addmission_class"
                      ).value = "";
                      document.getElementById("student_previous_class").value =
                        "FIRST TIME ADDMISSION";
                    }
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="my-4 mx-auto">
          <h5 className="text-danger ben">
            *** অনুগ্রহ করে ফর্ম ফিলাপের সময় আপনাকে প্রদত্ত ছাত্র/ছাত্রীর
            প্রদত্ত অ্যাপ্লিকেশন নাম্বারটি নিজের কাছে রাখুন। e.g.
            USPRYS-ONLINE-2024-01
          </h5>
          <div className="my-4 mx-auto d-flex justify-content-center align-items-center">
            <form method="post" className="mb-3 col-md-6">
              <div className="mb-3">
                <label className="form-label">
                  অ্যাপ্লিকেশন নাম্বার লিখুন*
                </label>
                <input
                  type="text"
                  value={applicationNo}
                  placeholder="অ্যাপ্লিকেশন নাম্বার লিখুন"
                  className="form-control"
                  onChange={(e) => setAplicationNo(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  অ্যাপ্লিকেশনে দেওয়া মোবাইল নাম্বার লিখুন*
                </label>
                <input
                  type="number"
                  value={mobileNumber}
                  placeholder="অ্যাপ্লিকেশনে দেওয়া মোবাইল নাম্বার লিখুন"
                  className="form-control"
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              <br />
              {showErr && (
                <span className="error">
                  দয়া করে অ্যাপ্লিকেশন নাম্বার ও মোবাইল নাম্বার লিখুন
                </span>
              )}
              <br />
              <button
                type="submit"
                className="btn btn-success m-2"
                onClick={(e) => {
                  e.preventDefault();
                  setShowErr(true);
                  if (applicationNo.length > 0 || mobileNumber.length > 0) {
                    searchApplication();
                    setShowErr(false);
                  } else {
                    setShowErr(true);
                  }
                }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
      {formSubmitted && (
        <div className="my-5">
          <h3 className="text-success">
            Congrats! আপনার ফর্মটি সাফল্যের সাথে আমাদের কাছে জমা পড়ে গেছে!
          </h3>
          <h3 className="text-success">
            অনুগ্রহ করে লিখে রাখবেন আপনার অ্যাপ্লিকেশন নাম্বারটি হলো।
          </h3>
          <div className="bg-light  mx-auto p-4 rounded">
            <div className="float-end">
              {!success ? (
                <div>
                  <BsClipboard
                    onClick={() => {
                      navigator.clipboard.writeText(admissionID);
                      setSuccess(true);
                      setTimeout(() => setSuccess(false), 1500);
                    }}
                    size={30}
                    color="skyblue"
                  />
                  <h5 className="text-info my-1">Copy</h5>
                </div>
              ) : (
                <div>
                  <BsClipboard2Check
                    onClick={() => {
                      navigator.clipboard.writeText(admissionID);
                      setSuccess(true);
                      setTimeout(() => setSuccess(false), 1500);
                    }}
                    size={30}
                    color="green"
                  />
                  <h5 className="text-success my-1">
                    Application Number Copied
                  </h5>
                </div>
              )}
            </div>
            <h1 className="text-primary text-center timesNewRoman">
              {admissionID}
            </h1>
            {success ? (
              <h5 className="text-success" suppressHydrationWarning={true}>
                Token Coppied to Clipboard
              </h5>
            ) : null}
            <div className="mx-auto mt-2">
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => {
                  setShowUpdateForm(false);
                  setShowForm(false);
                  setFormSubmitted(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
                  <button
                    type="button"
                    className="btn btn-warning btn-sm m-2"
                    onClick={() => {
                      setEditInputField(searchedApplicationNo);
                      setSearchedOrgApplicationNo(searchedApplicationNo);
                      setShowEditForm(true);
                      setShowSearchedResult(false);
                      setShowUpdateForm(false);
                      if (typeof window !== "undefined") {
                        setTimeout(() => {
                          document.getElementById("student_birthday").value =
                            getCurrentDateInput(
                              searchedApplicationNo?.student_birthday
                            );
                        }, 500);
                      }
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm m-2"
                    onClick={() => {
                      // eslint-disable-next-line no-alert
                      if (
                        window.confirm(
                          "Are you sure, you want to delete your Application?"
                        )
                      ) {
                        delEntry(searchedApplicationNo?.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tbody>
          </table>
        </div>
      )}
      {showEditForm && (
        <div className="my-4">
          <h5 className="text-danger">* চিহ্ন দেওয়া অংশগুলি আবশ্যিক।</h5>
          <h5 className="text-danger">
            *** যে অংশগুলি বাংলায় বলা আছে শুধুমাত্র সেইগুলিই বাংলায় করবেন বাকি
            সমস্ত অংশ ইংরাজীতে লিখবেন।
          </h5>
          <h5 className="text-danger ben">
            ** অনুগ্রহ করে ফর্ম ফিলাপের সময় আপনার ছাত্র/ছাত্রীর সমস্ত প্রয়োজনীয়
            ডকুমেন্টস আপনার সাথে রাখুন।
          </h5>

          <div className="my-4">
            <h3 className="text-primary">UPDATE ADMISSION FORM</h3>
          </div>
          <div className="text-center text-black">
            <form
              action=""
              method="post"
              className="row mx-auto"
              autoComplete="off"
            >
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_beng_name}
                  placeholder="ছাত্র/ছাত্রীর বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর ইংরাজীতে নাম*
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_eng_name}
                  placeholder="ছাত্র/ছাত্রীর ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জন্ম তারিখ*</label>
                <input
                  type="date"
                  className="form-control"
                  id="student_birthday"
                  name="student_birthday"
                  placeholder="ছাত্র/ছাত্রীর জন্ম তারিখ"
                  defaultValue={getCurrentDateInput(
                    editInputField.student_birthday
                  )}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_birthday: getSubmitDateInput(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর আধার নাম্বার</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_aadhaar}
                  placeholder="ছাত্র/ছাত্রীর আধার নাম্বার"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_aadhaar: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর লিঙ্গ*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_gender"
                  defaultValue={editInputField.student_gender}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_gender: e.target.value,
                    });
                  }}
                >
                  <option value="">লিঙ্গ বেছে নিন</option>
                  <option value={"BOYS"}>ছেলে</option>
                  <option value={"GIRLS"}>মেয়ে</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errEditInputField.student_gender.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_gender}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের মোবাইল নাম্বার*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={10}
                  value={editInputField.student_mobile}
                  placeholder="অভিভাবকের মোবাইল নাম্বার"
                  className="form-control"
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_mobile: setInputNumberMaxLength(
                        e.target.value,
                        10
                      ),
                    });
                  }}
                />
                {errEditInputField.student_mobile.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_mobile}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.father_beng_name}
                  placeholder="পিতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      father_beng_name: e.target.value,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.father_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.father_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.father_eng_name}
                  placeholder="পিতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      father_eng_name: e.target.value,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.father_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.father_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.mother_beng_name}
                  placeholder="মাতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      mother_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.mother_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.mother_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.mother_eng_name}
                  placeholder="মাতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      mother_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.mother_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.mother_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.guardian_beng_name}
                  placeholder="অভিভাবকের বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.guardian_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.guardian_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.guardian_eng_name}
                  placeholder="অভিভাবকের ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.guardian_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.guardian_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর ধর্ম*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_religion"
                  defaultValue={editInputField.student_religion}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_religion: e.target.value,
                    });
                  }}
                >
                  <option value="">ধর্ম বেছে নিন</option>
                  <option value={"HINDU"}>হিন্দু</option>
                  <option value={"ISLAM"}>ইসলাম</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errEditInputField.student_religion.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_religion}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জাতি*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_race"
                  defaultValue={editInputField.student_race}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_race: e.target.value,
                    });
                  }}
                >
                  <option value="">জাতি বেছে নিন</option>
                  <option value={"GENERAL"}>GENERAL</option>
                  <option value={"OBC-A"}>OBC-A</option>
                  <option value={"OBC-B"}>OBC-B</option>
                  <option value={"SC"}>SC</option>
                  <option value={"ST"}>ST</option>
                </select>
                {errEditInputField.student_race.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_race}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রী বি.পি.এল. কিনা? *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_bpl_status"
                  defaultValue={editInputField.student_bpl_status}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_bpl_status: e.target.value,
                    });
                    if (e.target.value === "NO") {
                      setEditInputField({
                        ...editInputField,
                        student_bpl_status: e.target.value,
                        student_bpl_number: "",
                      });
                    }
                  }}
                >
                  <option value="">বি.পি.এল. কিনা?</option>
                  <option value={"YES"}>হ্যাঁ</option>
                  <option value={"NO"}>না</option>
                </select>
              </div>
              {inputField.student_bpl_status === "YES" && (
                <div className="mb-3 col-md-4">
                  <label className="form-label">
                    অভিভাবকের বি.পি.এল. নাম্বার *
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={editInputField.student_bpl_number}
                    placeholder="অভিভাবকের বি.পি.এল. নাম্বার"
                    className="form-control"
                    onChange={(e) =>
                      setEditInputField({
                        ...editInputField,
                        student_bpl_number: e.target.value,
                      })
                    }
                  />
                  {errEditInputField.student_bpl_number.length > 0 && (
                    <span className="error">
                      {errEditInputField.student_bpl_number}
                    </span>
                  )}
                </div>
              )}
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর গ্রামের নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_village}
                  placeholder="ছাত্র/ছাত্রীর গ্রামের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_village: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_village.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_village}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_post_office}
                  placeholder="ছাত্র/ছাত্রীর পোস্ট অফিসের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_post_office: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_post_office.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_post_office}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_police_station}
                  placeholder="ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_police_station: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_police_station.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_police_station}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর পিনকোড*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={6}
                  value={editInputField.student_pin_code}
                  placeholder="ছাত্র/ছাত্রীর পিনকোড"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_pin_code: setInputNumberMaxLength(
                        e.target.value,
                        6
                      ),
                    })
                  }
                />
                {errEditInputField.student_pin_code.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_pin_code}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4  mx-auto">
                <label className="form-label">
                  ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_addmission_class"
                  defaultValue={editInputField.student_addmission_class}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_addmission_class: e.target.value,
                    });
                  }}
                >
                  <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                  <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                  <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                  <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                  <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                </select>
                {errEditInputField.student_addmission_class.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_addmission_class}
                  </span>
                )}
              </div>
              <hr className="text-danger" />
              <p className="text-danger">
                *** এই অংশ যদি ছাত্র/ছাত্রী অন্য স্কুল থেকে ট্রান্সফার নিয়ে আসে
                সেটির জন্য
              </p>
              <div
                className="rounded rounded-2 p-2 m-2 row"
                style={{ backgroundColor: "pink" }}
              >
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের শ্রেণী *
                  </label>
                  <select
                    className="form-select"
                    aria-label=".form-select-sm example"
                    required
                    id="student_previous_class"
                    defaultValue={editInputField.student_previous_class}
                    onChange={(e) => {
                      setEditInputField({
                        ...editInputField,
                        student_previous_class: e.target.value,
                      });
                    }}
                  >
                    <option value="FIRST TIME ADDMISSION">
                      শ্রেণী বেছে নিন
                    </option>
                    <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                    <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                    <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                    <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                    <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বর্ষ *
                  </label>
                  <input
                    type="number"
                    name=""
                    id=""
                    value={editInputField.student_previous_class_year}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বর্ষ"
                    className="form-control"
                    onChange={(e) => {
                      setEditInputField({
                        ...editInputField,
                        student_previous_class_year: setInputNumberMaxLength(
                          e.target.value,
                          4
                        ),
                      });
                    }}
                  />
                  {errEditInputField.student_previous_class_year.length > 0 && (
                    <span className="error">
                      {errEditInputField.student_previous_class_year}
                    </span>
                  )}
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি *
                  </label>
                  <input
                    type="number"
                    name=""
                    id=""
                    value={editInputField.student_previous_student_id}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের স্টুডেন্ট আইডি"
                    className="form-control"
                    onChange={(e) => {
                      setEditInputField({
                        ...editInputField,
                        student_previous_student_id: setInputNumberMaxLength(
                          e.target.value,
                          14
                        ),
                      });
                    }}
                  />
                  {errEditInputField.student_previous_student_id.length > 0 && (
                    <span className="error">
                      {errEditInputField.student_previous_student_id}
                    </span>
                  )}
                </div>
                <div className="mb-3 col-md-6 mx-auto">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা *
                  </label>

                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="7"
                    value={editInputField.student_previous_school}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা"
                    className="form-control"
                    onChange={(e) =>
                      setEditInputField({
                        ...editInputField,
                        student_previous_school: e.target.value,
                      })
                    }
                  ></textarea>
                  {errEditInputField.student_previous_school.length > 0 && (
                    <span className="error">
                      {errEditInputField.student_previous_school}
                    </span>
                  )}
                </div>
              </div>
              <hr className="text-danger" />
              <div className="mb-3 col-md-4 mx-auto">
                <button
                  type="submit"
                  className="btn btn-success m-2"
                  onClick={updateData}
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className="btn btn-danger m-2"
                  onClick={() => {
                    setEditInputField({
                      id: "",
                      student_beng_name: "",
                      student_eng_name: "",
                      father_beng_name: "",
                      father_eng_name: "",
                      mother_beng_name: "",
                      mother_eng_name: "",
                      guardian_beng_name: "",
                      guardian_eng_name: "",
                      student_birthday: ``,
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
                    setShowEditForm(false);
                    if (typeof window !== undefined) {
                      document.getElementById("student_gender").value = "";
                      document.getElementById(
                        "student_birthday"
                      ).value = `01-01-${new Date().getFullYear() - 5}`;
                      document.getElementById("student_religion").value = "";
                      document.getElementById("student_race").value = "";
                      document.getElementById("student_bpl_status").value = "";
                      document.getElementById(
                        "student_addmission_class"
                      ).value = "";
                      document.getElementById("student_previous_class").value =
                        "FIRST TIME ADDMISSION";
                    }
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
