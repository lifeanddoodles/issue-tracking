import { Fragment } from "react";
import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import { getVariantClasses } from "../../utils";

const menuItems = {
  planning: {
    title: "Planning",
    items: [
      {
        title: "Dashboard",
        link: "/dashboard",
      },
      {
        title: "Board",
        link: "/dashboard/board",
      },
    ],
  },
  users: {
    title: "Users",
    items: [
      {
        title: "All Users",
        link: "/dashboard/users",
      },
      {
        title: "Add User",
        link: "/dashboard/users/create",
      },
    ],
  },
  companies: {
    title: "Companies",
    items: [
      {
        title: "All Companies",
        link: "/dashboard/companies",
      },
      {
        title: "Add Company",
        link: "/dashboard/companies/create",
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        title: "All Projects",
        link: "/dashboard/projects",
      },
      {
        title: "Add Project",
        link: "/dashboard/projects/create",
      },
    ],
  },
  tickets: {
    title: "Tickets",
    items: [
      {
        title: "All Tickets",
        link: "/dashboard/tickets",
      },
      {
        title: "Add Ticket",
        link: "/dashboard/tickets/create",
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
