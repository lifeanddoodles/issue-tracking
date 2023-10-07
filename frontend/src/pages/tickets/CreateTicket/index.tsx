import { useEffect, useState } from "react";
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
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import useValidation from "../../../hooks/useValidation";
import { TICKETS_BASE_API_URL, getPostTicketOptions } from "../../../routes";
import {
  getAssignableDepartmentTeamOptions,
  getPriorityOptions,
  getStatusOptions,
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

    if (target.tagName === "INPUT") {
      validateField({
        target,
        setErrors,
      });
    }
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
          <Input
            label="Assignee:"
            id="assignee"
            onChange={handleChange}
            value={formData.assignee}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <Input
            label="Reporter:"
            id="reporter"
            onChange={handleChange}
            value={formData.reporter}
            required
            errors={errors}
            setErrors={setErrors}
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
            label="Assign to team:"
            id="assignToTeam"
            value={formData?.assignToTeam}
            options={getAssignableDepartmentTeamOptions()}
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
          <Input
            label="Estimated time:"
            id="estimatedTime"
            onChange={handleChange}
            value={formData?.estimatedTime ?? ""}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <Input
            label="Deadline:"
            id="deadline"
            onChange={handleChange}
            value={formData?.deadline}
            required
            errors={errors}
            setErrors={setErrors}
          />
          <Input
            label="Parent task:"
            id="parentTask"
            onChange={handleChange}
            value={formData?.parentTask ?? ""}
            required
            errors={errors}
            setErrors={setErrors}
          />
        </>
      )}
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateTicket;
