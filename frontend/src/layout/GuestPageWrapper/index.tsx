import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const GuestPageWrapper = () => {
  const { user } = useAuth();

  return !user ? (
    <main>
      <Outlet />
    </main>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default GuestPageWrapper;
