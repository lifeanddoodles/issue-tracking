import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Button from "../../components/Button";
import IconButton from "../../components/Button/IconButton";
import useResponsive from "../../hooks/useResponsive";
import Column from "../Column";
import Row from "../Row";
import DashboardSidebar from "./DashboardSidebar";
import MobileResourcesNavigation from "./MobileResourcesNavigation";

const DashboardLayout = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const { isExtraSmall, isMobile } = useResponsive();

  return (
    <Row className="w-full relative gap-6 grow" as="section">
      {!isExtraSmall && !isMobile && (
        <Column
          className={`relative overflow-visible
          ${
            sidebarIsOpen
              ? "w-full md:max-w-[10rem] lg:w-1/3 xl:max-w-[15rem] py-2 px-4"
              : ""
          }
        `}
          as="aside"
        >
          <IconButton
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            className={"absolute top-0 left-[100%] z-10"}
          >
            {sidebarIsOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <DashboardSidebar className={sidebarIsOpen ? "flex" : "hidden"} />
        </Column>
      )}
      <Column
        className="w-full pt-2 pb-24 md:pb-2 px-4 overflow-hidden gap-4"
        as="main"
      >
        {(isExtraSmall || isMobile) && (
          <>
            <Button
              onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)}
              className="fixed bottom-16 right-4 z-10"
            >
              View resources
            </Button>
            <MobileResourcesNavigation
              isOpen={mobileMenuIsOpen}
              setIsOpen={setMobileMenuIsOpen}
            />
          </>
        )}
        <Outlet />
      </Column>
    </Row>
  );
};

export default DashboardLayout;
