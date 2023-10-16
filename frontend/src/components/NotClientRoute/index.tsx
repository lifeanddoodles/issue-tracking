import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../../../shared/interfaces";
import useAuth from "../../hooks/useAuth";

const NotClientRoute = () => {
  const { user } = useAuth();
  const isNotClient = user?.role !== UserRole.CLIENT;

  return isNotClient ? <Outlet /> : <Navigate to="/login" replace />;
};
export default NotClientRoute;
