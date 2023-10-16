import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IProjectBase,
  IProjectDocument,
  UserRole,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import { TextInput } from "../../../components/Input";
import SelectWithFetch from "../../../components/Select/SelectWithFetch";
import TextArea from "../../../components/TextArea";
import useAuth from "../../../hooks/useAuth";
import useForm from "../../../hooks/useForm";
import useValidation from "../../../hooks/useValidation";
import {
  PROJECTS_BASE_API_URL,
  USERS_BASE_API_URL,
  getPostOptions,
} from "../../../routes";
import { getUserDataOptions } from "../../../utils";

const CreateProject = () => {
  const { user } = useAuth();
  const isClient = user?.role === UserRole.CLIENT;
  const navigate = useNavigate();
  const formDataShape = {
    name: "",
    company: user?.company,
    url: "",
    description: "",
    teamMember: "",
    team: [],
    services: [],
    tickets: [],
  };
  const { formData, setFormData, errors, setErrors, onSubmit } = useForm<
    IProjectBase & { teamMember: string },
    IProjectDocument
  >({
    formShape: formDataShape as Partial<IProjectBase>,
    url: PROJECTS_BASE_API_URL,
    onSuccess: () => {
      navigate(isClient ? "/dashboard/my-projects" : "/dashboard/projects");
    },
  });
  const { validateField } = useValidation();
  const companyQuery = useMemo(() => {
    return `company=${user?.company}`;
  }, [user?.company]);

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

    const options = getPostOptions({
      ...formData,
      team: [...(formData.team || []), formData.teamMember],
    });
    onSubmit(options);
  };

  return (
    <Form onSubmit={handleSubmit} className="ml-0">
      <Heading text="Create project" level={1} />
      <TextInput
        label="Name:"
        id="name"
        onChange={handleChange}
        value={formData.name}
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
      {/* TODO: If admin, add Company select */}
      <SelectWithFetch
        label="Add team member:"
        id="teamMember"
        value={formData.teamMember || ""}
        onChange={handleChange}
        errors={errors}
        url={USERS_BASE_API_URL}
        query={companyQuery}
        getFormattedOptions={getUserDataOptions}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateProject;
