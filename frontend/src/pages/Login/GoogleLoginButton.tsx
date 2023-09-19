import { useEffect } from "react";
import Button from "../../components/Button";
import useFetch from "../../hooks/useFetch";
import { GOOGLE_AUTH_BASE_API_URL } from "../../routes";

const GoogleLoginButton = () => {
  const { data, loading, error, sendRequest } = useFetch();

  const requestGoogleLogin = () => {
    sendRequest({
      url: GOOGLE_AUTH_BASE_API_URL,
    });
    if (error) {
      console.log(error);
    }
  };

  const handleOnClick = () => {
    requestGoogleLogin();
  };

  useEffect(() => {
    if (data && !loading) {
      console.log(data);
    }
  });

  return <Button onClick={handleOnClick} label="Login with Google" />;
};

export default GoogleLoginButton;
