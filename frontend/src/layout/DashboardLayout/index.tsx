import { Outlet } from "react-router-dom";
import Column from "../Column";
import Row from "../Row";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  return (
    <Row className="w-full">
      <Column className="w-full lg:w-1/3 max-w-xs py-2 px-4">
        <DashboardSidebar />
      </Column>
      <Column className="w-full py-2 px-4 overflow-hidden">
        <Outlet />
      </Column>
    </Row>
  );
};

export default DashboardLayout;
