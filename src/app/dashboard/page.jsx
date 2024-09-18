"use client";
import React, { useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
export default function Dashboard() {
  const { state } = useGlobalContext();
  useEffect(() => {
    console.log(state); // access state from context here  //
  }, [state]);
  return <div>Dashboard</div>;
}
