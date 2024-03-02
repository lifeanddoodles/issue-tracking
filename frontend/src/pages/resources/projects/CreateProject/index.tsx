import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IProjectDocument,
  IUserDocument,
  UserRole,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Heading from "../../../../components/Heading";
import { TextInput, UrlInput } from "../../../../components/Input";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import {
  COMPANIES_BASE_API_URL,
  PROJECTS_BASE_API_URL,
  SERVICES_BASE_API_URL,
  USERS_BASE_API_URL,
} from "../../../../routes";
import {
  getCompanyDataOptions,
  getServiceDataOptions,
  getUserDataOptions,
  renderFields,
} from "../../../../utils";

type CreateProjectFormData = Partial<IProjectDocument> & {
  teamMember?: string;
  newService?: string;
};

const getCompanyQuery = (user: Partial<IUserDocument>, companyId: string) => {
  return user?.role === UserRole.CLIENT
    ? `company=${user?.company}`
    : companyId
    ? `company=${companyId}`
    : "";
};

const fields = [
  {
    Component: TextInput,
    label: "Name:",
    id: "name",
    required: true,
  },
  {
    Component: TextArea,
    label: "Description:",
    id: "description",
    required: true,
  },
  {
    Component: UrlInput,
    label: "URL:",
    id: "url",
  },
  {
    Component: SelectWithFetch,
    label: "Add company:",
    id: "company",
    required: true,
    permissions: { VIEW: [UserRole.ADMIN] },
    fieldProps: {
      url: COMPANIES_BASE_API_URL,
      getFormattedOptions: getCompanyDataOptions,
    },
  },
  {
    Component: SelectWithFetch,
    label: "Add team member:",
    id: "teamMember",
    fieldProps: {
      url: USERS_BASE_API_URL,
      getFormattedOptions: getUserDataOptions,
      query: true,
    },
  },
  {
    Component: SelectWithFetch,
    label: "Add service:",
    id: "newService",
    fieldProps: {
      url: SERVICES_BASE_API_URL,
      getFormattedOptions: getServiceDataOptions,
    },
  },
];

const CreateProject = () => {
  const { user } = useAuthContext();
  const userRole = user?.role as UserRole;
  const isClient = user?.role === UserRole.CLIENT;
  const navigate = useNavigate();
  const formDataShape: CreateProjectFormData = {
    name: "",
    company: isClient ? user?.company : "",
    url: "",
    description: "",
    teamMember: "",
    newService: "",
    team: [],
    services: [],
    tickets: [],
  };
  const { formData, setFormData, errors, setErrors, onSubmit } = useForm<
    CreateProjectFormData,
    IProjectDocument
  >({
    formShape: formDataShape,
    url: PROJECTS_BASE_API_URL,
    onSuccess: () => {
      navigate(isClient ? "/dashboard/my-projects" : "/dashboard/projects");
    },
  });
  const { validateField } = useValidation();
  const companyQuery = useMemo(
    () =>
      formData?.company &&
      getCompanyQuery(user as IUserDocument, formData?.company as string),
    [formData?.company, user]
  );

  const handleChange = useCallback(
    (
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
    },
    [formData, setErrors, setFormData, validateField]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const {
        newService,
        teamMember,
        services = [],
        team = [],
        ...restFormData
      } = formData as Partial<CreateProjectFormData>;

      const formDataBody = {
        ...restFormData,
        services: [...services, newService].filter(Boolean),
        team: [...team, teamMember].filter(Boolean),
      };

      onSubmit("POST", formDataBody as Partial<IProjectDocument>);
    },
    [formData, onSubmit]
  );

  const fieldsWithFormProps = useCallback(
    (formShape: CreateProjectFormData) =>
      fields.map((field) => {
        return {
          ...field,
          name: field.id,
          value: formShape![field.id as keyof typeof formShape] as string,
          onChange: handleChange,
          errors,
          setErrors,
          ...(field?.fieldProps?.query ? { query: companyQuery } : {}),
        };
      }),
    [companyQuery, errors, handleChange, setErrors]
  );

  const getRenderedChildren = useCallback(
    (formShape: CreateProjectFormData) =>
      renderFields(fieldsWithFormProps(formShape), formShape, userRole),
    [fieldsWithFormProps, userRole]
  );
  const renderedChildren = useMemo(
    () => formData !== null && getRenderedChildren(formData),
    [formData, getRenderedChildren]
  );

  return (
    formData && (
      <Form onSubmit={handleSubmit} className="ml-0">
        <Heading text="Create project" level={1} />
        {renderedChildren}
        <Button type="submit">Submit</Button>
      </Form>
    )
  );
};

export default CreateProject;
