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

import checked from "@/images/checked.png";
import unchecked from "@/images/unchecked.png";
import {
  BLOCK,
  CCH_NAME,
  DIST,
  NGO_SHG,
  PP_STUDENTS,
  PRIMARY_BOYS,
  PRIMARY_GIRLS,
  PRIMARY_STUDENTS,
  SCHOOL_TYPE,
  SCHOOLNAME,
  TOTAL_STUDENTS,
  UDISE_CODE,
  WARD_NO,
  HOI_DESIGNATION,
} from "../modules/constants";
import { IndianFormat, round2dec } from "@/modules/calculatefunctions";
// import useScreenSize from "./useScreenSize";
const width = 2480;
const height = 3508;
export default function MDMPrint({ data }) {
  const { thisMonthlyData } = data;
  return (
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`MDM REPORT OF ${thisMonthlyData?.id}`}
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.pageMainView}>
          <View style={styles.headingView}>
            <Text style={styles.title}>
              Monthly Progress Report of Mid Day Meal
            </Text>
          </View>
          <View style={styles.tableStartView}>
            <View style={styles.view25}>
              <Text style={styles.title}>
                Name of the Month:- {thisMonthlyData?.month}&#8217;
                {thisMonthlyData?.year}
              </Text>
            </View>
            <View style={styles.view25}>
              <Text style={styles.title}>
                Financial Year:- {thisMonthlyData?.financialYear}
              </Text>
            </View>
            <View style={styles.view25}>
              <Text style={styles.title}>Ward No.:- {WARD_NO}</Text>
            </View>
            <View
              style={{
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                paddingRight: 1,
                width: "25%",
              }}
            >
              <Text style={styles.title}>Municipality/ Corporation (HMC)</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view25}>
              <Text style={styles.title}>Name of the School:-</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                paddingRight: 1,
                width: "50%",
              }}
            >
              <Text style={styles.title}>{SCHOOLNAME}</Text>
            </View>

            <View
              style={{
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                paddingRight: 0,
                width: "25%",
              }}
            >
              <Text style={styles.title}> </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view25}>
              <Text style={styles.title}>Basic Information of School:-</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                paddingRight: 1,
                width: "50%",
              }}
            >
              <Text style={styles.title}>{SCHOOL_TYPE}</Text>
            </View>

            <View
              style={{
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                paddingRight: 0,
                width: "25%",
              }}
            >
              <Text style={styles.title}> </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View
              style={{
                borderRightWidth: 1,
                paddingRight: 1,
                width: "37.5%",
              }}
            >
              <Text style={styles.title}>
                Total no. of the Students Bal Vatika:-{" "}
                {thisMonthlyData?.ppStudent}
              </Text>
              <Text style={styles.title}>
                Total no. of the Students Primary:-{" "}
                {thisMonthlyData?.pryStudent}
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                paddingRight: 1,
                width: "37.5%",
                height: "100%",
              }}
            >
              <Text style={[styles.title, { paddingTop: 5 }]}>
                Total Mid Day meal Served:-
                {thisMonthlyData?.ppTotal + thisMonthlyData?.pryTotal}
              </Text>
            </View>

            <View
              style={{
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                paddingRight: 0,
                width: "25%",
              }}
            >
              <Text style={styles.title}>
                No. of days Mid Day Meal Served:-{" "}
                {thisMonthlyData?.worrkingDays}
              </Text>
            </View>
          </View>
          <View style={styles.break}></View>
          <View style={styles.rowStartView}>
            <Text style={styles.title}>
              Utilization Certificate (COOKING COST)
            </Text>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125H35}>
              <Text style={styles.text}>Class</Text>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>Opening{"\n"} Balance</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "25%",
                flexDirection: "column",
                height: 35,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Allotment of fund received</Text>
              </View>
              <View style={styles.rowWrapView}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 1,
                    height: 24,
                    width: "50%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>
                    Previous month{"\n"}allotment received
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 24,
                    width: "49%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>
                    Current month{"\n"}allotment received
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>
                Total allotment{"\n"}
                received{"\n"} (2+3(b))
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "25%",
                flexDirection: "column",
                height: 35,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Expenditure</Text>
              </View>
              <View style={styles.view20}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 1,
                    height: 24,
                    width: "50%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>Previous month</Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 24,
                    width: "49%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>Current month</Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>
                Total Expenditure{"\n"}
                5(b)
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
                height: 35,
              }}
            >
              <Text style={styles.text}>
                Closing Balance{"\n"}
                (4-6)
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>2</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>3(a)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>3(b)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>4</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>5(a)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>5(b)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>6</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>7</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>Bal Vatika</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.ppOB)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.prevPpRC)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                {" "}
                ₹ {IndianFormat(thisMonthlyData?.ppRC)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹{" "}
                {IndianFormat(
                  round2dec(thisMonthlyData?.ppOB + thisMonthlyData?.ppRC)
                )}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.prevMonthlyPPCost)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.monthlyPPCost)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.monthlyPPCost)}
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.ppCB)}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>Primary</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.pryOB)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.prevPryRC)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.pryRC)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹{" "}
                {IndianFormat(
                  round2dec(thisMonthlyData?.pryOB + thisMonthlyData?.pryRC)
                )}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.prevMonthlyPRYCost)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.monthlyPRYCost)}
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.monthlyPRYCost)}
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>
                ₹ {IndianFormat(thisMonthlyData?.pryCB)}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>Up-Primary</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>-</Text>
            </View>
          </View>
          <View style={styles.break}></View>
          <View style={styles.rowStartView}>
            <Text style={styles.title}>
              Utilization Certificate (FOOD GRAINS)
            </Text>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125H35}>
              <Text style={styles.text}>Class</Text>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>Opening{"\n"} Balance</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "25%",
                flexDirection: "column",
                height: 35,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={[styles.text, { fontSize: 9 }]}>
                  Allotment of Food grains received
                </Text>
              </View>
              <View style={styles.rowWrapView}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 1,
                    height: 24,
                    width: "50%",
                    padding: 0,
                  }}
                >
                  <Text style={[styles.text, { fontSize: 9 }]}>
                    Previous month{"\n"}Food grains received
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 24,
                    width: "49%",
                    padding: 0,
                  }}
                >
                  <Text style={[styles.text, { fontSize: 9 }]}>
                    Current month Food{"\n"} grains received
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>
                Total Food grains{"\n"}
                received{"\n"} (2+3(b))
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "25%",
                flexDirection: "column",
                height: 35,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Expenditure</Text>
              </View>
              <View style={styles.view20}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 1,
                    height: 24,
                    width: "50%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>Previous month</Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 24,
                    width: "49%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>Current month</Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>
                Total Expenditure{"\n"}
                5(b)
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
                height: 35,
              }}
            >
              <Text style={styles.text}>
                Closing Balance{"\n"}
                (4-6)
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>2</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>3(a)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>3(b)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>4</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>5(a)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>5(b)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>6</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>7</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>Bal Vatika</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPOB} KG.</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePPRC} KG.
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPRC} KG.</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                {thisMonthlyData?.ricePPOB + thisMonthlyData?.ricePPRC} KG.
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePPEX} KG.
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPEX} KG.</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPEX} KG.</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>{thisMonthlyData?.ricePPCB} KG.</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>Primary</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryOB} KG.</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePryRC} KG.
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryRC} KG.</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                {thisMonthlyData?.ricePryOB + thisMonthlyData?.ricePryRC} KG.
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePryEX} KG.
              </Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryEX} KG.</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryEX} KG.</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>{thisMonthlyData?.ricePryCB} KG.</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>Up-Primary</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>-</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>-</Text>
            </View>
          </View>
          <View style={styles.break}></View>
          <View style={styles.rowStartView}>
            <Text style={styles.title}>
              Utilization Certificate (HONORARIUM TO COOK)
            </Text>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125H35}>
              <Text style={styles.text}>Class</Text>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>Opening{"\n"} Balance</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "25%",
                flexDirection: "column",
                height: 35,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Allotment of fund received</Text>
              </View>
              <View style={styles.rowWrapView}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 1,
                    height: 24,
                    width: "50%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>
                    Previous month{"\n"}allotment received
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 24,
                    width: "49%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>
                    Current month{"\n"}allotment received
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>
                Total allotment{"\n"}
                received{"\n"} (2+3(b))
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "25%",
                flexDirection: "column",
                height: 35,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Expenditure</Text>
              </View>
              <View style={styles.view20}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 1,
                    height: 24,
                    width: "50%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>Previous month</Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 24,
                    width: "49%",
                    padding: 0,
                  }}
                >
                  <Text style={styles.text}>Current month</Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H35}>
              <Text style={styles.text}>
                Total Expenditure{"\n"}
                5(b)
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
                height: 35,
              }}
            >
              <Text style={styles.text}>
                Closing Balance{"\n"}
                (4-6)
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>2</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>3(a)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>3(b)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>4</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>5(a)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>5(b)</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text}>6</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
              }}
            >
              <Text style={styles.text}>7</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125H30}>
              <Text style={styles.text}>Bal Vatika & Primary & Up-Primary</Text>
            </View>
            <View style={styles.view125H30}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125H30}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125H30}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125H30}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125H30}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125H30}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view125H30}>
              <Text style={styles.text}>-</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
                height: 30,
              }}
            >
              <Text style={styles.text}>-</Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "auto",

              justifyContent: "center",
              alignItems: "flex-end",
              alignContent: "center",
              marginTop: 60,
              paddingRight: 70,
            }}
          >
            <Text style={[styles.title, { marginBottom: 5 }]}>
              ..............................................................................
            </Text>
            <Text
              style={[styles.title, { paddingRight: 70, marginBottom: 10 }]}
            >
              Signature
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.title,
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
                  styles.title,
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
                  styles.title,
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
          {thisMonthlyData?.remarks && (
            <View
              style={{
                width: "70%",
                height: "auto",

                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                marginTop: 5,
              }}
            >
              <Text style={[styles.title, { marginBottom: 5 }]}>
                Remarks:- {thisMonthlyData?.remarks}
              </Text>
            </View>
          )}
        </View>
      </Page>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.pageMainView}>
          <View
            style={{
              border: "1px solid",
              borderWidth: 1,
              width: "100%",
              height: "auto",
            }}
          >
            <Text style={styles.title}>
              Utilization Certificate (COOKING COST)
            </Text>
          </View>
          <View style={styles.tableStartView}>
            <View style={styles.view16}>
              <Text style={styles.title}>
                Name of the Month:- {thisMonthlyData?.month}&#8217;
                {thisMonthlyData?.year}
              </Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.title}>
                Financial Year:- {thisMonthlyData?.financialYear}
              </Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.title}>Ward No.:- {WARD_NO}</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.title}>Municipality/ Corporation (HMC)</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View
              style={{
                borderRightWidth: 1,
                paddingRight: 1,
                width: "50%",
                height: 15,
              }}
            >
              <Text style={styles.title}>School Name:- {SCHOOLNAME}</Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "50%",
                height: 15,
              }}
            >
              <Text style={styles.title}>BLOCK:- {BLOCK}</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125H40}>
              <Text style={styles.text}>Class</Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>Total no of Students</Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>
                Total Meal Served during the month
              </Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>No of Days Mid day meal Served</Text>
            </View>

            <View style={styles.view125H40}>
              <Text style={styles.text}>Opening{"\n"} Balance</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "34%",
                flexDirection: "column",
                height: 40,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={[styles.text]}>Allotment of fund received</Text>
              </View>
              <View style={styles.rowWrapView}>
                <View
                  style={{
                    borderRightWidth: 1,
                    padding: 0,
                    height: 30,
                    width: "48%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[styles.text, { fontSize: 10, paddingRight: 4 }]}
                  >
                    Previous month{"\n"}allotment received
                  </Text>
                </View>
                <View style={{}}>
                  <Text style={[styles.text, { fontSize: 10, paddingLeft: 4 }]}>
                    Current month{"\n"}allotment received
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H40}>
              <Text style={[styles.text, { fontSize: 10 }]}>
                Total allotment received (5+6(b))
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,

                width: "25%",
                flexDirection: "column",
                height: 40,
                justifyContent: "space-evenly",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Expenditure</Text>
              </View>
              <View style={styles.view20}>
                <View
                  style={{
                    borderRightWidth: 1,
                    padding: 0,
                    height: 25,
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text, { paddingRight: 2 }]}>
                    Previous{"\n"} month
                  </Text>
                </View>
                <View
                  style={{
                    padding: 0,
                    height: 25,
                    width: "48%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>Current{"\n"} month</Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H40}>
              <Text style={[styles.text, { fontSize: 10 }]}>
                Total{"\n"}Expenditure{"\n"}
                8(b)
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
                height: 40,
              }}
            >
              <Text style={[styles.text, { fontSize: 10 }]}>
                Closing{"\n"}Balance{"\n"}
                (7-9)
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>2</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>3</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>4</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>5</Text>
            </View>
            <View style={[styles.view88, { width: "12%" }]}>
              <Text style={styles.text}>6(a)</Text>
            </View>
            <View style={[styles.view88, { width: "12%" }]}>
              <Text style={styles.text}>6(b)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>7</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>8(a)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>8(b)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>9</Text>
            </View>
            <View style={[styles.view88, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>10</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>Bal Vatika</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ppStudent}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ppTotal}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.worrkingDays}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.ppOB)}
              </Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.prevPpRC)}
              </Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.ppRC)}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹
                {IndianFormat(
                  round2dec(thisMonthlyData?.ppOB + thisMonthlyData?.ppRC)
                )}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.prevMonthlyPPCost)}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.monthlyPPCost)}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.monthlyPPCost)}
              </Text>
            </View>
            <View style={[styles.view88H20, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.ppCB)}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>Primary</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.pryStudent}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.pryTotal}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.worrkingDays}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.pryOB)}
              </Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.prevPryRC)}
              </Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.pryRC)}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹
                {IndianFormat(
                  round2dec(thisMonthlyData?.pryOB + thisMonthlyData?.pryRC)
                )}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.prevMonthlyPRYCost)}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.monthlyPRYCost)}
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.monthlyPRYCost)}
              </Text>
            </View>
            <View style={[styles.view88H20, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>
                ₹{IndianFormat(thisMonthlyData?.pryCB)}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>Up-Primary</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>-</Text>
            </View>
          </View>
          <View style={styles.break}></View>
          <View
            style={{
              border: "1px solid",
              borderWidth: 1,
              borderTopWidth: 0,
              width: "100%",
              height: "auto",
            }}
          >
            <Text style={styles.title}>
              Utilization Certificate (FOOD GRAINS)
            </Text>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125H40}>
              <Text style={styles.text}>Class</Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>Total no of Students</Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>
                Total Meal Served during the month
              </Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>No of Days Mid day meal Served</Text>
            </View>

            <View style={styles.view125H40}>
              <Text style={styles.text}>Opening{"\n"} Balance</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "34%",
                flexDirection: "column",
                height: 40,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={[styles.text, { fontSize: 9 }]}>
                  Allotment of Food grains received
                </Text>
              </View>
              <View style={styles.rowWrapView}>
                <View
                  style={{
                    borderRightWidth: 1,
                    padding: 0,
                    height: 28,
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text, { fontSize: 9 }]}>
                    Previous month{"\n"}Food grains received
                  </Text>
                </View>
                <View
                  style={{
                    padding: 0,
                    height: 25,
                    width: "48%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text, { fontSize: 9 }]}>
                    Current month Food{"\n"} grains received
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H40}>
              <Text style={[styles.text, { fontSize: 10 }]}>
                Total Food grains received (5+6(b))
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,

                width: "25%",
                flexDirection: "column",
                height: 40,
                justifyContent: "space-evenly",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Expenditure</Text>
              </View>
              <View style={styles.view20}>
                <View
                  style={{
                    borderRightWidth: 1,
                    padding: 0,
                    height: 25,
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text, { paddingRight: 2 }]}>
                    Previous{"\n"} month
                  </Text>
                </View>
                <View
                  style={{
                    padding: 0,
                    height: 25,
                    width: "48%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>Current{"\n"} month</Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H40}>
              <Text style={[styles.text, { fontSize: 10 }]}>
                Total{"\n"}Expenditure{"\n"}
                8(b)
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
                height: 40,
              }}
            >
              <Text style={[styles.text, { fontSize: 10 }]}>
                Closing{"\n"}Balance{"\n"}
                (7-9)
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>2</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>3</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>4</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>5</Text>
            </View>
            <View style={[styles.view88, { width: "12%" }]}>
              <Text style={styles.text}>6(a)</Text>
            </View>
            <View style={[styles.view88, { width: "12%" }]}>
              <Text style={styles.text}>6(b)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>7</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>8(a)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>8(b)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>9</Text>
            </View>
            <View style={[styles.view88, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>10</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>Bal Vatika</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ppStudent}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ppTotal}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.worrkingDays}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPOB} KG.</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePPRC} KG.
              </Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPRC} KG.</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                {thisMonthlyData?.ricePPOB + thisMonthlyData?.ricePPRC} KG.
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePPEX} KG.
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPEX} KG.</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPEX} KG.</Text>
            </View>
            <View style={[styles.view88H20, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>{thisMonthlyData?.ricePPCB} KG.</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>Primary</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.pryStudent}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.pryTotal}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.worrkingDays}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryOB} KG.</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePryRC} KG.
              </Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryRC} KG.</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                {thisMonthlyData?.ricePryOB + thisMonthlyData?.ricePryRC} KG.
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>
                {thisMonthlyData?.prevRicePryEX} KG.
              </Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryEX} KG.</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryEX} KG.</Text>
            </View>
            <View style={[styles.view88H20, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>{thisMonthlyData?.ricePryCB} KG.</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>Up-Primary</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>-</Text>
            </View>
          </View>
          <View style={styles.break}></View>
          <View
            style={{
              border: "1px solid",
              borderWidth: 1,
              borderTopWidth: 0,
              width: "100%",
              height: "auto",
            }}
          >
            <Text style={styles.title}>
              Utilization Certificate (HONORARIUM TO COOK)
            </Text>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125H40}>
              <Text style={styles.text}>Class</Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>Total no of Students</Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>No of Cook engaged</Text>
            </View>
            <View style={styles.view125H40}>
              <Text style={styles.text}>No of Days Mid day meal Served</Text>
            </View>

            <View style={styles.view125H40}>
              <Text style={styles.text}>Opening{"\n"} Balance</Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                width: "34%",
                flexDirection: "column",
                height: 40,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={[styles.text]}>Allotment of fund received</Text>
              </View>
              <View style={styles.rowWrapView}>
                <View
                  style={{
                    borderRightWidth: 1,
                    padding: 0,
                    height: 30,
                    width: "48%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[styles.text, { fontSize: 10, paddingRight: 4 }]}
                  >
                    Previous month{"\n"}allotment received
                  </Text>
                </View>
                <View style={{}}>
                  <Text style={[styles.text, { fontSize: 10, paddingLeft: 4 }]}>
                    Current month{"\n"}allotment received
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H40}>
              <Text style={[styles.text, { fontSize: 9 }]}>
                Total allotment{"\n"}
                received{"\n"} (5+6(b))
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,

                width: "25%",
                flexDirection: "column",
                height: 40,
                justifyContent: "space-evenly",
                alignItems: "stretch",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.text}>Expenditure</Text>
              </View>
              <View style={styles.view20}>
                <View
                  style={{
                    borderRightWidth: 1,
                    padding: 0,
                    height: 25,
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text, { paddingRight: 2 }]}>
                    Previous{"\n"} month
                  </Text>
                </View>
                <View
                  style={{
                    padding: 0,
                    height: 25,
                    width: "48%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>Current{"\n"} month</Text>
                </View>
              </View>
            </View>
            <View style={styles.view125H40}>
              <Text style={[styles.text, { fontSize: 10 }]}>
                Total{"\n"}Expenditure{"\n"}
                8(b)
              </Text>
            </View>
            <View
              style={{
                paddingRight: 1,
                width: "12.5%",
                height: 40,
              }}
            >
              <Text style={[styles.text, { fontSize: 10 }]}>
                Closing{"\n"}Balance{"\n"}
                (7-9)
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>2</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>3</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>4</Text>
            </View>
            <View style={[styles.view88, { width: "8.8%" }]}>
              <Text style={styles.text}>5</Text>
            </View>
            <View style={[styles.view88, { width: "12%" }]}>
              <Text style={styles.text}>6(a)</Text>
            </View>
            <View style={[styles.view88, { width: "12%" }]}>
              <Text style={styles.text}>6(b)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>7</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>8(a)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>8(b)</Text>
            </View>
            <View style={styles.view88}>
              <Text style={styles.text}>9</Text>
            </View>
            <View style={[styles.view88, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>10</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{TOTAL_STUDENTS}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{CCH_NAME.length}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>{thisMonthlyData?.worrkingDays}</Text>
            </View>
            <View style={[styles.view88H20, { width: "8.8%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { width: "12%" }]}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={styles.view88H20}>
              <Text style={styles.text}>-</Text>
            </View>
            <View style={[styles.view88H20, { borderRightWidth: 0 }]}>
              <Text style={styles.text}>-</Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "auto",

              justifyContent: "center",
              alignItems: "flex-end",
              alignContent: "center",
              marginTop: 60,
              paddingRight: 70,
            }}
          >
            <Text style={[styles.title, { marginBottom: 5 }]}>
              ..............................................................................
            </Text>
            <Text
              style={[styles.title, { paddingRight: 70, marginBottom: 10 }]}
            >
              Signature
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.title,
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
                  styles.title,
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
                  styles.title,
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
      </Page>
      {/* <Page size="A4" style={styles.page} orientation="portrait">
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            Pradhan Mantri Poshan Shakti Nirman (PM POSHAN)
          </Text>
          <Text style={styles.title}>
            School Monthly Data Capture Format (MDCF)
          </Text>
          <Text style={styles.text}>
            Instructions: Keep following registers at the time of filling the
            form:-
          </Text>
          <View style={{ justifyContent: "flex-start", marginVertical: 10 }}>
            <Text style={[styles.text, { textAlign: "left" }]}>
              1) Enrolment Register, 2) Account, 3) Bank Account Pass Book, 4)
              Cooking cost details etc.
            </Text>
          </View>
          <Text
            style={[styles.title, { textAlign: "left", marginVertical: 5 }]}
          >
            1. School Details
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={styles.SecondView10}>
              <Text style={styles.text2}>Month-Year</Text>
            </View>
            <View style={styles.SecondView16}>
              <Text style={styles.text2}>{thisMonthlyData?.id}</Text>
            </View>
            <View style={styles.SecondView10}>
              <Text style={styles.text2}>UDISE Code</Text>
            </View>
            <View style={styles.SecondView10}>
              <Text style={styles.text2}>{UDISE_CODE}</Text>
            </View>
            <View style={styles.SecondView10}>
              <Text style={styles.text2}>School Name</Text>
            </View>
            <View
              style={[
                styles.SecondView16,
                { borderRightWidth: 0, width: "35%" },
              ]}
            >
              <Text style={styles.text2}>{SCHOOLNAME}</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.SecondView10}>
              <Text style={styles.text2}>Type</Text>
            </View>
            <View style={styles.secondRowView}>
              <View style={styles.secondRowView}>
                <Text style={styles.text2}>Government</Text>
                <Image
                  style={{ width: 10, height: 10, marginHorizontal: 5 }}
                  source={checked.src}
                />
              </View>
              <View style={styles.secondRowView}>
                <Text style={styles.text2}>Local Body</Text>
                <Image
                  style={{ width: 10, height: 10, marginHorizontal: 5 }}
                  source={unchecked.src}
                />
              </View>
              <View style={styles.secondRowView}>
                <Text style={styles.text2}>EGS/AIE Centres</Text>
                <Image
                  style={{ width: 10, height: 10, marginHorizontal: 5 }}
                  source={unchecked.src}
                />
              </View>
              <View style={styles.secondRowView}>
                <Text style={styles.text2}>NCLP</Text>
                <Image
                  style={{ width: 10, height: 10, marginHorizontal: 5 }}
                  source={unchecked.src}
                />
              </View>
              <View style={styles.secondRowView}>
                <Text style={styles.text2}>Madrasa/Maqtab</Text>
                <Image
                  style={{ width: 10, height: 10, marginHorizontal: 5 }}
                  source={unchecked.src}
                />
              </View>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text2}>State / UT</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>WEST BENGAL</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>District:-</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>{DIST}</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>Block/NP</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>{BLOCK}</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>Village/Ward:-</Text>
            </View>
            <View style={[styles.view125, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>{WARD_NO}</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view125}>
              <Text style={styles.text2}>Kitchen Type</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>PUCCA</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>NGO / SHG</Text>
            </View>
            <View style={[styles.view125, { width: "20%" }]}>
              <Text style={styles.text2}>{NGO_SHG}</Text>
            </View>
            <View style={styles.view125}>
              <Text style={styles.text2}>Enrolment-</Text>
            </View>
            <View style={[styles.view125, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>{TOTAL_STUDENTS}</Text>
            </View>
          </View>
          <Text
            style={[styles.title, { textAlign: "left", marginVertical: 5 }]}
          >
            2. Meals Availed Status
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={[styles.view25, { width: "50%" }]}>
              <Text style={styles.text2}> </Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>Bal Vatika</Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>Primary</Text>
            </View>
            <View style={[styles.view16H0, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>Upper Primary</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view25, { width: "50%" }]}>
              <Text style={styles.text2}>
                Number of School days during month
              </Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>
                {thisMonthlyData?.totalWorkingDays}
              </Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>
                {thisMonthlyData?.totalWorkingDays}
              </Text>
            </View>
            <View style={[styles.view16H0, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>N/A</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view25, { width: "50%" }]}>
              <Text style={styles.text2}>
                Actual Number of days Mid-Day Meal served
              </Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>{thisMonthlyData?.worrkingDays}</Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>{thisMonthlyData?.worrkingDays}</Text>
            </View>
            <View style={[styles.view16H0, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>N/A</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view25, { width: "50%" }]}>
              <Text style={styles.text2}>
                Actual Number of days Total Meals served during the month
              </Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>{thisMonthlyData?.ppTotal}</Text>
            </View>
            <View style={styles.view16H0}>
              <Text style={styles.text2}>{thisMonthlyData?.pryTotal}</Text>
            </View>
            <View style={[styles.view16H0, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>N/A</Text>
            </View>
          </View>
          <Text
            style={[styles.title, { textAlign: "left", marginVertical: 5 }]}
          >
            3. Fund Details (In Rs.)
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={[styles.view20Sec, { width: "35%" }]}>
              <Text style={styles.text3}>Component</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Opening{"\n"} Balance</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Received During the Month</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Expenditure During the Month</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>Closing Balance</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view20Sec, { width: "35%" }]}>
              <Text style={styles.text2}>Cooking Cost- Bal Vatika</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>
                ₹{" "}
                {IndianFormat(
                  ftFound
                    ? thisMonthFromFirstTransaction?.ppOB
                    : thisMonthFromTransaction?.ppOB
                )}
              </Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}> ₹ {balRCThisMonth}</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>
                ₹ {IndianFormat(thisMonthlyData?.monthlyPPCost)}
              </Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>
                ₹{" "}
                {IndianFormat(
                  round2dec(
                    ftFound
                      ? thisMonthFromFirstTransaction?.ppOB +
                          balRCThisMonth -
                          thisMonthlyData?.monthlyPPCost
                      : thisMonthFromTransaction?.ppOB +
                          balRCThisMonth -
                          thisMonthlyData?.monthlyPPCost
                  )
                )}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view20Sec, { width: "35%" }]}>
              <Text style={styles.text2}> Cooking Cost- Primary</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>
                ₹{" "}
                {IndianFormat(
                  ftFound
                    ? thisMonthFromFirstTransaction?.pryOB
                    : thisMonthFromTransaction?.pryOB
                )}
              </Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}> ₹ {pryRCThisMonth}</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>
                ₹ {thisMonthlyData?.monthlyPRYCost}
              </Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>
                ₹{" "}
                {IndianFormat(
                  round2dec(
                    ftFound
                      ? thisMonthFromFirstTransaction?.pryOB +
                          pryRCThisMonth -
                          thisMonthlyData?.monthlyPRYCost
                      : thisMonthFromTransaction?.pryOB +
                          pryRCThisMonth -
                          thisMonthlyData?.monthlyPRYCost
                  )
                )}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view20Sec, { width: "35%" }]}>
              <Text style={styles.text2}> Cooking Cost- Upper Primary</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>N/A</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}> N/A</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>N/A</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>N/A</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view20Sec, { width: "35%" }]}>
              <Text style={styles.text2}> Cook Cum Helper </Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>N/A</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}> N/A</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>N/A</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>N/A</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={[styles.view20Sec, { width: "35%" }]}>
              <Text style={styles.text2}> School Expenses: MME Expenses</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>N/A</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}> N/A</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>N/A</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>N/A</Text>
            </View>
          </View>
          <Text
            style={[styles.title, { textAlign: "left", marginVertical: 5 }]}
          >
            4. Cook Cum Helper Payment Detail
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Sl. No</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Opening{"\n"} Balance</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Cook Name</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Gender{"\n"}(M/F)</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Category{"\n"}(SC/ST/OBC/GEN)</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text3}>Payment Mode{"\n"}(Cash/ Bank)</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>
                Amount Received{"\n"}During Month (In Rs.)
              </Text>
            </View>
          </View>

          {CCH_NAME.map((cch, index) => (
            <View style={styles.rowStartView} key={index}>
              <View style={styles.view20Sec}>
                <Text style={styles.text3}>{index + 1}</Text>
              </View>
              <View style={styles.view20Sec}>
                <Text style={styles.text3}>-</Text>
              </View>
              <View style={styles.view20Sec}>
                <Text style={styles.text3}>{cch.name}</Text>
              </View>
              <View style={styles.view20Sec}>
                <Text style={styles.text3}>{cch.gender}</Text>
              </View>
              <View style={styles.view20Sec}>
                <Text style={styles.text3}>{cch.cast}</Text>
              </View>
              <View style={styles.view20Sec}>
                <Text style={styles.text3}>{cch.payment}</Text>
              </View>
              <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
                <Text style={styles.text3}>-</Text>
              </View>
            </View>
          ))}
          <Text
            style={[styles.title, { textAlign: "center", marginVertical: 5 }]}
          >
            MID DAY MEAL REPORT (UC)
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>Category</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>TOTAL NO OF STUDENTS</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>TOTAL MEAL SERVED</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>MDM RATE</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>EXPENDITURE</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>BAL VATIKA</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>{thisMonthlyData?.ppStudent}</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>{thisMonthlyData?.ppTotal}</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>₹ {mdmCost}</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>
                {thisMonthlyData?.ppTotal} × ₹ {mdmCost} = ₹{" "}
                {Math.round(thisMonthlyData?.ppTotal * mdmCost)}
              </Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>PRIMARY</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>{thisMonthlyData?.pryStudent}</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>{thisMonthlyData?.pryTotal}</Text>
            </View>
            <View style={styles.view20Sec}>
              <Text style={styles.text2}>₹ {mdmCost}</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text2}>
                {thisMonthlyData?.pryTotal} × ₹ {mdmCost} = ₹{" "}
                {Math.round(thisMonthlyData?.pryTotal * mdmCost)}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "auto",

              justifyContent: "center",
              alignItems: "flex-end",
              alignContent: "center",
              marginTop: 60,
              paddingRight: 70,
            }}
          >
            <Text style={[styles.title, { marginBottom: 5 }]}>
              ..............................................................................
            </Text>
            <Text
              style={[styles.title, { paddingRight: 70, marginBottom: 10 }]}
            >
              Signature
            </Text>
            <Text style={styles.title}>Head Teacher / Teacher-in-Charge</Text>
          </View>
          {remarks && (
            <View
              style={{
                width: "100%",
                height: "auto",

                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                marginTop: 20,
              }}
            >
              <Text style={[styles.title, { marginBottom: 5 }]}>
                Remarks:- {remarks}
              </Text>
            </View>
          )}
        </View>
      </Page>
      <Page size="A4" style={styles.page} orientation="portrait">
        <View style={styles.pageMainView}>
          <Text
            style={[styles.title, { textAlign: "left", marginVertical: 5 }]}
          >
            5. Food Grain Details (In KG.)
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={styles.view16}>
              <Text style={styles.text3}>Category</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Food Item</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Opening{"\n"} Balance</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Received During the Month</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Consumption During the Month</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>Closing Balance</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view16}>
              <Text style={styles.text3}>BAL VATIKA</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Wheat</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view16}>
              <Text style={styles.text3}>BAL VATIKA</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Rice</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>{thisMonthlyData?.ricePPOB}</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>{thisMonthlyData?.ricePPRC}</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}> {thisMonthlyData?.ricePPEX}</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>{thisMonthlyData?.ricePPCB}</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view16}>
              <Text style={styles.text3}>PRIMARY</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Wheat</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view16}>
              <Text style={styles.text3}>PRIMARY</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Rice</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>{thisMonthlyData?.ricePryOB}</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>{thisMonthlyData?.ricePryRC}</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}> {thisMonthlyData?.ricePryEX}</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>{thisMonthlyData?.ricePryCB}</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view16}>
              <Text style={styles.text3}>UPPER PRIMARY</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Wheat</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view16}>
              <Text style={styles.text3}>PRIMARY</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>Rice</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={styles.view16}>
              <Text style={styles.text3}>-</Text>
            </View>
            <View style={[styles.view16, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <Text
            style={[styles.title, { textAlign: "left", marginVertical: 5 }]}
          >
            6. Children Health Status
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>
                No. of children from Class 1 to 8 who had received 4 IFA tablets
                (Boys)-
              </Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>{PRIMARY_BOYS}</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>
                No. of children from Class 1 to 8 who had received 4 IFA tablets
                (Girls)-
              </Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>{PRIMARY_GIRLS}</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>
                No. of children screened by mobile health (RBSK) team
              </Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>NIL</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>
                No. of children referred by mobile health (RBSK) team
              </Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>NIL</Text>
            </View>
          </View>
          <Text
            style={[styles.title, { textAlign: "left", marginVertical: 5 }]}
          >
            7. School Inspection
          </Text>
          <View style={styles.secondTableStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>
                School Inspection done during the month
              </Text>
            </View>
            <View
              style={[
                styles.view20Sec,
                { borderRightWidth: 0, flexDirection: "row" },
              ]}
            >
              <Text style={styles.text3}>Yes</Text>
              <Image
                style={{ width: 10, height: 10, marginHorizontal: 5 }}
                source={unchecked.src}
              />
              <Text style={styles.text3}>No</Text>
              <Image
                style={{ width: 10, height: 10, marginHorizontal: 5 }}
                source={unchecked.src}
              />
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>By Members of Task Force</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>By District Officials</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>By Block/Taluka Level Officials</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <View style={styles.rowStartView}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>By SMC Members</Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>-</Text>
            </View>
          </View>
          <View style={[styles.secondTableStartView, { marginTop: 5 }]}>
            <View style={styles.view80H20}>
              <Text style={styles.text3}>
                Number of unwanted incidents occurred
              </Text>
            </View>
            <View style={[styles.view20Sec, { borderRightWidth: 0 }]}>
              <Text style={styles.text3}>NIL</Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "auto",

              justifyContent: "center",
              alignItems: "flex-end",
              alignContent: "center",
              marginTop: 60,
              paddingRight: 70,
            }}
          >
            <Text style={[styles.title, { marginBottom: 5 }]}>
              ..............................................................................
            </Text>
            <Text
              style={[styles.title, { paddingRight: 70, marginBottom: 10 }]}
            >
              Signature
            </Text>
            <Text style={styles.title}>Head Teacher / Teacher-in-Charge</Text>
          </View>
        </View>
      </Page> */}
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 5,
    margin: 5,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: width,
    height: height,
  },
  pageMainView: {
    padding: 5,
    margin: 5,
    backgroundColor: "#FFFFFF",
    border: "1px solid",
    borderWidth: 2,
    alignSelf: "center",
    width: "98%",
    height: "98%",
  },
  title: {
    fontSize: 11,
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  text: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  text2: {
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  text3: {
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  headingView: {
    border: "1px solid",
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
  secondTableStartView: {
    borderWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  view88H20: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "8.78%",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  view88: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "8.78%",
    justifyContent: "center",
    alignItems: "center",
  },
  SecondView16: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "16%",
    height: 15,
  },
  SecondView10: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "10%",
    height: 15,
  },
  view25: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "25%",
  },
  view16: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "25%",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  view16H0: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "16%",
  },
  view25H30: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "25%",
    height: 30,
  },
  view20: {
    paddingRight: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 20,
  },
  view20Sec: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 1,
    width: "20%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 20,
  },
  view125: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
  },
  view125H35: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
    height: 35,
  },
  view125H30: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
    height: 30,
  },
  view125H35: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  view125H40: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  view80H20: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "80%",
    height: 20,
  },
  rowStartView: {
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
    paddingRight: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
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
  family: "Times",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/times.ttf",
});
Font.register({
  family: "TimesBold",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/timesBold.ttf",
});
