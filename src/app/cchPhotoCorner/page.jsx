"use client";
import React from "react";
import CCH from "./cch.json";
import { SCHOOLNAME } from "@/modules/constants";
import Image from "next/image";
export default function CchPhotoCorner() {
  return (
    <div className="container text-center mx-auto flex-wrap my-2">
      <h3 className="text-center">COOK CUM HELPERS' CORNER OF {SCHOOLNAME}</h3>

      <div className="row mx-auto justify-content-center">
        {CCH.map((el, index) => {
          return (
            <div
              style={{
                width: "250px",
                margin: "10px",
                border: "1px solid black",
                borderRadius: "10px",
                padding: "5px",
              }}
              className="justify-content-center align-items-center text-center"
              key={index}
            >
              <div className="align-items-center">
                <div
                  style={{
                    width: "200px",
                    height: "230px",
                    margin: "auto",
                    marginBottom: "5px",
                    padding: 5,
                    // borderWidth: "1px",
                    // borderRadius: "5px",
                    // borderColor: "1px solid black",
                  }}
                  className="text-center justify-content-center align-items-center border-1 border-dark"
                >
                  <Image
                    src={el?.url}
                    width={195}
                    height={225}
                    style={{
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: "black",
                    }}
                    alt="profileImage"
                  />
                </div>
              </div>

              <h6 className="m-1 p-0 text-center text-wrap">
                Name: {el?.name}
              </h6>

              <h6 className="m-1 p-0 text-center text-wrap">
                Designation: Cook Cum Helper {index + 1}
              </h6>
              {index === 0 && (
                <h6 className="m-1 p-0 text-center text-wrap">
                  School Key Holder
                </h6>
              )}
              <h6 className="m-1 p-0 text-center text-wrap">
                Mobile: {el?.mobile}
              </h6>
              <h6 className="m-1 p-0 text-center text-wrap">Address:</h6>
              <h6 className="m-1 p-0 text-center text-wrap">{el?.address1}</h6>
              <h6 className="m-1 p-0 text-center text-wrap">{el?.address2}</h6>
            </div>
          );
        })}
      </div>
      <div className="mx-auto my-3 noprint">
        <button
          type="button"
          className="btn btn-primary text-white font-weight-bold p-2 rounded"
          onClick={() => {
            if (typeof document != "undefined") {
              window.print();
            }
          }}
        >
          Print
        </button>
      </div>
    </div>
  );
}
