import { ObjectId } from "mongoose";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DepartmentTeam,
  IUserDocument,
  UserRole,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Heading from "../../../../components/Heading";
import {
  EmailInput,
  PasswordInput,
  TextInput,
} from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import { FormField } from "../../../../interfaces";
import { COMPANIES_BASE_API_URL, USERS_BASE_API_URL } from "../../../../routes";
import {
  getCompanyDataOptions,
  getDepartmentTeamOptions,
  getUserRoleOptions,
  renderFields,
} from "../../../../utils";

type CreateUserFormData = Partial<IUserDocument> & {
  confirmPassword: string;
  newAssignedAccount?: ObjectId | Record<string, unknown> | string;
};

const getCompanyProps = (isClient: boolean) => {
  return isClient
    ? {
        Component: TextInput,
        permissions: { VIEW: [UserRole.CLIENT] },
      }
    : {
        Component: SelectWithFetch,
        required: true,
        permissions: {
          VIEW: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER],
        },
        fieldProps: {
          url: COMPANIES_BASE_API_URL,
          getFormattedOptions: getCompanyDataOptions,
        },
      };
};

const fields = [
  {
    Component: TextInput,
    label: "First name:",
    id: "firstName",
    required: true,
    fieldProps: {
      minLength: 2,
    },
  },
  {
    Component: TextInput,
    label: "Last name:",
    id: "lastName",
    required: true,
    fieldProps: {
      minLength: 2,
    },
  },
  {
    Component: EmailInput,
    label: "Email:",
    id: "email",
    required: true,
  },
  {
    Component: Select,
    label: "Department:",
    id: "department",
    fieldProps: {
      options: getDepartmentTeamOptions,
      direction: "col",
    },
  },
  {
    Component: Select,
    label: "Role:",
    id: "role",
    required: true,
    permissions: { VIEW: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER] },
    fieldProps: {
      options: getUserRoleOptions,
      direction: "col",
    },
  },
  {
    label: "Company:",
    id: "company",
    loadProps: getCompanyProps,
  },
  {
    Component: TextInput,
    label: "Position:",
    id: "position",
  },
  {
    Component: PasswordInput,
    label: "Password:",
    id: "password",
    required: true,
  },
  {
    Component: PasswordInput,
    label: "Confirm password:",
    id: "confirmPassword",
    required: true,
  },
  {
    Component: SelectWithFetch,
    label: "Assign account:",
    id: "newAssignedAccount",
    permissions: { VIEW: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER] },
    fieldProps: {
      url: COMPANIES_BASE_API_URL,
      getFormattedOptions: getCompanyDataOptions,
      showList: true,
      pathToValue: "assignedAccounts",
    },
  },
];

const CreateUser = () => {
  const { user } = useAuthContext();
  const userRole = user?.role as UserRole;
  const isClient = userRole === UserRole.CLIENT;
  const navigate = useNavigate();
  const formDataShape: CreateUserFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "" as unknown as ObjectId | Record<string, unknown> | string,
    position: "",
    department: "" as DepartmentTeam,
    avatarUrl: "",
    newAssignedAccount: "" as unknown as
      | ObjectId
      | Record<string, unknown>
      | string,
    assignedAccounts: [],
  };
  const { formData, setFormData, errors, setErrors, onSubmit, data } = useForm<
    CreateUserFormData,
    IUserDocument
  >({
    formShape: formDataShape,
    url: USERS_BASE_API_URL,
    onSuccess: () => {
      navigate(
        isClient ? "/dashboard/my-team" : `/dashboard/users/${data?._id}`
      );
    },
  });
  const { validateField } = useValidation();
  const formHasErrors = useMemo(
    () => errors && Object.keys(errors).length > 0,
    [errors]
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = e.target;

      setFormData((prevFormData) => {
        let currentFormData = { ...prevFormData };

        if (target.name === "newAssignedAccount") {
          currentFormData[target.name] = target.value;
          currentFormData.assignedAccounts = [
            ...(currentFormData?.assignedAccounts || []),
            target.value,
          ];
        } else {
          currentFormData = {
            ...currentFormData,
            [target.name as keyof IUserDocument]:
              target.type === "checkbox"
                ? (target as HTMLInputElement).checked
                : target.value !== "" && target.value
                ? target.value
                : "",
          };
        }

        return currentFormData;
      });

      const changedId =
        target.id === "confirmPassword" ? "confirmPassword" : "password";
      const idToCompare =
        changedId === "confirmPassword" ? "password" : "confirmPassword";

      validateField({
        target,
        setErrors,
        elementToCompare:
          (target.id === changedId || idToCompare) &&
          formData?.password &&
          formData?.confirmPassword
            ? { id: idToCompare, value: formData[idToCompare] }
            : undefined,
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

    const fieldsToRender = (
      fields as (FormField<unknown> & {
        loadProps?: (isClient: boolean) => Record<string, unknown>;
      })[]
    ).map((field) => {
      let dynamicFieldProps: Record<string, unknown> = {};
      if (field.loadProps) {
        dynamicFieldProps = field.loadProps(isClient);
      }
      return {
        ...field,
        ...dynamicFieldProps,
        name: field.id,
        [typeof formData![field.id as keyof typeof formData] === "boolean"
          ? "checked"
          : "value"]: formData![field.id as keyof typeof formData] as
          | string
          | boolean,
        onChange: handleChange,
        errors,
        setErrors,
      };
    });

    return renderFields(fieldsToRender, formData, userRole);
  }, [errors, formData, handleChange, isClient, setErrors, userRole]);

  return (
    <Form onSubmit={handleSubmit} className="ml-0">
      <Heading text="Create user" level={1} />
      {renderedChildren}
      <Button type="submit" disabled={formHasErrors || false}>
        Submit
      </Button>
    </Form>
  );
};

export default CreateUser;
