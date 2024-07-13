import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  CodeBracketIcon,
  InformationCircleIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { useMemo } from "react";
import Button from "../../components/Button";
import InternalLink from "../../components/InternalLink";
import { useAuthContext } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeContext";
import useResponsive from "../../hooks/useResponsive";

const baseMenuItems = [
  {
    title: "About",
    link: "/about-the-dev",
    icon: InformationCircleIcon,
  },
  {
    title: "Code Snippets",
    link: "/code-snippets",
    icon: CodeBracketIcon,
  },
];

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
  const { theme, toggleTheme } = useTheme();
  const { isExtraSmall, isMobile } = useResponsive();
  const showIconLinks = isExtraSmall || isMobile;

  return (
    <header className="header fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between py-2 px-4 bg-neutral-100 dark:bg-neutral-800 md:static">
      <InternalLink to="/">Home</InternalLink>
      <div className="header__user-options flex gap-6 items-center">
        <nav className="flex gap-6 items-center">
          <section
            aria-label="Project info"
            className="flex gap-2 items-center"
          >
            {baseMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <InternalLink
                  key={item.title}
                  to={item.link!}
                  className={`header__info-options__link rounded-lg`}
                  variant={showIconLinks ? "icon" : "transparent"}
                  ariaLabel={showIconLinks ? item.title : ""}
                >
                  {showIconLinks ? (
                    <figure>
                      <Icon className="w-6 h-6" />
                    </figure>
                  ) : (
                    item.title
                  )}
                </InternalLink>
              );
            })}
          </section>
          <section
            aria-label="User options"
            className="flex gap-2 items-center"
          >
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
                      <Icon className="w-6 h-6" />
                    </figure>
                  ) : (
                    item.title
                  )}
                </InternalLink>
              );
            })}
            {user && (
              <Button onClick={logoutUserReq} variant="icon" ariaLabel="Logout">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </Button>
            )}
          </section>
        </nav>
        <Button onClick={toggleTheme} variant="icon" ariaLabel="Toggle theme">
          {theme === "light" ? (
            <MoonIcon className="w-6 h-6" />
          ) : (
            <SunIcon className="w-6 h-6" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
