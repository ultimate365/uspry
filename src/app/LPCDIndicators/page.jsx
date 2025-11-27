"use client";
import React, { useState, useEffect } from "react";
import { createDownloadLink } from "@/modules/calculatefunctions";
import { toast } from "react-toastify";
const LPCDIndicators = () => {
  const [indicator, setIndicator] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const initialIndicators = [
    "Academic anxiety in English",
    "Acting",
    "Adoptable in difficult situation",
    "Anxiety in appearing test",
    "Anxiety in historical timeline",
    "Anxiety in spelling",
    "Appear in Exam",
    "Clay Modelling",
    "Co-operative with classroom",
    "Co-operative with friends",
    "Dancing",
    "Diligent",
    "Effectively manages time",
    "Empathetic",
    "Hard Working",
    "Honest",
    "Instrumental Vocal",
    "Interact with classmates",
    "Logic smart",
    "Mathematics",
    "Music Smart",
    "Nature smart",
    "None",
    "Painting",
    "People smart",
    "Playing",
    "Pronounciation",
    "Running skill",
    "Self motivated",
    "Self smart",
    "Spelling",
    "Spelling Punctuality",
    "Understanding historical timeline",
    "Understanding Mathematics",
    "Word smart",
  ];
  // Load from localStorage on first render
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("indicators"));
    if (saved && saved.length > 0) {
      // If indicators exist in local storage, use them.
      setIndicators(saved);
    } else {
      // Otherwise, set the initial indicators in state and local storage.
      setIndicators(initialIndicators);
      localStorage.setItem("indicators", JSON.stringify(initialIndicators));
    }
  }, []);

  const sortAlphabetically = (arr) => {
    return [...arr].sort((a, b) => a.localeCompare(b));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!indicator.trim()) return;
    const exists = indicators.includes(indicator.trim());
    if (exists) {
      setIndicator("");
      toast.error("Indicator already exists.");
      return;
    }
    const updated = sortAlphabetically([...indicators, indicator.trim()]);
    setIndicators(updated);
    localStorage.setItem("indicators", JSON.stringify(updated));
    toast.success("Indicator added successfully.");
    setIndicator("");
  };

  const handleDelete = (index) => {
    const filtered = indicators.filter((_, i) => i !== index);
    setIndicators(filtered);
    localStorage.setItem("indicators", JSON.stringify(filtered));
    toast.success("Indicator deleted successfully.");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(indicators[index]);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editValue.trim()) return;
    const updated = [...indicators];
    updated[editIndex] = editValue.trim();
    // Sort after update
    setIndicators(sortAlphabetically(updated));
    localStorage.setItem(
      "indicators",
      JSON.stringify(sortAlphabetically(updated))
    );
    toast.success("Indicator updated successfully.");
    setEditIndex(null);
    setEditValue("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Indicator copied to clipboard.");
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your indicators?"
    );
    if (confirmReset) {
      const resetToInitial = window.confirm(
        "Do you want to reset to the default list of indicators?\n\nPress 'OK' to reset to default.\nPress 'Cancel' to clear all indicators."
      );
      if (resetToInitial) {
        setIndicators(initialIndicators);
        localStorage.setItem("indicators", JSON.stringify(initialIndicators));
        toast.success("Indicators have been reset to the default list.");
      } else {
        setIndicators([]);
        localStorage.setItem("indicators", JSON.stringify([]));
        toast.success("All indicators have been cleared.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="col-md-6 mx-auto">
        <button
          type="button"
          className="btn btn-success mb-4"
          onClick={() => {
            createDownloadLink(indicators, "indicators");
          }}
        >
          Download Indicators
        </button>
        <h1
          className="mb-1 ben"
          style={{
            fontSize: 20,
          }}
        >
          শিখনের বৌদ্ধিক দক্ষতার ক্ষেত্রসমূহ
        </h1>
        <h5 className="mb-1">(Learning Perspective of Cognitive Domain)</h5>
        <h5 className="mb-3">(Identified Condition)</h5>
        {/* Input + Submit */}
        <form action="">
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter indicator name"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>

        {/* Indicator List */}
        <ul className="list-group mb-4">
          {indicators.length === 0 && (
            <li className="list-group-item text-muted">No indicators added.</li>
          )}

          {indicators.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {editIndex === index ? (
                <input
                  type="text"
                  className="form-control me-2"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdate(e);
                    }
                  }}
                />
              ) : (
                <span>{item}</span>
              )}

              <div className="btn-group">
                {editIndex === index ? (
                  <>
                    <button
                      type="submit"
                      className="btn btn-success btn-sm"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setEditIndex(null);
                        setEditValue("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCopy(item)}
                    >
                      Copy
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Reset Button */}
        <button className="btn btn-danger" onClick={handleReset}>
          Reset All
        </button>
      </div>
    </div>
  );
};

export default LPCDIndicators;
