import { Link } from "react-router-dom";
import {
  DepartmentTeam,
  Industry,
  Priority,
  Status,
  SubscriptionStatus,
  TicketType,
  UserRole,
} from "../../../../shared/interfaces";
import useFetch from "../../hooks/useFetch";
import { getDeleteOptions } from "../../routes";
import {
  getDepartmentTeamText,
  getIndustryText,
  getPriorityClasses,
  getPriorityText,
  getStatusClasses,
  getStatusText,
  getSubscriptionStatusText,
  getTicketTypeClasses,
  getTicketTypeText,
  getUserRoleText,
  getVariantClasses,
} from "../../utils";
import Badge from "../Badge";
import Button from "../Button";
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
    case "role":
      return getUserRoleText(value as UserRole);
    case "department":
      return getDepartmentTeamText(value as DepartmentTeam);
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
  apiBaseUrl,
}: {
  cols: { keyTitle: string; title: string }[];
  rows: [] | { id: string; data: Partial<T> }[];
  resourceBaseUrl: string;
  apiBaseUrl: string;
  refetch: () => void;
}) => JSX.Element | null = ({
  cols,
  rows,
  resourceBaseUrl,
  apiBaseUrl,
  refetch,
}) => {
  const { sendRequest } = useFetch();
  const variantClasses = getVariantClasses("transparent");
  if (!cols && !rows) return null;

  const handleDelete = (id: string) => {
    const options = getDeleteOptions();
    sendRequest({ url: `${apiBaseUrl}/${id}`, options });
    refetch();
  };

  return (
    <div className="overflow-x-auto grow">
      <Table>
        {cols && (
          <TableHead className="w-full">
            <TableRow className="grid grid-flow-col grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))]">
              {cols.map((col) => (
                <TableHeading
                  className="text-left whitespace-nowrap"
                  key={col.keyTitle}
                >
                  {col.title}
                </TableHeading>
              ))}
              <TableHeading className="text-left whitespace-nowrap">
                Actions
              </TableHeading>
            </TableRow>
          </TableHead>
        )}
        <TableBody className="w-full">
          {rows.map((row, index) => (
            <TableRow
              id={row.id}
              key={row.id || index}
              className="grid grid-flow-col grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))]"
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
                <Button onClick={() => handleDelete(row.id)} variant="link">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableFromDocuments;
