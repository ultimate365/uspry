"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
import { firestore } from "../../context/FirbaseContext";
import { getDocs, query, collection, doc, updateDoc } from "firebase/firestore";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { comparePassword } from "@/modules/calculatefunctions";
import bcrypt from "bcryptjs";
export default function UserTeachers() {
  const {
    state,
    teachersState,
    setTeachersState,
    setTeacherUpdateTime,
    userState,
    userUpdateTime,
    setUserState,
    setUserUpdateTime,
  } = useGlobalContext();

  const access = state?.ACCESS;
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);
  const [userTeachers, setUserTeachers] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const getTeacherData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "teachers"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setLoader(false);
    setAllTeachers(data);
    setTeachersState(data);
    setTeacherUpdateTime(Date.now());
    setShowTable(true);
  };

  const getUserTeacherData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "userTeachers"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setUserTeachers(data);
    setUserState(data);
    setUserUpdateTime(Date.now());
    setLoader(false);
    setShowTable(true);
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, ind) => allTeachers.findIndex((i) => i.id === row.id) + 1,
      width: "2",
    },

    {
      name: "Teacher Name",
      selector: (row) => row.tname,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Employee ID",
      selector: (row) => row.empid,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "PAN",
      selector: (row) => row.pan,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Is Default Username",
      selector: (row) => {
        const dbUsername =
          userTeachers[userTeachers.findIndex((i) => i.id === row.id)].username;
        if (dbUsername === row.empid) {
          return <p className="text-success">Yes</p>;
        } else {
          <button
            className="btn btn-primary"
            type="button"
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to reset ${row.tname}'s Username`
                )
              ) {
                try {
                  setLoader(true);

                  const docRef = doc(firestore, "userTeachers", row.id);
                  await updateDoc(docRef, {
                    username: row.empid,
                  })
                    .then(() => {
                      toast.success(
                        `Congrats! ${row.tname}'s Username Changed to Default Successfully!`
                      );
                      getUserTeacherData();
                      setLoader(false);
                    })
                    .catch((e) => {
                      toast.error("Server Error! Unable to Change Username!");
                      setLoader(false);
                      console.log(e);
                    });
                } catch (e) {
                  toast.error("Server Error! Unable to Change Username!");
                  setLoader(false);
                  console.log(e);
                }
              }
            }}
          >
            Reset Password
          </button>;
        }
      },
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Is Default Password",
      selector: (row) => {
        const checkPassword = comparePassword(
          row.pan,
          userTeachers[userTeachers.findIndex((i) => i.id === row.id)].password
        );
        if (!checkPassword) {
          return (
            <button
              className="btn btn-primary"
              type="button"
              onClick={async () => {
                if (
                  window.confirm(
                    `Are you sure you want to reset ${row.tname}'s password`
                  )
                ) {
                  try {
                    setLoader(true);
                    const newPassword = bcrypt.hashSync(row.pan, 10);
                    const docRef = doc(firestore, "userTeachers", row.id);
                    await updateDoc(docRef, {
                      password: newPassword,
                    })
                      .then(() => {
                        toast.success(
                          `Congrats! ${row.tname}'s Password Changed to Default Successfully!`
                        );
                        getUserTeacherData();
                        setLoader(false);
                      })
                      .catch((e) => {
                        toast.error("Server Error! Unable to Change Password!");
                        setLoader(false);
                        console.log(e);
                      });
                  } catch (e) {
                    toast.error("Server Error! Unable to Change Password!");
                    setLoader(false);
                    console.log(e);
                  }
                }
              }}
            >
              Reset Password
            </button>
          );
        } else {
          return <p className="text-success">Yes</p>;
        }
      },
      sortable: +true,
      wrap: +true,
      center: +true,
    },
  ];

  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    if (teachersState.length === 0) {
      getTeacherData();
    } else {
      setAllTeachers(teachersState);
      setShowTable(true);
    }
    if (userState.length === 0) {
      getUserTeacherData();
    } else {
      setUserTeachers(userState);
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      {loader && <Loader />}
      {showTable ? (
        <>
          <h3 className="text-center text-primary">
            User Teacher&apos;s Deatails
          </h3>
          <h5 className="text-danger">
            *** Teacher&apos;s Default Username is Employee ID and Default
            Password is PAN
          </h5>
          <DataTable
            columns={columns}
            data={allTeachers}
            pagination
            highlightOnHover
            fixedHeader
          />
        </>
      ) : (
        <Loader center content="loading" size="lg" />
      )}
    </div>
  );
}
