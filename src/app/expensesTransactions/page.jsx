"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { firestore } from "../../context/FirbaseContext";
import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { useGlobalContext } from "../../context/Store";
import Loader from "@/components/Loader";
import CustomInput from "@/components/CustomInput";
import {
  findEmptyValues,
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  IndianFormat,
  monthNamesWithIndex,
  round2dec,
  todayInString,
  compareObjects,
  titleCase,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { v4 as uuid } from "uuid";
export default function ExpensesTransactions() {
  const { stateObject, setStateObject, state, sourceState, setSourceState } =
    useGlobalContext();
  const access = state?.ACCESS;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allFTransactions, setAllFTransactions] = useState([]);
  const [showExpenseEntry, setShowExpenseEntry] = useState(false);
  const [showExpenseEdit, setShowExpenseEdit] = useState(false);
  const [account, setAccount] = useState({
    accountName: "",
    accountNumber: "",
    balance: 0,
    date: todayInString(),
  });
  const [expenseObj, setExpenseObj] = useState({
    id: "",
    amount: "",
    purpose: "",
    sourceName: "",
    type: "DEBIT",
    date: todayInString(),
    openingBalance: parseFloat(stateObject?.balance),
    closingBalance: parseFloat(stateObject?.balance),
  });
  const [editexpenseObj, setEditexpenseObj] = useState({
    id: "",
    amount: "",
    purpose: "",
    sourceName: "",
    type: "DEBIT",
    date: todayInString(),
    openingBalance: "",
    closingBalance: "",
  });
  const [editOrgexpenseObj, setEditOrgexpenseObj] = useState({
    id: "",
    amount: "",
    purpose: "",
    sourceName: "",
    type: "DEBIT",
    date: todayInString(),
    openingBalance: "",
    closingBalance: "",
  });
  const docId = uuid().split("-")[0];
  const [allSources, setAllSources] = useState([]);
  const [sources, setSources] = useState({
    sourceName: "",
    id: docId,
    accountId: stateObject?.id,
  });
  const [addSource, setAddSource] = useState(false);
  const getId = () => {
    const currentDate = new Date();
    const month =
      monthNamesWithIndex[
        currentDate.getDate() > 10
          ? currentDate.getMonth()
          : currentDate.getMonth() - 1
      ].monthName;
    const year = currentDate.getFullYear();
    return `${month}-${year}`;
  };
  const [id, setId] = useState(getId());
  const getTransactions = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "expensesTransactions"))
    );
    const data = querySnapshot.docs
      .map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }))
      .sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date))
      );
    setLoader(false);
    setAllTransactions(data);
    setAllFTransactions(data);
    const x = data.filter((t) => t.id === id);
    if (x.length > 0) {
      setId(getId() + `-${x.length}`);
    } else {
      setId(getId());
    }
    setExpenseObj({
      id: "",
      amount: "",
      purpose: "",
      type: "DEBIT",
      date: todayInString(),
      openingBalance: parseFloat(stateObject?.balance),
      closingBalance: parseFloat(stateObject?.balance),
    });
  };

  const getSources = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "expensesources"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setSourceState(data);
    const filteredSources = data.filter(
      (source) => source.accountId === stateObject?.id
    );
    setAllSources(filteredSources);
  };

  const delTransaction = async (transaction) => {
    setLoader(true);
    await deleteDoc(doc(firestore, "expensesTransactions", transaction.id))
      .then(async () => {
        const thisAccount = stateObject;
        thisAccount.balance =
          transaction.type === "DEBIT"
            ? parseFloat(
                round2dec(
                  parseFloat(stateObject.balance) +
                    parseFloat(transaction.amount)
                )
              )
            : parseFloat(
                round2dec(
                  parseFloat(stateObject.balance) -
                    parseFloat(transaction.amount)
                )
              );
        await updateDoc(doc(firestore, "expenses", stateObject.id), thisAccount)
          .then(() => {
            setStateObject(thisAccount);
            toast.success("Account Updated successfully");
            setLoader(false);
            getTransactions();
          })
          .catch((err) => {
            setLoader(false);
            toast.error("Account Update Failed!");
          });
      })
      .catch((err) => {
        setLoader(false);
        toast.error("Transaction Deletion Failed!");
      });
  };

  const handleVECSubmit = async (e) => {
    e.preventDefault();
    if (findEmptyValues(expenseObj)) {
      try {
        setLoader(true);
        await setDoc(
          doc(firestore, "expensesTransactions", expenseObj.id),
          expenseObj
        );

        let thisAccount = stateObject;
        thisAccount.balance = expenseObj.closingBalance;
        thisAccount.date = expenseObj.date;
        await updateDoc(doc(firestore, "expenses", stateObject.id), {
          balance: thisAccount.balance,
          date: thisAccount.date,
        });
        setStateObject(thisAccount);
        setShowExpenseEntry(false);
        getTransactions();
        setLoader(false);
        toast.success("Transaction added successfully");
      } catch (error) {
        setLoader(false);
        console.log(error);
        toast.error("Transaction addition failed");
      }
    } else {
      toast.error("Please fill all required fields");
    }
  };

  const updateVec = async () => {
    try {
      setLoader(true);
      await updateDoc(
        doc(firestore, "expensesTransactions", editexpenseObj.id),
        editexpenseObj
      );

      const fetchedAmount = stateObject.balance;
      let amount = 0;
      if (
        editOrgexpenseObj.type !== editexpenseObj.type &&
        editOrgexpenseObj.amount !== editexpenseObj.amount
      ) {
        console.log("Case 1");
        if (editOrgexpenseObj.type === "DEBIT") {
          if (fetchedAmount + parseFloat(editexpenseObj.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount + parseFloat(editexpenseObj.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount + parseFloat(editexpenseObj.amount) * 2
            );
          }
        } else {
          if (fetchedAmount - parseFloat(editexpenseObj.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount - parseFloat(editexpenseObj.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount - parseFloat(editexpenseObj.amount) * 2
            );
          }
        }
      } else if (
        editOrgexpenseObj.type !== editexpenseObj.type &&
        editOrgexpenseObj.amount === editexpenseObj.amount
      ) {
        console.log("Case 2");
        if (editOrgexpenseObj.type === "DEBIT") {
          if (fetchedAmount + parseFloat(editexpenseObj.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount + parseFloat(editexpenseObj.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount + parseFloat(editexpenseObj.amount) * 2
            );
          }
        } else {
          if (fetchedAmount - parseFloat(editexpenseObj.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount - parseFloat(editexpenseObj.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount - parseFloat(editexpenseObj.amount) * 2
            );
          }
        }
      } else if (
        editOrgexpenseObj.type === editexpenseObj.type &&
        editOrgexpenseObj.amount !== editexpenseObj.amount
      ) {
        console.log("Case 3");
        if (editOrgexpenseObj.type === "DEBIT") {
          if (
            fetchedAmount -
              parseFloat(editOrgexpenseObj.amount) +
              parseFloat(editexpenseObj.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount +
                  parseFloat(editOrgexpenseObj.amount) -
                  parseFloat(editexpenseObj.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount +
                parseFloat(editOrgexpenseObj.amount) -
                parseFloat(editexpenseObj.amount)
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(editOrgexpenseObj.amount) +
              parseFloat(editexpenseObj.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(editOrgexpenseObj.amount) +
                  parseFloat(editexpenseObj.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(editOrgexpenseObj.amount) +
                parseFloat(editexpenseObj.amount)
            );
          }
        }
      } else {
        console.log("Case 4");
        if (editOrgexpenseObj.type === "DEBIT") {
          if (
            fetchedAmount -
              parseFloat(editOrgexpenseObj.amount) +
              parseFloat(editexpenseObj.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(editOrgexpenseObj.amount) +
                  parseFloat(editexpenseObj.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(editOrgexpenseObj.amount) +
                parseFloat(editexpenseObj.amount)
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(editOrgexpenseObj.amount) -
              parseFloat(editexpenseObj.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(editOrgexpenseObj.amount) -
                  parseFloat(editexpenseObj.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(editOrgexpenseObj.amount) +
                parseFloat(editexpenseObj.amount)
            );
          }
        }
      }
      let thisAccount = stateObject;
      thisAccount.date = editexpenseObj.date;
      thisAccount.balance = amount;
      await updateDoc(doc(firestore, "expenses", stateObject.id), {
        balance: thisAccount.balance,
        date: thisAccount.date,
      });
      toast.success("VEC Transaction updated successfully");
      setShowExpenseEdit(false);
      getTransactions();
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("VEC Transaction update failed");
    }
  };

  const submitSource = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      await setDoc(doc(firestore, "expensesources", sources.id), sources)
        .then(() => {
          let x = [];
          x = [...sourceState, sources];
          setSourceState(x);
          setAllSources(x);
          setAddSource(false);
          setLoader(false);
          setTimeout(() => {
            setSources({
              sourceName: "",
              id: docId,
              accountId: stateObject?.id,
            });
            toast.success("Source added successfully");
          }, 600);
        })
        .catch((e) => {
          setLoader(false);
          toast.error("Source addition failed");
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Source addition failed");
    }
  };
  const removeSource = async (id) => {
    try {
      setLoader(true);
      await deleteDoc(doc(firestore, "expensesources", id))
        .then(() => {
          let x = sourceState;
          x = sourceState.filter((s) => s.id !== id);
          setSourceState(x);
          setAllSources(x);
          setAddSource(false);
          setLoader(false);
          toast.success("Source Deleted successfully");
        })
        .catch((e) => {
          setLoader(false);
          toast.error("Source Deletation failed");
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Source Deletation failed");
    }
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, ind) =>
        allFTransactions.findIndex((i) => i.id === row.id) + 1,
      width: "7%",
    },

    {
      name: "Date",
      selector: (row) => row.date,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "15%",
    },
    {
      name: "Type",
      selector: (row) => (row.type === "DEBIT" ? "DR" : "CR"),
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "9%",
    },
    {
      name: "Source",
      selector: (row) => row.sourceName,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "9%",
    },

    {
      name: "Purpose",
      selector: (row) => row?.purpose,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "13%",
    },
    {
      name: "Amount",
      selector: (row) => `₹ ${IndianFormat(row?.amount)}`,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "10%",
    },
    {
      name: "Opening Balance",
      selector: (row) => `₹ ${IndianFormat(row?.openingBalance)}`,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "10%",
    },
    {
      name: "Closing Balance",
      selector: (row) => `₹ ${IndianFormat(row?.closingBalance)}`,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "10%",
    },
    {
      name: "Action",
      selector: (transaction, index) => (
        <div>
          <button
            type="button"
            className={`btn btn-warning m-1`}
            style={{ fontSize: 10 }}
            onClick={() => {
              setShowExpenseEntry(false);
              setShowExpenseEdit(true);
              setEditexpenseObj(transaction);
              setEditOrgexpenseObj(transaction);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className={`btn btn-danger m-1`}
            style={{ fontSize: 10 }}
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (
                window.confirm("Are you sure you want to delete this entry?")
              ) {
                delTransaction(transaction);
              }
            }}
          >
            Delete
          </button>
        </div>
      ),
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "20%",
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row.type === "DEBIT",
      style: {
        backgroundColor: "red",
        color: "white",
      },
    },
    {
      when: (row) => row.type === "CREDIT",
      style: {
        backgroundColor: "green",
        color: "white",
      },
    },
  ];
  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    getTransactions();
    setAccount(stateObject);
    if (sourceState.length === 0) {
      getSources();
    } else {
      const filteredSources = sourceState.filter(
        (source) => source.accountId === stateObject?.id
      );
      setAllSources(filteredSources);
    }

    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    //eslint-disable-next-line
  }, [stateObject, allTransactions, id, allSources]);

  return (
    <div className="container">
      {loader && <Loader />}
      <div>
        <h3>Transactions</h3>
        <h3>Account Name: {stateObject.accountName}</h3>
        <h3>Account Balance: ₹ {IndianFormat(stateObject?.balance)}</h3>
        <div className="my-3">
          <button
            type="button"
            className="btn btn-success m-2"
            onClick={() => {
              setShowExpenseEntry(true);
              setShowExpenseEdit(false);
            }}
          >
            Add New Transaction
          </button>
          <button
            type="button"
            className="btn btn-dark m-2"
            onClick={() => {
              setShowExpenseEntry(false);
              setShowExpenseEdit(false);
              setAddSource(true);
            }}
          >
            Add{sourceState.length > 0 ? "/ Remove" : ""} Source
          </button>
          {allTransactions.length > 0 && (
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                createDownloadLink(allTransactions, "expensesTransactions");
              }}
            >
              Download Expenses Transaction Data
            </button>
          )}
        </div>
        {allTransactions.length > 0 && (
          <DataTable
            columns={columns}
            data={allTransactions}
            pagination
            highlightOnHover
            fixedHeader
            conditionalRowStyles={conditionalRowStyles}
          />
        )}
        {/* {allTransactions.length > 0 ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{
              width: "100%",
              overflowX: "scroll",
              flexWrap: "wrap",
            }}
          >
            <table
              style={{
                width: "100%",
                overflowX: "auto",
                marginBottom: "20px",
                border: "1px solid",
              }}
              className="text-white"
            >
              <thead>
                <tr
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center bg-primary"
                >
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center px-1"
                  >
                    Date
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center px-1"
                  >
                    Type
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center px-1"
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center px-1"
                  >
                    Purpose
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center px-1"
                  >
                    Opening Balance
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center px-1"
                  >
                    Closing Balance
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center px-1"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((transaction, index) => (
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className={`text-center ${
                      transaction.type === "CREDIT" ? "bg-success" : "bg-danger"
                    }`}
                    key={transaction.id}
                  >
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center px-1"
                    >
                      {transaction.date}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center px-1"
                    >
                      {transaction.type}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center px-1"
                    >
                      ₹ {IndianFormat(transaction?.amount)}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center px-1"
                    >
                      {transaction.purpose}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center px-1"
                    >
                      ₹ {IndianFormat(transaction?.openingBalance)}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                      }}
                      className="text-center px-1"
                    >
                      ₹ {IndianFormat(transaction?.closingBalance)}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        backgroundColor: "lavender",
                      }}
                      className="text-center px-1"
                    >
                      <button
                        type="button"
                        className={`btn btn-warning m-1`}
                        onClick={() => {
                          setShowExpenseEntry(false);
                          setShowExpenseEdit(true);
                          setEditexpenseObj(transaction);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`btn btn-danger m-1`}
                        onClick={() => {
                          // eslint-disable-next-line no-alert
                          if (
                            window.confirm(
                              "Are you sure you want to delete this entry?"
                            )
                          ) {
                            delTransaction(transaction);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h6>No Transactions Found</h6>
        )} */}

        {showExpenseEntry && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Add New Transaction
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setShowExpenseEntry(false);
                      setExpenseObj({
                        id: "",
                        amount: "",
                        purpose: "",
                        type: "DEBIT",
                        date: todayInString(),
                        openingBalance: parseFloat(stateObject?.balance),
                        closingBalance: parseFloat(stateObject?.balance),
                      });
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="col-md-6 mx-auto" autoComplete="off">
                    {expenseObj.id && (
                      <div className="mb-3">
                        <label htmlFor="vec_id" className="form-label">
                          ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="vec_balance"
                          value={expenseObj.id}
                          placeholder="Enter id"
                          disabled={true}
                          readOnly
                        />
                      </div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="vec_date" className="form-label">
                        Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="vec_date"
                        defaultValue={getCurrentDateInput(expenseObj.date)}
                        onChange={(e) => {
                          setExpenseObj({
                            ...expenseObj,
                            date: getSubmitDateInput(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">
                        Type
                      </label>
                      <select
                        className="form-select"
                        id="type"
                        value={expenseObj.type}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "DEBIT") {
                            setExpenseObj({
                              ...expenseObj,
                              type: value,
                              closingBalance: round2dec(
                                stateObject.balance - expenseObj.amount
                              ),
                            });
                          } else {
                            setExpenseObj({
                              ...expenseObj,
                              type: value,
                              closingBalance:
                                stateObject.balance + expenseObj.amount,
                            });
                          }
                        }}
                      >
                        <option value="CREDIT">CREDIT</option>
                        <option value="DEBIT">DEBIT</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vec_balance" className="form-label">
                        Opening Balance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vec_balance"
                        value={expenseObj.openingBalance}
                        placeholder="Enter Opening balance"
                        disabled={true}
                        readOnly={true}
                        onChange={(e) => {
                          toast.error(
                            "Can't change the opening balance, from this section"
                          );
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">
                        Select Source
                      </label>
                      <select
                        className="form-select"
                        id="type"
                        defaultValue={""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value !== "") {
                            setExpenseObj({
                              ...expenseObj,
                              sourceName: e.target.value,
                            });
                          } else {
                            setExpenseObj({
                              ...expenseObj,
                              type: value,
                              sourceName: "",
                            });
                            toast.error("Please Select a Source");
                          }
                        }}
                      >
                        <option value="">Select Sources</option>
                        {allSources.map((item, index) => (
                          <option value={item?.sourceName} key={index}>
                            {item?.sourceName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <CustomInput
                      title={"Purpose"}
                      id="vec_purpose"
                      type={"text"}
                      value={expenseObj.purpose}
                      placeholder="Enter purpose"
                      onChange={(e) => {
                        const inpMonth =
                          parseInt(expenseObj.date?.split("-")[1]) - 1;
                        const inpYear = expenseObj.date?.split("-")[2];
                        const textMonth =
                          monthNamesWithIndex[inpMonth].monthName;
                        let newId = `${textMonth}-${inpYear}`;
                        const checkDuplicate = allTransactions.filter(
                          (transaction) => transaction.id === newId
                        );
                        if (checkDuplicate.length > 0) {
                          newId =
                            new Date().getMinutes().toString() + "-" + newId;
                        }
                        setExpenseObj({
                          ...expenseObj,
                          purpose: e.target.value.toUpperCase(),
                          id:
                            titleCase(e.target.value).split(" ").join("-") +
                            "-" +
                            newId,
                        });
                      }}
                    />

                    <CustomInput
                      title={"Amount"}
                      id="vec_amount"
                      value={expenseObj.amount}
                      placeholder="Enter amount"
                      type={"number"}
                      onChange={(e) => {
                        if (e.target.value) {
                          setExpenseObj({
                            ...expenseObj,
                            amount: parseFloat(e.target.value),
                            closingBalance:
                              expenseObj.type === "DEBIT"
                                ? parseFloat(
                                    round2dec(
                                      expenseObj.openingBalance -
                                        parseFloat(e.target.value)
                                    )
                                  )
                                : parseFloat(e.target.value) +
                                  expenseObj.openingBalance,
                          });
                        } else {
                          setExpenseObj({
                            ...expenseObj,
                            amount: "",
                            closingBalance: expenseObj.openingBalance,
                          });
                        }
                      }}
                    />

                    <div className="mb-3">
                      <label htmlFor="vec_balance" className="form-label">
                        Closing Balance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vec_balance"
                        value={expenseObj.closingBalance}
                        disabled={true}
                        readOnly={true}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <div className="my-2">
                    <button
                      type="submit"
                      className="btn btn-primary m-2"
                      disabled={
                        expenseObj.closingBalance <= 0 ||
                        expenseObj.purpose === ""
                      }
                      onClick={handleVECSubmit}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger m-2"
                      onClick={() => {
                        setShowExpenseEntry(false);
                        setExpenseObj({
                          id: "",
                          amount: "",
                          purpose: "",
                          type: "DEBIT",
                          date: todayInString(),
                          openingBalance: parseFloat(stateObject?.balance),
                          closingBalance: parseFloat(stateObject?.balance),
                        });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showExpenseEdit && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Edit Transaction
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setShowExpenseEdit(false);
                      setStateObject(account);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="mx-auto col-md-6" autoComplete="off">
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">
                        Type
                      </label>
                      <select
                        className="form-select"
                        id="type"
                        value={editexpenseObj.type}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "DEBIT") {
                            if (editOrgexpenseObj.type === "DEBIT") {
                              setEditexpenseObj({
                                ...editexpenseObj,
                                type: value,
                                closingBalance:
                                  editOrgexpenseObj.closingBalance,
                              });
                            } else {
                              setEditexpenseObj({
                                ...editexpenseObj,
                                type: value,
                                closingBalance:
                                  editOrgexpenseObj.openingBalance -
                                  editexpenseObj.amount,
                              });
                            }
                          } else {
                            if (editOrgexpenseObj.type === "CREDIT") {
                              setEditexpenseObj({
                                ...editexpenseObj,
                                type: value,
                                closingBalance:
                                  editOrgexpenseObj.closingBalance,
                              });
                            } else {
                              setEditexpenseObj({
                                ...editexpenseObj,
                                type: value,
                                closingBalance:
                                  editOrgexpenseObj.openingBalance +
                                  editexpenseObj.amount,
                              });
                            }
                          }
                        }}
                      >
                        <option value="CREDIT">CREDIT</option>
                        <option value="DEBIT">DEBIT</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vec_edit_balance" className="form-label">
                        Edit Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vec_edit_balance"
                        value={editexpenseObj.amount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value) {
                            if (editexpenseObj.type === "DEBIT") {
                              setEditexpenseObj({
                                ...editexpenseObj,
                                amount: value,
                                closingBalance:
                                  editOrgexpenseObj.closingBalance +
                                  editOrgexpenseObj.amount -
                                  value,
                              });
                            } else {
                              setEditexpenseObj({
                                ...editexpenseObj,
                                amount: value,
                                closingBalance:
                                  editexpenseObj.openingBalance + value,
                              });
                            }
                          } else {
                            setEditexpenseObj({
                              ...editexpenseObj,
                              amount: "",
                              closingBalance: editOrgexpenseObj.openingBalance,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vec_edit_date" className="form-label">
                        Edit Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="vec_edit_date"
                        defaultValue={getCurrentDateInput(editexpenseObj.date)}
                        onChange={(e) => {
                          setEditexpenseObj({
                            ...editexpenseObj,
                            date: getSubmitDateInput(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">
                        Edit Source
                      </label>
                      <select
                        className="form-select"
                        id="type"
                        value={editexpenseObj.sourceName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value !== "") {
                            setEditexpenseObj({
                              ...editexpenseObj,
                              sourceName: e.target.value,
                            });
                          } else {
                            setEditexpenseObj({
                              ...editexpenseObj,
                              type: value,
                              sourceName: "",
                            });
                            toast.error("Please Select a Source");
                          }
                        }}
                      >
                        <option value="">Select Sources</option>
                        {allSources.map((item, index) => (
                          <option value={item?.sourceName} key={index}>
                            {item?.sourceName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vec_edit_purpose" className="form-label">
                        Edit Purpose
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vec_edit_purpose"
                        value={editexpenseObj.purpose}
                        onChange={(e) => {
                          setEditexpenseObj({
                            ...editexpenseObj,
                            purpose: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vec_edit_balance" className="form-label">
                        Edit Opening Balance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vec_edit_balance"
                        value={editexpenseObj.openingBalance}
                        onChange={(e) => {
                          setEditexpenseObj({
                            ...editexpenseObj,
                            openingBalance: parseFloat(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="vec_edit_balance" className="form-label">
                        Edit Closing Balance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vec_edit_balance"
                        value={editexpenseObj.closingBalance}
                        onChange={(e) => {
                          setEditexpenseObj({
                            ...editexpenseObj,
                            closingBalance: parseFloat(e.target.value),
                          });
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <div className="my-2">
                    <button
                      type="submit"
                      className="btn btn-primary m-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          !compareObjects(editexpenseObj, editOrgexpenseObj)
                        ) {
                          if (editexpenseObj.amount < stateObject.balance) {
                            updateVec();
                          } else {
                            toast.error("Amount is invalid");
                          }
                        } else {
                          toast.error("Nothing to update");
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger m-2"
                      onClick={() => {
                        setShowExpenseEdit(false);
                        setStateObject(account);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {addSource && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Add New Source
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setAddSource(false);
                      setSources({
                        sourceName: "",
                        id: docId,
                        accountId: stateObject?.id,
                      });
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    className="col-md-6 mx-auto"
                    autoComplete="off"
                    onSubmit={submitSource}
                  >
                    <div className="mb-3">
                      <label htmlFor="vec_id" className="form-label">
                        Source Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="sourceName"
                        value={sources.sourceName}
                        placeholder="Enter Source Name"
                        onChange={(e) => {
                          setSources({
                            ...sources,
                            sourceName: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <div className="my-2">
                    <button
                      type="submit"
                      className="btn btn-primary m-2"
                      disabled={sources.sourceName === ""}
                      onClick={submitSource}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger m-2"
                      onClick={() => {
                        setAddSource(false);
                        setSources({
                          sourceName: "",
                          id: docId,
                          accountId: stateObject?.id,
                        });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
                {sourceState.length > 0 && (
                  <div>
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="staticBackdropLabel">
                        Remove Source
                      </h1>
                    </div>
                    <div className="modal-body">
                      <div className="my-3">
                        {sourceState.map((source, index) => (
                          <div
                            className="d-flex flex-row justify-content-center align-items-center"
                            key={index}
                          >
                            <h5 className="m-2">{index + 1})</h5>
                            <h5 className="m-2">{source?.sourceName}</h5>
                            <button
                              className="btn btn-danger btn-sm m-2"
                              onClick={() => {
                                removeSource(source.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className="my-2">
                        <button
                          type="button"
                          className="btn btn-danger m-2"
                          onClick={() => {
                            setAddSource(false);
                            setSources({
                              sourceName: "",
                              id: docId,
                              accountId: stateObject?.id,
                            });
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
