import { useState } from "react";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Heading from "../../components/Heading";
import Input from "../../components/Input";
import useValidation from "../../hooks/useValidation";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateInput } = useValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    setFormData({
      ...formData,
      [target.name]: target.value,
    });

    validateInput({
      target,
      setErrors,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
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
      <Button label="Submit" type="submit" />
    </Form>
  );
};

export default Login;
