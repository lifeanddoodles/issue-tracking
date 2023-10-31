import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Heading from "../../components/Heading";
import Input from "../../components/Input";
import { useAuthContext } from "../../context/AuthProvider";
import useValidation from "../../hooks/useValidation";
import { LOGIN_API_URL, getLoginUserOptions } from "../../routes";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();
  const { user, error, loading, authUserReq } = useAuthContext();
  const navigate = useNavigate();

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
        <Input
          label="Email:"
          type="email"
          id="email"
          onChange={handleChange}
          value={email}
          required
          errors={errors}
          setErrors={setErrors}
        />
        <Input
          label="Password"
          type="password"
          id="password"
          onChange={handleChange}
          value={password}
          required
          errors={errors}
          setErrors={setErrors}
        />
        <Button type="submit">Submit</Button>
      </Form>
      <GoogleLoginButton />
    </>
  );
};

export default Login;
