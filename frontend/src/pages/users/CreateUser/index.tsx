import { ObjectId } from "mongoose";
import { useNavigate } from "react-router-dom";
import {
  IUser,
  IUserDocument,
  UserRole,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import {
  EmailInput,
  PasswordInput,
  TextInput,
} from "../../../components/Input";
import Select from "../../../components/Select";
import useAuth from "../../../hooks/useAuth";
import useForm from "../../../hooks/useForm";
import useValidation from "../../../hooks/useValidation";
import { USERS_BASE_API_URL, getPostOptions } from "../../../routes";
import { getDepartmentTeamOptions, getUserRoleOptions } from "../../../utils";

const CreateUser = () => {
  const { user } = useAuth();
  const isClient = user?.role === UserRole.CLIENT;
  const navigate = useNavigate();
  const formDataShape = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "" as unknown as ObjectId | Record<string, unknown>,
    position: "",
    department: "",
    avatarUrl: "",
  };
  const { formData, setFormData, errors, setErrors, onSubmit, data } = useForm<
    IUser & { confirmPassword: string },
    IUserDocument
  >({
    formShape: formDataShape as Partial<IUser> & { confirmPassword: string },
    url: USERS_BASE_API_URL,
    onSuccess: () => {
      navigate(
        isClient ? "/dashboard/my-team" : `/dashboard/users/${data?._id}`
      );
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

    const changedId =
      target.id === "confirmPassword" ? "confirmPassword" : "password";
    const idToCompare =
      changedId === "confirmPassword" ? "password" : "confirmPassword";

    validateField({
      target,
      setErrors,
      elementToCompare:
        (target.id === changedId || idToCompare) &&
        formData.password &&
        formData.confirmPassword
          ? { id: idToCompare, value: formData[idToCompare] }
          : undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const options = getPostOptions(formData);
    onSubmit(options);
  };

  return (
    <Form onSubmit={handleSubmit} className="ml-0">
      <Heading text="Create user" level={1} />
      <TextInput
        label="First name:"
        id="firstName"
        onChange={handleChange}
        value={formData.firstName}
        minLength={2}
        errors={errors}
        setErrors={setErrors}
        required
      />
      <TextInput
        label="Last name:"
        id="lastName"
        onChange={handleChange}
        value={formData.lastName}
        minLength={2}
        errors={errors}
        setErrors={setErrors}
        required
      />
      <EmailInput
        label="Email:"
        id="email"
        onChange={handleChange}
        value={formData.email}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <Select
        label="Department:"
        id="department"
        value={formData.department || ""}
        required
        options={getDepartmentTeamOptions()}
        onChange={handleChange}
        direction="col"
      />
      <Select
        label="Role:"
        id="role"
        value={formData.role || ""}
        required
        options={getUserRoleOptions()}
        onChange={handleChange}
        direction="col"
      />
      <TextInput
        label="Company"
        id="company"
        onChange={handleChange}
        value={formData.company?.toString()}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="Position"
        id="position"
        onChange={handleChange}
        value={formData.position}
        errors={errors}
        setErrors={setErrors}
      />
      <PasswordInput
        label="Password"
        id="password"
        onChange={handleChange}
        value={formData.password}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <PasswordInput
        label="Confirm password"
        id="confirmPassword"
        onChange={handleChange}
        value={formData.confirmPassword}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateUser;
