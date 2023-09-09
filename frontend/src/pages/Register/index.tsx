import { useState } from "react";

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
  const [errors, setErrors] = useState([]);

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
      <label htmlFor="firstName">First name:</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        onChange={handleChange}
        value={firstName}
        minLength={2}
        required
      />
      <label htmlFor="lastName">Last name:</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        onChange={handleChange}
        value={lastName}
        minLength={2}
        required
      />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        onChange={handleChange}
        value={email}
        required
      />
      <label htmlFor="company">Company</label>
      <input
        type="text"
        id="company"
        name="company"
        onChange={handleChange}
        value={company}
        required
      />
      <label htmlFor="position">Position</label>
      <input
        type="text"
        id="position"
        name="position"
        onChange={handleChange}
        value={position}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={handleChange}
        value={password}
        required
      />
      <label htmlFor="passwordConfirm">Confirm password</label>
      <input
        type="password"
        id="passwordConfirm"
        name="passwordConfirm"
        onChange={handleChange}
        value={passwordConfirm}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Register;
