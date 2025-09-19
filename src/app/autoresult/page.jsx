"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx"; // <-- XLSX import

export default function Autoresult() {
  const [data, setData] = useState([]);
  const [columsArray, setColumsArray] = useState([]);
  const [values, setValues] = useState([]);
  const [type, setType] = useState(null);
  const [selectedCols, setSelectedCols] = useState([]); // <-- Track visible columns

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setType(file.type);

    if (file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data;
          setData(parsedData);
          setColumsArray(Object.keys(parsedData[0]));
          setValues(parsedData);
          setSelectedCols(Object.keys(parsedData[0])); // show all by default
        },
      });
    } else if (file.type === "application/json") {
      let reader = new FileReader();
      reader.onload = function (e) {
        const parsedData = JSON.parse(e.target.result);
        setData(parsedData);
        setColumsArray(Object.keys(parsedData[0]));
        setValues(parsedData);
        setSelectedCols(Object.keys(parsedData[0])); // show all by default
      };
      reader.readAsText(file);
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      let reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setData(worksheet);
        setColumsArray(Object.keys(worksheet[0]));
        setValues(worksheet);
        setSelectedCols(Object.keys(worksheet[0])); // show all by default
      };
      reader.readAsArrayBuffer(file);
    } else {
      //eslint-disable-next-line
      alert("Invalid file type. Please upload a CSV, JSON, or XLSX file.");
    }
  };

  const toggleColumn = (col) => {
    if (selectedCols.includes(col)) {
      setSelectedCols(selectedCols.filter((c) => c !== col));
    } else {
      setSelectedCols([...selectedCols, col]);
    }
  };

  return (
    <div className="container">
      <div className="mx-auto col-md-6 noprint">
        <div className="input-group mb-3">
          <input
            type="file"
            className="form-control"
            id="inputGroupFile02"
            accept=".csv,.json,.xlsx"
            onChange={handleChange}
          />
        </div>
        {data.length !== 0 && (
          <div>
            <button
              className="btn btn-danger"
              onClick={() => {
                setData([]);
                setColumsArray([]);
                setValues([]);
                setSelectedCols([]);
                if (typeof window !== "undefined") {
                  document.getElementById("inputGroupFile02").value = "";
                }
              }}
              type="button"
            >
              Reset
            </button>
            <button
              className="btn btn-success mx-3"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.print();
                }
              }}
              type="button"
            >
              Print
            </button>
          </div>
        )}
      </div>

      {/* Column filter section */}
      {columsArray.length > 0 && (
        <div className="my-3 noprint">
          <h5>Choose Columns:</h5>
          <div className="d-flex flex-wrap">
            {columsArray.map((col) => (
              <div key={col} className="form-check mx-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`col-${col}`}
                  checked={selectedCols.includes(col)}
                  onChange={() => toggleColumn(col)}
                />
                <label htmlFor={`col-${col}`} className="form-check-label">
                  {col}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data table */}
      <div className="mx-auto my-3 d-flex flex-column justify-content-center align-items-center">
        {data.length > 0 && (
          <table
            className="table table-bordered"
            style={{
              border: "1px solid",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Sl</th>
                {selectedCols.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {selectedCols.map((col, i) => (
                    <td key={i}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
