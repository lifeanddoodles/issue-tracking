import { ITicketPopulatedDocument } from "../../../../shared/interfaces";
import Heading from "../../components/Heading";
import Column from "../../layout/Column";

interface ITicketMainProps {
  ticket: ITicketPopulatedDocument;
}

const TicketMain = ({ ticket }: ITicketMainProps) => {
  return (
    <Column className="w-full md:col-start-1 md:row-start-1 py-2 px-4">
      <main>
        <Heading
          text={ticket.title}
          level={1}
          className="md:text-2xl xl:text-3xl"
        />
        <Heading text="Description" className="text-xl" />
        <p>{ticket.description}</p>
        {/* TODO: Add attachments
        {<h2>Attachments</h2>} */}
        {/* TODO: Populate subtasks
        {<h2>Subtasks</h2>} */}
      </main>
    </Column>
  );
};

export default TicketMain;
