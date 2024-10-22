"use client";

import React, { useState, useEffect } from "react";
import { firestore } from "../../context/FirbaseContext";
import { getDocs, query, collection, updateDoc, doc } from "firebase/firestore";

import Loader from "@/components/Loader";
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
export default function Accounts() {
  const { setStateObject, accountState, setAccountState, state } =
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

  const [loader, setLoader] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);

  const getAccounts = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "accounts"))
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
    setAccountState(data);
  };

  const updateAccount = async (account) => {
    try {
      await updateDoc(doc(firestore, "accounts", account.id), {
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

  useEffect(() => {
    if (accountState.length === 0) {
      getAccounts();
    } else {
      setAllAccounts(accountState);
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
        <h3>Accounts</h3>
        {accountState.length > 0 && (
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              createDownloadLink(accountState, "accounts");
            }}
          >
            Download Account Data
          </button>
        )}

        {allAccounts.length > 0 ? (
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
                          router.push("/transactions");
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h6>No Accounts Found</h6>
        )}
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
