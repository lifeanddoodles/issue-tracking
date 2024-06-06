import { render } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { IUserDocument } from "../../../../shared/interfaces";
import { fakeAdminUser } from "../../__mocks__";
import AuthContext from "../../context/AuthContext";
import { RouterFromMultipleRoutes } from "../../tests/utils";

export const authBase = {
  error: null,
  loading: false,
  authUserReq: () => {},
  logoutUserReq: () => {},
};

export const adminAuth = {
  user: {
    ...fakeAdminUser,
  },
  ...authBase,
};

export type IAuthContext = {
  error: null;
  loading: boolean;
  authUserReq: () => void;
  logoutUserReq: () => void;
  user: IUserDocument;
};

export const componentWithAuthContext = <T extends ReactElement>(
  Component: T,
  auth: IAuthContext
): ReactElement => {
  return <AuthContext.Provider value={auth}>{Component}</AuthContext.Provider>;
};

export const componentWithRouter = <T extends ReactElement>(
  Component: T,
  auth: IAuthContext
) => <MemoryRouter>{componentWithAuthContext(Component, auth)}</MemoryRouter>;

export const renderWithRouter = <T extends ReactElement>(
  Component: T,
  auth: IAuthContext
) => {
  render(componentWithRouter(Component, auth));
};

export const renderWithRouterFromRoute = <T extends ReactElement>(
  Component: T,
  initialEntries: string[],
  path: string
) =>
  render(
    <MemoryRouter initialEntries={[...initialEntries]}>
      <Routes>
        <Route path={path} element={Component} />
      </Routes>
    </MemoryRouter>
  );

export const renderWithRouterFromMultipleRoutes = (
  initialEntries: string[],
  auth: IAuthContext,
  children: ReactNode
) =>
  render(
    <RouterFromMultipleRoutes
      initialEntries={[...initialEntries]}
      auth={auth}
      children={children}
    />
  );
