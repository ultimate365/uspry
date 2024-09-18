import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../context/FirbaseContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Loader from "./Loader";
import { useGlobalContext } from "../context/Store";
import { DateValueToSring } from "../modules/calculatefunctions";
import { v4 as uuid } from "uuid";

// Plugins
// eslint-disable-next-line
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
// eslint-disable-next-line
import "@react-pdf-viewer/core/lib/styles/index.css";
// eslint-disable-next-line
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Image from "next/image";

const NoticeDetails = ({ sata }) => {
  // Create new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { state } = useGlobalContext();
  const user = state?.USER;
  const name = user?.name;
  const id = user?.id;
  const access = state?.ACCESS;
  const username = user?.username;
  const mobile = user?.mobile;
  const noticeId = id + "-" + uuid().split("-")[0];
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [orgReply, setOrgReply] = useState("");
  const [noticeReplies, setNoticeReplies] = useState([]);
  const [editReplyObj, setEditReplyObj] = useState({
    id: "",
    token: "",
    username: "",
    tname: "",
    school: "",
    gp: "",
    association: "",
    email: "",
    phone: "",
    reply: "",
    date: "",
    noticeId: "",
  });
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [isLink, setIsLink] = useState(false);
  const [textArr, setTextArr] = useState([]);
  const getNoticeReplies = async () => {
    setLoader(true);
    const q = query(
      collection(firestore, "noticeReply"),
      where("noticeId", "==", sata.id)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setNoticeReplies(data);
    setLoader(false);
  };

  const addComment = async () => {
    try {
      setLoader(true);
      await setDoc(doc(firestore, "noticeReply", noticeId), {
        id: noticeId,
        token: "",
        username: username,
        tname: name,
        phone: mobile,
        reply: comment,
        date: Date.now(),
        noticeId: sata.id,
      })
        .then(async () => {
          setComment("");
          setLoader(false);
          toast.success("Comment Added Successfully!");
          getNoticeReplies();
        })
        .catch((e) => {
          setLoader(false);
          toast.error("Comment Addition Failed!");
          console.log(e);
        });
    } catch (error) {
      setLoader(false);
      toast.error("Comment Addition Failed!");
      console.log(error);
    }
  };

  const updateReply = async () => {
    setLoader(true);
    const docRef = doc(firestore, "noticeReply", editReplyObj.id);
    await updateDoc(docRef, {
      reply: editReplyObj.reply,
      editDate: Date.now(),
      editedBy: name,
    }).then(async () => {
      setLoader(false);
      toast.success("Comment Updated Successfully");
      getNoticeReplies();
    });
  };

  const delReply = async (id) => {
    setLoader(true);
    await deleteDoc(doc(firestore, "noticeReply", id))
      .then(() => {
        setLoader(false);
        toast.success("Comment Deleted Successfully!");
        getNoticeReplies();
      })
      .catch((err) => {
        setLoader(false);
        toast.error("Comment Deletation Failed!");
        console.log(err);
      });
  };

  useEffect(() => {
    getNoticeReplies();
    setHeight(window.screen.height);
    setWidth(window.screen.width);
    console.log(name);
    // eslint-disable-next-line
  }, [sata]);
  useEffect(() => {
    const txt = sata.noticeText;
    if (txt?.includes("https")) {
      setIsLink(true);
      const firstIndex = txt?.indexOf("https"); //find link start
      const linkEnd = txt?.indexOf(" ", firstIndex); //find the end of link
      const firstTextSection = txt?.slice(0, firstIndex);
      const linkSection = txt?.slice(firstIndex, linkEnd);
      const secondSection = txt?.slice(linkEnd);
      setTextArr([firstTextSection, linkSection, secondSection]);
    } else {
      setIsLink(false);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container my-3">
      {loader && <Loader />}
      <h3
        className={`text-success fs-3 ${
          !/^[a-zA-Z]+$/.test(sata.title.split(" ")[0]) ? "ben" : "timesFont"
        }`}
      >
        {sata.title}
      </h3>
      {sata.url !== "" ? (
        sata.type.split("/")[0] === "image" ? (
          <Image
            src={
              sata.url !== ""
                ? sata.url
                : "https://raw.githubusercontent.com/awwbtpta/data/main/notice.png"
            }
            className="rounded-2 w-100 my-3"
            style={{ cursor: "pointer" }}
            alt="..."
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          />
        ) : sata.type.split("/")[0] === "application" ? (
          width > 500 ? (
            <div>
              <object
                data={sata.url}
                type={sata.type}
                // width={width}
                height={height}
                className="w-100"
                aria-labelledby="Pdf"
              ></object>
              <a
                href={sata.url}
                className="btn btn-success my-3 rounded text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          ) : (
            <a
              href={sata.url}
              className="btn btn-success my-3 rounded text-decoration-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          )
        ) : // <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        //   <Viewer
        //     fileUrl={sata.url}
        //     plugins={[defaultLayoutPluginInstance]}
        //   />
        // </Worker>
        null
      ) : null}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Image
                src={
                  sata.url !== ""
                    ? sata.url
                    : "https://raw.githubusercontent.com/awwbtpta/data/main/notice.png"
                }
                className="rounded-2 w-100 my-3"
                alt="..."
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <h3
        className={`text-success fs-3 ${
          !/^[a-zA-Z]+$/.test(sata.title.split(" ")[0]) ? "ben" : "timesFont"
        }`}
      >
        {sata.title}
      </h3>
      <h5 className="text-info timesFont">
        Published At: {DateValueToSring(sata.date)}
      </h5>
      <h5 className="text-dark timesFont">By: {sata.addedBy}</h5>
      {isLink ? (
        <div>
          <h5
            className={`text-primary fs-5 ${
              !/^[a-zA-Z]+$/.test(sata.noticeText.split(" ")[0])
                ? "ben"
                : "timesFont"
            }`}
          >
            {textArr[0]}
          </h5>
          <br />
          <h5 className="text-primary fs-5 timesFont">{textArr[1]}</h5>
          <a
            href={textArr[1]}
            target="_blank"
            rel="noreferrer"
            className="text-decoration-underline text-primary fs-5 timesFont"
          >
            Click Here
          </a>
          <h5
            className={`text-primary fs-5 ${
              !/^[a-zA-Z]+$/.test(sata.noticeText.split(" ")[0])
                ? "ben"
                : "timesFont"
            }`}
          >
            {textArr[2]}
          </h5>
        </div>
      ) : (
        <h5
          className={`text-primary fs-5 ${
            !/^[a-zA-Z]+$/.test(sata.noticeText.split(" ")[0])
              ? "ben"
              : "timesFont"
          }`}
        >
          {sata.noticeText}
        </h5>
      )}
      {noticeReplies.length > 0 && (
        <div className="my-5">
          <h3 className={`fs-3 timesFont`} style={{ color: "blueviolet" }}>
            Comments:
          </h3>

          {noticeReplies.map((el, index) => (
            <div className="m-2" key={index}>
              <h4
                className={`text-primary fs-5 ${
                  !/^[a-zA-Z]+$/.test(el.reply.split(" ")[0])
                    ? "ben"
                    : "timesFont"
                }`}
              >
                {`${index + 1}) `}
                {el.reply}
              </h4>
              <p className={`text-success timesFont`}>By {el.tname}</p>
              <p className={`text-black timesFont`}>
                On {DateValueToSring(el.date)}
              </p>
              {el.editedBy !== undefined ? (
                <p className={`text-dark timesFont`}>
                  Edited By: {el.editedBy} On {DateValueToSring(el.editDate)}
                </p>
              ) : null}
              {(access === "admin" || username === el.username) && (
                <div className="my-2">
                  <button
                    type="button"
                    className="btn btn-sm m-1 btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#editNotice"
                    onClick={() => {
                      setEditReplyObj(el);
                      setOrgReply(el.reply);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm m-1 btn-danger"
                    onClick={() => {
                      // eslint-disable-next-line
                      let conf = confirm(
                        "Are you sure you want to Delete this Comment?"
                      );
                      if (conf) {
                        delReply(el.id);
                      } else {
                        toast.success("Comment Not Deleted!!!");
                      }
                    }}
                  >
                    Delete
                  </button>
                  <div
                    className="modal fade"
                    id="editNotice"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="editNotice"
                    aria-hidden="true"
                  >
                    <div
                      className={`modal-dialog modal-xl timesFont
          }`}
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="editNoticeLabel">
                            Edit Comment
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <textarea
                            className="form-control mb-3 w-50 mx-auto"
                            rows={5}
                            placeholder="Enter Comment"
                            value={editReplyObj.reply}
                            onChange={(e) =>
                              setEditReplyObj({
                                ...editReplyObj,
                                reply: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-success"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              if (editReplyObj.reply !== "") {
                                if (editReplyObj.reply !== orgReply) {
                                  updateReply();
                                } else {
                                  toast.error("Nothing to Update!!!");
                                }
                              } else {
                                toast.error("Please fill the field");
                              }
                            }}
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {name === undefined && (
        <h5 className={`text-danger fs-5 timesFont`}>
          Please Login to Post Comments
        </h5>
      )}
      {name !== undefined && (
        <div className="my-3 mx-auto">
          <button
            type="button"
            className="btn btn-sm btn-info"
            data-bs-toggle="modal"
            data-bs-target="#addNotice"
          >
            Add Comment
          </button>
          <div
            className="modal fade"
            id="addNotice"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="addNotice"
            aria-hidden="true"
          >
            <div
              className={`modal-dialog modal-xl timesFont
          }`}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addNoticeLabel">
                    Add Comment
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <textarea
                    className="form-control mb-3 w-50 mx-auto"
                    rows={5}
                    placeholder="Enter Your Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      if (comment !== "") {
                        addComment();
                      } else {
                        toast.error("Please Enter Your Comment");
                      }
                    }}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeDetails;
