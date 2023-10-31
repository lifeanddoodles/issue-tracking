import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";

const GuestPageWrapper = () => {
  const { user } = useAuthContext();

  return !user ? (
    <main>
      <Outlet />
    </main>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default GuestPageWrapper;
