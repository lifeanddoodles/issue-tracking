import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../../../shared/interfaces";
import { useAuthContext } from "../../context/AuthProvider";

const AdminRoute = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === UserRole.ADMIN;

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};
export default AdminRoute;
