import { ReactNode } from "react";
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { IAuthContext } from ".";
import AuthContext from "../../context/AuthContext";

export const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
};

export const RouterFromMultipleRoutes = ({
  initialEntries,
  auth,
  children,
}: {
  initialEntries: string[];
  auth: IAuthContext;
  children: ReactNode;
}) => (
  <MemoryRouter initialEntries={[...initialEntries]}>
    <Routes>
      <Route
        path="/"
        element={
          <AuthContext.Provider value={auth}>
            <LocationDisplay />
            <Outlet />
          </AuthContext.Provider>
        }
      >
        {children}
      </Route>
    </Routes>
  </MemoryRouter>
);
