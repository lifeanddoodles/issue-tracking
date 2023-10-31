import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ICompany, ICompanyDocument } from "../../../../shared/interfaces";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Heading from "../../components/Heading";
import { EmailInput, PasswordInput, TextInput } from "../../components/Input";
import SelectWithFetch from "../../components/Select/SelectWithFetch";
import { useAuthContext } from "../../context/AuthProvider";
import useFetch from "../../hooks/useFetch";
import useValidation from "../../hooks/useValidation";
import {
  COMPANIES_BASE_API_URL,
  USERS_BASE_API_URL,
  getPostOptions,
  getRegisterUserOptions,
} from "../../routes";
import { getCompanyDataOptions } from "../../utils";

const Register = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const companyParam = searchParams.get("company");
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
  const { validateField } = useValidation();
  const { user, error, loading, authUserReq } = useAuthContext();
  const navigate = useNavigate();
  const {
    data: newCompany,
    error: newCompanyError,
    loading: newCompanyLoading,
    sendRequest,
  } = useFetch<ICompanyDocument>();

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

    // TODO: Fix validation bug due to password and confirm password
    const changedId =
      target.id === "confirmPassword" ? "confirmPassword" : "password";
    const idToCompare =
      changedId === "confirmPassword" ? "password" : "confirmPassword";

    validateField({
      target,
      setErrors,
      elementToCompare:
        (target.id === changedId || idToCompare) && password && confirmPassword
          ? { id: idToCompare, value: formData[idToCompare] }
          : undefined,
    });
  };

  const createUser = useCallback(
    (companyId: string) => {
      const options = getRegisterUserOptions({
        ...formData,
        company: companyId,
      });
      authUserReq!(USERS_BASE_API_URL, options);
    },
    [authUserReq, formData]
  );

  const createCompany = () => {
    const options = getPostOptions<ICompany>({ name: formData.company });
    sendRequest({ url: COMPANIES_BASE_API_URL, options });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!companyParam) {
      return createCompany();
    }
    createUser(companyParam);
  };

  useEffect(() => {
    if (
      !user &&
      !companyParam &&
      newCompany &&
      !newCompanyLoading &&
      !newCompanyError
    ) {
      createUser(newCompany._id);
    }
  }, [
    companyParam,
    createUser,
    newCompany,
    newCompanyError,
    newCompanyLoading,
    user,
  ]);

  useEffect(() => {
    if (user && !loading && !error) {
      navigate("/dashboard");
    }
  }, [user, error, loading, navigate]);

  return (
    <Form onSubmit={handleSubmit}>
      <Heading text="Register" level={1} />
      <TextInput
        label="First name:"
        id="firstName"
        onChange={handleChange}
        value={firstName}
        minLength={2}
        errors={errors}
        setErrors={setErrors}
        required
      />
      <TextInput
        label="Last name:"
        id="lastName"
        onChange={handleChange}
        value={lastName}
        minLength={2}
        errors={errors}
        setErrors={setErrors}
        required
      />
      <EmailInput
        label="Email:"
        id="email"
        onChange={handleChange}
        value={email}
        required
        errors={errors}
        setErrors={setErrors}
      />
      {!companyParam ? (
        <TextInput
          label="Company"
          id="company"
          onChange={handleChange}
          value={company}
          required
          errors={errors}
          setErrors={setErrors}
        />
      ) : (
        <SelectWithFetch
          label="Company"
          id="company"
          value={companyParam}
          onChange={handleChange}
          errors={errors}
          url={COMPANIES_BASE_API_URL}
          getFormattedOptions={getCompanyDataOptions}
          disabled
        />
      )}
      <TextInput
        label="Position"
        id="position"
        onChange={handleChange}
        value={position}
        errors={errors}
        setErrors={setErrors}
      />
      <PasswordInput
        label="Password"
        id="password"
        onChange={handleChange}
        value={password}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <PasswordInput
        label="Confirm password"
        id="confirmPassword"
        onChange={handleChange}
        value={confirmPassword}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default Register;
