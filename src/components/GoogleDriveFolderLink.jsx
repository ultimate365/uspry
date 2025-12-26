import React from "react";

export default function GoogleDriveFolderLink({ gdriveFolderID }) {
  return (
    <div className="container my-3">
      <h5 className="text-primary fw-bold my-3">Google Drive Folder Link</h5>
      <iframe
        src={`https://drive.google.com/embeddedfolderview?id=${gdriveFolderID}#grid`}
        style={{
          width: "100%",
          height: "500px",
          padding: "5px",
          border: "0",
          overflow: "hidden",
          borderRadius: "5px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      ></iframe>
    </div>
  );
}
