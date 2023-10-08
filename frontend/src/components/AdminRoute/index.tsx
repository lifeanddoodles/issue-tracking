import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../../../shared/interfaces";
import useAuth from "../../hooks/useAuth";

const AdminRoute = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};
export default AdminRoute;
