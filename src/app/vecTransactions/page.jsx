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

export default function VecTransactions() {
  const { stateObject, setStateObject, state } = useGlobalContext();
  const access = state?.ACCESS;
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [showVECEnrty, setShowVECEnrty] = useState(false);
  const [showVECEdit, setShowVECEdit] = useState(false);
  const [vecObj, setVecObj] = useState({
    id: "",
    accountNumber: stateObject?.accountNumber,
    amount: "",
    purpose: "",
    type: "DEBIT",
    date: todayInString(),
    openingBalance: parseFloat(stateObject?.balance),
    closingBalance: parseFloat(stateObject?.balance),
  });
  const [editVecObj, setEditVecObj] = useState({
    id: "",
    accountNumber: "",
    amount: "",
    purpose: "",
    type: "",
    date: todayInString(),
    openingBalance: "",
    closingBalance: "",
  });

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
      query(collection(firestore, "vectransactions"))
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
    const x = data.filter((t) => t.id === id);
    if (x.length > 0) {
      setId(getId() + `-${x.length}`);
    } else {
      setId(getId());
    }
    setVecObj({
      id: "",
      accountNumber: stateObject?.accountNumber,
      amount: "",
      purpose: "",
      type: "DEBIT",
      date: todayInString(),
      openingBalance: parseFloat(stateObject?.balance),
      closingBalance: parseFloat(stateObject?.balance),
    });
  };

  const delTransaction = async (transaction) => {
    setLoader(true);
    await deleteDoc(doc(firestore, "vectransactions", transaction.id))
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
        await updateDoc(
          doc(firestore, "vecaccount", stateObject.accountNumber),
          thisAccount
        )
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

    try {
      setLoader(true);
      await setDoc(doc(firestore, "vectransactions", vecObj.id), vecObj);

      let thisAccount = stateObject;
      thisAccount.balance = vecObj.closingBalance;
      thisAccount.date = vecObj.date;
      await updateDoc(doc(firestore, "vecaccount", stateObject.accountNumber), {
        balance: thisAccount.balance,
        date: thisAccount.date,
      });
      setStateObject(thisAccount);
      setShowVECEnrty(false);
      getTransactions();
      setLoader(false);
      toast.success("Transaction added successfully");
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Transaction addition failed");
    }
  };

  const updateVec = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      await updateDoc(
        doc(firestore, "vectransactions", editVecObj.id),
        editVecObj
      );

      let thisAccount = stateObject;

      thisAccount.balance = editVecObj.closingBalance;
      thisAccount.date = editVecObj.date;
      await updateDoc(doc(firestore, "vecaccount", stateObject.accountNumber), {
        balance: thisAccount.balance,
        date: thisAccount.date,
      });
      toast.success("VEC Transaction updated successfully");
      setShowVECEdit(false);
      getTransactions();
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("VEC Transaction update failed");
    }
  };

  useEffect(() => {
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    getTransactions();
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
              setShowVECEnrty(true);
              setShowVECEdit(false);
            }}
          >
            Add New Transaction
          </button>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              createDownloadLink(allTransactions, "vectransactions");
            }}
          >
            Download VEC Transaction Data
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
                      setShowVECEnrty(false);
                      setShowVECEdit(true);
                      setEditVecObj(transaction);
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

        {showVECEnrty && (
          <div className="mx-auto">
            <form className="col-md-6 mx-auto" onSubmit={handleVECSubmit}>
              {vecObj.id && (
                <div className="mb-3">
                  <label htmlFor="vec_id" className="form-label">
                    ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="vec_balance"
                    value={vecObj.id}
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
                  defaultValue={getCurrentDateInput(vecObj.date)}
                  onChange={(e) => {
                    setVecObj({
                      ...vecObj,
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
                  value={vecObj.type}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "DEBIT") {
                      setVecObj({
                        ...vecObj,
                        type: value,
                        closingBalance: round2dec(
                          stateObject.balance - vecObj.amount
                        ),
                      });
                    } else {
                      setVecObj({
                        ...vecObj,
                        type: value,
                        closingBalance: stateObject.balance + vecObj.amount,
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
                  value={vecObj.openingBalance}
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

              <CustomInput
                title={"Purpose"}
                id="vec_purpose"
                type={"text"}
                value={vecObj.purpose}
                placeholder="Enter purpose"
                onChange={(e) => {
                  console.log(vecObj.date);
                  const inpMonth = parseInt(vecObj.date?.split("-")[1]) - 1;
                  const inpYear = vecObj.date?.split("-")[2];
                  const textMonth = monthNamesWithIndex[inpMonth].monthName;
                  let newId = `${textMonth}-${inpYear}`;
                  const checkDuplicate = allTransactions.filter(
                    (transaction) => transaction.id === newId
                  );
                  if (checkDuplicate.length > 0) {
                    newId = newId + "-" + new Date().getMinutes().toString();
                  }
                  setVecObj({
                    ...vecObj,
                    purpose: e.target.value,
                    id: e.target.value.split(" ").join("-") + "-" + newId,
                  });
                }}
              />

              <CustomInput
                title={"Amount"}
                id="vec_amount"
                value={vecObj.amount}
                placeholder="Enter amount"
                type={"number"}
                onChange={(e) => {
                  if (e.target.value) {
                    setVecObj({
                      ...vecObj,
                      amount: parseFloat(e.target.value),
                      closingBalance:
                        vecObj.type === "DEBIT"
                          ? parseFloat(
                              round2dec(
                                vecObj.openingBalance -
                                  parseFloat(e.target.value)
                              )
                            )
                          : parseFloat(e.target.value) + vecObj.openingBalance,
                    });
                  } else {
                    setVecObj({
                      ...vecObj,
                      amount: "",
                      closingBalance: vecObj.openingBalance,
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
                  value={vecObj.closingBalance}
                  disabled={true}
                  readOnly={true}
                />
              </div>

              <div className="my-2">
                <button
                  type="submit"
                  className="btn btn-primary m-2"
                  disabled={vecObj.closingBalance <= 0 || vecObj.purpose === ""}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-danger m-2"
                  onClick={() => {
                    setShowVECEnrty(false);
                    setVecObj({
                      id: "",
                      accountNumber: stateObject?.accountNumber,
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
            </form>
          </div>
        )}
        {showVECEdit && (
          <div className="mx-auto">
            <form className="mx-auto col-md-6" onSubmit={updateVec}>
              <div className="mb-3">
                <label htmlFor="vec_edit_balance" className="form-label">
                  Edit Amount
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="vec_edit_balance"
                  value={editVecObj.amount}
                  onChange={(e) => {
                    setEditVecObj({
                      ...editVecObj,
                      amount: parseFloat(e.target.value),
                    });
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
                  defaultValue={getCurrentDateInput(editVecObj.date)}
                  onChange={(e) => {
                    setEditVecObj({
                      ...editVecObj,
                      date: getSubmitDateInput(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="vec_edit_purpose" className="form-label">
                  Edit Purpose
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="vec_edit_purpose"
                  value={editVecObj.purpose}
                  onChange={(e) => {
                    setEditVecObj({
                      ...editVecObj,
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
                  value={editVecObj.openingBalance}
                  onChange={(e) => {
                    setEditVecObj({
                      ...editVecObj,
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
                  value={editVecObj.closingBalance}
                  onChange={(e) => {
                    setEditVecObj({
                      ...editVecObj,
                      closingBalance: parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="my-2">
                <button
                  type="submit"
                  className="btn btn-primary m-2"
                  disabled={
                    vecObj.editBalance <= 0 ||
                    vecObj.editBalance > stateObject?.balance
                  }
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger m-2"
                  onClick={() => setShowVECEdit(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
