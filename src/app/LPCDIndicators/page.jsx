"use client";
import React, { useState, useEffect } from "react";

const LPCDIndicators = () => {
  const [indicator, setIndicator] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Load from localStorage on first render
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("indicators"));
    if (saved) setIndicators(saved);
  }, []);

  // Save to localStorage whenever indicators change
  useEffect(() => {
    localStorage.setItem("indicators", JSON.stringify(indicators));
  }, [indicators]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!indicator.trim()) return;
    setIndicators([...indicators, indicator.trim()]);
    setIndicator("");
  };

  const handleDelete = (index) => {
    const filtered = indicators.filter((_, i) => i !== index);
    setIndicators(filtered);
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
    setIndicators(updated);
    setEditIndex(null);
    setEditValue("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    setIndicators([]);
    localStorage.removeItem("indicators");
  };

  return (
    <div className="container mt-4">
      <div className="col-md-6 mx-auto">
        <h3 className="mb-3">Indicator Manager</h3>

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
                />
              ) : (
                <span>{item}</span>
              )}

              <div className="btn-group">
                {editIndex === index ? (
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
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
