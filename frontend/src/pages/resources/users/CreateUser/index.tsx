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
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import { USERS_BASE_API_URL } from "../../../../routes";
import {
  getDepartmentTeamOptions,
  getUserRoleOptions,
  renderFields,
} from "../../../../utils";

type CreateUserFormData = Partial<IUserDocument> & { confirmPassword: string };

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
    fieldProps: {
      options: getUserRoleOptions,
      direction: "col",
    },
  },
  {
    Component: TextInput,
    label: "Company:",
    id: "company",
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
];

const CreateUser = () => {
  const { user } = useAuthContext();
  const isClient = user?.role === UserRole.CLIENT;
  const navigate = useNavigate();
  const formDataShape: CreateUserFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "" as unknown as ObjectId | Record<string, unknown>,
    position: "",
    department: "" as DepartmentTeam,
    avatarUrl: "",
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

      setFormData({
        ...formData,
        [target.name]: target.value,
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

  const fieldsWithFormProps = useCallback(
    (formShape: CreateUserFormData) =>
      fields.map((field) => {
        return {
          ...field,
          name: field.id,
          [typeof formShape![field.id as keyof typeof formShape] === "boolean"
            ? "checked"
            : "value"]: formShape![field.id as keyof typeof formShape] as
            | string
            | boolean,
          onChange: handleChange,
          errors,
          setErrors,
        };
      }),
    [errors, handleChange, setErrors]
  );

  const getRenderedChildren = useCallback(
    (formShape: CreateUserFormData) =>
      renderFields(fieldsWithFormProps(formShape), formShape),
    [fieldsWithFormProps]
  );

  const renderedChildren = useMemo(
    () =>
      formData !== null && getRenderedChildren(formData as CreateUserFormData),
    [formData, getRenderedChildren]
  );

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
