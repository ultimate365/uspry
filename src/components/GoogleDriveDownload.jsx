import React from "react";

const GoogleDriveDownload = ({
  fileId,
  text = "Click Here",
  className = "d-inline-block text-decoration-none fw-bold",
}) => {
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return (
    <a
      href={downloadUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {text}
    </a>
  );
};

export default GoogleDriveDownload;
