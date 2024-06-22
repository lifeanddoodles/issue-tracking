import { twMerge } from "tailwind-merge";
import ResourcesNavigation from "../../components/ResourcesNavigation";

const DashboardSidebar = ({ className }: { className?: string }) => {
  const classes = twMerge("dashboard-sidebar flex flex-col", className);

  return <ResourcesNavigation className={classes} id="sidebar-navigation" />;
};

export default DashboardSidebar;
