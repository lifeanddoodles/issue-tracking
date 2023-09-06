import { ITicketPopulatedDocument } from "../../../../shared/interfaces";
import { getFullName } from "../../../../shared/utils";

interface ITicketSidebarProps {
  ticket: ITicketPopulatedDocument;
}

const TicketSidebar = ({ ticket }: ITicketSidebarProps) => {
  const { assignee, reporter } = ticket;
  const assigneeFullName = getFullName(assignee.firstName!, assignee.lastName!);
  const reporterFullName = getFullName(reporter.firstName!, reporter.lastName!);

  return (
    <aside>
      <p>{ticket.status}</p>
      <p>
        <strong>Assignee:</strong> {assigneeFullName ?? "Click to assign"}
      </p>
      <p>
        <strong>Reporter:</strong> {reporterFullName}
      </p>
    </aside>
  );
};

export default TicketSidebar;
