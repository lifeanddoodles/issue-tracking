import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IAddressInfo,
  ICompany,
  Industry,
  SubscriptionStatus,
  UserRole,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Heading from "../../../../components/Heading";
import { EmailInput, TextInput, UrlInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import TextArea from "../../../../components/TextArea";
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import { COMPANIES_BASE_API_URL } from "../../../../routes";
import { getIndustryOptions, renderFields } from "../../../../utils";

type CreateCompanyFormData = Partial<ICompany>;

const fields = [
  {
    Component: TextInput,
    label: "Name:",
    id: "name",
    required: true,
  },
  {
    Component: UrlInput,
    label: "Website:",
    id: "url",
    required: true,
  },
  {
    Component: TextInput,
    label: "Phone:",
    id: "phone",
  },
  {
    Component: EmailInput,
    label: "Email:",
    id: "email",
  },
  {
    Component: TextInput,
    label: "Street:",
    id: "address.street",
  },
  {
    Component: TextInput,
    label: "City:",
    id: "address.city",
  },
  {
    Component: TextInput,
    label: "State:",
    id: "address.state",
  },
  {
    Component: TextInput,
    label: "Zip:",
    id: "address.zip",
  },
  {
    Component: TextInput,
    label: "Country:",
    id: "address.country",
  },
  {
    Component: TextInput,
    label: "DBA:",
    id: "dba",
  },
  {
    Component: Select,
    label: "Industry:",
    id: "industry",
    required: true,
    fieldProps: {
      options: getIndustryOptions,
    },
  },
  {
    Component: TextArea,
    label: "Description:",
    id: "description",
    required: true,
  },
];

const CreateCompany = () => {
  const { user } = useAuthContext();
  const userRole = user?.role as UserRole;
  const isClient = userRole === UserRole.CLIENT;
  const navigate = useNavigate();
  const formDataShape: CreateCompanyFormData = {
    name: "",
    url: "",
    phone: "",
    description: "",
    industry: "" as Industry,
    subscriptionStatus: SubscriptionStatus.ONBOARDING,
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    employees: [],
    projects: [],
    dba: "",
  };

  const { validateField } = useValidation();
  const { formData, setFormData, errors, setErrors, onSubmit } = useForm({
    formShape: formDataShape as CreateCompanyFormData,
    url: COMPANIES_BASE_API_URL,
    onSuccess: () => {
      navigate(isClient ? "/dashboard/my-company" : "/dashboard/companies");
    },
  });

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = e.target;

      setFormData((prevFormData) => {
        // Clone the previous data to avoid mutations
        let currentFormData = { ...prevFormData };
        // Check if the target name starts with 'address.'
        if (target.name.startsWith("address.")) {
          // This is an address property
          // Fix its name, update the correct property inside address
          const addressKey = target.name.replace("address.", "");

          currentFormData = {
            ...currentFormData,
            address: {
              ...(currentFormData.address || {}),
              [addressKey as keyof IAddressInfo]: target.value,
            } as IAddressInfo,
          };
        } else {
          currentFormData = {
            ...currentFormData,
            [target.name as keyof ICompany]:
              target.type === "checkbox"
                ? (target as HTMLInputElement).checked
                : target.value !== "" && target.value
                ? target.value
                : "",
          };
        }

        return currentFormData;
      });

      validateField({
        target,
        setErrors,
      });
    },
    [setErrors, setFormData, validateField]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formDataBody = {
        ...formData,
        employeeId: isClient ? user!._id : "",
      };

      onSubmit("POST", formDataBody);
    },
    [formData, isClient, onSubmit, user]
  );

  const fieldsWithFormProps = useCallback(
    (formShape: CreateCompanyFormData) =>
      fields.map((field) => {
        return {
          ...field,
          name: field.id,
          value: formShape![field.id as keyof typeof formShape] as string,
          onChange: handleChange,
          errors,
          setErrors,
        };
      }),
    [errors, handleChange, setErrors]
  );

  const getRenderedChildren = useCallback(
    (formShape: CreateCompanyFormData) =>
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
        <Heading text="Create company" level={1} />
        {renderedChildren}
        <Button type="submit">Submit</Button>
      </Form>
    )
  );
};

export default CreateCompany;
