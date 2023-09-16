import { Outlet } from "react-router-dom";
import Column from "../../layout/Column";
import Header from "../../layout/Header";
import Row from "../../layout/Row";
import DashboardSidebar from "./DashboardSidebar";

const Dashboard = () => {
  return (
    <Column>
      <Header />
      <Row className="w-full">
        <Column className="w-full md:w-1/3 max-w-xs py-2 px-4">
          <DashboardSidebar />
        </Column>
        <Column className="w-full">
          <Outlet />
        </Column>
      </Row>
    </Column>
  );
};

export default Dashboard;
