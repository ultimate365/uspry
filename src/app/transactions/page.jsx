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
import {
  btnArray,
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  IndianFormat,
  monthNamesWithIndex,
  round2dec,
  todayInString,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
export default function Transactions() {
  const {
    transactionState,
    setTransactionState,
    accountState,
    setAccountState,
    stateObject,
    setStateObject,
    state,
  } = useGlobalContext();
  const access = state?.ACCESS;
  const router = useRouter();
  const [date, setDate] = useState(todayInString());
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [transactionPurpose, setTransactionPurpose] =
    useState("MDM WITHDRAWAL");
  const [loader, setLoader] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [thisAccounTransactions, setThisAccounTransactions] = useState([]);
  const [showEntry, setShowEntry] = useState(false);
  const [amount, setAmount] = useState("");
  const [mdmWithdrawal, setMdmWithdrawal] = useState("MDM WITHDRAWAL");
  const [type, setType] = useState("DEBIT");
  const [ppOB, setPpOB] = useState("");
  const [ppCB, setPpCB] = useState("");
  const [ppRC, setPpRC] = useState("");
  const [ppEX, setPpEX] = useState("");
  const [pryOB, setPryOB] = useState("");
  const [pryRC, setPryRC] = useState("");
  const [pryCB, setPryCB] = useState("");
  const [pryEX, setPryEX] = useState("");
  const [openingBalance, setOpeningBalance] = useState(stateObject.balance);
  const [editTransaction, setEditTransaction] = useState({
    id: "",
    accountNumber: "",
    amount: "",
    month: "",
    year: "",
    purpose: "",
    type: "",
    transactionPurpose: "",
    date: "",
    ppOB: "",
    ppRC: "",
    ppCB: "",
    ppEX: "",
    pryOB: "",
    pryRC: "",
    pryCB: "",
    pryEX: "",
  });
  const [orgTransaction, setOrgTransaction] = useState({
    id: "",
    accountNumber: "",
    amount: "",
    month: "",
    year: "",
    purpose: "",
    type: "",
    transactionPurpose: "",
    date: "",
    ppOB: "",
    ppRC: "",
    ppCB: "",
    ppEX: "",
    pryOB: "",
    pryRC: "",
    pryCB: "",
    pryEX: "",
  });
  const [showEdit, setShowEdit] = useState(false);
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
  const getMonthYear = (date) => {
    const currentDate = new Date(date);
    const cmonth =
      monthNamesWithIndex[
        currentDate.getDate() > 10
          ? currentDate.getMonth()
          : currentDate.getMonth() - 1
      ].monthName;
    const cyear = currentDate.getFullYear();
    return `${cmonth}-${cyear}`;
  };
  const [id, setId] = useState(getId());
  const [purpose, setPurpose] = useState("MDM WITHDRAWAL");
  const getTransactions = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "transactions"))
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
    setThisAccounTransactions(
      data.filter(
        (account) => account.accountNumber === stateObject.accountNumber
      )
    );
    setLoader(false);
    setAllTransactions(data);
    const x = data.filter((t) => t.id === id);
    if (x.length > 0) {
      setId(getId() + `-${x.length}`);
    } else {
      setId(getId());
    }
    setTransactionState(data);
  };

  const submitTransaction = async (e) => {
    e.preventDefault();
    if (amount && purpose && type) {
      setLoader(true);
      let y = purpose;
      let z = transactionState.filter((item) => item.id === y);
      if (z.length > 0) {
        y = y + `-${z.length}`;
      }
      const transaction = {
        accountName: stateObject.accountName,
        accountNumber: stateObject.accountNumber,
        amount,
        purpose,
        type,
        date,
        month,
        year,
        transactionPurpose,
        id: y,
        ppOB,
        ppRC,
        ppEX,
        ppCB,
        pryOB,
        pryRC,
        pryEX,
        pryCB,
        openingBalance,
        closingBalance: round2dec(ppCB + pryCB),
      };
      let x = transactionState;
      x = x.push(transaction);
      setThisAccounTransactions(
        x.filter(
          (account) => account.accountNumber === stateObject.accountNumber
        )
      );
      setTransactionState(x);
      await setDoc(doc(firestore, "transactions", y), transaction);
      let thisAccount = stateObject;
      thisAccount.balance = transaction.closingBalance;
      thisAccount.date = date;
      await updateDoc(doc(firestore, "accounts", stateObject.id), {
        balance: parseFloat(thisAccount.balance),
        date: date,
      });
      const filteredAccounts = accountState.filter(
        (el) => el.id !== stateObject.id
      );

      setAccountState([...filteredAccounts, thisAccount]);
      setStateObject(thisAccount);
      toast.success("Transaction added successfully");
      setShowEntry(false);
      setLoader(false);
      setDate(todayInString());
      setType("DEBIT");
      setPurpose("MDM WITHDRAWAL");
      setAmount("");
      // getTransactions();
    } else {
      toast.error("Please fill all the required fields");
      setLoader(false);
    }
  };
  const delTransaction = async (transaction) => {
    setLoader(true);
    await deleteDoc(doc(firestore, "transactions", transaction.id));
    const thisAccount = stateObject;
    thisAccount.balance =
      transaction.type === "DEBIT"
        ? parseFloat(
            round2dec(
              parseFloat(stateObject.balance) + parseFloat(transaction.amount)
            )
          )
        : parseFloat(
            round2dec(
              parseFloat(stateObject.balance) - parseFloat(transaction.amount)
            )
          );
    await updateDoc(doc(firestore, "accounts", stateObject.id), {
      balance:
        transaction.type === "DEBIT"
          ? parseFloat(
              round2dec(
                parseFloat(stateObject.balance) + parseFloat(transaction.amount)
              )
            )
          : parseFloat(
              round2dec(
                parseFloat(stateObject.balance) - parseFloat(transaction.amount)
              )
            ),
      date: todayInString(),
    });
    let x = transactionState;
    x = x.filter((item) => item.id !== transaction.id);
    setTransactionState(x);
    setThisAccounTransactions(
      x.filter((account) => account.accountNumber === stateObject.accountNumber)
    );
    let filteredAccounts = accountState.filter(
      (el) => el.id !== stateObject.id
    );
    filteredAccounts.push(thisAccount);
    setAccountState(filteredAccounts);
    setStateObject(thisAccount);
    toast.success("Transaction deleted successfully");
    setLoader(false);
    // getTransactions();
  };

  const updateTransaction = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      await updateDoc(
        doc(firestore, "transactions", editTransaction.id),
        editTransaction
      );

      const fetchedAmount = stateObject.balance;
      let amount = 0;
      if (
        orgTransaction.type !== editTransaction.type &&
        orgTransaction.amount !== editTransaction.amount
      ) {
        console.log("Case 1");
        if (orgTransaction.type === "DEBIT") {
          if (fetchedAmount + parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount + parseFloat(editTransaction.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount + parseFloat(editTransaction.amount) * 2
            );
          }
        } else {
          if (fetchedAmount - parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount - parseFloat(editTransaction.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount - parseFloat(editTransaction.amount) * 2
            );
          }
        }
      } else if (
        orgTransaction.type !== editTransaction.type &&
        orgTransaction.amount === editTransaction.amount
      ) {
        console.log("Case 2");
        if (orgTransaction.type === "DEBIT") {
          if (fetchedAmount + parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount + parseFloat(editTransaction.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount + parseFloat(editTransaction.amount) * 2
            );
          }
        } else {
          if (fetchedAmount - parseFloat(editTransaction.amount) * 2 < 0) {
            amount =
              round2dec(
                (fetchedAmount - parseFloat(editTransaction.amount) * 2) * -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount - parseFloat(editTransaction.amount) * 2
            );
          }
        }
      } else if (
        orgTransaction.type === editTransaction.type &&
        orgTransaction.amount !== editTransaction.amount
      ) {
        console.log("Case 3");
        if (orgTransaction.type === "DEBIT") {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) +
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount +
                  parseFloat(orgTransaction.amount) -
                  parseFloat(editTransaction.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount +
                parseFloat(orgTransaction.amount) -
                parseFloat(editTransaction.amount)
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) +
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(orgTransaction.amount) +
                  parseFloat(editTransaction.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(orgTransaction.amount) +
                parseFloat(editTransaction.amount)
            );
          }
        }
      } else {
        console.log("Case 4");
        if (orgTransaction.type === "DEBIT") {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) +
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(orgTransaction.amount) +
                  parseFloat(editTransaction.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(orgTransaction.amount) +
                parseFloat(editTransaction.amount)
            );
          }
        } else {
          if (
            fetchedAmount -
              parseFloat(orgTransaction.amount) -
              parseFloat(editTransaction.amount) <
            0
          ) {
            amount =
              round2dec(
                (fetchedAmount -
                  parseFloat(orgTransaction.amount) -
                  parseFloat(editTransaction.amount)) *
                  -1
              ) * -1;
          } else {
            amount = round2dec(
              fetchedAmount -
                parseFloat(orgTransaction.amount) +
                parseFloat(editTransaction.amount)
            );
          }
        }
      }
      let thisAccount = stateObject;
      thisAccount.date = editTransaction.date;
      thisAccount.balance = amount;
      await updateDoc(doc(firestore, "accounts", stateObject.id), thisAccount);
      let filteredAccounts = accountState.filter(
        (el) => el.id !== stateObject.id
      );
      filteredAccounts.push(thisAccount);
      setAccountState(filteredAccounts);
      setStateObject(thisAccount);
      let x = transactionState;
      x = x.filter((item) => item.id !== orgTransaction.id);
      x.push(editTransaction);
      setTransactionState(x);
      setThisAccounTransactions(
        x.filter(
          (account) => account.accountNumber === stateObject.accountNumber
        )
      );
      toast.success("Transaction Updated successfully");
      setShowEdit(false);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Transaction Updation Failed");
    }
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, ind) =>
        transactionState.findIndex((i) => i.id === row.id) + 1,
      width: "7%",
    },

    {
      name: "Date",
      selector: (row) => row.date,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "13%",
    },
    {
      name: "Tran. Type",
      selector: (row) => row.type,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "10%",
    },

    {
      name: "Purpose",
      selector: (row) => row?.purpose,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "15%",
    },
    {
      name: "Amount",
      selector: (row) => `₹ ${IndianFormat(row?.amount)}`,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "12%",
    },
    {
      name: "Opening Balance",
      selector: (row) => `₹ ${IndianFormat(row?.openingBalance)}`,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "13%",
    },
    {
      name: "Closing Balance",
      selector: (row) => `₹ ${IndianFormat(row?.closingBalance)}`,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "13%",
    },
    {
      name: "Action",
      selector: (transaction, index) => (
        <div>
          <button
            type="button"
            className={`btn btn-warning btn-sm m-1`}
            style={{ fontSize: 10 }}
            onClick={() => {
              setShowEntry(false);
              setEditTransaction(transaction);
              setOrgTransaction(transaction);
              setShowEdit(true);
              setAmount(transaction.amount);
              setPurpose(transaction.purpose);
              setId(transaction.purpose);
              setType(transaction.type);
              setDate(transaction.date);
              setPpOB(transaction.ppOB);
              setPpRC(transaction.ppRC);
              setPpCB(transaction.ppCB);
              setPryOB(transaction.pryOB);
              setPryRC(transaction.pryRC);
              setPryCB(transaction.pryCB);
              setPryCB(transaction.pryCB);
              setOpeningBalance(transaction.openingBalance);
              setTimeout(() => {
                if (transaction?.purpose?.split(" ")[1] === "MDM") {
                  setMdmWithdrawal("MDM WITHDRAWAL");
                  if (typeof (window !== "undefined")) {
                    const purpose_type =
                      document.getElementById("purpose_type");
                    if (purpose_type) {
                      purpose_type.value = "MDM WITHDRAWAL";
                    }
                  }
                } else {
                  setMdmWithdrawal("OTHERS");
                }
              }, 200);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className={`btn btn-danger btn-sm m-1`}
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (
                window.confirm("Are you sure you want to delete this entry?")
              ) {
                delTransaction(transaction);
              }
            }}
            style={{ fontSize: 10 }}
          >
            Delete
          </button>
        </div>
      ),
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "18%",
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row.type === "DEBIT",
      style: {
        backgroundColor: "red",
        color: "white",
        fontSize: "11px",
      },
    },
    {
      when: (row) => row.type === "CREDIT",
      style: {
        backgroundColor: "green",
        color: "white",
        fontSize: "11px",
      },
    },
  ];
  useEffect(() => {
    if (transactionState.length === 0) {
      getTransactions();
    } else {
      setAllTransactions(transactionState);
      setThisAccounTransactions(
        transactionState.filter(
          (transaction) =>
            transaction.accountNumber === stateObject.accountNumber
        )
      );
      const x = transactionState.filter((t) => t.id === id);
      if (x.length > 0) {
        setId(getId() + `-${x.length}`);
      } else {
        setId(getId());
      }
    }
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    //eslint-disable-next-line
  }, [stateObject, allTransactions, id]);
  return (
    <div className="container">
      {loader && <Loader />}
      <div>
        <h3>Transactions</h3>
        <h3>Account Name: {stateObject.accountName}</h3>
        <h3>Account Number: {stateObject.accountNumber}</h3>
        <h3>Account Balance: ₹ {IndianFormat(stateObject?.balance)}</h3>
        <div className="my-3">
          <button
            type="button"
            className="btn btn-success m-2"
            onClick={() => {
              setShowEntry(true);
              const lastTransaction =
                transactionState[transactionState.length - 1];
              setPpOB(lastTransaction.ppCB);
              setPryOB(lastTransaction.pryCB);
            }}
          >
            Add New Transaction
          </button>
          {transactionState.length > 0 && (
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                createDownloadLink(transactionState, "transactions");
              }}
            >
              Download Transaction Data
            </button>
          )}
        </div>
        {thisAccounTransactions.length > 0 && (
          <DataTable
            columns={columns}
            data={thisAccounTransactions}
            pagination
            highlightOnHover
            fixedHeader
            conditionalRowStyles={conditionalRowStyles}
          />
        )}

        {showEntry && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-xl">
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
                      setShowEntry(false);
                      setAmount("");
                      setPurpose("MDM WITHDRAWAL");
                      setId(getId());
                      setType("DEBIT");
                      setDate(todayInString());
                      setPpOB("");
                      setPpRC("");
                      setPpCB("");
                      setPryOB("");
                      setPryRC("");
                      setPryCB("");
                      setPryCB("");
                      setOpeningBalance(stateObject.balance);
                      setMdmWithdrawal("MDM WITHDRAWAL");
                      if (typeof (window !== "undefined")) {
                        document.getElementById("purpose_type").value =
                          "MDM WITHDRAWAL";
                        document.getElementById("type").value = "DEBIT";
                      }
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    action=""
                    className="mx-auto"
                    autoComplete="off"
                    onSubmit={submitTransaction}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="date" className="form-label">
                          ID: {id}
                        </label>
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="date"
                            defaultValue={getCurrentDateInput(date)}
                            onChange={(e) => {
                              const date = getSubmitDateInput(e.target.value);
                              const currentDate = new Date(e.target.value);
                              const cmonth =
                                monthNamesWithIndex[
                                  currentDate.getDate() > 10
                                    ? currentDate.getMonth()
                                    : currentDate.getMonth() - 1
                                ].monthName;
                              const cyear = getSubmitDateInput(
                                e.target.value
                              )?.split("-")[2];
                              setDate(date);
                              setMonth(cmonth);
                              setYear(cyear);

                              const genId = getMonthYear(e.target.value);
                              const checkId = transactionState.filter(
                                (tr) => tr.id === genId
                              );
                              if (checkId.length > 0) {
                                setId(genId + `-${checkId.length + 1}`);
                              } else {
                                setId(genId);
                              }
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
                            value={type}
                            onChange={(e) => {
                              setType(e.target.value);
                              if (e.target.value === "DEBIT") {
                                setMdmWithdrawal("MDM WITHDRAWAL");
                                setPurpose("MDM WITHDRAWAL");
                                setTransactionPurpose("MDM WITHDRAWAL");
                                setPpRC(0);
                                setPryRC(0);
                                setPpCB(ppOB);
                                setPryCB(parseFloat(pryOB));
                                setPpEX("");
                                setPryEX("");
                                if (typeof (window !== "undefined")) {
                                  let purpose_type =
                                    document.getElementById("purpose_type");
                                  if (purpose_type) {
                                    purpose_type.value = "MDM WITHDRAWAL";
                                  }
                                }
                              } else {
                                setMdmWithdrawal("MDM COOKING COST");
                                setPurpose("MDM COOKING COST");
                                setTransactionPurpose("MDM COOKING COST");
                                setPpEX(0);
                                setPryEX(0);
                                setPpCB(ppOB + ppRC);
                                setPryCB(pryOB + pryRC);
                                setPpRC("");
                                setPryRC("");
                                if (typeof (window !== "undefined")) {
                                  let purpose_type =
                                    document.getElementById("purpose_type");
                                  if (purpose_type) {
                                    purpose_type.value = "MDM COOKING COST";
                                  }
                                }
                              }
                            }}
                          >
                            <option value="CREDIT">CREDIT</option>
                            <option value="DEBIT">DEBIT</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="purpose_type" className="form-label">
                            Transaction Purpose
                          </label>
                          <select
                            className="form-select"
                            id="purpose_type"
                            defaultValue={mdmWithdrawal}
                            onChange={(e) => {
                              setMdmWithdrawal(e.target.value);
                              setPurpose(e.target.value);
                              setTransactionPurpose(e.target.value);
                            }}
                          >
                            <option value="MDM WITHDRAWAL">
                              MDM WITHDRAWAL
                            </option>
                            <option value="MDM COOKING COST">
                              MDM COOKING COST
                            </option>
                            <option value="MDM INTEREST">MDM INTEREST</option>
                            <option value="OTHERS">OTHERS</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="amount" className="form-label">
                            Purpose
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="purpose"
                            value={purpose}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setPurpose(e.target.value);
                              } else {
                                setPurpose("");
                              }
                            }}
                            placeholder="Enter Purpose"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="amount" className="form-label">
                            Amount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="amount"
                            value={amount}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);

                                setAmount(parsedAmount);
                              } else {
                                setAmount("");
                              }
                            }}
                            placeholder="Enter amount"
                          />
                          {type === "DEBIT" && (
                            <small
                              id="amountHelp"
                              className="form-text text-muted fs-6 my-2"
                            >
                              Maximum amount allowed: {stateObject.balance}
                            </small>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="ppOB" className="form-label">
                            PP Opening Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="ppOB"
                            value={ppOB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setPpOB(parseFloat(e.target.value));
                              } else {
                                setPpOB("");
                              }
                            }}
                            placeholder="Enter PP Opening Balance"
                          />
                        </div>
                        {type === "CREDIT" && (
                          <div className="mb-3">
                            <label htmlFor="ppRC" className="form-label">
                              PP Received
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="ppRC"
                              value={ppRC}
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  setPpRC(parseFloat(e.target.value));
                                  setPpCB(ppOB + parseFloat(e.target.value));
                                } else {
                                  setPpRC("");
                                  setPpCB(ppRC + ppOB);
                                }
                              }}
                              placeholder="Enter PP Received"
                            />
                          </div>
                        )}
                        {type === "DEBIT" && (
                          <div className="mb-3">
                            <label htmlFor="ppRC" className="form-label">
                              PP Expense
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="ppEX"
                              value={ppEX}
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  setPpEX(parseFloat(e.target.value));
                                  setPpCB(
                                    ppOB + ppRC - parseFloat(e.target.value)
                                  );
                                } else {
                                  setPpRC("");
                                  setPpCB(ppRC + ppOB);
                                }
                              }}
                              placeholder="Enter PP Expense"
                            />
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="ppCB" className="form-label">
                            PP Closing Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="ppCB"
                            value={ppCB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setPpCB(parseFloat(e.target.value));
                              } else {
                                setPpCB("");
                              }
                            }}
                            placeholder="Enter PP Closing Balance"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="pryOB" className="form-label">
                            Primary Opening Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="pryOB"
                            value={pryOB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setPryOB(parseFloat(e.target.value));
                              } else {
                                setPryOB("");
                              }
                            }}
                            placeholder="Enter Primary Opening Balance"
                          />
                        </div>
                        {type === "CREDIT" && (
                          <div className="mb-3">
                            <label htmlFor="pryRC" className="form-label">
                              Primary Received
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="pryRC"
                              value={pryRC}
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  setPryRC(parseFloat(e.target.value));
                                  setPryCB(parseFloat(e.target.value) + pryOB);
                                } else {
                                  setPryRC("");
                                }
                              }}
                              placeholder="Enter Primary Received"
                            />
                          </div>
                        )}
                        {type === "DEBIT" && (
                          <div className="mb-3">
                            <label htmlFor="pryRC" className="form-label">
                              Primary Expense
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="pryEX"
                              value={pryEX}
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  setPryEX(parseFloat(e.target.value));
                                  setPryCB(
                                    pryOB + pryRC - parseFloat(e.target.value)
                                  );
                                } else {
                                  setPryRC("");
                                  setPryCB(pryRC + pryOB);
                                }
                              }}
                              placeholder="Enter Primary Expense"
                            />
                          </div>
                        )}
                        <div className="mb-3">
                          <label htmlFor="pryCB" className="form-label">
                            Primary Closing Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="pryCB"
                            value={pryCB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setPryCB(parseFloat(e.target.value));
                              } else {
                                setPryCB("");
                              }
                            }}
                            placeholder="Enter Primary Closing Balance"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary m-2"
                    onClick={submitTransaction}
                    disabled={
                      stateObject.amount <= 0 ||
                      stateObject.amount > stateObject.balance
                    }
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-2"
                    onClick={() => {
                      setShowEntry(false);
                      setAmount("");
                      setPurpose("MDM WITHDRAWAL");
                      setId(getId());
                      setType("DEBIT");
                      setDate(todayInString());
                      setPpOB("");
                      setPpRC("");
                      setPpCB("");
                      setPryOB("");
                      setPryRC("");
                      setPryCB("");
                      setPryCB("");
                      setOpeningBalance(stateObject.balance);
                      setMdmWithdrawal("MDM WITHDRAWAL");
                      if (typeof (window !== "undefined")) {
                        document.getElementById("purpose_type").value =
                          "MDM WITHDRAWAL";
                        document.getElementById("type").value = "DEBIT";
                      }
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showEdit && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Update Transaction</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setShowEdit(false);

                      if (typeof (window !== "undefined")) {
                        document.getElementById("type").value = "DEBIT";
                      }
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    action=""
                    className="mx-auto"
                    autoComplete="off"
                    onSubmit={updateTransaction}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="date"
                            defaultValue={getCurrentDateInput(
                              editTransaction.date
                            )}
                            onChange={(e) => {
                              const date = getSubmitDateInput(e.target.value);
                              const currentDate = new Date(e.target.value);
                              const cmonth =
                                monthNamesWithIndex[
                                  currentDate.getDate() > 10
                                    ? currentDate.getMonth()
                                    : currentDate.getMonth() - 1
                                ].monthName;
                              const cyear = getSubmitDateInput(
                                e.target.value
                              )?.split("-")[2];
                              setEditTransaction({
                                ...editTransaction,
                                date: date,
                                month: cmonth,
                                year: cyear,
                              });
                            }}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="amount" className="form-label">
                            Amount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="amount"
                            value={editTransaction.amount}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);

                                setEditTransaction({
                                  ...editTransaction,
                                  amount: parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  amount: "",
                                });
                              }
                            }}
                            placeholder="Enter amount"
                          />
                          <small
                            id="amountHelp"
                            className="form-text text-muted fs-6 my-2"
                          >
                            Maximum amount allowed: {stateObject.balance}
                          </small>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="type" className="form-label">
                            Type
                          </label>
                          <select
                            className="form-select"
                            id="type"
                            value={editTransaction.type}
                            onChange={(e) => {
                              if (e.target.value === "DEBIT") {
                                setEditTransaction({
                                  ...editTransaction,
                                  closingBalance:
                                    stateObject.balance -
                                    editTransaction.amount,
                                  type: e.target.value,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  closingBalance:
                                    stateObject.balance +
                                    editTransaction.amount,
                                  type: e.target.value,
                                });
                              }
                            }}
                          >
                            <option value="CREDIT">CREDIT</option>
                            <option value="DEBIT">DEBIT</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="purpose_type" className="form-label">
                            Transaction Purpose
                          </label>
                          <select
                            className="form-select"
                            id="purpose_type"
                            defaultValue={editTransaction.transactionPurpose}
                            onChange={(e) => {
                              setEditTransaction({
                                ...editTransaction,
                                transactionPurpose: e.target.value,
                              });
                            }}
                          >
                            <option value="MDM WITHDRAWAL">
                              MDM WITHDRAWAL
                            </option>
                            <option value="MDM COOKING COST">
                              MDM COOKING COST
                            </option>
                            <option value="MDM INTEREST">MDM INTEREST</option>
                            <option value="OTHERS">OTHERS</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="amount" className="form-label">
                            Purpose
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="purpose"
                            value={editTransaction.purpose}
                            onChange={(e) => {
                              setEditTransaction({
                                ...editTransaction,
                                purpose: e.target.value,
                              });
                            }}
                            placeholder="Enter Purpose"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="ppOB" className="form-label">
                            PP Opening Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="ppOB"
                            value={editTransaction.ppOB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  ppOB: parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  ppOB: "",
                                });
                              }
                            }}
                            placeholder="Enter PP Opening Balance"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="ppRC" className="form-label">
                            PP Received
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="ppRC"
                            value={ppRC}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setPpRC(parseFloat(e.target.value));
                                setPpCB(parseFloat(e.target.value) + ppOB);
                              } else {
                                setPpRC("");
                              }
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  ppRC: parsedAmount,
                                  pryCB: parsedAmount + editTransaction.ppOB,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  ppRC: "",
                                  ppCB: "",
                                });
                              }
                            }}
                            placeholder="Enter PP Received"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="pryRC" className="form-label">
                            PP Expense
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="ppEX"
                            value={editTransaction?.ppEX}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  ppEX: parsedAmount,
                                  ppCB:
                                    editTransaction.ppOB +
                                    editTransaction.ppRC -
                                    parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  ppEX: "",
                                  ppCB:
                                    editTransaction.ppOB + editTransaction.ppRC,
                                });
                              }
                            }}
                            placeholder="Enter PP Expense"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="ppCB" className="form-label">
                            PP Closing Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="ppCB"
                            value={editTransaction.ppCB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  ppCB: parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  ppCB: "",
                                });
                              }
                            }}
                            placeholder="Enter PP Closing Balance"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="pryOB" className="form-label">
                            Primary Opening Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="pryOB"
                            value={editTransaction.pryOB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  pryOB: parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  pryOB: "",
                                });
                              }
                            }}
                            placeholder="Enter Primary Opening Balance"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="pryRC" className="form-label">
                            Primary Received
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="pryRC"
                            value={editTransaction.pryRC}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  pryRC: parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  pryRC: "",
                                });
                              }
                            }}
                            placeholder="Enter Primary Received"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="pryRC" className="form-label">
                            Primary Expense
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="pryEX"
                            value={editTransaction?.pryEX}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  pryEX: parsedAmount,
                                  pryCB:
                                    editTransaction.pryOB +
                                    editTransaction.pryRC -
                                    parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  pryEX: "",
                                  pryCB:
                                    editTransaction.pryOB +
                                    editTransaction.pryRC,
                                });
                              }
                            }}
                            placeholder="Enter Primary Expense"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="pryCB" className="form-label">
                            Primary Closing Balance
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="pryCB"
                            value={editTransaction.pryCB}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const parsedAmount = parseFloat(e.target.value);
                                setEditTransaction({
                                  ...editTransaction,
                                  pryCB: parsedAmount,
                                });
                              } else {
                                setEditTransaction({
                                  ...editTransaction,
                                  pryCB: "",
                                });
                              }
                            }}
                            placeholder="Enter Primary Closing Balance"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <div className="my-2">
                    <button
                      type="submit"
                      className="btn btn-primary m-2"
                      onClick={updateTransaction}
                      disabled={
                        stateObject.amount <= 0 ||
                        stateObject.amount > stateObject.balance
                      }
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger m-2"
                      onClick={() => {
                        setShowEdit(false);

                        if (typeof (window !== "undefined")) {
                          document.getElementById("type").value = "DEBIT";
                        }
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
      </div>
    </div>
  );
}
