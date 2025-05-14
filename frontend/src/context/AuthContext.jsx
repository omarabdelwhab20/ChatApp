import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsloginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        setUser(JSON.parse(user));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      try {
        const response = await postRequest(
          `${import.meta.env.VITE_SERVER_URL}auth/sign-up`,
          registerInfo
        );

        if (response.error) {
          setRegisterError(response);
          return false;
        }

        return true;
      } catch (error) {
        setRegisterError({
          error: true,
          message: error.message || "Registration failed",
        });
      } finally {
        setIsRegisterLoading(false);
      }
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsloginLoading(true);
      setLoginError(null);

      try {
        const response = await postRequest(
          `${import.meta.env.VITE_SERVER_URL}auth/sign-in`,
          loginInfo
        );

        if (response.error) {
          setLoginError(response);
          return;
        }



        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));



        setUser(response.user);
      } catch (error) {
        setLoginError({
          error: true,
          message: error.message || "Login failed",
        });
      } finally {
        setIsloginLoading(false);
      }
    },
    [loginInfo]
  );

  const logOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logOut,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
      }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};
