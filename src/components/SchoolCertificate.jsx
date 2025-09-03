"use client";

import React, { useEffect } from "react";
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
  SCHOOLNAME,
  SCHOOL_RECOGNITION_DATE,
  CIRCLE,
  SCHOOLADDRESS,
} from "@/modules/constants";
import { titleCase, dobToWords } from "../modules/calculatefunctions";
const width = 2480;
const height = 3508;

export default function SchoolCertificate({ data }) {
  const { id, father_name, student_name, mother_name, dob, year, ref } = data;

  return (
    // <PDFViewer
    //   style={{
    //     width: width / 3,
    //     height: height / 3,
    //   }}
    // >
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`School Certificate of ${titleCase(student_name)}`}
    >
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.titleMain}>{SCHOOLNAME}</Text>
          <Text style={styles.title2}>
            Date of Recognition: {SCHOOL_RECOGNITION_DATE}
          </Text>
          <Text style={styles.title2}>
            Under: D. P. S. C. Howrah and {titleCase(CIRCLE)} Circle
          </Text>
          <Text style={styles.textBold}>Address: {SCHOOLADDRESS}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "baseline",
              alignContent: "center",
              margin: 20,
            }}
          >
            <Text style={styles.textItalic}>
              Date: ...................................
            </Text>
          </View>
          <Text
            style={[styles.text, { textDecoration: "underline", fontSize: 16 }]}
          >
            To Whom It May Concern
          </Text>
          <View
            style={{
              margin: 50,
              marginBottom: 15,
              marginLeft: 30,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
              width: "90%",
            }}
          >
            <Text style={styles.textMain}>This is to certify that</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomStyle: "dotted",
                width: "70%",
              }}
            >
              <Text style={styles.text}>{student_name}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              width: "90%",
              marginBottom: 15,
            }}
          >
            <Text style={styles.textMain}>Son / Daughter of Sri / Late</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomStyle: "dotted",
                width: "60%",
              }}
            >
              <Text style={styles.text}>{father_name}</Text>
            </View>
            <Text style={styles.textMain}>(Father)</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
              width: "90%",
              marginBottom: 15,
            }}
          >
            <Text style={styles.textMain}>and</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomStyle: "dotted",
                width: "40%",
              }}
            >
              <Text style={styles.text}>{mother_name ? mother_name : ""}</Text>
            </View>
            <Text style={styles.textMain}>
              (Mother), an inhabitant of Vill.- Sehagori, P.O.- Khorop,
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "baseline",
              alignContent: "center",
              width: "90%",
              marginBottom: 15,
            }}
          >
            <Text style={styles.textMain}>
              P.S.- Joypur, Dist.- Howrah, Pin.-{" "}
            </Text>
            <Text style={styles.textItalic}>711401</Text>
            <Text style={styles.textMain}>
              {" "}
              , is / was a Student of our School.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
              width: "100%",
              marginBottom: 15,
            }}
          >
            <Text style={[styles.textMain, { textIndent: 30 }]}>
              As per our School records and admission register his / her date of
              birth is / was
            </Text>

            <View
              style={{
                marginLeft: 20,
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    borderBottomStyle: "dotted",
                    borderBottomWidth: 1,
                  },
                ]}
              >
                {" "}
                {dob ? dob : ""}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
              width: "90%",
              marginBottom: 15,
            }}
          >
            <Text style={[styles.textMain, { textIndent: 10 }]}>
              (The {dobToWords(dob)})
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
              width: "90%",
              marginBottom: 15,
            }}
          >
            <Text style={[styles.textMain, { textIndent: 30 }]}>
              As for as I know he/she bears a good moral charactor.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
              width: "90%",
              marginBottom: 15,
            }}
          >
            <Text style={[styles.textMain, { textIndent: 30 }]}>
              I wish him / her Success in life.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              alignContent: "center",
              marginTop: 50,
              marginRight: 50,
            }}
          >
            <Text style={styles.text}>Head Teacher / TIC</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              alignContent: "center",
              marginRight: 20,
            }}
          >
            <Text style={styles.text}>{titleCase(SCHOOLNAME)}</Text>
          </View>
        </View>
      </Page>
    </Document>
    // </PDFViewer>
  );
}
const styles = StyleSheet.create({
  page: {
    padding: 10,
    margin: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  pageMainView: {
    padding: 5,
    margin: 5,
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "98%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  title2: {
    fontSize: 12,
    fontFamily: "ArialBold",
    textAlign: "center",
  },
  titleMain: {
    fontSize: 20,
    fontFamily: "ArialBold",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "TimesBold",
    textAlign: "center",
    padding: 2,
  },
  textBold: {
    fontSize: 14,
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  textItalic: {
    fontSize: 14,
    fontFamily: "TimesBoldItalic",
    textAlign: "center",
  },
  textMain: {
    fontSize: 14,
    fontFamily: "Birds",
    textAlign: "center",
  },
});
Font.register({
  family: "ArialBold",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/arialbd.ttf",
});
Font.register({
  family: "Birds",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/Birds.ttf",
});
Font.register({
  family: "Times",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/times.ttf",
});
Font.register({
  family: "TimesBold",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/timesBold.ttf",
});
Font.register({
  family: "TimesBoldItalic",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/timesBoldItalic.ttf",
});
