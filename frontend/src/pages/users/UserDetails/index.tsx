import { ObjectId } from "mongoose";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DepartmentTeam,
  IUserDocument,
} from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import FormControlWithActions from "../../../components/FormControlWithActions";
import Heading from "../../../components/Heading";
import { TextInput } from "../../../components/Input";
import Select from "../../../components/Select";
import useFetch from "../../../hooks/useFetch";
import useValidation from "../../../hooks/useValidation";
import {
  USERS_BASE_API_URL,
  getDeleteOptions,
  getUpdateUserOptions,
} from "../../../routes";
import { getDepartmentTeamOptions } from "../../../utils";

type PartialDocument = Partial<IUserDocument>;

const UserDetails = () => {
  const params = useParams();
  const userId = params.userId;
  const {
    data: user,
    loading,
    error,
    sendRequest,
  } = useFetch<IUserDocument | null>();

  const [initialFormData, setInitialFormData] =
    useState<PartialDocument | null>(null);
  const [formData, setFormData] = useState<PartialDocument | null>(null);
  const [changedFormData, setChangedFormData] = useState<PartialDocument>({});
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();

  const getUserInfo = useCallback(() => {
    sendRequest({ url: `${USERS_BASE_API_URL}/${userId}` });
  }, [userId, sendRequest]);

  const requestDelete = () => {
    sendRequest({
      url: `${USERS_BASE_API_URL}/${userId}`,
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
          : target.value !== "" && target.value
          ? target.value
          : null,
    });

    validateField({
      target,
      setErrors,
    });
  };

  const handleCancel = (
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    initialValue:
      | string
      | number
      | boolean
      | readonly string[]
      | ObjectId
      | Record<string, unknown>
  ) => {
    setFormData({
      ...formData!,
      [target.id]: initialValue,
    });
  };

  const handleSave = async () => {
    const options = getUpdateUserOptions(changedFormData);
    await sendRequest({ url: `${USERS_BASE_API_URL}/${userId}`, options });
    getUserInfo();
  };

  const handleDelete = () => {
    requestDelete();
  };

  useEffect(() => getUserInfo(), [getUserInfo]);

  useEffect(() => {
    if (user && !loading) {
      const formDataShape: PartialDocument = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        position: user.position,
      };
      setInitialFormData(formDataShape);
      setFormData(formDataShape);
    }
  }, [loading, user]);

  useEffect(() => {
    const changes: PartialDocument = {};

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

  if (!user) {
    return <Heading text="Ticket not found" level={1} role="status" />;
  }

  return (
    user &&
    !loading &&
    formData && (
      <div className="user-details flex flex-col align-stretch">
        <div className="user-details__actions self-end flex gap-4">
          <Button onClick={handleDelete}>Delete</Button>
        </div>
        <Heading text="User details" level={1} />
        <FormControlWithActions
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

        <FormControlWithActions
          label="Company:"
          id="company"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.company!.toString()}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
      </div>
    )
  );
};

export default UserDetails;
