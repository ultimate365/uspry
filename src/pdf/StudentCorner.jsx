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
import { SCHOOLNAME } from "@/modules/constants";
const width = 2480;
const height = 3508;

export default function StudentCorner({ data }) {
  return (
    <Document style={{ margin: 5, padding: 5 }} title={`Student Photo Corner`}>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>STUDENT PHOTO CORNER OF {SCHOOLNAME}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {data.length > 0 &&
              data.map((item, index) => (
                <View
                  style={{
                    width: 150,
                    borderWidth: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    borderRadius: 10,
                    margin: 5,
                    padding: 2,
                  }}
                  key={index}
                  wrap={false}
                >
                  <View
                    style={{
                      width: 100,
                      height: 120,
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      borderRadius: 10,
                    }}
                  ></View>
                  <Text style={styles.text}>{item?.student_name}</Text>
                  <Text style={styles.text}>{item?.class}</Text>
                  <Text style={styles.text}>ROLL: {item?.roll_no}</Text>
                  <Text style={styles.text}>Mother: {item?.mother_name}</Text>
                  <Text style={styles.text}>Father: {item?.father_name}</Text>
                  <Text style={styles.text}>
                    Mobile:{" "}
                    {item?.mobile === "0"
                      ? ""
                      : item?.mobile === "9999999999"
                      ? ""
                      : item?.mobile === "7872882343"
                      ? ""
                      : item?.mobile === "7679230482"
                      ? ""
                      : item?.mobile === "9933684468"
                      ? ""
                      : item?.mobile}
                  </Text>
                  <Text style={styles.text}>
                    Student ID: {item?.student_id}
                  </Text>
                  <Text style={styles.text}>DOB: {item?.birthdate}</Text>
                </View>
              ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
const styles = StyleSheet.create({
  page: {
    padding: 2,
    margin: 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    alignSelf: "center",
    width: width,
    height: height,
  },
  pageMainView: {
    padding: 2,
    margin: 5,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  title2: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  titleMain: {
    fontSize: 20,
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
    fontFamily: "Times",
    textAlign: "center",
    padding: 2,
    marginVertical: 2,
  },
  text2: {
    fontSize: 9,
    fontFamily: "Times",
    textAlign: "center",
    transform: "rotate(-60deg)",
  },
  text3: {
    fontSize: 8,
    fontFamily: "Times",
    textAlign: "center",
    transform: "rotate(-60deg)",
  },
  text4: {
    fontSize: 8,
    fontFamily: "Times",
    textAlign: "center",
  },
  text5: {
    fontSize: 7,
    fontFamily: "Times",
    textAlign: "center",
  },
  headingView: {
    // border: "1px solid",
    borderWidth: 1,
    width: "100%",
    height: "auto",
  },
  tableStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  tableStartBorderView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
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
  rowStartBorderView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  rowWrapView: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  rowFlexView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  rowFlexViewEvenly: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
  },
  break: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  secondRowView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 5,
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
