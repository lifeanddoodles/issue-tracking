import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import {
  EmailInput,
  PasswordInput,
  TextInput,
} from "../../../components/Input";
import Select from "../../../components/Select";
import useFetch from "../../../hooks/useFetch";
import useValidation from "../../../hooks/useValidation";
import { USERS_BASE_API_URL, getPostOptions } from "../../../routes";
import { getDepartmentTeamOptions, getUserRoleOptions } from "../../../utils";

const CreateUser = () => {
  const formDataShape = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "",
    position: "",
    department: "",
    avatarUrl: "",
  };
  const [formData, setFormData] = useState(formDataShape);

  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();
  const { data, error, loading, sendRequest } = useFetch();

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
    sendRequest({ url: USERS_BASE_API_URL, options });
  };

  useEffect(() => {
    if (data && !loading && !error) {
      console.log(data);
      // TODO: Redirect to user details
    }
  }, [data, error, loading]);

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
        value={formData.company}
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
