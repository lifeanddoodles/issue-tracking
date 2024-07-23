import { useMemo } from "react";
import { ITicketDocument, ITicketPopulatedDocument } from "shared/interfaces";
import { DepartmentTeam, UserRole } from "../../../../../shared/interfaces";
import ChartsSection from "../../../components/ChartsSection";
import Heading from "../../../components/Heading";
import Pagination from "../../../components/Pagination";
import useDocsSlice from "../../../components/Pagination/hooks/useDocsSlice";
import usePagination from "../../../components/Pagination/hooks/usePagination";
import TicketsList from "../../../components/TicketsList";
import { useAuthContext } from "../../../context/AuthProvider";
import useFetch from "../../../hooks/useFetch";
import { PROJECTS_BASE_API_URL, TICKETS_BASE_API_URL } from "../../../routes";

const ticketsCharts = [
  {
    attribute: "status",
    title: "Tickets by Status",
  },
  {
    attribute: "priority",
    title: "Tickets by Priority",
  },
  {
    attribute: "ticketType",
    title: "Tickets by Type",
  },
  {
    attribute: "assignToTeam",
    title: "Tickets by Assigned Team",
    allowedRoles: [UserRole.ADMIN],
  },
  {
    attribute: "assignee",
    title: "Tickets by Assignee",
    allowedRoles: [UserRole.STAFF],
  },
  /**
   * TODO: Add tickets by company
   */
];

const projectsCharts = [
  {
    attribute: "company",
    title: "Projects by Company",
    labelFrom: "name",
  },
  {
    attribute: "tickets",
    title: "Tickets by Project",
  },
  {
    attribute: "services",
    title: "Services by Projects",
    labelFrom: "name",
  },
];

const getTicketsQuery = (
  userRole: UserRole,
  userDepartment: DepartmentTeam,
  userCompany: string
) => {
  switch (userRole) {
    case UserRole.CLIENT:
      return `?company=${userCompany}`;
    case UserRole.STAFF:
      return `?assignToTeam=${userDepartment}`;
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
    default:
      return "";
  }
};

const getProjectsQuery = (userRole: UserRole, userCompany: string) => {
  switch (userRole) {
    case UserRole.CLIENT:
      return `?company=${userCompany}`;
    case UserRole.STAFF:
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
    default:
      return "";
  }
};

const Dashboard = () => {
  const { user } = useAuthContext();

  const ticketsQuery = getTicketsQuery(
    user?.role as UserRole,
    user?.department as DepartmentTeam,
    user?.company as string
  );
  const ticketsUrl = `${TICKETS_BASE_API_URL}${ticketsQuery}`;
  const {
    data: ticketsResponse,
    loading: loadingTickets,
    error: ticketsError,
  } = useFetch<{
    data: (ITicketDocument | ITicketPopulatedDocument)[];
    count: number;
    pagination: { [key: string]: number; limit: number };
    success: boolean;
  }>({
    url: ticketsUrl,
  });

  const tickets = useMemo(() => ticketsResponse?.data, [ticketsResponse]);

  const projectsQuery = getProjectsQuery(
    user?.role as UserRole,
    user?.company as string
  );
  const projectsUrl = `${PROJECTS_BASE_API_URL}${projectsQuery}`;

  const { currentPage, setCurrentPage } = usePagination();
  const limit = 10;
  const paginatedTickets = useDocsSlice(limit, currentPage, tickets);

  return (
    <>
      <Heading text="Dashboard" level={1} />
      <ChartsSection
        data={tickets as ITicketPopulatedDocument[]}
        charts={ticketsCharts}
        userRole={user?.role as UserRole}
        title="Tickets"
      />
      <ChartsSection
        url={projectsUrl}
        charts={projectsCharts}
        userRole={user?.role as UserRole}
        title="Projects"
      />
      <Heading text="Notifications" />
      <Heading text="Tickets" />
      {loadingTickets && <h3 role="status">Loading tickets...</h3>}
      {ticketsError && <h3 role="status">{ticketsError.message}</h3>}
      {!loadingTickets && tickets && tickets?.length === 0 && (
        <h3 role="status">No tickets found</h3>
      )}
      {!loadingTickets && tickets && paginatedTickets?.length > 0 && (
        <>
          <TicketsList tickets={paginatedTickets} />
          <Pagination
            total={tickets.length}
            limit={limit}
            currentPage={currentPage}
            onClick={setCurrentPage}
          />
        </>
      )}
    </>
  );
};

export default Dashboard;
