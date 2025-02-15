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

const width = 2480;
const height = 3508;

export default function HPRCInsidePage({ data }) {
  return (
    <PDFViewer style={{ width, height }}>
      <Document
        style={{ margin: 5, padding: 5 }}
        title={`Holistic Progress Report Card Class Page`}
      >
        <Page size="A4" orientation="portrait" style={styles.page}>
          <View style={styles.pageMainView}>
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
                  <View style={styles.detailsView} key={index}>
                    <View style={styles.lineView}>
                      <View>
                        <Text style={styles.text}>
                          ছাত্রী/ছাত্রের নাম (Name of the student):{" "}
                        </Text>
                      </View>
                      <View style={styles.dataView}>
                        <Text style={styles.text}>{item?.student_name}</Text>
                      </View>
                    </View>
                    <View style={styles.lineView}>
                      <View>
                        <Text style={styles.text}>শ্রেণী (Class): </Text>
                      </View>
                      <View style={styles.dataView}>
                        <Text style={styles.text}>
                          {item?.class.split(" (A)")[0]}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.text}>বিভাগ (Section): </Text>
                      </View>
                      <View style={styles.dataView}>
                        <Text style={styles.text}>
                          {item?.class.split(" (A)")[1]}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
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
  detailsView: {
    width: 560,
    height: 265,
    borderWidth: 0.5,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    margin: 5,
    padding: 5,
    paddingLeft: 5,
    borderStyle: "dashed",
    marginBottom: 5,
  },

  lineView: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
  headingView: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    alignSelf: "center",
  },
  dataView: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    alignSelf: "center",
    paddingLeft: 10,
    borderBottomWidth: 2,
    borderBottomStyle: "dotted",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "TiroBold",
    textAlign: "center",
  },
  title2: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "TiroBold",
    textAlign: "center",
  },
  titleMain: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Tiro",
    textAlign: "center",
  },
  text: {
    fontSize: 11,
    fontFamily: "Tiro",
    textAlign: "left",
  },
  text2: {
    fontSize: 11,
    fontFamily: "Tiro",
    textAlign: "left",
  },
  textBold: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Tiro",
    textAlign: "center",
    padding: 2,
    marginVertical: 2,
  },

  text3: {
    fontSize: 8,
    fontFamily: "Tiro",
    textAlign: "center",
    transform: "rotate(-60deg)",
  },
  text4: {
    fontSize: 8,
    fontFamily: "Tiro",
    textAlign: "center",
  },
  text5: {
    fontSize: 7,
    fontFamily: "Tiro",
    textAlign: "center",
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
