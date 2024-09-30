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
  const [loader, setLoader] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [thisAccounTransactions, setThisAccounTransactions] = useState([]);
  const [showEntry, setShowEntry] = useState(false);
  const [amount, setAmount] = useState("");
  const [isMDMWithdrawal, setIsMDMWithdrawal] = useState(true);
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
  const [closingBalance, setClosingBalance] = useState(stateObject.balance);
  const [editTransaction, setEditTransaction] = useState({
    id: "",
    accountNumber: "",
    amount: "",
    purpose: "",
    type: "",
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
  const [id, setId] = useState(getId());
  const [purpose, setPurpose] = useState(getId());
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

  const submitTransaction = async () => {
    if (amount && purpose && type) {
      setLoader(true);
      const transaction = {
        accountName: stateObject.accountName,
        accountNumber: stateObject.accountNumber,
        amount,
        purpose,
        type,
        date,
        id,
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
      setTransactionState(x);
      let y = purpose;
      let z = transactionState.filter((item) => item.id === y);
      if (z.length > 0) {
        y = y + `-${z.length}`;
      }
      await setDoc(doc(firestore, "transactions", y), transaction);
      let thisAccount = stateObject;
      thisAccount.balance = transaction.closingBalance;
      thisAccount.date = date;
      await updateDoc(doc(firestore, "accounts", stateObject.accountNumber), {
        balance: thisAccount.balance,
      });
      let filteredAccounts = accountState.filter(
        (el) => el.id !== stateObject.id
      );
      filteredAccounts.push(thisAccount);
      setAccountState(filteredAccounts);
      setStateObject(thisAccount);
      toast.success("Transaction added successfully");
      setShowEntry(false);
      setLoader(false);
      setDate(todayInString());
      setType("DEBIT");
      setPurpose("");
      setAmount("");
      getTransactions();
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
        ? round2dec(
            parseFloat(stateObject.balance) + parseFloat(transaction.amount)
          )
        : round2dec(
            parseFloat(stateObject.balance) - parseFloat(transaction.amount)
          );
    await updateDoc(doc(firestore, "accounts", stateObject.accountNumber), {
      balance:
        transaction.type === "DEBIT"
          ? round2dec(
              parseFloat(stateObject.balance) + parseFloat(transaction.amount)
            )
          : round2dec(
              parseFloat(stateObject.balance) - parseFloat(transaction.amount)
            ),
    });
    let x = transactionState;
    x = x.filter((item) => item.id !== transaction.id);
    setTransactionState(x);
    let filteredAccounts = accountState.filter(
      (el) => el.id !== stateObject.id
    );
    filteredAccounts.push(thisAccount);
    setAccountState(filteredAccounts);
    setStateObject(thisAccount);
    toast.success("Transaction deleted successfully");
    setLoader(false);
    getTransactions();
  };

  const updateTransaction = async () => {
    try {
      setLoader(true);
      await updateDoc(
        doc(firestore, "transactions", editTransaction.id),
        editTransaction
      );
      let thisAccount = stateObject;
      thisAccount.balance = editTransaction.ppCB + editTransaction.pryCB;
      thisAccount.date = editTransaction.date;
      await updateDoc(
        doc(firestore, "accounts", stateObject.accountNumber),
        thisAccount
      );
      let filteredAccounts = accountState.filter(
        (el) => el.id !== stateObject.id
      );
      filteredAccounts.push(thisAccount);
      setAccountState(filteredAccounts);
      setStateObject(thisAccount);
      let filteredTransactions = transactionState.filter(
        (el) => el.id !== editTransaction.id
      );
      filteredTransactions.push(editTransaction);
      setTransactionState(filteredTransactions);
      toast.success("Transaction Updated successfully");
      setShowEdit(false);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Transaction Updation Failed");
    }
  };

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
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              createDownloadLink(transactionState, "transactions");
            }}
          >
            Download Transaction Data
          </button>
        </div>
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
            {thisAccounTransactions.map((transaction, index) => (
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
                  }}
                  className="text-center px-1"
                >
                  <button
                    type="button"
                    className={`btn btn-warning m-1`}
                    onClick={() => {
                      setShowEntry(false);
                      setEditTransaction(transaction);
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
                      setClosingBalance(transaction.closingBalance);
                      setTimeout(() => {
                        if (transaction?.purpose?.split(" ")[1] === "MDM") {
                          setMdmWithdrawal("MDM WITHDRAWAL");
                          setIsMDMWithdrawal(true);
                          if (typeof (window !== "undefined")) {
                            document.getElementById("purpose_type").value =
                              "MDM WITHDRAWAL";
                          }
                        } else {
                          setMdmWithdrawal("OTHERS");
                          setIsMDMWithdrawal(false);
                        }
                      }, 200);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`btn btn-${btnArray[index].color} m-1`}
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
        {showEntry && (
          <form action="" className="mx-auto" autoComplete="off">
            <h3>Add New Transaction</h3>
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
                    defaultValue={getCurrentDateInput(date)}
                    onChange={(e) =>
                      setDate(getSubmitDateInput(e.target.value))
                    }
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
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      if (e.target.value === "DEBIT") {
                        setClosingBalance(
                          round2dec(stateObject.balance - amount)
                        );
                      } else {
                        setClosingBalance(stateObject.balance + amount);
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
                      if (e.target.value === "MDM WITHDRAWAL") {
                        setIsMDMWithdrawal(true);
                        setMdmWithdrawal(e.target.value);
                        setId(getId());
                      } else {
                        setIsMDMWithdrawal(false);
                      }
                    }}
                  >
                    <option value="MDM WITHDRAWAL">MDM WITHDRAWAL</option>
                    <option value="OTHERS">OTHERS</option>
                  </select>
                </div>
                {isMDMWithdrawal ? null : (
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
                )}
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
                        setPpCB("");
                      }
                    }}
                    placeholder="Enter PP Received"
                  />
                </div>
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
                        setPpCB(ppOB + ppRC - parseFloat(e.target.value));
                      } else {
                        setPpRC("");
                        setPpCB(ppRC + ppOB);
                      }
                    }}
                    placeholder="Enter PP Expense"
                  />
                </div>
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
                        setPryCB(pryOB + pryRC - parseFloat(e.target.value));
                      } else {
                        setPryRC("");
                        setPryCB(pryRC + pryOB);
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

                <div className="my-2">
                  <button
                    type="button"
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
                      setPurpose(getId());
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
                      setClosingBalance(stateObject.balance);
                      setMdmWithdrawal("MDM WITHDRAWAL");
                      setIsMDMWithdrawal(true);
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
          </form>
        )}
        {showEdit && (
          <form action="" className="mx-auto" autoComplete="off">
            <h3>Update Transaction</h3>
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
                    defaultValue={getCurrentDateInput(editTransaction.date)}
                    onChange={(e) =>
                      setEditTransaction({
                        ...editTransaction,
                        date: getSubmitDateInput(e.target.value),
                      })
                    }
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
                            stateObject.balance - editTransaction.amount,
                          type: e.target.value,
                        });
                      } else {
                        setEditTransaction({
                          ...editTransaction,
                          closingBalance:
                            stateObject.balance + editTransaction.amount,
                          type: e.target.value,
                        });
                      }
                    }}
                  >
                    <option value="CREDIT">CREDIT</option>
                    <option value="DEBIT">DEBIT</option>
                  </select>
                </div>
                {/* <div className="mb-3">
                  <label htmlFor="purpose_type" className="form-label">
                    Transaction Purpose
                  </label>
                  <select
                    className="form-select"
                    id="purpose_type"
                    defaultValue={mdmWithdrawal}
                    onChange={(e) => {
                      if (e.target.value === "MDM WITHDRAWAL") {
                        setIsMDMWithdrawal(true);
                        setMdmWithdrawal(e.target.value);
                        
                        setId(getId());
                      } else {
                        setIsMDMWithdrawal(false);
                      }
                    }}
                  >
                    <option value="MDM WITHDRAWAL">MDM WITHDRAWAL</option>
                    <option value="OTHERS">OTHERS</option>
                  </select>
                </div> */}

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
                          ppCB: editTransaction.ppOB + editTransaction.ppRC,
                        });
                      }
                    }}
                    placeholder="Enter Primary Expense"
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
                          pryCB: editTransaction.pryOB + editTransaction.pryRC,
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

                <div className="my-2">
                  <button
                    type="button"
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
          </form>
        )}
      </div>
    </div>
  );
}
