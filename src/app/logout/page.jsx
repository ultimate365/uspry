"use client";
import React, { useEffect, useState } from "react";

import { useGlobalContext } from "../../context/Store";
import { deleteAllCookies } from "../../modules/encryption";
import { useRouter } from "next/navigation";

const LogOut = () => {
  const router = useRouter();
  // eslint-disable-next-line
  const { setState } = useGlobalContext();
  // eslint-disable-next-line
  const [user, setUser] = useState(null);

  useEffect(() => {
    setState({
      USER: {
        name: "",
        email: "",
        id: "",
        access: "",
        userType: "",
      },
      LOGGEDAT: "",
    });
    deleteAllCookies();
    router.push("/login");

    // eslint-disable-next-line
  }, []);
  return <div className="container"></div>;
};

export default LogOut;
