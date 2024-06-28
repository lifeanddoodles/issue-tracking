import { Outlet } from "react-router-dom";

const GuestPageWrapper = () => {
  return (
    <main className="w-full h-full px-4 pt-8 pb-24 md:py-8">
      <Outlet />
    </main>
  );
};

export default GuestPageWrapper;
