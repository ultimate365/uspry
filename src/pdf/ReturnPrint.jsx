"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";

import tick from "@/images/tick.png";
import {
  BLOCK,
  BUILDING,
  CIRCLE,
  DRINKING_WATER,
  GIRLS_TOILET,
  HOI_DESIGNATION,
  HOI_MOBILE_NO,
  JLNO,
  KHATIAN_NO,
  MEDIUM,
  MOUZA,
  PLOT_NO,
  PO,
  PS,
  SCHNO,
  SCHOOL_AREA,
  SCHOOL_RECOGNITION_DATE,
  SCHOOLNAME,
  UDISE_CODE,
  VILL,
  WARD_NO,
} from "@/modules/constants";

/**
 * ReturnPrint
 * - Accepts `data` prop which can be:
 *    - an object { students, teachers, ... }
 *    - an array [ { students, teachers, ... } ] (will pick first item)
 *
 * Student data expected format (flat keys per grade), example:
 * students.pp.GeneralBoys, students.pp.GeneralGirls, students.pp.GeneralTotal
 * or fallback to students.pp.Boys / Girls / Total
 */

const BASE_FONT_SIZE = 8;
const HEADER_FONT_SIZE = 10;
const TITLE_FONT_SIZE = 12;
const width = 2480;
const height = 3508;
export default function ReturnPrint({ data }) {
  // support passing an array or single object
  const payload = Array.isArray(data) ? data[0] || {} : data || {};

  const {
    students = {},
    inspection = {},
    remarks = "",
    workingDays = "",
    teachers = [],
    year = "",
    id = "",
    month = "",
  } = payload;
  // Date display component (keeps earlier behavior)
  const DateDisplay = ({ dateString }) => {
    if (!dateString) return <Text style={styles.text}>-</Text>;
    const parts = dateString.split("-");
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.title2, { marginTop: 2 }]}>{parts[0]}</Text>
        <View style={styles.datePart}>
          <Text style={[styles.title2, styles.underlined]}>{parts[1]}</Text>
          <Text style={styles.title2}>{parts[2]}</Text>
        </View>
      </View>
    );
  };

  // Teacher table header (kept mostly same)
  const TeacherTableHeader = () => (
    <View style={[styles.tableStartView, styles.teacherHeader]}>
      <View style={[styles.colSerial]}>
        <Text style={styles.text}>Sl. No.</Text>
      </View>
      <View style={[styles.colName]}>
        <Text style={styles.text}>Name of Teacher</Text>
      </View>
      <View style={[styles.colDesignation]}>
        <Text style={styles.text4}>Desig-{"\n"}nation</Text>
      </View>
      <View style={[styles.colEducation]}>
        <Text style={styles.text4}>Educational{"\n"}Qualification</Text>
      </View>
      <View style={[styles.colDob]}>
        <Text style={styles.text}>
          Date{"\n"}of{"\n"}Birth
        </Text>
      </View>
      <View style={[styles.colJoining]}>
        <Text style={styles.text}>
          Joining{"\n"}date as{"\n"}approved{"\n"}teacher
        </Text>
      </View>
      <View style={[styles.colCurrentJoining]}>
        <Text style={styles.text}>
          Joining{"\n"}date in this{"\n"}school
        </Text>
      </View>
      <View style={[styles.colCast]}>
        <Text style={[styles.text, { fontSize: 9 }]}>
          S.C./ S.T./ O.B.C.-A/ O.B.C.-B/ PH
        </Text>
      </View>

      <View style={[styles.colCasualLeave]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.text}>Casual Leave</Text>
        </View>
        <View style={styles.splitSection}>
          <View style={[styles.splitCell, styles.borderRight]}>
            <Text style={styles.text}>In this month</Text>
          </View>
          <View style={styles.splitCell}>
            <Text style={styles.text}>From 1st Jan.</Text>
          </View>
        </View>
      </View>

      <View style={[styles.colOtherLeave]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.text}>Other Leave</Text>
        </View>
        <View style={styles.complexSection}>
          <View style={[styles.smallSplitCell, styles.borderRight]}>
            <Text style={styles.text4}>
              In{"\n"}this{"\n"}month
            </Text>
          </View>
          <View style={[styles.smallSplitCell, styles.borderRight]}>
            <Text style={styles.text4}>
              From{"\n"}1st{"\n"}Jan.
            </Text>
          </View>
          <View style={styles.leaveTypes}>
            <View style={styles.sectionHeader}>
              <Text style={styles.text}>From 1st Jan.</Text>
            </View>
            <View style={styles.leaveSplit}>
              <View style={[styles.leaveTypeCell, styles.borderRight]}>
                <Text style={styles.text4}>Full Pay</Text>
              </View>
              <View style={[styles.leaveTypeCell, styles.borderRight]}>
                <Text style={styles.text4}>Half Pay</Text>
              </View>
              <View style={[styles.leaveTypeCell, { borderRightWidth: 0 }]}>
                <Text style={styles.text4}>Without Pay</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.colWorkingDays]}>
        <Text style={styles.text5}>
          Total working days in this month {"\n"}({workingDays})
        </Text>
      </View>
      <View style={[styles.colSignature]}>
        <Text style={styles.text}>Full signature of teacher with date</Text>
      </View>
      <View style={[styles.colRemarks]}>
        <Text style={[styles.text5, { fontSize: 6 }]}>Remarks</Text>
      </View>
    </View>
  );

  return (
    // <PDFViewer
    //   style={{
    //     width: width / 3,
    //     height: height / 3,
    //   }}
    // >
    <Document
      style={styles.document}
      title={`${id || "Return"} Teachers Return`}
    >
      {/* Teacher Page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.titleMain}>
            HOWRAH DISTRICT PRIMARY SCHOOL COUNCIL
          </Text>
          <Text style={[styles.title, styles.sectionSpacing]}>
            MONTHLY RETURN OF SCHOOL
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoPair}>
              <Text style={styles.text}>U.Dise Code No.:</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {UDISE_CODE}
              </Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.text}>Contact No.: HT/</Text>
              <Text style={[styles.text, styles.strikethrough]}>TIC</Text>
              <Text style={styles.text}>:</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {" "}
                {HOI_MOBILE_NO}
              </Text>
              <Image
                alt={"tickmark"}
                source={tick.src}
                style={{
                  width: 10,
                  height: 10,
                  position: "absolute",
                  top: -10,
                  right: 65,
                }}
              />
            </View>
          </View>

          <View style={[styles.infoRow, styles.justifyEnd]}>
            <View style={styles.infoPair}>
              <Text style={[styles.textBold, { fontSize: HEADER_FONT_SIZE }]}>
                {" "}
                Month:
              </Text>
              <Text
                style={[
                  styles.textBold,
                  styles.underlinedDotted,
                  { fontSize: HEADER_FONT_SIZE },
                ]}
              >
                {`${month || ""} of ${year || ""}`}
              </Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.marginTop]}>
            <View style={styles.infoPair}>
              <Text style={styles.text}>Name of School:{"  "}</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {SCHOOLNAME}
              </Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={[styles.text, styles.strikethrough]}>Morn.</Text>
              <Text style={styles.text}>/Day Section time{"  "}</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                11 A.M. TO 4 P.M.
              </Text>
            </View>
            <Image
              alt={"tickmark"}
              source={tick.src}
              style={{
                width: 10,
                height: 10,
                position: "absolute",
                top: -10,
                right: 100,
              }}
            />
          </View>

          {/* more school info rows (kept same) */}
          <View style={[styles.infoRow]}>
            <View style={styles.infoPair}>
              <Text style={styles.text}>Vill:{"  "}</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {VILL}
              </Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.text}>P.O.:{"  "}</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {PO}
              </Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.text}>Panchayet Samity</Text>
              <Text style={[styles.text, styles.strikethrough]}>
                /Municipality/Municipal Corporation
              </Text>
              <Text style={styles.text}>{" :  "}</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {BLOCK}
              </Text>
            </View>
            <Image
              alt={"tickmark"}
              source={tick.src}
              style={{
                width: 10,
                height: 10,
                position: "absolute",
                top: -10,
                right: 200,
              }}
            />
          </View>

          <View style={[styles.infoRow]}>
            <View style={styles.infoPair}>
              <Text style={styles.text}>P.S.:{"  "}</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {PS}
              </Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.text}>G.P.:{"  "}</Text>
              <Text style={[styles.text, styles.strikethrough]}>Ward</Text>
              <Text style={styles.text}>{"  "}</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {WARD_NO}
              </Text>
              <Image
                alt={"tickmark"}
                source={tick.src}
                style={{
                  width: 10,
                  height: 10,
                  position: "absolute",
                  top: -7,
                  right: 90,
                }}
              />
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.text}>Mouza:&nbsp;&nbsp;</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {MOUZA}
              </Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.text}>J.L. No.:&nbsp;&nbsp;</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {JLNO}
              </Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.text}>School Sl. No.:&nbsp;&nbsp;</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {SCHNO}
              </Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.justifyStart]}>
            <View style={styles.infoPair}>
              <Text style={styles.text}>Circle:&nbsp;&nbsp;</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {CIRCLE}
              </Text>
            </View>
            <View style={[styles.infoPair, styles.paddingLeft]}>
              <Text style={styles.text}>Medium:&nbsp;&nbsp;</Text>
              <Text style={[styles.textBold, styles.underlinedDotted]}>
                {MEDIUM}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, styles.sectionSpacing]}>
            PART- 'A': PARTICULARS OF TEACHERS
          </Text>

          <View style={styles.pageMainView}>
            <View style={styles.headingView}>
              <TeacherTableHeader />

              {teachers.length > 0 &&
                teachers.map((teacher, index) => (
                  <React.Fragment key={teacher.id || index}>
                    <View style={styles.rowStartView}>
                      <View style={[styles.colSerial, styles.teacherDataCell]}>
                        <Text style={styles.title2}>{index + 1}</Text>
                      </View>
                      <View style={[styles.colName, styles.teacherDataCell]}>
                        <Text style={styles.title2}>
                          {`${teacher?.tname?.split(" ").join("\n")}\n(Ph: ${
                            teacher?.phone
                          })`}
                        </Text>
                      </View>
                      <View
                        style={[styles.colDesignation, styles.teacherDataCell]}
                      >
                        <Text style={styles.title2}>{teacher.desig}</Text>
                      </View>
                      <View
                        style={[styles.colEducation, styles.teacherDataCell]}
                      >
                        <Text style={styles.title2}>
                          {teacher.education}
                          {"\n"}
                          {teacher.training}
                        </Text>
                      </View>
                      <View style={[styles.colDob, styles.teacherDataCell]}>
                        <DateDisplay dateString={teacher.dob} />
                      </View>
                      <View style={[styles.colJoining, styles.teacherDataCell]}>
                        <DateDisplay dateString={teacher.doj} />
                      </View>
                      <View
                        style={[
                          styles.colCurrentJoining,
                          styles.teacherDataCell,
                        ]}
                      >
                        <DateDisplay dateString={teacher.dojnow} />
                      </View>
                      <View style={[styles.colCast, styles.teacherDataCell]}>
                        <Text style={styles.title2}>{teacher.cast}</Text>
                      </View>
                      <View
                        style={[
                          styles.colCasualLeaveSplit,
                          styles.teacherDataCell,
                        ]}
                      >
                        <Text style={styles.title2}>
                          {teacher.clThisMonth ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.colCasualLeaveSplit,
                          styles.teacherDataCell,
                        ]}
                      >
                        <Text style={styles.title2}>
                          {teacher.clThisYear ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.colOtherLeaveSplit,
                          styles.teacherDataCell,
                        ]}
                      >
                        <Text style={styles.title2}>
                          {teacher.olThisMonth ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.colOtherLeaveSplit,
                          styles.teacherDataCell,
                        ]}
                      >
                        <Text style={styles.title2}>
                          {teacher.olThisYear ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[styles.colLeaveType, styles.teacherDataCell]}
                      >
                        <Text style={styles.title2}>
                          {teacher.fullPay ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[styles.colLeaveType, styles.teacherDataCell]}
                      >
                        <Text style={styles.title2}>
                          {teacher.halfPay ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[styles.colLeaveType, styles.teacherDataCell]}
                      >
                        <Text style={styles.title2}>
                          {teacher.WOPay ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[styles.colWorkingDays, styles.teacherDataCell]}
                      >
                        <Text style={styles.title2}>
                          {teacher.workingDays ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={[styles.colSignature, styles.teacherDataCell]}
                      >
                        <Text style={styles.title2}></Text>
                      </View>
                      <View style={[styles.colRemarks, styles.teacherDataCell]}>
                        <Text style={styles.text}>{teacher.remarks || ""}</Text>
                      </View>
                    </View>
                    {index !== teachers.length - 1 && (
                      <View style={styles.rowDivider}></View>
                    )}
                  </React.Fragment>
                ))}
            </View>

            {/* signatures */}
            <View style={styles.signatureSection}>
              <View style={styles.signatureGroup}>
                <Text style={styles.text}>
                  1..............................................................2.....................................................................
                </Text>
                <Text style={styles.text}>
                  Signature of two members of Committee
                </Text>
              </View>
              <View style={styles.signatureGroup}>
                <Text style={styles.text}>
                  …......................................................................
                </Text>
                <View style={styles.hoiSignature}>
                  <Text style={styles.text}>Signature of </Text>
                  <Text
                    style={[
                      styles.text,
                      HOI_DESIGNATION === "HT" ? {} : styles.strikethrough,
                    ]}
                  >
                    Head Teacher
                  </Text>
                  <Text style={styles.text}>
                    {"  "}/{"  "}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      HOI_DESIGNATION === "HT" ? styles.strikethrough : {},
                    ]}
                  >
                    Teacher-in-Charge
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* Student Page */}
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <View style={styles.headingView}>
            <Text style={styles.title}>PART- 'B': PARTICULARS OF STUDENTS</Text>
          </View>
          <View style={styles.tableStartView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "100%", height: 60 }]}
              >
                <Text style={styles.text5}>Required information</Text>
              </View>
            </View>
            <View
              style={[styles.view25Height0, { width: "8.33%", height: 60 }]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {" "}
                    Class- Pre Pry [Who will be in Class-I next year]
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.view25Height0, { width: "8.33%", height: 60 }]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>Class-I</Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.view25Height0, { width: "8.33%", height: 60 }]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>Class-II</Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.view25Height0, { width: "8.33%", height: 60 }]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>Class-III</Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.view25Height0, { width: "8.33%", height: 60 }]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>Class-IV</Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.view25Height0, { width: "8.33%", height: 60 }]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>Class-V</Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", height: 60, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>Total</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>Total</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.Boys ? students?.pp?.Boys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.Girls ? students?.pp?.Girls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.Total ? students?.pp?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.Boys ? students?.i?.Boys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.Girls ? students?.i?.Girls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.Total ? students?.i?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.Boys ? students?.ii?.Boys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.Girls ? students?.ii?.Girls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.Total ? students?.ii?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.Boys ? students?.iii?.Boys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.Girls ? students?.iii?.Girls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.Total ? students?.iii?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.Boys ? students?.iv?.Boys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.Girls ? students?.iv?.Girls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.Total ? students?.iv?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.Boys ? students?.v?.Boys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.Girls ? students?.v?.Girls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.Total ? students?.v?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.Boys ? students?.total?.Boys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.Girls ? students?.total?.Girls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.Total ? students?.total?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>General (Excluding Minority)</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.GeneralBoys
                      ? students?.pp?.GeneralBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.GeneralGirls
                      ? students?.pp?.GeneralGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.Total ? students?.pp?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.GeneralBoys ? students?.i?.GeneralBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.GeneralGirls
                      ? students?.i?.GeneralGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.Total ? students?.i?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.GeneralBoys
                      ? students?.ii?.GeneralBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.GeneralGirls
                      ? students?.ii?.GeneralGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.Total ? students?.ii?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.GeneralBoys
                      ? students?.iii?.GeneralBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.GeneralGirls}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.Total ? students?.iii?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.GeneralBoys
                      ? students?.iv?.GeneralBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.GeneralGirls
                      ? students?.iv?.GeneralGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.Total ? students?.iv?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.GeneralBoys ? students?.v?.GeneralBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.GeneralGirls
                      ? students?.v?.GeneralGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.Total ? students?.v?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.GeneralBoys
                      ? students?.total?.GeneralBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.GeneralGirls
                      ? students?.total?.GeneralGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.Total ? students?.total?.Total : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>Sch. Caste</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ScBoys ? students?.pp?.ScBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ScGirls ? students?.pp?.ScGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ScTotal ? students?.pp?.ScTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ScBoys ? students?.i?.ScBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ScGirls ? students?.i?.ScGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ScTotal ? students?.i?.ScTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ScBoys ? students?.ii?.ScBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ScGirls ? students?.ii?.ScGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ScTotal ? students?.ii?.ScTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ScBoys ? students?.iii?.ScBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ScGirls ? students?.iii?.ScGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ScTotal ? students?.iii?.ScTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ScBoys ? students?.iv?.ScBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ScGirls ? students?.iv?.ScGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ScTotal ? students?.iv?.ScTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ScBoys ? students?.v?.ScBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ScGirls ? students?.v?.ScGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ScTotal ? students?.v?.ScTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ScBoys ? students?.total?.ScBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ScGirls ? students?.total?.ScGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ScTotal ? students?.total?.ScTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>Sch. Tribe</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.StBoys ? students?.pp?.StBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.StGirls ? students?.pp?.StGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.StTotal ? students?.pp?.StTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.StBoys ? students?.i?.StBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.StGirls ? students?.i?.StGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.StTotal ? students?.i?.StTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.StBoys ? students?.ii?.StBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.StGirls ? students?.ii?.StGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.StTotal ? students?.ii?.StTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.StBoys ? students?.iii?.StBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.StGirls ? students?.iii?.StGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.StTotal ? students?.iii?.StTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.StBoys ? students?.iv?.StBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.StGirls ? students?.iv?.StGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.StTotal ? students?.iv?.StTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.StBoys ? students?.v?.StBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.StGirls ? students?.v?.StGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.StTotal ? students?.v?.StTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.StBoys ? students?.total?.StBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.StGirls ? students?.total?.StGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.StTotal ? students?.total?.StTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>O.B.C. A Minority</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ObcABoys ? students?.pp?.ObcABoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ObcAGirls ? students?.pp?.ObcAGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ObcATotal ? students?.pp?.ObcATotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ObcABoys ? students?.i?.ObcABoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ObcAGirls ? students?.i?.ObcAGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ObcATotal ? students?.i?.ObcATotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ObcABoys ? students?.ii?.ObcABoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ObcAGirls ? students?.ii?.ObcAGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ObcATotal ? students?.ii?.ObcATotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ObcABoys ? students?.iii?.ObcABoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ObcAGirls ? students?.iii?.ObcAGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ObcATotal ? students?.iii?.ObcATotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ObcABoys ? students?.iv?.ObcABoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ObcAGirls ? students?.iv?.ObcAGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ObcATotal ? students?.iv?.ObcATotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ObcABoys ? students?.v?.ObcABoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ObcAGirls ? students?.v?.ObcAGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ObcATotal ? students?.v?.ObcATotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ObcABoys
                      ? students?.total?.ObcABoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ObcAGirls
                      ? students?.total?.ObcAGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ObcATotal
                      ? students?.total?.ObcATotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>O.B.C. B</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ObcBBoys ? students?.pp?.ObcBBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ObcBGirls ? students?.pp?.ObcBGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.ObcBTotal ? students?.pp?.ObcBTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ObcBBoys ? students?.i?.ObcBBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ObcBGirls ? students?.i?.ObcBGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.ObcBTotal ? students?.i?.ObcBTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ObcBBoys ? students?.ii?.ObcBBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ObcBGirls ? students?.ii?.ObcBGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.ObcBTotal ? students?.ii?.ObcBTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ObcBBoys ? students?.iii?.ObcBBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ObcBGirls ? students?.iii?.ObcBGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.ObcBTotal ? students?.iii?.ObcBTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ObcBBoys ? students?.iv?.ObcBBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ObcBGirls ? students?.iv?.ObcBGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.ObcBTotal ? students?.iv?.ObcBTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ObcBBoys ? students?.v?.ObcBBoys : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ObcBGirls ? students?.v?.ObcBGirls : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.ObcBTotal ? students?.v?.ObcBTotal : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ObcBBoys
                      ? students?.total?.ObcBBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ObcBGirls
                      ? students?.total?.ObcBGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.ObcBTotal
                      ? students?.total?.ObcBTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>Minority Excluding O.B.C.-A</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.MinorityBoys
                      ? students?.pp?.MinorityBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.MinorityGirls}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.MinorityTotal}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.MinorityBoys
                      ? students?.i?.MinorityBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.MinorityGirls
                      ? students?.i?.MinorityGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.MinorityTotal
                      ? students?.i?.MinorityTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.MinorityBoys
                      ? students?.ii?.MinorityBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.MinorityGirls
                      ? students?.ii?.MinorityGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.MinorityTotal
                      ? students?.ii?.MinorityTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.MinorityBoys
                      ? students?.iii?.MinorityBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.MinorityGirls
                      ? students?.iii?.MinorityGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.MinorityTotal
                      ? students?.iii?.MinorityTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.MinorityBoys
                      ? students?.iv?.MinorityBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.MinorityGirls
                      ? students?.iv?.MinorityGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.MinorityTotal
                      ? students?.iv?.MinorityTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.MinorityBoys
                      ? students?.v?.MinorityBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.MinorityGirls
                      ? students?.v?.MinorityGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.MinorityTotal
                      ? students?.v?.MinorityTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.MinorityBoys
                      ? students?.total?.MinorityBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.MinorityGirls
                      ? students?.total?.MinorityGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.MinorityTotal
                      ? students?.total?.MinorityTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={[styles.view25Height0, { width: "100%" }]}>
                <Text style={styles.text5}>
                  Average Attendance of the month
                </Text>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.averageAttendance
                      ? students?.pp?.averageAttendance
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.averageAttendance
                      ? students?.i?.averageAttendance
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.averageAttendance
                      ? students?.ii?.averageAttendance
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.averageAttendance
                      ? students?.iii?.averageAttendance
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.averageAttendance
                      ? students?.iv?.averageAttendance
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.averageAttendance !== 0
                      ? students?.v?.averageAttendance
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.averageAttendance
                      ? students?.total?.averageAttendance
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "100%", height: 33 }]}
              >
                <Text style={styles.text5}>
                  Absentees for all or more of the working days of the month
                </Text>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>-</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "12.5%",
                height: 50,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",

                borderRightWidth: 1,
              }}
            >
              <Text style={styles.text5}>Remarks</Text>
            </View>
            <View
              style={[
                styles.view25,
                { width: "88.5%", height: 50, borderRightWidth: 0 },
              ]}
            >
              <Text
                style={[styles.text5, { textAlign: "left", paddingLeft: 2 }]}
              >
                {remarks.length > 0 && remarks}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={[styles.view25Height0, { width: "100%" }]}>
                <Text style={styles.text5}>
                  No. of Attendance of students on the date of last inspection
                </Text>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {inspection?.pp ? inspection?.pp : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {inspection?.i ? inspection?.i : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {inspection?.ii ? inspection?.ii : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {inspection?.iii ? inspection?.iii : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {inspection?.iv ? inspection?.iv : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {inspection?.v !== 0 ? inspection?.v : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>{inspection?.total}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rowStartBorderView}>
            <View
              style={{
                width: "41.65%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[styles.view25Height0, { width: "75%", height: 33 }]}
              >
                <Text style={styles.text5}>Total as on last December</Text>
              </View>
              <View style={[styles.view25Height0, { width: "25%" }]}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Boys</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Girls</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text5}>Total</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.lastYearBoys
                      ? students?.pp?.lastYearBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.lastYearGirls
                      ? students?.pp?.lastYearGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.pp?.lastYearTotal
                      ? students?.pp?.lastYearTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.lastYearBoys
                      ? students?.i?.lastYearBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.lastYearGirls
                      ? students?.i?.lastYearGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.i?.lastYearTotal
                      ? students?.i?.lastYearTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.lastYearBoys
                      ? students?.ii?.lastYearBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.lastYearGirls
                      ? students?.ii?.lastYearGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.ii?.lastYearTotal
                      ? students?.ii?.lastYearTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.lastYearBoys
                      ? students?.iii?.lastYearBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.lastYearGirls
                      ? students?.iii?.lastYearGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iii?.lastYearTotal
                      ? students?.iii?.lastYearTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.lastYearBoys
                      ? students?.iv?.lastYearBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.lastYearGirls
                      ? students?.iv?.lastYearGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.iv?.lastYearTotal
                      ? students?.iv?.lastYearTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.view25Height0, { width: "8.33%" }]}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.lastYearBoys
                      ? students?.v?.lastYearBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.lastYearGirls
                      ? students?.v?.lastYearGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.v?.lastYearTotal
                      ? students?.v?.lastYearTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.view25Height0,
                { width: "8.33%", borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.lastYearBoys
                      ? students?.total?.lastYearBoys
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.lastYearGirls
                      ? students?.total?.lastYearGirls
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text5}>
                    {students?.total?.lastYearTotal
                      ? students?.total?.lastYearTotal
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.headingView, { marginTop: 5 }]}>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Source of drinking water:&nbsp;&nbsp;
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {DRINKING_WATER}
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Water Supply in Toilets:&nbsp;&nbsp;
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  YES
                </Text>
              </View>
            </View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Water Supply in Toilets:&nbsp;&nbsp;
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {DRINKING_WATER}
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>No. of Girls' Toilet :</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {GIRLS_TOILET}
                </Text>
              </View>
            </View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>No. of Girls' Toilet :</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {GIRLS_TOILET}
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>Own Electricity:&nbsp;&nbsp;</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  YES
                </Text>
              </View>
            </View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Whether the toilets used by the outsiders :
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  NO
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  No. of floor : (1 or 2 erected) :{" "}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {BUILDING}
                </Text>
              </View>
            </View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Whether the toilets used by the outsiders :
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  NO
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Whether the students use the toilet properly :
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  YES
                </Text>
              </View>
            </View>
            <View
              style={{ width: "100%", height: 1, backgroundColor: "black" }}
            ></View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>Date of last Inspection :</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {inspection?.inspectionDate}
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>Recognition date of school :</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {SCHOOL_RECOGNITION_DATE}
                </Text>
              </View>
            </View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>Area of school's Land :</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {SCHOOL_AREA}
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>Khatian No.:</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {KHATIAN_NO}
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}> Own or Rented building :</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  OWN
                </Text>
              </View>
            </View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>PLOT/Dag No. :</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  {PLOT_NO}
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>If rented amount of rent:</Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  N/A
                </Text>
              </View>
            </View>
            <View style={styles.rowFlexViewEvenly}>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  If own building Regd deed is available or not Yes/No:
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                    },
                  ]}
                >
                  YES
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.title}>
            PART - 'C' : ACCOUNTS OF CONTINGENT GRANT
          </Text>
          <View style={styles.headingView}>
            <View
              style={[
                styles.rowFlexViewEvenly,
                { alignItems: "flex-start", marginTop: 10 },
              ]}
            >
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Opening Balance = Rs. 0{"\n"}
                  Received = Rs. 0{"\n"}
                  Total = Rs. 0
                </Text>
              </View>
              <View style={styles.rowFlexView}>
                <Text style={styles.text5}>
                  Expenditure in the last month = Rs. 50{"\n"}
                  Closing Balance = Rs. 0
                </Text>
              </View>
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text style={[styles.title, { marginLeft: -300 }]}>
                Countersigned
              </Text>
              <View
                style={{
                  marginVertical: 40,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 30,
                }}
              >
                <Text style={[styles.text, { marginLeft: 50 }]}>
                  Sub Inspector of Schools
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>Signature of </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        textDecoration:
                          HOI_DESIGNATION === "HT" ? "none" : "line-through",
                      },
                    ]}
                  >
                    Head Teacher
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        textDecoration:
                          HOI_DESIGNATION === "HT" ? "line-through" : "none",
                      },
                    ]}
                  >
                    {"  "}/{"  "}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        textDecoration:
                          HOI_DESIGNATION === "HT" ? "line-through" : "none",
                      },
                    ]}
                  >
                    Teacher-in-Charge
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
    // </PDFViewer>
  );
}

