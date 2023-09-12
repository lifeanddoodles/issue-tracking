import { useState } from "react";
import Input from "../../components/Input";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    password: "",
    passwordConfirm: "",
  });
  const {
    firstName,
    lastName,
    email,
    company,
    position,
    password,
    passwordConfirm,
  } = formData;
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
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
        id="passwordConfirm"
        onChange={handleChange}
        value={passwordConfirm}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Register;
