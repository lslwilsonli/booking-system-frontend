"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Logout from "./components/Logout";
// import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // new code
  const authState = useState(false);
  const [ready, setReady] = useState(false); // Use to give the loading screen before the feching is completed
  const [isLogin, setIsLogin] = authState;
  // const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // router.push("/login");
        setIsLogin(false);
        setReady(true);
        return;
      }

      const response = await fetch("http://localhost:3030/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLogin(response.ok);
      setReady(true);
      console.log("After login in Auth.js: the state is: ", isLogin);
    };

    fetchProfileData();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {ready ? children : <Logout />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
