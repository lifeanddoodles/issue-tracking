import { Fragment } from "react";
import { Link } from "react-router-dom";
import { UserRole } from "../../../../shared/interfaces";
import { useAuthContext } from "../../context/AuthProvider";
import { getVariantClasses } from "../../utils";
import Heading from "../Heading";

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
        title: "My Team",
        link: "/dashboard/my-team",
      },
      {
        title: "All Users",
        link: "/dashboard/users",
        restrictAccess: true,
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
        title: "My Company",
        link: "/dashboard/my-company",
      },
      {
        title: "All Companies",
        link: "/dashboard/companies",
        restrictAccess: true,
      },
      {
        title: "Add Company",
        link: "/dashboard/companies/create",
        restrictAccess: true,
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        title: "My Projects",
        link: "/dashboard/my-projects",
      },
      {
        title: "All Projects",
        link: "/dashboard/projects",
        restrictAccess: true,
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
        title: "My Tickets",
        link: "/dashboard/my-tickets",
      },
      {
        title: "All Tickets",
        link: "/dashboard/tickets",
        restrictAccess: true,
      },
      {
        title: "Add Ticket",
        link: "/dashboard/tickets/create",
      },
    ],
  },
  services: {
    title: "Services",
    items: [
      {
        title: "All Services",
        link: "/dashboard/services",
        restrictAccess: true,
      },
      {
        title: "Add Service",
        link: "/dashboard/services/create",
        restrictAccess: true,
      },
    ],
  },
};

const clientMenuItems = {
  account: {
    title: "My Account",
    items: [
      {
        title: "Dashboard",
        link: "/dashboard",
      },
      {
        title: "Board",
        link: "/dashboard/board",
      },
      {
        title: "My Team",
        link: "/dashboard/my-team",
      },
      {
        title: "Add User",
        link: "/dashboard/users/create",
      },
      {
        title: "My Company",
        link: "/dashboard/my-company",
      },
      {
        title: "My Projects",
        link: "/dashboard/my-projects",
      },
      {
        title: "Add Project",
        link: "/dashboard/projects/create",
      },
      {
        title: "My Tickets",
        link: "/dashboard/my-tickets",
      },
      {
        title: "Add Ticket",
        link: "/dashboard/tickets/create",
      },
    ],
  },
};

const ResourcesNavigation = ({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) => {
  const variantClasses = getVariantClasses("transparent");
  const { user } = useAuthContext();
  const isClient = user?.role === UserRole.CLIENT;

  return (
    <nav className={className} id={id}>
      {Object.entries(isClient ? clientMenuItems : menuItems).map(
        ([key, value]) => {
          return (
            <Fragment key={key}>
              <Heading
                text={value.title}
                className="text-lg"
                marginBottom={2}
              />
              {value.items.map(
                (item: {
                  title: string;
                  link: string;
                  restrictAccess?: boolean;
                }) => {
                  return (
                    (!isClient || !item?.restrictAccess) && (
                      <Link
                        key={item.title}
                        to={item.link}
                        className={`mb-2 rounded-lg ${variantClasses}`}
                      >
                        {item.title}
                      </Link>
                    )
                  );
                }
              )}
            </Fragment>
          );
        }
      )}
    </nav>
  );
};

export default ResourcesNavigation;
