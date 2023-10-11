import { useCallback, useEffect, useState } from "react";
import {
  ITicketDocument,
  ITicketPopulatedDocument,
  Priority,
  Status,
  TicketType,
} from "shared/interfaces";
import Button from "../../../components/Button";
import Select from "../../../components/Select";
import TableFromDocuments from "../../../components/TableFromDocuments";
import useFetch from "../../../hooks/useFetch";
import Row from "../../../layout/Row";
import { TICKETS_BASE_API_URL } from "../../../routes";
import {
  getColumnTitles,
  getStatusOptions,
  objectToQueryString,
} from "../../../utils";

enum TableColumns {
  title = "Title",
  status = "Status",
  ticketType = "Type",
  assignee = "Assignee",
  priority = "Priority",
  createdAt = "Created at",
}

const AllTickets = () => {
  const {
    data: tickets,
    loading,
    error,
    sendRequest,
  } = useFetch<ITicketDocument[] | ITicketPopulatedDocument[] | []>();
  const [filters, setFilters] = useState<
    Partial<{
      title: string;
      status: Status;
      ticketType: TicketType;
      assignee: string;
      priority: Priority;
    }>
  >({});
  const [query, setQuery] = useState("");

  const applyFilters: () => void = useCallback(() => {
    const queryString = objectToQueryString<
      Partial<{
        title: string;
        status: Status;
        ticketType: TicketType;
        assignee: string;
        priority: Priority;
      }>
    >(filters);
    setQuery(queryString);
  }, [filters]);

  const clearFilters: () => void = useCallback(() => {
    setFilters({});
    setQuery("");
    // TODO: Reset controllers to select empty option
  }, []);

  const getRows = useCallback(() => {
    sendRequest({
      url: `${TICKETS_BASE_API_URL}${query ? `?${query}` : ""}`,
    });
  }, [query, sendRequest]);

  const handleChangeFilters = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getRows();
  }, [getRows]);

  const formattedTickets =
    !loading &&
    tickets?.map((ticket) => {
      return {
        id: ticket._id.toString(),
        data: {
          title: ticket.title,
          status: ticket.status,
          ticketType: ticket.ticketType,
          assignee: ticket.assignee,
          priority: ticket.priority as Priority,
          createdAt: ticket.createdAt,
        },
      };
    });

  if (error) return <h3 role="status">{error.message}</h3>;

  return (
    <>
      <div className="filters mb-8">
        <Row className="gap-2">
          <Select
            id="status"
            value={filters?.status || ""}
            options={getStatusOptions("Status")}
            onChange={handleChangeFilters}
            direction="col"
            className="shrink-0 grow max-w-[10rem]"
          />
        </Row>
        <Row className="gap-2">
          <Button onClick={applyFilters}>Apply filters</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </Row>
      </div>
      {loading && <h3 role="status">Loading tickets...</h3>}
      {!loading && formattedTickets && formattedTickets?.length === 0 && (
        <h3 role="status">No tickets found</h3>
      )}
      {!loading && formattedTickets && formattedTickets?.length > 0 && (
        <TableFromDocuments
          cols={getColumnTitles(formattedTickets[0], TableColumns)}
          rows={formattedTickets}
          resourceBaseUrl="/dashboard/tickets"
          apiBaseUrl={TICKETS_BASE_API_URL}
          refetch={getRows}
        />
      )}
    </>
  );
};

export default AllTickets;
