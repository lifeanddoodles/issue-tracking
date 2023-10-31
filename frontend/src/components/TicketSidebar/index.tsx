import { useMemo } from "react";
import {
  ITicketPopulatedDocument,
  UserRole,
} from "../../../../shared/interfaces";
import { useAuthContext } from "../../context/AuthProvider";
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
import Toggle from "../Toggle";
import MetaInfo from "./MetaInfo";

interface ITicketSidebarProps {
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
  onChange,
  onSave,
  onDelete,
  formData,
  errors,
  setErrors,
}: ITicketSidebarProps) => {
  const { user } = useAuthContext();
  const isClient = user?.role === UserRole.CLIENT;
  const reporterFullName = formData?.reporter
    ? getFullName(formData?.reporter?.firstName, formData?.reporter?.lastName)
    : null;
  const externalReporterFullName = formData?.externalReporter
    ? getFullName(
        formData?.externalReporter?.firstName,
        formData?.externalReporter?.lastName
      )
    : null;
  const assignToTeam = formData?.assignToTeam || "";
  const departmentQuery = useMemo(() => {
    return assignToTeam && assignToTeam ? `department=${assignToTeam}` : "";
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
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
      <Select
        // label="Status:"
        id="status"
        value={formData?.status}
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
          value={formData?.assignToTeam}
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
            (formData?.assignee?._id as string) ||
            (formData?.assignee?.toString() as string)
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
            (formData?.reporter?._id as string) ||
            (formData?.reporter?.toString() as string)
          }
          onChange={handleChange}
          disabled={isClient}
          errors={errors}
          url={USERS_BASE_API_URL}
          getFormattedOptions={getUserDataOptions}
        />
        {isClient && !reporterFullName && (
          <Button onClick={handleRequestUpdate}>Request update</Button>
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
              value={formData?.priority}
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
              value={formData?.ticketType}
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
              value={formData?.estimatedTime}
              required
              errors={errors}
              setErrors={setErrors}
            />
            <Input
              label="Deadline:"
              id="deadline"
              onChange={handleChange}
              value={formData?.deadline?.toString()}
              required
              errors={errors}
              setErrors={setErrors}
            />
            <Toggle
              label="Is subtask:"
              id="isSubtask"
              onChange={handleChange}
              checked={formData?.isSubtask || false}
              errors={errors}
              setErrors={setErrors}
            />
            <SelectWithFetch
              label="Parent task:"
              id="parentTask"
              value={
                !formData?.isSubtask || !formData?.parentTask
                  ? ""
                  : formData?.parentTask?.toString()
              }
              onChange={handleChange}
              disabled={isClient || !formData?.isSubtask}
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
