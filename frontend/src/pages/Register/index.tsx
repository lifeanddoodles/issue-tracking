import { useState } from "react";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Heading from "../../components/Heading";
import Input from "../../components/Input";
import useValidation from "../../hooks/useValidation";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    password: "",
    confirmPassword: "",
  });
  const {
    firstName,
    lastName,
    email,
    company,
    position,
    password,
    confirmPassword,
  } = formData;
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

    const changedId =
      target.id === "confirmPassword" ? "confirmPassword" : "password";
    const idToCompare =
      changedId === "confirmPassword" ? "password" : "confirmPassword";

    validateInput({
      target,
      setErrors,
      elementToCompare:
        (target.id === changedId || idToCompare) && password && confirmPassword
          ? { id: idToCompare, value: formData[idToCompare] }
          : undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Heading text="Register" level={1} />
      <Input
        label="First name:"
        type="text"
        id="firstName"
        onChange={handleChange}
        value={firstName}
        minLength={2}
        errors={errors}
        setErrors={setErrors}
        required
      />
      <Input
        label="Last name:"
        type="text"
        id="lastName"
        onChange={handleChange}
        value={lastName}
        minLength={2}
        errors={errors}
        setErrors={setErrors}
        required
      />
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
        label="Company"
        type="text"
        id="company"
        onChange={handleChange}
        value={company}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <Input
        label="Position"
        type="text"
        id="position"
        onChange={handleChange}
        value={position}
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
      <Input
        label="Confirm password"
        type="password"
        id="confirmPassword"
        onChange={handleChange}
        value={confirmPassword}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <Button label="Submit" type="submit" />
    </Form>
  );
};

export default Register;
