import { useContext } from "react";
import useAuth from "../hooks/useAuth";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
