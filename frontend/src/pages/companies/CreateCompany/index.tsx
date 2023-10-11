import { useEffect, useState } from "react";
import {
  ICompany,
  Industry,
  SubscriptionStatus,
  UserRole,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import { EmailInput, TextInput, UrlInput } from "../../../components/Input";
import Select from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import useValidation from "../../../hooks/useValidation";
import { COMPANIES_BASE_API_URL, getPostOptions } from "../../../routes";
import { getIndustryOptions } from "../../../utils";

const CreateTicket = () => {
  const { user } = useAuth();
  const role = user?.role;
  const isClient = role === UserRole.CLIENT;
  const formDataShape = {
    name: "",
    url: "",
    phone: "",
    description: "",
    industry: "" as Industry,
    subscriptionStatus: SubscriptionStatus.ONBOARDING,
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    employees: [],
    projects: [],
    dba: "",
  };
  const [formData, setFormData] = useState<
    ICompany & {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    }
  >(formDataShape);

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

    validateField({
      target,
      setErrors,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataBody = {
      ...formData,
      address: {
        street: formData?.street,
        city: formData?.city,
        state: formData?.state,
        zip: formData?.zip,
        country: formData?.country,
      },
      employeeId: isClient ? user!._id : "",
    };

    const options = getPostOptions<ICompany>(formDataBody);
    sendRequest({ url: COMPANIES_BASE_API_URL, options });
  };

  useEffect(() => {
    if (data && !loading && !error) {
      console.log(data);
      // TODO: Redirect to ticket details
    }
  }, [data, error, loading]);

  return (
    <Form onSubmit={handleSubmit} className="ml-0">
      <Heading text="Create company" level={1} />
      <TextInput
        label="Name:"
        id="name"
        onChange={handleChange}
        value={formData.name}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <UrlInput
        label="Website:"
        id="url"
        type="url"
        onChange={handleChange}
        value={formData.url}
        required
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="Phone:"
        id="phone"
        onChange={handleChange}
        value={formData.phone}
        errors={errors}
        setErrors={setErrors}
      />
      <EmailInput
        label="Email:"
        id="email"
        onChange={handleChange}
        value={formData.email}
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="Street:"
        id="street"
        onChange={handleChange}
        value={formData.street}
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="City:"
        id="city"
        onChange={handleChange}
        value={formData.city}
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="State:"
        id="state"
        onChange={handleChange}
        value={formData.state}
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="Zip:"
        id="zip"
        onChange={handleChange}
        value={formData.zip}
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="Country:"
        id="country"
        onChange={handleChange}
        value={formData.country}
        errors={errors}
        setErrors={setErrors}
      />
      <TextInput
        label="DBA:"
        id="dba"
        onChange={handleChange}
        value={formData.dba}
        errors={errors}
        setErrors={setErrors}
      />
      <Select
        label="Industry:"
        id="industry"
        value={formData?.industry}
        options={getIndustryOptions()}
        onChange={handleChange}
        errors={errors}
        setErrors={setErrors}
      />
      <TextArea
        label="Description:"
        id="description"
        onChange={handleChange}
        value={formData.description}
        errors={errors}
        setErrors={setErrors}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateTicket;
