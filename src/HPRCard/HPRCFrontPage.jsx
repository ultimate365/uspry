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

export default function HPRCFrontPage({ data }) {
  return (
    <PDFViewer style={{ width, height }}>
      <Document
        style={{ margin: 5, padding: 5 }}
        title={`Holistic Progress Report Card Front Page`}
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
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.student_name}</Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.student_id}</Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.birthdate}</Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.aadhaar}</Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.bloodGroup}</Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.father_name}</Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.mother_name}</Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.text}>{item?.guardians_name}</Text>
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
    width: 150,
    height: 300,
    borderWidth: .5,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    margin: 5,
    padding: 2,
    paddingLeft:5,
    borderStyle:"dashed",
    marginBottom:85
  },
  dataView: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    alignSelf: "center",
    width: "100%",
    height: 37.79,
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
    fontSize: 13,
    fontFamily: "Times",
    textAlign: "left",
  },
  text2: {
    fontSize: 11,
    fontFamily: "Times",
    textAlign: "left",
  },
  textBold: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
    padding: 2,
    marginVertical: 2,
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
