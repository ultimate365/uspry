"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
import { firestore } from "../../context/FirbaseContext";
import { getDocs, query, collection } from "firebase/firestore";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import bcrypt from "bcryptjs";
export default function UserStudents() {
  const { state, studentState, setStudentState, setStudentUpdateTime } =
    useGlobalContext();

  const access = state?.ACCESS;
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [filtedStudents, setFiltedStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const getStudentData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "students"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setLoader(false);
    setAllStudents(data);
    setFiltedStudents(data);
    setStudentState(data);
    setStudentUpdateTime(Date.now());
    setShowTable(true);
    // await getStudentHassedPasswords(data);
  };
  const getStudentHassedPasswords = async (data) => {
    let allData = [];
    const fd = data.map(async (student) => {
      const hashedPassword = bcrypt.hashSync(student.birthdate, 10);
      allData = [
        ...allData,
        {
          dob: hashedPassword,
          id: student.id,
          studentID: student.student_id,
          userType: "student",
        },
      ];
    });
    await Promise.all(fd).then(() => console.log(allData));
  };
  const columns = [
    {
      name: "Sl",
      selector: (row, ind) => allStudents.findIndex((i) => i.id === row.id) + 1,
      width: "2",
    },

    {
      name: "Student Name",
      selector: (row) => row.student_name,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Class",
      selector: (row) => row.class.split(" (A)")[0],
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Student ID",
      selector: (row) => row.student_id,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.birthdate,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
  ];
  useEffect(() => {
    const result = allStudents.filter((el) => {
      return el.student_name.toLowerCase().match(search.toLowerCase());
    });
    setFiltedStudents(result);
  }, [search]);

  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    if (studentState.length === 0) {
      getStudentData();
    } else {
      setAllStudents(studentState);
      setFiltedStudents(studentState);
      setShowTable(true);
      // getStudentHassedPasswords(studentState);
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      {loader && <Loader />}
      {showTable ? (
        <>
          <h3 className="text-center text-primary">
            User Student&apos;s Deatails
          </h3>
          <DataTable
            columns={columns}
            data={filtedStudents}
            pagination
            highlightOnHover
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
            subHeaderAlign="right"
          />
        </>
      ) : (
        <Loader center content="loading" size="lg" />
      )}
    </div>
  );
}
