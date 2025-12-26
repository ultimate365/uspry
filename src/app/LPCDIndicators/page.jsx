"use client";
import React, { useState, useEffect } from "react";
import { createDownloadLink } from "@/modules/calculatefunctions";
import { toast } from "react-toastify";
const LPCDIndicators = () => {
  const [indicator, setIndicator] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const initialIndicators = [
    "Academic Anxiety in English",
    "Adoptable",
    "Adoptable in difficult situation",
    "Anxiety in Maths",
    "Anxiety in Pronunciation",
    "Anxiety in spelling",
    "Anxiety To appear test",
    "Attitude smart",
    "Body Smart",
    "Calculation",
    "Children loving attitude",
    "Clay modeling",
    "Co-operative with classroom",
    "Co-operative with friends",
    "Collaborate and friendly",
    "Communicative",
    "Critical thinker",
    "Curious",
    "Dancing",
    "Diligent",
    "Drawing",
    "Effective note taker",
    "Effectively manages anything",
    "Effectively manages time",
    "Efficient in sports",
    "Empathetic",
    "Energy level",
    "English grammar",
    "English Spelling",
    "Entertain with music",
    "Evaluation",
    "Fear in English",
    "Friendly",
    "Friendly Attitude",
    "Games",
    "Games and sports",
    "Gardening",
    "Gifted Children",
    "Gymnastics",
    "Handwriting",
    "Hard Working",
    "Historical Timeline",
    "Honest",
    "Interactive with friends",
    "Leadership skills",
    "Logic Smart",
    "Mathematical formula",
    "Mathematics",
    "Music",
    "Music Smart",
    "N.A.",
    "Nature Smart",
    "NO",
    "None",
    "Open minded",
    "Painting",
    "Picture Smart",
    "Playing",
    "Practice of English",
    "Practice of Environment",
    "Practice of Mathematics",
    "Pronunciation",
    "Punctual",
    "Quiz",
    "Reading",
    "Reading comprehension",
    "Running skills",
    "Self awareness",
    "Self disciplined",
    "Self grooming",
    "Self motivated",
    "Self oriented",
    "Self Smart",
    "Show leadership in sports time",
    "Singing",
    "Sketch",
    "Spelling",
    "Time management",
    "To appear test",
    "Understanding English",
    "Word Smart",
    "Work smart",
    "Writing habit",
    "Writing Test",
    "Yoga",
  ];
  // Load from localStorage on first render
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("indicators"));
    if (saved && saved.length > 0) {
      // If indicators exist in local storage, use them.
      setIndicators(saved);
    } else {
      // Otherwise, set the initial indicators in state and local storage.
      const allIndicators = [
        ...new Set([...initialIndicators, ...(saved || [])]),
      ];
      setIndicators(allIndicators);
      localStorage.setItem("indicators", JSON.stringify(allIndicators));
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
    setEditIndex(null);
    setEditValue("");
    setSearchTerm("");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(indicators[index]);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editValue.trim() && indicators.includes(editValue.trim())) {
      toast.error("Indicator already exists.");
      return;
    }
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
    setSearchTerm("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Indicator copied to clipboard.");
    setSearchTerm("");
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
      <div className="mx-auto">
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
              className="col-md-6 form-control"
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

        {/* Search Input */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search indicators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Indicator List */}
        <ul className="list-group mb-4">
          {indicators.length === 0 && (
            <li className="list-group-item text-muted">No indicators added.</li>
          )}

          {indicators.map((item, index) =>
            // Filter indicators based on search term
            item.toLowerCase().includes(searchTerm.toLowerCase()) ? (
              <li
                // It's generally better to use a stable unique ID if available,
                // but index is used here to maintain consistency with existing code.
                // If items can be reordered or deleted, a unique ID from the item itself is preferred.

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
            ) : null
          )}
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
