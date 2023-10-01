import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ITicketDocument,
  IUserDocument,
  Priority,
  Status,
  TicketType,
} from "shared/interfaces";
import useFetch from "../../hooks/useFetch";
import { USERS_BASE_API_URL } from "../../routes";
import {
  getFullName,
  getPriorityClasses,
  getPriorityText,
  getStatusClasses,
  getStatusText,
  getTicketTypeClasses,
  getTicketTypeText,
  getVariantClasses,
} from "../../utils";
import Badge from "../Badge";
import Table from "../Table";
import TableBody from "../TableBody";
import TableCell from "../TableCell";
import TableHead from "../TableHead";
import TableHeading from "../TableHeading";
import TableRow from "../TableRow";

const TicketTableCell = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  const { data, loading, error, sendRequest } = useFetch<IUserDocument | null>(
    null
  );

  useEffect(() => {
    if (title === "assignee") {
      sendRequest({ url: `${USERS_BASE_API_URL}/${value}` });
    }
  }, [sendRequest, title, value]);

  const getCellData = () => {
    if (title === "assignee") {
      if (error) return error.message;
      if (loading) return "Loading...";
      return !loading && data && getFullName(data.firstName!, data.lastName!);
    }
    if (title === "priority") {
      return (
        <Badge
          text={getPriorityText(value as Priority)}
          className={getPriorityClasses(value as Priority)}
        />
      );
    }
    if (title === "ticketType") {
      return (
        <Badge
          text={getTicketTypeText(value as TicketType)}
          className={getTicketTypeClasses(value as TicketType)}
        />
      );
    }
    if (title === "status") {
      return (
        <Badge
          text={getStatusText(value)}
          className={getStatusClasses(value as Status)}
        />
      );
    }
    if (title === "createdAt") {
      return (
        <span data-original-format={value}>
          {new Date(value).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      );
    }
    return value;
  };

  return <TableCell className="shrink-0 grow-0">{getCellData()}</TableCell>;
};

const TicketsTable = ({
  cols,
  rows,
}: {
  cols: { key: string; title: string }[];
  rows: [] | { id: string; data: Partial<ITicketDocument> }[];
}) => {
  const variantClasses = getVariantClasses("transparent");
  if (!cols && !rows) return null;
  return (
    <Table>
      {cols && (
        <TableHead className="w-full">
          <TableRow className="grid grid-flow-col md:grid-cols-[5fr_repeat(3,_3fr)_1fr_3fr_1fr]">
            {cols.map((col) => (
              <TableHeading className="shrink-0 grow-0 text-left" key={col.key}>
                {col.title}
              </TableHeading>
            ))}
            <TableHeading>Actions</TableHeading>
          </TableRow>
        </TableHead>
      )}
      <TableBody className="w-full">
        {rows.map((row, index) => (
          <TableRow
            id={row.id}
            key={row.id || index}
            className="grid grid-flow-col md:grid-cols-[5fr_repeat(3,_3fr)_1fr_3fr_1fr]"
          >
            {Object.entries(row.data).map(([key, value]) => (
              <TicketTableCell key={key} title={key} value={value} />
            ))}
            <TableCell>
              <Link
                to={`/dashboard/tickets/${row.id}`}
                className={`rounded-lg ${variantClasses}`}
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketsTable;
