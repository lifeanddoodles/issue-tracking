import { ITicketPopulatedDocument } from "../../../../shared/interfaces";
import Heading from "../../components/Heading";
import Column from "../../layout/Column";
import EditableTextArea from "../EditableTextArea";

interface ITicketMainProps {
  ticket: ITicketPopulatedDocument;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  errors?: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] } | null>
  >;
}

const TicketMain = ({
  ticket,
  onChange,
  onSave,
  errors,
  setErrors,
}: ITicketMainProps) => {
  return (
    <Column className="w-full lg:col-start-1 lg:row-start-1 py-2 px-4">
      <main>
        <Heading
          text={ticket?.title}
          level={1}
          className="md:text-2xl xl:text-3xl"
        />
        <Heading text="Description" className="text-xl" />
        <EditableTextArea
          id="description"
          value={ticket?.description}
          onChange={onChange}
          onSave={onSave}
          errors={errors}
          setErrors={setErrors}
        />
        {/* TODO: Add attachments
        {<h2>Attachments</h2>} */}
        {/* TODO: Populate subtasks
        {<h2>Subtasks</h2>} */}
      </main>
    </Column>
  );
};

export default TicketMain;
