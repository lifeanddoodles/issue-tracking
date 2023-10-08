import { useEffect, useMemo, useState } from "react";
import {
  DepartmentTeam,
  Priority,
  Status,
  TicketType,
  UserRole,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import Input, { TextInput } from "../../../components/Input";
import Select from "../../../components/Select";
import SelectWithFetch from "../../../components/Select/SelectWithFetch";
import TextArea from "../../../components/TextArea";
import Toggle from "../../../components/Toggle";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import useValidation from "../../../hooks/useValidation";
import {
  TICKETS_BASE_API_URL,
  USERS_BASE_API_URL,
  getPostTicketOptions,
} from "../../../routes";
import {
  getAssignableDepartmentTeamOptions,
  getPriorityOptions,
  getStatusOptions,
  getTicketDataOptions,
  getTicketTypeOptions,
  getUserDataOptions,
} from "../../../utils";

const CreateTicket = () => {
  const { user } = useAuth();
  const role = user?.role;
  const isClient = role === UserRole.CLIENT;
  const formDataShape = isClient
    ? {
        title: "",
        description: "",
        externalReporter: user!._id,
        attachments: [],
      }
    : {
        title: "",
        description: "",
        attachments: [],
        assignee: "",
        reporter: user!._id,
        status: Status.OPEN,
        priority: Priority.MEDIUM,
        assignToTeam: DepartmentTeam.UNASSIGNED,
        ticketType: TicketType.ISSUE,
        estimatedTime: "",
        deadline: "",
        isSubtask: false,
        parentTask: "",
      };
  const [formData, setFormData] = useState(formDataShape);

  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();
  const { data, error, loading, sendRequest } = useFetch();
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
    const target = e.target;

    setFormData({
      ...formData,
      [target.name]: target.value,
    });

    validateField({
      target,
      setErrors,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const options = getPostTicketOptions(formData);
    sendRequest({ url: TICKETS_BASE_API_URL, options });
  };

  useEffect(() => {
    if (data && !loading && !error) {
      console.log(data);
      // TODO: Redirect to ticket details
    }
  }, [data, error, loading]);

  return (
    <Form onSubmit={handleSubmit} className="ml-0">
      <Heading text="Create ticket" level={1} />
      <Input
        label="Title:"
        id="title"
        onChange={handleChange}
        value={formData.title}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <TextArea
        label="Description:"
        id="description"
        onChange={handleChange}
        value={formData.description}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <Select
        label={isClient ? "Reporter:" : "External reporter:"}
        id="externalReporter"
        value={formData.externalReporter}
        options={isClient ? getUserDataOptions([user!]) : []}
        onChange={handleChange}
        required
        errors={errors}
        setErrors={setErrors}
        disabled
      />
      {!isClient && (
        <>
          <Select
            label="Assign to team:"
            id="assignToTeam"
            value={formData?.assignToTeam}
            options={getAssignableDepartmentTeamOptions()}
            onChange={handleChange}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <SelectWithFetch
            label="Assignee:"
            id="assignee"
            value={formData.assignee || ""}
            onChange={handleChange}
            disabled={isClient}
            errors={errors}
            url={USERS_BASE_API_URL}
            query={departmentQuery}
            getFormattedOptions={getUserDataOptions}
          />
          <SelectWithFetch
            label="Reporter:"
            id="reporter"
            value={formData.reporter}
            onChange={handleChange}
            disabled={isClient}
            errors={errors}
            url={USERS_BASE_API_URL}
            query={departmentQuery}
            getFormattedOptions={getUserDataOptions}
          />
          <Select
            label="Status:"
            id="status"
            value={formData?.status}
            options={getStatusOptions()}
            onChange={handleChange}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <Select
            label="Priority:"
            id="priority"
            value={formData?.priority}
            options={getPriorityOptions()}
            onChange={handleChange}
            required
            errors={errors}
            setErrors={setErrors}
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
          />
          <TextInput
            label="Estimated time:"
            id="estimatedTime"
            onChange={handleChange}
            value={formData?.estimatedTime ?? ""}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <TextInput
            label="Deadline:"
            id="deadline"
            onChange={handleChange}
            value={formData?.deadline}
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
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateTicket;