/* ---------- Styles (kept mostly same but some cleanup) ---------- */

const styles = StyleSheet.create({
  document: { margin: 5, padding: 5 },
  page: { padding: 5, margin: 5, backgroundColor: "#FFFFFF" },
  pageMainView: {
    padding: 5,
    margin: 5,
    border: "1px solid",
    borderWidth: 2,
    width: "99%",
    height: "99%",
  },

  titleMain: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: "ultrabold",
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  title2: {
    fontSize: BASE_FONT_SIZE + 2,
    fontWeight: "ultrabold",
    fontFamily: "Times",
    textAlign: "center",
  },
  text: {
    fontSize: BASE_FONT_SIZE,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
    padding: 1,
  },
  textBold: {
    fontSize: BASE_FONT_SIZE,
    fontWeight: "bold",
    fontFamily: "TimesBold",
    textAlign: "center",
    padding: 1,
  },
  text4: {
    fontSize: BASE_FONT_SIZE - 1,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  text5: {
    fontSize: BASE_FONT_SIZE + 0.5,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  textLeft: { textAlign: "left", paddingLeft: 2 },

  underlined: { textDecoration: "underline" },
  underlinedDotted: {
    textDecoration: "underline",
    textDecorationStyle: "dotted",
  },
  strikethrough: { textDecoration: "line-through" },

  sectionSpacing: { marginVertical: 10 },
  marginTop: { marginTop: 10 },
  marginTopSmall: { marginTop: 5 },
  justifyEnd: { justifyContent: "flex-end" },
  justifyStart: { justifyContent: "flex-start" },
  paddingLeft: { paddingLeft: 50 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  infoPair: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* Teacher columns */
  teacherHeader: { borderLeftWidth: 0, borderRightWidth: 0, height: 68 },
  teacherDataCell: { height: 55 },

  colSerial: {
    width: "4%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colName: {
    width: "10%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colDesignation: {
    width: "5%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colEducation: {
    width: "7%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colDob: {
    width: "6%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colJoining: {
    width: "6%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colCurrentJoining: {
    width: "6%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colCast: {
    width: "6%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colCasualLeave: { width: "7%", borderRightWidth: 1, flexDirection: "column" },
  colCasualLeaveSplit: {
    width: "3.5%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colOtherLeave: { width: "15%", borderRightWidth: 1, flexDirection: "column" },
  colOtherLeaveSplit: {
    width: "3%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colLeaveType: {
    width: "3%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colWorkingDays: {
    width: "5%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colSignature: {
    width: "17%",
    borderRightWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colRemarks: { width: "3%", justifyContent: "center", alignItems: "center" },

  /* Student table layout */
  labelColumn: { width: "41.65%", flexDirection: "row" },
  labelColumnHeader: {
    width: "41.65%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  fullLabelCell: {
    width: "41.65%",
    justifyContent: "center",
    alignItems: "center",
  },
  genderColumn: { width: "25%", flexDirection: "column" },
  view75: { width: "75%" },
  gradeCell: { width: "8.33%", borderRightWidth: 1, flexDirection: "column" },
  lastGradeCell: { borderRightWidth: 1 },
  lastCell: { borderRightWidth: 0 },
  gradeHeader: {
    width: "8.33%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
  },
  lastGradeHeader: { borderRightWidth: 0 },
  remarksLabel: {
    width: "12.5%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
  },
  remarksContent: {
    width: "87.5%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullCell: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  borderBottom: { borderBottomWidth: 1 },
  borderRight: { borderRightWidth: 1 },

  sectionHeader: {
    width: "100%",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  splitSection: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
  },
  splitCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  smallSplitCell: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
  },
  complexSection: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
  },
  leaveTypes: {
    width: "75%",
    flexDirection: "column",
  },
  leaveSplit: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
  },
  leaveTypeCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
  },

  headingView: { borderWidth: 1, width: "100%", height: "auto" },
  tableStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
  },
  rowStartView: {
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
  },
  rowStartBorderView: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
  },
  rowFlexView: {
    paddingRight: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  rowFlexViewEvenly: {
    paddingRight: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
  },
  rowDivider: { width: "100%", height: 5, borderBottomWidth: 1 },
  view25Height0: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "27%",
    justifyContent: "center",
    alignItems: "center",
  },
  datePart: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },

  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    marginVertical: 20,
    width: "100%",
  },
  signatureGroup: {
    flexDirection: "column",
    alignItems: "center",
  },
  hoiSignature: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  facilityRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 2,
  },
  facilityPair: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    marginVertical: 2,
  },

  accountsSection: {
    alignItems: "flex-start",
    marginTop: 10,
  },
  accountInfo: {
    flexDirection: "row",
  },
  countersignedSection: {
    marginVertical: 20,
  },
  countersignedTitle: {
    marginLeft: -300,
  },
  finalSignatures: {
    marginVertical: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  inspectorSignature: {
    marginLeft: 50,
  },

  tickIcon: {
    width: 8,
    height: 8,
    position: "absolute",
    top: -8,
    right: 70,
  },
});

/* ---------- Font registrations (kept) ---------- */
Font.register({
  family: "Kalpurush",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/kalpurush.ttf",
});
Font.register({
  family: "Times",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/times.ttf",
});
Font.register({
  family: "TimesBold",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/timesBold.ttf",
});
