import { RefAttributes, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DepartmentTeam,
  IUserDocument,
  UserRole,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import FormControlWithActions, {
  nonBooleanValueType,
} from "../../../components/FormControlWithActions";
import Heading from "../../../components/Heading";
import { TextInput } from "../../../components/Input";
import Select from "../../../components/Select";
import SelectWithFetch from "../../../components/Select/SelectWithFetch";
import useFetch from "../../../hooks/useFetch";
import useProfileData from "../../../hooks/useProfileData";
import useValidation from "../../../hooks/useValidation";
import { ITextInputProps } from "../../../interfaces";
import {
  COMPANIES_BASE_API_URL,
  PROFILE_API_URL,
  USERS_BASE_API_URL,
  getDeleteOptions,
  getUpdateOptions,
} from "../../../routes";
import {
  getCompanyDataOptions,
  getDepartmentTeamOptions,
  getVariantClasses,
} from "../../../utils";

const Profile = () => {
  const { userInfo, loading, error, getUserInfo } = useProfileData();
  const { sendRequest } = useFetch<IUserDocument | null>();
  const [initialFormData, setInitialFormData] =
    useState<Partial<IUserDocument> | null>(null);
  const [formData, setFormData] = useState<Partial<IUserDocument> | null>(null);
  const [changedFormData, setChangedFormData] = useState<
    Partial<IUserDocument>
  >({});
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();

  const requestDelete = () => {
    sendRequest({
      url: `${USERS_BASE_API_URL}/${userInfo?._id}`,
      options: getDeleteOptions(),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    setFormData({
      ...formData!,
      [target.name]:
        target.type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value,
    });

    validateField({
      target,
      setErrors,
    });
  };

  const handleCancel: (
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    initialValue: nonBooleanValueType | boolean
  ) => void = (target, initialValue) => {
    setFormData({
      ...formData!,
      [target.id]: initialValue,
    });
  };

  const handleSave = async () => {
    const options = getUpdateOptions(changedFormData);
    await sendRequest({ url: `${PROFILE_API_URL}`, options });
    getUserInfo();
  };

  const handleDelete = () => {
    requestDelete();
  };

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  useEffect(() => {
    if (userInfo) {
      setInitialFormData(userInfo);
      setFormData(userInfo);
    }
  }, [loading, userInfo]);

  useEffect(() => {
    const changes: Partial<IUserDocument> = {};

    for (const key in formData) {
      if (
        initialFormData &&
        formData[key as keyof IUserDocument] !==
          initialFormData[key as keyof IUserDocument]
      ) {
        changes[key as keyof IUserDocument] =
          formData[key as keyof IUserDocument];
      }
    }
    setChangedFormData(changes);
  }, [formData, initialFormData]);

  if (loading) {
    return <Heading text="Loading..." level={1} role="status" />;
  }

  if (error) {
    return <Heading text={error.message} level={1} role="status" />;
  }

  if (!loading && !userInfo) {
    return <Heading text="User not found" level={1} role="status" />;
  }

  return (
    userInfo &&
    !loading &&
    formData && (
      <div className="user-details flex flex-col align-stretch">
        <div className="user-details__actions self-end flex gap-4">
          <Button onClick={handleDelete}>Delete</Button>
        </div>
        <Heading text="Profile" level={1} />
        <FormControlWithActions<
          ITextInputProps & RefAttributes<HTMLInputElement>,
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
          unknown
        >
          label="First name:"
          id="firstName"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.firstName}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Last name:"
          id="lastName"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.lastName}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        {formData?.department && (
          <FormControlWithActions
            label="Assign to team:"
            id="department"
            value={formData?.department as DepartmentTeam}
            options={getDepartmentTeamOptions()}
            onChange={handleChange}
            onCancel={handleCancel}
            onSave={handleSave}
            required
            errors={errors}
            setErrors={setErrors}
            component={Select}
          />
        )}
        <FormControlWithActions
          label="Email:"
          id="email"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.email}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Position:"
          id="position"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.position}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        {formData?.company ? (
          <>
            <FormControlWithActions
              label="Company:"
              id="company"
              onChange={handleChange}
              onCancel={handleCancel}
              onSave={handleSave}
              value={formData?.company.toString()}
              errors={errors}
              setErrors={setErrors}
              component={SelectWithFetch}
              url={COMPANIES_BASE_API_URL}
              getFormattedOptions={getCompanyDataOptions}
              disabled={userInfo?.role === UserRole.CLIENT}
            />
            <Link
              className={`${getVariantClasses("link")}`}
              to={`/dashboard/companies/${formData?.company.toString()}`}
            >
              Edit company details
            </Link>
          </>
        ) : (
          <Link
            className={`${getVariantClasses("link")}`}
            to={`/dashboard/companies/create`}
          >
            Add company
          </Link>
        )}
      </div>
    )
  );
};

export default Profile;
