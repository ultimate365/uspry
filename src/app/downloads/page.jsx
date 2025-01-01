"use client";
import React, { useEffect, useState } from "react";
import { firestore, storage } from "../../context/FirbaseContext";

import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  deleteDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import Loader from "../../components/Loader";
import { SCHOOLNAME } from "@/modules/constants";
import { useGlobalContext } from "@/context/Store";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
const Downloads = () => {
  const { state } = useGlobalContext();
  const user = state?.USER;
  const name = user?.name;
  const access = state?.ACCESS;
  const [data, setData] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [allData, setAllData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("");
  const [editFileName, setEditFileName] = useState("");
  const [editFileId, setEditFileId] = useState("");
  const docId = uuid();
  const getData = async () => {
    setLoader(true);
    const q = query(collection(firestore, "downloads"));

    try {
      const querySnapshot = await getDocs(q);
      const datas = querySnapshot.docs
        .map((doc) => ({
          // doc.data() is never undefined for query doc snapshots
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => b.date - a.date);
      setData(true);
      setAllData(datas);
      setLoader(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoader(false);
      toast.error("Something went Wrong!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const uploadFiles = () => {
    if (file == null) {
      return;
    } else {
      setLoader(true);
      const filestorageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(filestorageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const percent = Math.round(
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // );
          console.log(snapshot);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            // console.log(url);

            try {
              await setDoc(doc(firestore, "downloads", docId), {
                id: docId,
                date: Date.now(),
                addedBy: name,
                url: url,
                fileName: fileName,
                originalFileName: file.name,
                fileType: file.type,
              });
              setFileName("");
              if (typeof window !== "undefined") {
                document.getElementById("fileInput").value = "";
              }
              toast.success("Congrats! File Uploaded Successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,

                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setLoader(false);
              getData();
              setFile({});
            } catch (e) {
              toast.success("File Upload Failed!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,

                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setLoader(false);
            }
          });
        }
      );
    }
  };
  const updateFileName = async () => {
    try {
      const docRef = doc(firestore, "downloads", editFileId);
      await updateDoc(docRef, {
        fileName: editFileName,
      });

      toast.success("Congrats! File Name Changed Successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,

        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoader(false);
      getData();
    } catch (error) {
      toast.error("Something went Wrong!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoader(false);
      console.log(error);
    }
  };
  const deleteFile = (name, id) => {
    setLoader(true);
    const desertRef = ref(storage, `files/${name}`);
    deleteObject(desertRef)
      .then(async () => {
        await deleteDoc(doc(firestore, "downloads", id));
        // File deleted successfully
        toast.success("Congrats! File Deleted Successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoader(false);
        getData();
      })
      .catch((error) => {
        setLoader(false);
        // Uh-oh, an error occurred!
        toast.error("Something Went Wrong!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    document.title = `${SCHOOLNAME}:Notifications`;
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container my-5">
      {loader ? <Loader /> : null}
      <h3 className="text-primary text-center">Downloads</h3>
      {access === "admin" && (
        <div className="my-3 mx-auto col-md-6">
          <button
            type="button"
            className="btn btn-primary my-3"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? "Hide Upload" : "Show Upload"}
          </button>
          {showUpload && (
            <div>
              <div className="mb-3">
                <h5 className="text-center text-primary">Upload File</h5>
                <input
                  type="file"
                  className="form-control"
                  placeholder="Upload Document"
                  id="fileInput"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter File Name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div className="my-3">
                <button
                  type="button"
                  className="btn btn-success my-3"
                  onClick={() => {
                    if (fileName !== "") {
                      uploadFiles();
                    } else {
                      toast.error("Please Enter File Name!", {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,

                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    }
                  }}
                >
                  Upload File
                </button>
              </div>
            </div>
          )}
          {showEdit && (
            <div>
              <h3>Edit File Name</h3>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter File Name"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                />
              </div>
              <div className="my-3">
                <button
                  type="button"
                  className="btn btn-success my-3"
                  onClick={() => {
                    if (editFileName !== "") {
                      updateFileName();
                      setShowEdit(false);
                    } else {
                      toast.error("Please Enter File Name!", {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,

                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    }
                  }}
                >
                  Update File Name
                </button>
                <button
                  type="button"
                  className="btn btn-danger mx-3"
                  onClick={() => {
                    setEditFileId("");
                    setEditFileName("");
                    setShowEdit(false);
                    setData(true);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {data &&
        (allData.length > 0 ? (
          <div className="container overflow-auto  d-flex">
            <table className="table table-responsive table-hover table-striped table-success rounded-4 container px-lg-3 py-lg-2 ">
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Format</th>
                  <th>File Name</th>
                  <th>Download</th>
                  {access === "admin" && (
                    <>
                      <th>Edit File Name</th>
                      <th>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {allData.map((el, ind) => {
                  return (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>{el.fileName.toUpperCase()}</td>
                      <td>
                        {el.fileType === "application/pdf"
                          ? "PDF"
                          : el.fileType === "application/pdf"
                          ? "PDF"
                          : el?.fileType?.split("/")[0] === "image"
                          ? "IMAGE"
                          : el.fileType ===
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          ? "WORD"
                          : el.fileType ===
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                          ? "POWERPOINT"
                          : el.fileType === "application/vnd.ms-excel"
                          ? "EXCEL"
                          : el.fileType ===
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          ? "EXCEL"
                          : el.fileType ===
                            "application/vnd.ms-excel.sheet.macroEnabled.12"
                          ? "EXCEL"
                          : el.fileType === "application/vnd.ms-powerpoint"
                          ? "EXCEL"
                          : el.fileType === "application/zip"
                          ? "ZIP"
                          : el.fileType === "application/vnd.rar"
                          ? "RAR"
                          : el.fileType === "text/csv"
                          ? "CSV"
                          : el.fileType ===
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                          ? "POWERPOINT"
                          : el.fileType ===
                            "application/vnd.android.package-archive"
                          ? "APK"
                          : ""}
                      </td>
                      <td>
                        <a
                          href={el.url}
                          className="btn btn-success rounded text-decoration-none"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </td>
                      {access === "admin" && (
                        <>
                          <td>
                            <button
                              type="button"
                              className="btn btn-warning "
                              onClick={() => {
                                setEditFileId(el.id);
                                setEditFileName(el.fileName);
                                setShowEdit(true);
                                setData(false);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger "
                              onClick={() => {
                                // eslint-disable-next-line no-alert
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this File?"
                                  )
                                ) {
                                  deleteFile(el.originalFileName, el.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h4>This Page is Under Maintenance</h4>
        ))}
    </div>
  );
};

export default Downloads;
