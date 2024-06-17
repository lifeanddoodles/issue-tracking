import { useState } from "react";
import { Outlet } from "react-router-dom";
import IconButton from "../../components/Button/IconButton";
import Column from "../Column";
import Row from "../Row";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  return (
    <Row className="w-full relative gap-6">
      <Column
        className={`relative overflow-visible
          ${
            sidebarIsOpen
              ? "w-full md:max-w-[10rem] lg:w-1/3 xl:max-w-[15rem] py-2 px-4"
              : ""
          }
        `}
      >
        <IconButton
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          className={"absolute top-0 left-[100%] z-10"}
        >
          {sidebarIsOpen ? "<" : ">"}
        </IconButton>
        <DashboardSidebar className={sidebarIsOpen ? "flex" : "hidden"} />
      </Column>
      <Column className="w-full py-2 px-4 overflow-hidden">
        <Outlet />
      </Column>
    </Row>
  );
};

export default DashboardLayout;
