import {
  ITicketPopulatedDocument,
  Status,
} from "../../../../shared/interfaces";
import { getFullName, getStatusText } from "../../utils";
import Box from "../Box";
import Button from "../Button";
import Heading from "../Heading";
import Select from "../Select";
import MetaInfo from "./MetaInfo";

interface ITicketSidebarProps {
  ticket: ITicketPopulatedDocument;
}

function getStatusOptions() {
  return Object.values(Status).map((status) => ({
    value: status,
    label: getStatusText(status),
  }));
}

const TicketSidebar = ({ ticket }: ITicketSidebarProps) => {
  const { assignee, reporter } = ticket;
  const assigneeFullName = getFullName(assignee.firstName!, assignee.lastName!);
  const reporterFullName = getFullName(reporter.firstName!, reporter.lastName!);

  return (
    <aside className="w-full max-w-md flex flex-col gap-4 items-start">
      <div className="ticket-details__sidebar--actions self-end">
        <Button label="Share" onClick={() => {}} />
        <Button label="..." onClick={() => {}} />
      </div>
      <Select value={ticket.status} options={getStatusOptions()} />
      <Box>
        <Heading text="Details" level={3} className="border-b" />
        <MetaInfo
          label="Assignee"
          fullName={assigneeFullName ?? "Click to assign"}
        />
        <MetaInfo label="Reporter" fullName={reporterFullName} />
      </Box>
    </aside>
  );
};

export default TicketSidebar;
