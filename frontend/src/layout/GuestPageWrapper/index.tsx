import { Outlet } from "react-router-dom";
import Header from "../Header";

const GuestPageWrapper = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default GuestPageWrapper;
