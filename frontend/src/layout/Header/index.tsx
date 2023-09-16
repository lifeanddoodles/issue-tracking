import { Link } from "react-router-dom";
import { getVariantClasses } from "../../utils";

function getUser() {
  // TODO: Implement user authentication
  return false;
}

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
    isMainCTA: true,
  },
  {
    title: "Profile",
    link: "/profile",
  },
];

const Header = () => {
  const user = getUser();
  const menuItems = user ? userMenuItems : guestMenuItems;
  const variantClasses = getVariantClasses("transparent");

  return (
    <header className="header flex justify-between py-6 px-4">
      <Link to="/">Home</Link>
      <div className="header__user-options flex gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className={`header__user-options__link rounded-lg ${variantClasses}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
