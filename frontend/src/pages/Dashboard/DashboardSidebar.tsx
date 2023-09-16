import { Fragment } from "react";
import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import { getVariantClasses } from "../../utils";

const menuItems = {
  planning: {
    title: "Planning",
    items: [
      {
        title: "Dashboard start",
        link: "/dashboard",
      },
      {
        title: "Board",
        link: "/dashboard/board",
      },
    ],
  },
};

const DashboardSidebar = () => {
  const variantClasses = getVariantClasses("transparent");

  return (
    <nav className="dashboard-sidebar__nav flex flex-col">
      {Object.entries(menuItems).map(([key, value]) => {
        return (
          <Fragment key={key}>
            <Heading text={value.title} className="text-lg" marginBottom={2} />
            {value.items.map((item) => {
              return (
                <Link
                  key={item.title}
                  to={item.link}
                  className={`dashboard-sidebar__link mb-2 rounded-lg ${variantClasses}`}
                >
                  {item.title}
                </Link>
              );
            })}
          </Fragment>
        );
      })}
    </nav>
  );
};

export default DashboardSidebar;
