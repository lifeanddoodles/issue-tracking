import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ICompany,
  ICompanyDocument,
  IUser,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Heading from "../../../components/Heading";
import {
  EmailInput,
  PasswordInput,
  TextInput,
} from "../../../components/Input";
import SelectWithFetch from "../../../components/Select/SelectWithFetch";
import { useAuthContext } from "../../../context/AuthProvider";
import useFetch from "../../../hooks/useFetch";
import useValidation from "../../../hooks/useValidation";
import { FormField } from "../../../interfaces";
import {
  COMPANIES_BASE_API_URL,
  USERS_BASE_API_URL,
  getPostOptions,
} from "../../../routes";
import { getCompanyDataOptions, omit } from "../../../utils";

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
  const fields: FormField[] = useMemo(
    () => [
      {
        id: "firstName",
        label: "First name:",
        Component: TextInput,
        required: true,
        fieldProps: {
          minLength: 2,
        },
      },
      {
        id: "lastName",
        label: "Last name:",
        Component: TextInput,
        required: true,
        fieldProps: {
          minLength: 2,
        },
      },
      {
        id: "email",
        label: "Email:",
        Component: EmailInput,
        required: true,
      },
      {
        id: "company",
        label: "Company:",
        ...(!companyParam
          ? { Component: TextInput }
          : {
              Component: SelectWithFetch,
              fieldProps: {
                url: COMPANIES_BASE_API_URL,
                getFormattedOptions: getCompanyDataOptions,
              },
              customFormProps: {
                errors: errors,
              },
            }),
      },
      {
        id: "position",
        label: "Position:",
        Component: TextInput,
      },
      {
        id: "password",
        label: "Password:",
        Component: PasswordInput,
        required: true,
      },
      {
        id: "confirmPassword",
        label: "Confirm password:",
        Component: PasswordInput,
        required: true,
      },
    ],
    [companyParam, errors]
  );
  const requiredFields = useMemo(
    () =>
      fields
        .map((field) => {
          if (field.required) return field.id;
        })
        .filter(Boolean),
    [fields]
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
        (target.id === changedId || idToCompare) &&
        formData.password &&
        formData.confirmPassword
          ? { id: idToCompare, value: formData[idToCompare] }
          : undefined,
    });
  };

  const createUser = useCallback(
    (companyId?: string) => {
      const keysToOmit = [
        ...(companyId ? [] : ["company"]),
        ...(formData.position !== "" ? [] : ["position"]),
      ];
      const formattedFormData = omit(formData, keysToOmit);
      const options = getPostOptions<IUser>({
        ...formattedFormData,
        ...(companyId ? { company: companyId } : {}),
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

    if (!companyParam && formData.company) {
      return createCompany();
    } else if (!companyParam && !formData.company) {
      return createUser();
    }
    companyParam && createUser(companyParam);
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
      {fields.map(
        ({ id, label, Component, required, fieldProps, customFormProps }) => (
          <Component
            key={id}
            label={label}
            id={id}
            onChange={handleChange}
            value={formData[id as keyof typeof formData]}
            required={required}
            {...fieldProps}
            errors={errors}
            setErrors={setErrors}
            {...customFormProps}
          />
        )
      )}
      <Button type="submit" disabled={disableSubmit}>
        Submit
      </Button>
    </Form>
  );
};

export default Register;
