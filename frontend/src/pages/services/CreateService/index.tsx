import { useNavigate } from "react-router-dom";
import {
  IServiceBase,
  IServiceDocument,
  Tier,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import { TextInput } from "../../../components/Input";
import TextArea from "../../../components/TextArea";
import useForm from "../../../hooks/useForm";
import useValidation from "../../../hooks/useValidation";
import { SERVICES_BASE_API_URL, getPostOptions } from "../../../routes";

const CreateProject = () => {
  const navigate = useNavigate();
  const formDataShape = {
    name: "",
    description: "",
    url: "",
    version: "",
    tier: "" as Tier,
  };
  const { formData, setFormData, errors, setErrors, onSubmit } = useForm<
    IServiceBase,
    IServiceDocument
  >({
    formShape: formDataShape as Partial<IServiceBase>,
    url: SERVICES_BASE_API_URL,
    onSuccess: () => {
      navigate("/dashboard/services");
    },
  });
  const { validateField } = useValidation();

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
    });
    onSubmit(options);
  };

  return (
    <Form onSubmit={handleSubmit} className="ml-0">
      <Heading text="Create service" level={1} />
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
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="URL:"
        id="url"
        onChange={handleChange}
        value={formData.url}
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="Version:"
        id="version"
        onChange={handleChange}
        value={formData.version}
        errors={errors}
        setErrors={setErrors}
        placeholder="1.0.0"
        pattern="^\d\.\d\.\d$"
      />
      <TextInput
        label="Tier:"
        id="tier"
        onChange={handleChange}
        value={formData.tier}
        errors={errors}
        setErrors={setErrors}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateProject;
