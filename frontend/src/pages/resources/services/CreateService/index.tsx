import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IServiceBase,
  IServiceDocument,
  Tier,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Heading from "../../../../components/Heading";
import { TextInput, UrlInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import TextArea from "../../../../components/TextArea";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import { FormField } from "../../../../interfaces";
import { SERVICES_BASE_API_URL } from "../../../../routes";
import { getTierOptions, renderFields } from "../../../../utils";

type CreateServiceFormData = Partial<IServiceDocument>;

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
  },
  {
    Component: UrlInput,
    label: "URL:",
    id: "url",
  },
  {
    Component: TextInput,
    label: "Version:",
    id: "version",
    fieldProps: {
      placeholder: "1.0.0",
      pattern: /^\d\.\d\.\d$/,
    },
  },
  {
    Component: Select,
    label: "Tier:",
    id: "tier",
    fieldProps: {
      options: getTierOptions,
      direction: "col",
    },
  },
];

const CreateService = () => {
  const navigate = useNavigate();
  const formDataShape = {
    name: "",
    description: "",
    url: "",
    version: "",
    tier: "" as Tier,
  };
  const { formData, setFormData, errors, setErrors, onSubmit } = useForm<
    CreateServiceFormData,
    IServiceDocument
  >({
    formShape: formDataShape as Partial<IServiceBase>,
    url: SERVICES_BASE_API_URL,
    onSuccess: () => {
      navigate("/dashboard/services");
    },
  });
  const { validateField } = useValidation();

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
        onChange: handleChange,
        errors,
        setErrors,
      };
    });

    return renderFields(fieldsToRender, formData);
  }, [errors, formData, handleChange, setErrors]);

  return (
    formData && (
      <Form onSubmit={handleSubmit} className="ml-0">
        <Heading text="Create service" level={1} />
        {renderedChildren}
        <Button type="submit">Submit</Button>
      </Form>
    )
  );
};

export default CreateService;
