"use client";
import React, { useEffect } from "react";
import examData from "./exam.json";
import Image from "next/image";
export default function Result() {
  useEffect(() => {}, []);
  return (
    <div className="container text-center">
      <div className="d-flex">
        <div className="row justify-content-center align-items-center flex-wrap ">
          {examData.map((item, index) => (
            <div
              className="col-md-4 m-2 d-flex flex-column justify-content-center align-items-center nobreak"
              key={index}
              style={{
                width: "200px",
                height: 80,
                margin: "5px",
                border: "1px solid black",
                borderRadius: "10px",
              }}
            >
              <h6 className="m-1" style={{ margin: 0, padding: 0 }}>
                {item.name}
              </h6>
              <h6 className="m-1" style={{ margin: 0, padding: 0 }}>
                {" "}
                {item.class}
              </h6>
              <h4 className="m-1" style={{ margin: 0, padding: 0 }}>
                ROLL: {item.roll}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
