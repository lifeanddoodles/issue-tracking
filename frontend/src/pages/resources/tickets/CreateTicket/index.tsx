import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DepartmentTeam,
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
import { TextInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import Toggle from "../../../../components/Toggle";
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import { FormField } from "../../../../interfaces";
import { TICKETS_BASE_API_URL, USERS_BASE_API_URL } from "../../../../routes";
import {
  getAssignableDepartmentTeamOptions,
  getNonClientDataOptions,
  getPriorityOptions,
  getStatusOptions,
  getTicketDataOptions,
  getTicketTypeOptions,
  getUserDataOptions,
  renderFields,
} from "../../../../utils";

type CreateTicketFormData = Partial<ITicketDocument>;

const getDepartmentQuery = (assignToTeam: DepartmentTeam) => {
  return assignToTeam && assignToTeam ? `?department=${assignToTeam}` : "";
};

const isFieldDisabled = (id: string, formData: CreateTicketFormData) => {
  switch (id) {
    case "parentTask":
      return !formData?.isSubtask;
    default:
      return;
  }
};

const fields = [
  {
    Component: TextInput,
    label: "Title:",
    id: "title",
    required: true,
  },
  {
    Component: TextArea,
    label: "Description:",
    id: "description",
    required: true,
  },
  {
    Component: TextInput,
    label: "Reporter:",
    id: "externalReporter",
    required: true,
    permissions: { VIEW: [UserRole.CLIENT] },
  },
  {
    Component: Select,
    label: "Assign to team:",
    id: "assignToTeam",
    required: true,
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      options: getAssignableDepartmentTeamOptions,
    },
  },
  {
    Component: SelectWithFetch,
    label: "Assignee:",
    id: "assignee",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      url: USERS_BASE_API_URL,
      getFormattedOptions: getUserDataOptions,
      query: true,
    },
  },
  {
    Component: SelectWithFetch,
    label: "Reporter:",
    id: "reporter",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      url: USERS_BASE_API_URL,
      getFormattedOptions: getNonClientDataOptions,
    },
  },
  {
    Component: Select,
    label: "Status:",
    id: "status",
    required: true,
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      options: getStatusOptions,
    },
  },
  {
    Component: Select,
    label: "Priority:",
    id: "priority",
    required: true,
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      options: getPriorityOptions,
    },
  },
  {
    Component: Select,
    label: "Type:",
    id: "ticketType",
    required: true,
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      options: getTicketTypeOptions,
    },
  },
  {
    Component: TextInput,
    label: "Estimated time:",
    id: "estimatedTime",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
  },
  {
    Component: TextInput,
    label: "Deadline:",
    id: "deadline",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
  },
  {
    Component: Toggle,
    label: "Is subtask:",
    id: "isSubtask",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
  },
  {
    Component: SelectWithFetch,
    label: "Parent task:",
    id: "parentTask",
    disabled: isFieldDisabled,
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      url: TICKETS_BASE_API_URL,
      getFormattedOptions: getTicketDataOptions,
    },
  },
];

const CreateTicket = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const userRole = user?.role as UserRole;
  const isClient = userRole === UserRole.CLIENT;
  const formDataShape = isClient
    ? {
        title: "",
        description: "",
        externalReporter: user!._id,
        attachments: [],
        ticketType: TicketType.FOLLOW_UP,
      }
    : {
        title: "",
        description: "",
        attachments: [],
        assignee: "",
        reporter: user?._id,
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
    CreateTicketFormData,
    ITicketDocument
  >({
    formShape: formDataShape as Partial<ITicketBase | ITicket>,
    url: TICKETS_BASE_API_URL,
    onSuccess: () => {
      navigate(`/dashboard/tickets/${data?._id}`);
    },
  });
  const { validateField } = useValidation();

  const assignToTeam = useMemo(
    () => (formData as CreateTicketFormData)?.assignToTeam || "",
    [formData]
  );
  const departmentQuery = useMemo(() => {
    return assignToTeam && getDepartmentQuery(assignToTeam);
  }, [assignToTeam]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = e.target;

      setFormData({
        ...formData,
        [target.name]:
          target.type === "checkbox"
            ? (target as HTMLInputElement).checked
            : target.value,
      });

      validateField({
        target,
        setErrors,
      });
    },
    [formData, setErrors, setFormData, validateField]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      onSubmit("POST", formData);
    },
    [formData, onSubmit]
  );

  const renderedChildren = useMemo(() => {
    if (formData === null) return;

    const fieldsToRender = (fields as FormField<unknown>[]).map((field) => {
      return {
        ...field,
        name: field.id,
        [typeof formData![field.id as keyof typeof formData] === "boolean"
          ? "checked"
          : "value"]: formData![field.id as keyof typeof formData] as
          | string
          | boolean,
        onChange: handleChange,
        errors,
        setErrors,
        ...(field?.fieldProps?.query ? { query: departmentQuery } : {}),
      };
    });

    return renderFields(fieldsToRender, formData, userRole);
  }, [departmentQuery, errors, formData, handleChange, setErrors, userRole]);

  return (
    formData && (
      <Form onSubmit={handleSubmit} className="ml-0">
        <Heading text="Create ticket" level={1} />
        {renderedChildren}
        <Button type="submit">Submit</Button>
      </Form>
    )
  );
};

export default CreateTicket;
