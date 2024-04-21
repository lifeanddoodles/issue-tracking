import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import { EmailInput, PasswordInput } from "../../../components/Input";
import { useAuthContext } from "../../../context/AuthProvider";
import useValidation from "../../../hooks/useValidation";
import { FormField } from "../../../interfaces";
import { LOGIN_API_URL, getLoginUserOptions } from "../../../routes";
import GoogleLoginButton from "./GoogleLoginButton";

const fields: FormField<unknown>[] = [
  {
    id: "email",
    label: "Email:",
    Component: EmailInput,
    required: true,
  },
  {
    id: "password",
    label: "Password:",
    Component: PasswordInput,
    required: true,
  },
];

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();
  const { user, error, loading, authUserReq } = useAuthContext();
  const navigate = useNavigate();
  const requiredFields = useMemo(
    () =>
      fields
        .map((field) => {
          if (field.required) return field.id;
        })
        .filter(Boolean),
    []
  );
  const missingFields = useMemo(
    () =>
      requiredFields.filter(
        (field) => formData[field as keyof typeof formData] === ""
      ).length > 0,
    [formData, requiredFields]
  );
  const disableSubmit = useMemo(
    () => missingFields || errors !== null,
    [missingFields, errors]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const options = getLoginUserOptions(formData);
    authUserReq!(LOGIN_API_URL, options);
  };

  useEffect(() => {
    if (user && !loading && !error) {
      navigate("/dashboard");
    }
  }, [user, error, loading, navigate]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Heading text="Login" level={1} />
        {fields.map(({ id, label, Component, required }) => (
          <Component
            key={id}
            label={label}
            id={id}
            onChange={handleChange}
            value={formData[id as keyof typeof formData]}
            required={required}
            errors={errors}
            setErrors={setErrors}
          />
        ))}
        <Button type="submit" disabled={disableSubmit}>
          Submit
        </Button>
        {error && <p className="mt-4 text-red-500">{error?.message}</p>}
      </Form>
      <GoogleLoginButton />
    </>
  );
};

export default Login;
