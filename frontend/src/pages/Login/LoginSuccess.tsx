import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import { PROFILE_API_URL } from "../../routes";

const LoginSuccess = () => {
  const { user, error, loading, authUserReq } = useAuthContext();
  const navigate = useNavigate();

  const getAuthUser = useCallback(() => {
    authUserReq!(`${PROFILE_API_URL}`);
  }, [authUserReq]);

  useEffect(() => getAuthUser(), [getAuthUser]);

  useEffect(() => {
    if (user && !loading && !error) {
      navigate("/dashboard");
    }
  }, [user, error, loading, navigate]);

  return <div>Login was successful</div>;
};

export default LoginSuccess;
