import {
  BellIcon,
  KeyIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import InternalLink from "../../components/InternalLink";
import { useAuthContext } from "../../context/AuthProvider";
import useResponsive from "../../hooks/useResponsive";

const guestMenuItems = [
  {
    title: "Register",
    link: "/register",
    icon: UserPlusIcon,
    isMainCTA: true,
  },
  {
    title: "Login",
    link: "/login",
    icon: KeyIcon,
  },
];

const userMenuItems = [
  {
    title: "Notifications",
    link: "/dashboard/start#notifications",
    icon: BellIcon,
  },
  {
    title: "Profile",
    link: "/dashboard/profile",
    icon: UserIcon,
  },
];

const Header = () => {
  const { user, logoutUserReq } = useAuthContext();
  const menuItems = useMemo(
    () => (user ? userMenuItems : guestMenuItems),
    [user]
  );
  const { isExtraSmall, isMobile } = useResponsive();
  const showIconLinks = isExtraSmall || isMobile;

  return (
    <header className="header fixed bottom-0 left-0 right-0 z-10 flex justify-between py-6 px-4 bg-neutral-100 dark:bg-neutral-800 md:static">
      <Link to="/">Home</Link>
      <div className="header__user-options flex gap-4">
        <nav className="flex gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <InternalLink
                key={item.title}
                to={item.link!}
                className={`header__user-options__link rounded-lg`}
                variant={showIconLinks ? "icon" : "transparent"}
                ariaLabel={showIconLinks ? item.title : ""}
              >
                {showIconLinks ? (
                  <figure>
                    <Icon />
                  </figure>
                ) : (
                  item.title
                )}
              </InternalLink>
            );
          })}
        </nav>
        {user && <Button onClick={logoutUserReq}>Logout</Button>}
      </div>
    </header>
  );
};

export default Header;
