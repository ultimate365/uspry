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

export default function TeachersCorner({ data }) {
  return (
    <Document style={{ margin: 5, padding: 5 }} title={`Teacher Photo Corner`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            TEACHER'S PHOTO CORNER OF {SCHOOLNAME}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {data.length > 0 &&
              data.map((el, index) => (
                <View
                  style={{
                    width: 170,
                    height: 250,
                    borderWidth: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    borderRadius: 10,
                    margin: 5,
                    padding: 2,
                  }}
                  key={index}
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
                  <Text style={styles.text}>Name: {el?.tname}</Text>
                  <Text style={styles.text}>Designation: {el?.desig}</Text>
                  <Text style={styles.text}>Mobile: {el?.phone}</Text>
                  <Text style={styles.text}>Date of Joining: {el?.doj}</Text>
                  <Text style={styles.text}>
                    DOJ to this School: {el?.dojnow}
                  </Text>
                  <Text style={styles.text}>Date of Retirement: {el?.dor}</Text>
                  <Text style={styles.text}>Training: {el?.training}</Text>
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
    fontSize: 20,
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
