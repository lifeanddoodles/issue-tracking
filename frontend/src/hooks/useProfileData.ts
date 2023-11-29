import { useCallback, useMemo } from "react";
import { IUserDocument } from "../../../shared/interfaces";
import useFetch from "../hooks/useFetch";
import { PROFILE_API_URL } from "../routes";

const useProfileData = () => {
  const {
    data: userInfo,
    loading,
    error,
    sendRequest,
  } = useFetch<IUserDocument | null>();

  const getUserInfo = useCallback(
    (url = PROFILE_API_URL) => {
      sendRequest({ url });
    },
    [sendRequest]
  );

  return {
    userInfo: useMemo(() => userInfo, [userInfo]),
    loading: useMemo(() => loading, [loading]),
    error: useMemo(() => error, [error]),
    getUserInfo,
  };
};

export default useProfileData;
