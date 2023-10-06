import { Link } from "react-router-dom";
import {
  Industry,
  Priority,
  Status,
  SubscriptionStatus,
  TicketType,
} from "../../../../shared/interfaces";
import {
  getIndustryText,
  getPriorityClasses,
  getPriorityText,
  getStatusClasses,
  getStatusText,
  getSubscriptionStatusText,
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

interface PopulatedUserCell {
  _id: string;
  firstName: string;
  lastName: string;
}

type CellDataValue = string | number | PopulatedUserCell;

const getCellData = (title: string, value: CellDataValue) => {
  switch (title) {
    case "assignee":
    case "reporter":
    case "externalReporter":
      value = value as PopulatedUserCell;
      return (
        <span data-original-format={value?._id}>
          {value?.firstName} {value?.lastName}
        </span>
      );
    case "industry":
      return (
        <Badge
          text={getIndustryText(value as Industry)}
          className={"bg-gray-200"}
        />
      );
    case "priority":
      return (
        <Badge
          text={getPriorityText(value as Priority)}
          className={getPriorityClasses(value as Priority)}
        />
      );
    case "ticketType":
      return (
        <Badge
          text={getTicketTypeText(value as TicketType)}
          className={getTicketTypeClasses(value as TicketType)}
        />
      );
    case "status":
      return (
        <Badge
          text={getStatusText(value as Status)}
          className={getStatusClasses(value as Status)}
        />
      );
    case "subscriptionStatus":
      return (
        <Badge
          text={getSubscriptionStatusText(value as SubscriptionStatus)}
          className={getStatusClasses(value as Status)}
        />
      );
    case "createdAt":
    case "updatedAt":
      return (
        <span data-original-format={value}>
          {new Date(value as string).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      );
    default:
      return value as string;
  }
};

const TableCellData = ({
  title,
  value,
}: {
  title: string;
  value: CellDataValue;
}) => {
  return (
    <TableCell className="shrink-0 grow-0">
      {getCellData(title, value)}
    </TableCell>
  );
};

const TableFromDocuments: <T>({
  cols,
  rows,
  resourceBaseUrl,
}: {
  cols: { keyTitle: string; title: string }[];
  rows: [] | { id: string; data: Partial<T> }[];
  resourceBaseUrl?: string;
}) => JSX.Element | null = ({ cols, rows, resourceBaseUrl }) => {
  const variantClasses = getVariantClasses("transparent");
  if (!cols && !rows) return null;
  return (
    <Table>
      {cols && (
        <TableHead className="w-full">
          <TableRow className="grid grid-flow-col md:grid-cols-[5fr_repeat(3,_3fr)_1fr_3fr_1fr]">
            {cols.map((col) => (
              <TableHeading
                className="shrink-0 grow-0 text-left"
                key={col.keyTitle}
              >
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
              <TableCellData
                key={key}
                title={key}
                value={value as CellDataValue}
              />
            ))}
            <TableCell>
              <Link
                to={`${resourceBaseUrl}/${row.id}`}
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

export default TableFromDocuments;
