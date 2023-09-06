import { ITicketDocument, IUser } from "../../../../shared/interfaces";
import { getFullName } from "../../../../shared/utils";

interface ITicketSidebarProps {
  ticket: Partial<ITicketDocument>;
  assignee: IUser & { _id: string };
  reporter: IUser & { _id: string };
}

const TicketSidebar = ({ ticket, assignee, reporter }: ITicketSidebarProps) => {
  const assigneeFullName = getFullName(assignee.firstName!, assignee.lastName!);
  const reporterFullName = getFullName(reporter.firstName!, reporter.lastName!);

  return (
    <aside>
      <p>{ticket.status}</p>
      <p>{assigneeFullName ?? "Click to assign"}</p>
      <p>{reporterFullName}</p>
    </aside>
  );
};

export default TicketSidebar;
