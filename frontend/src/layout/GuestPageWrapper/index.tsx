import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";

const GuestPageWrapper = () => {
  const { user } = useAuthContext();

  return !user ? (
    <main className="w-full h-full px-4 pb-24 md:pb-2">
      <Outlet />
    </main>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default GuestPageWrapper;
