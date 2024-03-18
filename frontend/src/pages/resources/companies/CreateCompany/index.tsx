import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IAddressInfo,
  ICompany,
  Industry,
  SubscriptionStatus,
  Tier,
  UserRole,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Heading from "../../../../components/Heading";
import { EmailInput, TextInput, UrlInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import { FormField } from "../../../../interfaces";
import { COMPANIES_BASE_API_URL, USERS_BASE_API_URL } from "../../../../routes";
import {
  getCustomerSuccessOptions,
  getIndustryOptions,
  getSubscriptionStatusOptions,
  getTierOptions,
  renderFields,
} from "../../../../utils";

type CreateCompanyFormData = Partial<ICompany>;

const isFieldDisabled = (id: string, formData: CreateCompanyFormData) => {
  switch (id) {
    case "assignedRepresentative":
      return formData?.tier === ("" as unknown) || formData?.tier === Tier.FREE;
    default:
      return;
  }
};

const fields = [
  {
    Component: TextInput,
    label: "Name:",
    id: "name",
    required: true,
  },
  {
    Component: Select,
    label: "Status:",
    id: "subscriptionStatus",
    permissions: { VIEW: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER] },
    fieldProps: {
      options: getSubscriptionStatusOptions,
    },
  },
  {
    Component: Select,
    label: "Tier:",
    id: "tier",
    permissions: { VIEW: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER] },
    fieldProps: {
      options: getTierOptions,
    },
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
  {
    Component: SelectWithFetch,
    label: "Assign representative:",
    id: "assignedRepresentative",
    disabled: isFieldDisabled,
    permissions: {
      EDIT: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER],
      VIEW: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER],
    },
    fieldProps: {
      url: USERS_BASE_API_URL,
      getFormattedOptions: getCustomerSuccessOptions,
    },
  },
];

const CreateCompany = () => {
  const { user } = useAuthContext();
  const userRole = user?.role as UserRole;
  const isClient = userRole === UserRole.CLIENT;
  const navigate = useNavigate();
  const formDataShape: CreateCompanyFormData = {
    name: "",
    subscriptionStatus: "" as SubscriptionStatus,
    tier: "" as Tier,
    url: "",
    phone: "",
    description: "",
    industry: "" as Industry,
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
    assignedRepresentative: "",
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

      /**
       * TODO: Update endpoint to add company ID
       * to the corresponding CS Rep's assigned accounts (if not already included)
       */
      onSubmit("POST", formDataBody);
    },
    [formData, isClient, onSubmit, user]
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

    return renderFields(fieldsToRender, formData, userRole);
  }, [errors, formData, handleChange, setErrors, userRole]);

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
