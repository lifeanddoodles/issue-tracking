import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepartmentTeam, UserRole } from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import { EmailInput, PasswordInput } from "../../../components/Input";
import InternalLink from "../../../components/InternalLink";
import Text from "../../../components/Text";
import { useAuthContext } from "../../../context/AuthProvider";
import useValidation from "../../../hooks/useValidation";
import { FormField } from "../../../interfaces";
import Row from "../../../layout/Row";
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

  const getDemoUserCredentials = (
    role: UserRole,
    department?: DepartmentTeam
  ) => {
    switch (role) {
      case UserRole.ADMIN:
        return {
          email: import.meta.env.VITE_ADMIN_EMAIL,
          password: import.meta.env.VITE_ADMIN_PASSWORD,
        };
      case UserRole.STAFF:
        return {
          email:
            department === DepartmentTeam.MANAGEMENT
              ? import.meta.env.VITE_PM_EMAIL
              : department === DepartmentTeam.DEVELOPMENT
              ? import.meta.env.VITE_DEV_EMAIL
              : import.meta.env.VITE_CS_EMAIL,
          password:
            department === DepartmentTeam.MANAGEMENT
              ? import.meta.env.VITE_PM_PASSWORD
              : department === DepartmentTeam.DEVELOPMENT
              ? import.meta.env.VITE_DEV_PASSWORD
              : import.meta.env.VITE_CS_PASSWORD,
        };
      case UserRole.CLIENT:
      default:
        return {
          email: import.meta.env.VITE_CLIENT_EMAIL,
          password: import.meta.env.VITE_CLIENT_PASSWORD,
        };
    }
  };

  const handleLoginAsDemo = (role: UserRole, department?: DepartmentTeam) => {
    const credentials = getDemoUserCredentials(role, department);

    const options = getLoginUserOptions(
      credentials as { email: string; password: string }
    );
    authUserReq!(LOGIN_API_URL, options);
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
        <Button type="submit" disabled={disableSubmit} className="mb-4">
          Submit
        </Button>
        {error && <Text className="mt-4 text-red-500">{error?.message}</Text>}
        {/* TODO: Add forgot password functionality
          <Text>
            Forgot your password? <InternalLink to="/forgot-password">Reset</InternalLink>
          </Text>
        */}
        <Row className="gap-x-4 mb-4">
          <Text>
            Don't have an account?{" "}
            <InternalLink to="/register" variant="link">
              Register
            </InternalLink>
          </Text>
          <GoogleLoginButton />
        </Row>
        <section aria-label={"Sign in as a demo user"} className="mb-4">
          <Text>
            Or use one of the{" "}
            <Text className="font-bold" as="span">
              demo accounts
            </Text>
            :
          </Text>
          <Row className="gap-2 flex-wrap flex-row">
            <Button
              className="flex-grow-0 flex-shrink-1"
              variant="outline"
              onClick={() => handleLoginAsDemo(UserRole.CLIENT)}
            >
              Client
            </Button>
            <Button
              className="flex-grow-0 flex-shrink-1"
              variant="outline"
              onClick={() =>
                handleLoginAsDemo(
                  UserRole.STAFF,
                  DepartmentTeam.CUSTOMER_SUCCESS
                )
              }
            >
              Customer Success Rep.
            </Button>
            <Button
              className="flex-grow-0 flex-shrink-1"
              variant="outline"
              onClick={() =>
                handleLoginAsDemo(UserRole.STAFF, DepartmentTeam.DEVELOPMENT)
              }
            >
              Developer
            </Button>
            <Button
              className="flex-grow-0 flex-shrink-1"
              variant="outline"
              onClick={() =>
                handleLoginAsDemo(UserRole.STAFF, DepartmentTeam.MANAGEMENT)
              }
            >
              Project Manager
            </Button>
            <Button
              className="flex-grow-0 flex-shrink-1"
              variant="outline"
              onClick={() => handleLoginAsDemo(UserRole.ADMIN)}
            >
              Admin
            </Button>
          </Row>
        </section>
      </Form>
    </>
  );
};

export default Login;
