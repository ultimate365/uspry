"use client";
import React, { useEffect, useState } from "react";
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
import {
  CIRCLE,
  DIST,
  SCHOOLADDRESS,
  SCHOOLNAME,
  UDISE_CODE,
} from "../modules/constants";
const width = 2480;
const height = 3508;
export default function PPResult({ data }) {
  const subjects = [
    { fullName: "Bengali", shortName: "ben" },
    { fullName: "English", shortName: "eng" },
    { fullName: "Mathematics", shortName: "math" },
  ];

  return (
    // <PDFViewer width={height / 3.5} height={width / 3}>
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`Result of Pre Primary Students`}
    >
      {data.map((student, index) => {
        const getPartTotal = (part) => {
          return subjects.reduce((total, sub) => {
            const subjectPartKey = `${sub.shortName}${part}`;
            return total + (student[subjectPartKey] || 0);
          }, 0);
        };
        const totalMarks =
          student.ben1 +
          student.ben2 +
          student.ben3 +
          student.eng1 +
          student.eng2 +
          student.eng3 +
          student.math1 +
          student.math2 +
          student.math3 +
          student.work1 +
          student.work2 +
          student.work3 +
          student.health1 +
          student.health2 +
          student.health3 +
          student.envs1 +
          student.envs2 +
          student.envs3;
        const getGrade = () => {
          const maxMarks =
            getPartTotal(3) > 0
              ? student.nclass === 0
                ? 300
                : student.nclass < 3
                ? 450
                : 500
              : student.nclass === 0
              ? 150
              : student.nclass < 3
              ? 200
              : 250 + getPartTotal(2) > 0
              ? student.nclass === 0
                ? 150
                : student.nclass < 3
                ? 200
                : 250
              : student.nclass === 0
              ? 100
              : student.nclass < 3
              ? 150
              : 200;

          const percentage = (totalMarks / maxMarks) * 100;
          if (percentage >= 90) return "A+";
          if (percentage >= 80) return "A";
          if (percentage >= 70) return "B+";
          if (percentage >= 60) return "B";
          if (percentage >= 45) return "C+";
          if (percentage >= 25) return "C";
          return "D";
        };
        const total1 = subjects.reduce(
          (acc, sub) => acc + (student[`${sub.shortName}1`] || 0),
          0
        );
        const total2 = subjects.reduce(
          (acc, sub) => acc + (student[`${sub.shortName}2`] || 0),
          0
        );
        const total3 = subjects.reduce(
          (acc, sub) => acc + (student[`${sub.shortName}3`] || 0),
          0
        );
        const grandTotal = total1 + total2 + total3;
        const totalPercentage = (grandTotal / 300) * 100;
        return (
          <Page
            size="A4"
            orientation="landscape"
            style={styles.page}
            key={index}
          >
            <View style={styles.pageMainView}>
              <View
                style={{
                  marginVertical: 10,
                }}
              >
                <Text style={styles.title}>{SCHOOLNAME}</Text>
                <Text style={styles.title2}>UDISE CODE: {UDISE_CODE}</Text>
                <Text style={styles.title2}>
                  CIRCLE: {CIRCLE}, DISTRICT: {DIST}
                </Text>
                <Text style={styles.title2}>ADDRESS: {SCHOOLADDRESS}</Text>
              </View>

              {student.new_roll_no && (
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                >
                  <Text style={styles.title}>
                    Class I Roll No.: {student?.new_roll_no}
                  </Text>
                </View>
              )}
              <View
                style={{
                  marginBottom: 5,
                }}
              >
                <Text style={styles.title}>PROGRESS REPORT CARD</Text>
              </View>
              <View
                style={{
                  marginBottom: 5,
                }}
              >
                <Text style={styles.title}>
                  Academic Session - {new Date().getFullYear()}
                </Text>
              </View>
              <View
                style={{
                  marginBottom: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignSelf: "center",
                  width: "98%",
                }}
              >
                <Text style={styles.title2}>
                  Name of the Student: {student?.student_name}
                </Text>
                <Text style={styles.title2}>Class : {student?.class}</Text>
                <Text style={styles.title2}>Roll No. : {student?.roll_no}</Text>
                <Text style={styles.title2}>
                  Student ID: {student?.student_id}
                </Text>
              </View>

              <View style={styles.headingView}>
                <View
                  style={{
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={styles.title}>SUMMATIVE EVALUATION</Text>
                </View>
                <View
                  style={[
                    styles.tableStartView,
                    { borderLeftWidth: 0, borderRightWidth: 0 },
                  ]}
                >
                  <View
                    style={{
                      width: "40%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBold}>Subject</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBold}>I</Text>
                    <Text style={styles.textBold}>(20)</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBold}>II</Text>
                    <Text style={styles.textBold}>(30)</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBold}>III</Text>
                    <Text style={styles.textBold}>(50)</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBold}>Total</Text>
                    <Text style={styles.textBold}>(100)</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBold}>Percentage</Text>
                    <Text style={styles.textBold}>(%)</Text>
                  </View>
                </View>
                {subjects.map((sub, ind) => {
                  const subjectPartKey1 = `${sub.shortName}1`;
                  const mark1 = student[subjectPartKey1] || 0;
                  const subjectPartKey2 = `${sub.shortName}2`;
                  const mark2 = student[subjectPartKey2] || 0;
                  const subjectPartKey3 = `${sub.shortName}3`;
                  const mark3 = student[subjectPartKey3] || 0;
                  const getSubjectTotal = () => {
                    return mark1 + mark2 + mark3;
                  };

                  return (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "40%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.textBoldBold}>{sub.fullName}</Text>
                      </View>
                      <View
                        style={{
                          width: "12%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.textBoldBold}>{mark1}</Text>
                      </View>
                      <View
                        style={{
                          width: "12%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.textBoldBold}>{mark2}</Text>
                      </View>
                      <View
                        style={{
                          width: "12%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.textBoldBold}>{mark3}</Text>
                      </View>
                      <View
                        style={{
                          width: "12%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.textBoldBold}>
                          {getSubjectTotal()}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "12%",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.textBoldBold}>
                          {getSubjectTotal()} %
                        </Text>
                      </View>
                    </View>
                  );
                })}
                <View
                  style={[
                    styles.rowStartView,
                    {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: "40%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBoldBold}>Grand Total</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBoldBold}>{total1} / 60</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBoldBold}>{total2} / 90</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBoldBold}>{total3} / 150</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBoldBold}>{grandTotal} / 300</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.textBoldBold}>
                      {totalPercentage.toFixed(2)} %
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  alignSelf: "center",
                  width: "90%",
                  marginTop: 10,
                }}
              >
                <View>
                  <Text style={styles.textBoldBold}>
                    OVER ALL GRAND TOTAL: {totalMarks} / 300
                  </Text>
                </View>
                <View>
                  <Text style={styles.textBoldBold}>
                    OVER ALL GRAND PERCENTAGE: {totalPercentage.toFixed(2)} %
                  </Text>
                </View>
                <View>
                  <Text style={styles.textBoldBold}>GRADE: {getGrade()}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  alignSelf: "center",
                  width: "90%",
                  marginTop: 80,
                }}
              >
                <View>
                  <Text style={styles.textBoldBold}>
                    Signature of the Class Teacher
                  </Text>
                </View>
                <View>
                  <Text style={styles.textBoldBold}>
                    Signature of the Head Teacher
                  </Text>
                </View>
                <View>
                  <Text style={styles.textBoldBold}>
                    Signature of the Gurdian
                  </Text>
                </View>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
    // </PDFViewer>
  );
}
const styles = StyleSheet.create({
  page: {
    padding: 5,
    // margin: 5,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: width,
    height: height,
  },
  pageMainView: {
    alignSelf: "center",
    width: "99%",
    height: "99%",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  title2: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  text: {
    fontSize: 10,
    fontFamily: "Times",
    textAlign: "center",
    padding: 2,
  },
  textBold: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Tiro",
    textAlign: "center",
    padding: 2,
    marginVertical: 2,
  },

  headingView: {
    // border: "1px solid",
    borderWidth: 1,
    width: "100%",
  },
  tableStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },

  rowStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});
Font.register({
  family: "Kalpurush",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/kalpurush.ttf",
});
Font.register({
  family: "Tiro",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/TiroBangla-Regular.ttf",
});
Font.register({
  family: "Times",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/times.ttf",
});
Font.register({
  family: "TimesBold",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/timesBold.ttf",
});
