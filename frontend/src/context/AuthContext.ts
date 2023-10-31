import { createContext } from "react";
import { IUserDocument } from "../../../shared/interfaces";

const AuthContext = createContext<
  Partial<{
    user: Partial<IUserDocument> | null;
    error: Error | null;
    loading: boolean;
    authUserReq: (url: string, options?: RequestInit) => void;
    logoutUserReq: () => void;
  }>
>({});

export default AuthContext;
