import { useCallback, useEffect, useMemo, useState } from "react";
import { IUserDocument } from "shared/interfaces";
import { LOGOUT_API_URL } from "../routes";
import useFetch from "./useFetch";

const useAuth = () => {
  const userInLocalStorage = localStorage.getItem("user");
  const [user, setUser] = useState<Partial<IUserDocument> | null>(
    userInLocalStorage ? JSON.parse(userInLocalStorage) : null
  );
  const { data, error, loading, sendRequest } =
    useFetch<Partial<IUserDocument> | null>();

  const authUserReq = useCallback(
    async (url: string, options?: RequestInit) => {
      await sendRequest({ url, options });
    },
    [sendRequest]
  );

  const logoutUserReq = useCallback(async () => {
    await sendRequest({ url: LOGOUT_API_URL });
    localStorage.removeItem("user");
    setUser(null);
  }, [sendRequest]);

  useEffect(() => {
    if (data && !loading && !error) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  }, [data, error, loading]);

  return {
    user: useMemo(() => user, [user]),
    error: useMemo(() => error, [error]),
    loading: useMemo(() => loading, [loading]),
    authUserReq,
    logoutUserReq,
  };
};

export default useAuth;
