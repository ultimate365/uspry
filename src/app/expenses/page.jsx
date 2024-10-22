"use client";

import React, { useState, useEffect } from "react";
import { firestore } from "../../context/FirbaseContext";
import {
  getDocs,
  query,
  collection,
  updateDoc,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import Loader from "@/components/Loader";
import CustomInput from "@/components/CustomInput";
import {
  btnArray,
  createDownloadLink,
  getCurrentDateInput,
  IndianFormat,
  todayInString,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Store";
import { toast } from "react-toastify";
export default function Expenses() {
  const { setStateObject, expensesState, setExpensesState, state } =
    useGlobalContext();
  const access = state?.ACCESS;
  const router = useRouter();
  const [showUpdate, setShowUpdate] = useState(false);
  const [account, setAccount] = useState({
    accountName: "",
    accountNumber: "",
    balance: 0,
    date: todayInString(),
  });
  const [newAccount, setNewAccount] = useState({
    id: "",
    accountName: "",
    accountNumber: "",
    balance: 0,
    date: todayInString(),
  });
  const [loader, setLoader] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const [addAccount, setAddAccount] = useState(false);
  const getAccounts = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "expenses"))
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
    setAllAccounts(data);
    setExpensesState(data);
  };

  const updateAccount = async (account) => {
    try {
      await updateDoc(doc(firestore, "expenses", account.id), {
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        balance: account.balance,
        date: todayInString(),
      });
      toast.success("Account updated successfully");
      setShowUpdate(false);
      getAccounts();
    } catch (error) {
      toast.error("Error updating account");
      console.error(error);
    }
  };

  const addNewAccount = async () => {
    setLoader(true);
    try {
      await setDoc(doc(firestore, "expenses", newAccount.id), newAccount)
        .then(() => {
          setExpensesState([...expensesState, newAccount]);
          setAllAccounts([...expensesState, newAccount]);
          toast.success("Account added successfully");
          setAddAccount(false);
        })
        .catch((error) => {
          toast.error("Error adding account");
          console.error(error);
        });
    } catch (error) {
      toast.error("Error adding account");
      console.error(error);
    }
    setLoader(false);
  };

  const deleteAccount = async (account) => {
    setLoader(true);
    try {
      await deleteDoc(doc(firestore, "expenses", account.id));
      setExpensesState(expensesState.filter((a) => a.id !== account.id));
      setAllAccounts(expensesState.filter((a) => a.id !== account.id));
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Error deleting account");
      console.error(error);
    }
    setLoader(false);
  };

  useEffect(() => {
    if (expensesState.length === 0) {
      getAccounts();
    } else {
      setAllAccounts(expensesState);
    }
    if (access !== "admin") {
      router.push("/");
      toast.error("Unathorized access");
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      {loader && <Loader />}
      <div>
        <h3>Expenses</h3>
        {allAccounts.length > 0 && (
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              createDownloadLink(expensesState, "expenses");
            }}
          >
            Download Expenses Data
          </button>
        )}
        <button
          type="button"
          className="btn btn-success m-2"
          onClick={() => {
            setAddAccount(true);
          }}
        >
          Create New Account
        </button>
        {addAccount && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Add New Account
                  </h1>
                </div>
                <div className="modal-body">
                  <form autoComplete="off">
                    <div className="mx-auto my-2 noprint">
                      <CustomInput
                        title={"Account Name"}
                        placeholder={"Enter Account Name"}
                        value={newAccount.accountName}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            accountName: e.target.value,
                            id: e.target.value?.split(" ")?.join("-"),
                          })
                        }
                      />
                      <CustomInput
                        title={"Account Number"}
                        placeholder={"Enter Account Number"}
                        type={"number"}
                        value={newAccount.accountNumber}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            accountNumber: e.target.value,
                          })
                        }
                      />

                      <div className="my-3">
                        <label htmlFor="">Account Balance</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={"Enter Account Balance"}
                          value={newAccount.balance}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setNewAccount({
                                ...newAccount,
                                balance: parseFloat(e.target.value),
                              });
                            } else {
                              setNewAccount({
                                ...newAccount,
                                balance: "",
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  {newAccount.accountName !== "" &&
                    newAccount.accountNumber !== "" &&
                    newAccount.balance !== "" && (
                      <button
                        type="submit"
                        className="btn btn-success m-2"
                        onClick={(e) => {
                          e.preventDefault();
                          addNewAccount();
                        }}
                      >
                        Save
                      </button>
                    )}
                  <button
                    type="button"
                    className="btn btn-dark m-2"
                    onClick={() => {
                      setAddAccount(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            width: "100%",
            overflowX: "scroll",
            flexWrap: "wrap",
          }}
        >
          <table
            className="table table-responsive table-striped "
            style={{
              width: "100%",
              overflowX: "scroll",
              marginBottom: "20px",
              border: "1px solid",
            }}
          >
            <thead>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  SL
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  ACCOUNT NAME
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  ACCOUNT NUMBER
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  BALANCE
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  UPDATED AT
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  TRANSACTIONS
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  UPDATE
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  DELETE
                </th>
              </tr>
            </thead>
            <tbody>
              {allAccounts.map((account, index) => (
                <tr
                  key={account.id}
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    {account.accountName}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    {account.accountNumber}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    ₹ {IndianFormat(account.balance)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    {account.date}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    <button
                      type="button"
                      className={`btn btn-${btnArray[index].color} m-1`}
                      onClick={() => {
                        setStateObject(account);
                        router.push("/expensesTransactions");
                      }}
                    >
                      Transactions
                    </button>
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    <button
                      type="button"
                      className={`btn btn-${btnArray[index + 2].color} m-1`}
                      onClick={() => {
                        setShowUpdate(true);
                        setAccount(account);
                      }}
                    >
                      Update
                    </button>
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center p-1"
                  >
                    <button
                      type="button"
                      className={`btn btn-danger m-1`}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this account?"
                          )
                        ) {
                          deleteAccount(account);
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
      </div>
      {showUpdate && (
        <div className="col-md-6 mx-auto">
          <h3>Update Account</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateAccount(account);
            }}
          >
            <div className="form-group">
              <label htmlFor="accountName">Account Name:</label>
              <input
                type="text"
                className="form-control"
                id="accountName"
                value={account.accountName}
                onChange={(e) =>
                  setAccount({ ...account, accountName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number:</label>
              <input
                type="text"
                className="form-control"
                id="accountNumber"
                value={account.accountNumber}
                onChange={(e) =>
                  setAccount({ ...account, accountNumber: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="balance">Balance:</label>
              <input
                type="number"
                className="form-control"
                id="balance"
                value={account.balance}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    balance: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary m-2">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary m-2"
              onClick={() => setShowUpdate(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
