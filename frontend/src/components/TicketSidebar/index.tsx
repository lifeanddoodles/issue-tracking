import { useMemo } from "react";
import {
  DepartmentTeam,
  ITicketPopulatedDocument,
  UserRole,
} from "../../../../shared/interfaces";
import useAuth from "../../hooks/useAuth";
import { TICKETS_BASE_API_URL, USERS_BASE_API_URL } from "../../routes";
import {
  getDepartmentTeamOptions,
  getFullName,
  getPriorityOptions,
  getStatusOptions,
  getTicketDataOptions,
  getTicketTypeOptions,
  getUserDataOptions,
} from "../../utils";
import Box from "../Box";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../Input";
import Select from "../Select";
import SelectWithFetch from "../Select/SelectWithFetch";
import MetaInfo from "./MetaInfo";

interface ITicketSidebarProps {
  ticket: ITicketPopulatedDocument;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSave?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onDelete?: () => void;
  formData?: Partial<ITicketPopulatedDocument>;
  errors?: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] } | null>
  >;
}

const TicketSidebar = ({
  ticket,
  onChange,
  onSave,
  onDelete,
  formData,
  errors,
  setErrors,
}: ITicketSidebarProps) => {
  const { user } = useAuth();
  const isClient = user?.role === UserRole.CLIENT;
  const reporterFullName = ticket?.reporter
    ? getFullName(ticket?.reporter?.firstName, ticket?.reporter?.lastName)
    : null;
  const externalReporterFullName = ticket?.externalReporter
    ? getFullName(
        ticket?.externalReporter?.firstName,
        ticket?.externalReporter?.lastName
      )
    : null;
  const assignToTeam = formData?.assignToTeam || DepartmentTeam.UNASSIGNED;
  const departmentQuery = useMemo(() => {
    return assignToTeam && assignToTeam !== DepartmentTeam.UNASSIGNED
      ? `?department=${assignToTeam}`
      : "";
  }, [assignToTeam]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange && onChange(e);
  };

  const handleDelete = () => {
    onDelete && onDelete();
  };

  const handleSave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onSave && onSave(e);
  };

  const handleRequestUpdate = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    console.log("handleRequestUpdate", e);
  };

  return (
    <aside className="w-full flex flex-col gap-4 items-start md:col-start-2 md:row-span-2 py-2 px-4">
      <div className="ticket-details__sidebar--actions self-end flex gap-4">
        <Button label="Save" onClick={handleSave} />
        <Button label="Delete" onClick={handleDelete} />
      </div>
      <Select
        // label="Status:"
        id="status"
        value={ticket?.status}
        options={getStatusOptions()}
        onChange={handleChange}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <Box>
        <Heading text="Details" level={3} className="border-b" />
        {reporterFullName && isClient && (
          <MetaInfo label={"Follow up by"} value={reporterFullName} />
        )}
        <Select
          label="Assign to team:"
          id="assignToTeam"
          value={ticket?.assignToTeam}
          options={getDepartmentTeamOptions()}
          onChange={handleChange}
          required
          errors={errors}
          setErrors={setErrors}
          direction="row"
        />
        <SelectWithFetch
          label="Assignee:"
          id="assignee"
          value={
            (ticket?.assignee?._id as string) ||
            (ticket?.assignee?.toString() as string)
          }
          onChange={handleChange}
          disabled={isClient}
          errors={errors}
          url={USERS_BASE_API_URL}
          query={departmentQuery}
          getFormattedOptions={getUserDataOptions}
        />
        <SelectWithFetch
          label={!isClient ? "Reporter" : "Follow up"}
          id="reporter"
          value={
            (ticket?.reporter?._id as string) ||
            (ticket?.reporter?.toString() as string)
          }
          onChange={handleChange}
          disabled={isClient}
          errors={errors}
          url={USERS_BASE_API_URL}
          getFormattedOptions={getUserDataOptions}
        />
        {isClient && !reporterFullName && (
          <Button label="Request update" onClick={handleRequestUpdate} />
        )}
        {externalReporterFullName && (
          <MetaInfo
            label={isClient ? "Reporter" : "Client"}
            value={externalReporterFullName}
          />
        )}
        {!isClient && (
          <>
            <Select
              label="Priority:"
              id="priority"
              value={ticket?.priority}
              options={getPriorityOptions()}
              onChange={handleChange}
              required
              errors={errors}
              setErrors={setErrors}
              direction="row"
            />
            <Select
              label="Type:"
              id="ticketType"
              value={ticket?.ticketType}
              options={getTicketTypeOptions()}
              onChange={handleChange}
              required
              errors={errors}
              setErrors={setErrors}
              direction="row"
            />
            <Input
              label="Estimated time (in hours):"
              id="estimatedTime"
              onChange={handleChange}
              value={ticket?.estimatedTime}
              required
              errors={errors}
              setErrors={setErrors}
            />
            <Input
              label="Deadline:"
              id="deadline"
              onChange={handleChange}
              value={ticket?.deadline?.toString()}
              required
              errors={errors}
              setErrors={setErrors}
            />
            <SelectWithFetch
              label="Parent task:"
              id="parentTask"
              value={
                !ticket?.isSubtask || !ticket?.parentTask
                  ? ""
                  : ticket?.parentTask?.toString()
              }
              onChange={handleChange}
              disabled={isClient || !ticket?.isSubtask}
              errors={errors}
              url={TICKETS_BASE_API_URL}
              getFormattedOptions={getTicketDataOptions}
            />
          </>
        )}
      </Box>
    </aside>
  );
};

export default TicketSidebar;
