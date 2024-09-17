"use client";
import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";
import useWindowSize from "@rooks/use-window-size";
import schoolLogo from "@/../public/assets/images/logoweb.png";
import { SCHOOLBENGALIADDRESS, SCHOOLBENGALINAME } from "@/modules/constants";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/context/FirbaseContext";
import { useGlobalContext } from "../../context/Store";

export default function DownloadAdmissionForm() {
  const { applicationFormState } = useGlobalContext();
  const { innerWidth, innerHeight } = useWindowSize();
  const [id, setId] = useState("");
  const [student_beng_name, setStudent_beng_name] = useState("");
  const [student_eng_name, setStudent_eng_name] = useState("");
  const [father_beng_name, setFather_beng_name] = useState("");
  const [father_eng_name, setFather_eng_name] = useState("");
  const [mother_beng_name, setMother_beng_name] = useState("");
  const [mother_eng_name, setMother_eng_name] = useState("");
  const [guardian_beng_name, setGuardian_beng_name] = useState("");
  const [guardian_eng_name, setGuardian_eng_name] = useState("");
  const [student_birthday, setStudent_birthday] = useState("");
  const [student_gender, setStudent_gender] = useState("");
  const [student_mobile, setStudent_mobile] = useState("");
  const [student_aadhaar, setStudent_aadhaar] = useState("");
  const [student_religion, setStudent_religion] = useState("");
  const [student_race, setStudent_race] = useState("");
  const [student_bpl_status, setStudent_bpl_status] = useState("");
  const [student_bpl_number, setStudent_bpl_number] = useState("");
  const [student_village, setStudent_village] = useState("");
  const [student_post_office, setStudent_post_office] = useState("");
  const [student_police_station, setStudent_police_station] = useState("");
  const [student_pin_code, setStudent_pin_code] = useState("");
  const [student_addmission_class, setStudent_addmission_class] = useState("");
  const [student_previous_class, setStudent_previous_class] = useState("");
  const [student_previous_class_year, setStudent_previous_class_year] =
    useState("");
  const [student_previous_school, setStudent_previous_school] = useState("");
  const [student_addmission_date, setStudent_addmission_date] = useState("");
  const [student_addmission_dateAndTime, setStudent_addmission_dateAndTime] =
    useState("");

  const searchApplication = async () => {
    console.log(applicationFormState);
    setId(applicationFormState.id);
    setStudent_beng_name(applicationFormState.student_beng_name);
    setStudent_eng_name(applicationFormState.student_eng_name);
    setFather_beng_name(applicationFormState.father_beng_name);
    setFather_eng_name(applicationFormState.father_eng_name);
    setMother_beng_name(applicationFormState.mother_beng_name);
    setMother_eng_name(applicationFormState.mother_eng_name);
    setGuardian_beng_name(applicationFormState.guardian_beng_name);
    setGuardian_eng_name(applicationFormState.guardian_eng_name);
    setStudent_birthday(applicationFormState.student_birthday);
    setStudent_gender(applicationFormState.student_gender);
    setStudent_mobile(applicationFormState.student_mobile);
    setStudent_aadhaar(applicationFormState.student_aadhaar);
    setStudent_religion(applicationFormState.student_religion);
    setStudent_race(applicationFormState.student_race);
    setStudent_bpl_status(applicationFormState.student_bpl_status);
    setStudent_bpl_number(applicationFormState.student_bpl_number);
    setStudent_village(applicationFormState.student_village);
    setStudent_post_office(applicationFormState.student_post_office);
    setStudent_police_station(applicationFormState.student_police_station);
    setStudent_pin_code(applicationFormState.student_pin_code);
    setStudent_addmission_class(applicationFormState.student_addmission_class);
    setStudent_previous_class(applicationFormState.student_previous_class);
    setStudent_previous_class_year(
      applicationFormState.student_previous_class_year
    );
    setStudent_previous_school(applicationFormState.student_previous_school);
    setStudent_addmission_date(applicationFormState.student_addmission_date);
    setStudent_addmission_dateAndTime(
      applicationFormState.student_addmission_dateAndTime
    );
  };
  const date = new Date(student_addmission_dateAndTime);
  const scrWidth = (w) => (w * innerWidth) / 100;
  const scrHeight = (w) => (w * innerHeight) / 100;
  useEffect(() => {
    searchApplication();
  }, [applicationFormState]);
  return (
    <>
      {applicationFormState.id !== "" && (
        <Document title={`Apllication Form of ${student_eng_name}`}>
          <Page size="A4" style={styles.page}>
            <View style={styles.headSection}>
              <Image src={schoolLogo.src} alt="logo" style={{ width: 70 }} />
              <View style={[styles.schView, { width: scrWidth(40) }]}>
                <Text style={styles.schName}>{SCHOOLBENGALINAME}</Text>

                <Text style={styles.schAddress}>{SCHOOLBENGALIADDRESS} </Text>
              </View>

              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?data=UTTAR SEHAGORI PRIMARY SCHOOL: STUDENT NAME:${" "}${student_eng_name}, Father's name:${" "}${father_eng_name},Mother's name:${" "}${mother_eng_name}, Mobile Number:${" "}${student_mobile}, Gender:${" "}${student_gender},  Addmission Class:${" "} ${student_addmission_class}, Application Number:${" "} ${id}, Application Date:${" "} ${student_addmission_date}`}
                style={{ width: 70 }}
                alt="qr-code"
              />
            </View>
            <View style={styles.admView}>
              <Text style={styles.admText}>
                ভর্তির আবেদন পত্র (Online Admission)
              </Text>
              <View style={styles.paraView}>
                <Text style={styles.engparaText}>
                  Application Form No.: {id}
                </Text>
                <Text style={[styles.engparaText, { paddingLeft: 30 }]}>
                  Application Date:{" "}
                  {`${date.getDate()}-${date.getMonth()}-${date.getFullYear()} At ${
                    date.getHours() > 12
                      ? date.getHours() - 12
                      : date.getHours()
                  }:${date.getMinutes()}:${date.getSeconds()} ${
                    date.getHours() > 12 ? "PM" : "AM"
                  }`}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  ছাত্র / ছাত্রীর নাম (বাংলায়): {student_beng_name}
                </Text>
                <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                  (ইংরাজীতে): {student_eng_name}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  অভিভাবকের মোবাইল নাম্বার: {student_mobile}
                </Text>
                <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                  ছাত্র/ছাত্রীর লিঙ্গ: {student_gender}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  জন্ম তারিখ: {student_birthday}
                </Text>
                <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                  আধার নং: {student_aadhaar}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  পিতার নাম (বাংলায়): {father_beng_name}
                </Text>
                <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                  (ইংরাজীতে): {father_eng_name}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  মাতার নাম (বাংলায়): {mother_beng_name}
                </Text>
                <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                  (ইংরাজীতে): {mother_eng_name}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  অভিভাবকের নাম (বাংলায়): {guardian_beng_name}
                </Text>
                <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                  (ইংরাজীতে): {guardian_eng_name}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  ছাত্র/ছাত্রীর ধর্ম: {student_religion}
                </Text>
                <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                  ছাত্র/ছাত্রীর জাতি: {student_race}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  ছাত্র/ছাত্রী বি.পি.এল. কিনা?: {student_bpl_status}
                </Text>
                {student_bpl_status === "YES" && (
                  <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                    অভিভাবকের বি.পি.এল. নাম্বার: {student_bpl_number}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.paraView,
                  { flexWrap: "wrap", width: scrWidth(55) },
                ]}
              >
                <Text style={styles.paraText}>
                  ছাত্র/ছাত্রীর ঠিকানা: Vill.: {student_village},P.O.:{" "}
                  {student_post_office},P.S.: {student_police_station}, PIN:
                  {student_pin_code}
                </Text>
              </View>
              <View style={styles.paraView}>
                <Text style={styles.paraText}>
                  ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী:{" "}
                  {student_addmission_class}
                </Text>
              </View>
              {student_previous_class !== "" && (
                <View style={styles.paraView}>
                  <Text style={styles.paraText}>
                    ছাত্র/ছাত্রীর পূর্বের শ্রেণী: {student_previous_class}
                  </Text>
                  <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                    ছাত্র/ছাত্রীর পূর্বের বর্ষ: {student_previous_class_year}
                  </Text>
                </View>
              )}
              {student_previous_class !== "" && (
                <View
                  style={[
                    styles.paraView,
                    { flexWrap: "wrap", width: scrWidth(55) },
                  ]}
                >
                  <Text style={styles.paraText}>
                    ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা:{" "}
                    {student_previous_school}
                  </Text>
                </View>
              )}
            </View>
          </Page>
        </Document>
      )}
    </>
  );
}
// Create styles
const styles = StyleSheet.create({
  page: {
    display: "flex",
    padding: 10,
  },
  headSection: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  schView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",

    textAlign: "center",
    marginBottom: 20,
  },
  schName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },
  schAddress: {
    fontSize: 10,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },

  admView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    alignContent: "center",
    textAlign: "center",
    marginTop: 10,
  },
  admText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },
  paraView: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 1,
    alignSelf: "flex-start",
  },
  paraText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },
  engparaText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
});
Font.register({
  family: "Kalpurush",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/kalpurush.ttf",
});
