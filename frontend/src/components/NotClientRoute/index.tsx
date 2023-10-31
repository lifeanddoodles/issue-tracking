import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../../../../shared/interfaces";
import { useAuthContext } from "../../context/AuthProvider";

const NotClientRoute = () => {
  const { user } = useAuthContext();
  const isNotClient = user?.role !== UserRole.CLIENT;

  return isNotClient ? <Outlet /> : <Navigate to="/login" replace />;
};
export default NotClientRoute;
