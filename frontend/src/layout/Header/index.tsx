import { useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { useAuthContext } from "../../context/AuthProvider";
import { getVariantClasses } from "../../utils";

const guestMenuItems = [
  {
    title: "Register",
    link: "/register",
    isMainCTA: true,
  },
  {
    title: "Login",
    link: "/login",
  },
];

const userMenuItems = [
  {
    title: "Notifications",
    link: "/dashboard/start#notifications",
  },
  {
    title: "Profile",
    link: "/dashboard/profile",
  },
];

const Header = () => {
  const { user, logoutUserReq } = useAuthContext();
  const menuItems = useMemo(
    () => (user ? userMenuItems : guestMenuItems),
    [user]
  );
  const variantClasses = getVariantClasses("transparent");

  return (
    <header className="header flex justify-between py-6 px-4">
      <Link to="/">Home</Link>
      <div className="header__user-options flex gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.link!}
            className={`header__user-options__link rounded-lg ${variantClasses}`}
          >
            {item.title}
          </Link>
        ))}
        {user && <Button onClick={logoutUserReq}>Logout</Button>}
      </div>
    </header>
  );
};

export default Header;
