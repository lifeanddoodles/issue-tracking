import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ITicket,
  ITicketBase,
  ITicketDocument,
  Priority,
  Status,
  TicketType,
  UserRole,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Heading from "../../../../components/Heading";
import Input, { TextInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import Toggle from "../../../../components/Toggle";
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import {
  TICKETS_BASE_API_URL,
  USERS_BASE_API_URL,
  getPostOptions,
} from "../../../../routes";
import {
  getAssignableDepartmentTeamOptions,
  getPriorityOptions,
  getStatusOptions,
  getTicketDataOptions,
  getTicketTypeOptions,
  getUserDataOptions,
} from "../../../../utils";

const CreateTicket = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
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
        assignToTeam: "",
        ticketType: TicketType.ISSUE,
        estimatedTime: "",
        deadline: "",
        isSubtask: false,
        parentTask: "",
      };
  const { formData, setFormData, errors, setErrors, onSubmit, data } = useForm<
    (ITicketBase | ITicket) & { teamMember: string },
    ITicketDocument
  >({
    formShape: formDataShape as Partial<ITicketBase | ITicket>,
    url: TICKETS_BASE_API_URL,
    onSuccess: () => {
      navigate(`/dashboard/tickets/${data?._id}`);
    },
  });
  const { validateField } = useValidation();
  const assignToTeam = (formData as Partial<ITicket>)?.assignToTeam || "";
  const departmentQuery = useMemo(() => {
    return assignToTeam && assignToTeam ? `?department=${assignToTeam}` : "";
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

    const options = getPostOptions(formData);
    onSubmit(options);
  };

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
        value={formData.externalReporter?.toString()}
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
            value={(formData as Partial<ITicket>)?.assignToTeam}
            options={getAssignableDepartmentTeamOptions()}
            onChange={handleChange}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <SelectWithFetch
            label="Assignee:"
            id="assignee"
            value={(formData as Partial<ITicket>)?.assignee?.toString() || ""}
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
            value={(formData as Partial<ITicket>).reporter?.toString() || ""}
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
            value={(formData as Partial<ITicket>)?.status}
            options={getStatusOptions()}
            onChange={handleChange}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <Select
            label="Priority:"
            id="priority"
            value={(formData as Partial<ITicket>)?.priority}
            options={getPriorityOptions()}
            onChange={handleChange}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <Select
            label="Type:"
            id="ticketType"
            value={(formData as Partial<ITicket>)?.ticketType}
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
            value={(formData as Partial<ITicket>)?.estimatedTime ?? ""}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <TextInput
            label="Deadline:"
            id="deadline"
            onChange={handleChange}
            value={(formData as Partial<ITicket>)?.deadline as string}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <Toggle
            label="Is subtask:"
            id="isSubtask"
            onChange={handleChange}
            checked={(formData as Partial<ITicket>)?.isSubtask || false}
            errors={errors}
            setErrors={setErrors}
          />
          <SelectWithFetch
            label="Parent task:"
            id="parentTask"
            value={
              !(formData as Partial<ITicket>)?.isSubtask ||
              !(formData as Partial<ITicket>)?.parentTask
                ? ""
                : (formData as Partial<ITicket>)?.parentTask?.toString() || ""
            }
            onChange={handleChange}
            disabled={isClient || !(formData as Partial<ITicket>)?.isSubtask}
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
