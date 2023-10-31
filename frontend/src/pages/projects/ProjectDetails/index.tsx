import { ObjectId } from "mongoose";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IProjectDocument, UserRole } from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import FormControlWithActions from "../../../components/FormControlWithActions";
import Heading from "../../../components/Heading";
import { TextInput, UrlInput } from "../../../components/Input";
import SelectWithFetch from "../../../components/Select/SelectWithFetch";
import TextArea from "../../../components/TextArea";
import { useAuthContext } from "../../../context/AuthProvider";
import useFetch from "../../../hooks/useFetch";
import useValidation from "../../../hooks/useValidation";
import {
  PROJECTS_BASE_API_URL,
  SERVICES_BASE_API_URL,
  USERS_BASE_API_URL,
  getDeleteOptions,
  getUpdateOptions,
} from "../../../routes";
import { getServiceDataOptions, getUserDataOptions } from "../../../utils";

type PartialDocument = Partial<IProjectDocument> & {
  newService?: ObjectId | Record<string, unknown>;
  newTeamMember?: ObjectId | Record<string, unknown>;
};

const ProjectDetails = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === UserRole.ADMIN;
  const params = useParams();
  const projectId = params.projectId;
  const {
    data: project,
    loading,
    error,
    sendRequest,
  } = useFetch<IProjectDocument | null>();

  const [initialFormData, setInitialFormData] =
    useState<PartialDocument | null>(null);
  const [formData, setFormData] = useState<PartialDocument | null>(null);
  const [changedFormData, setChangedFormData] = useState<PartialDocument>({});
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();

  const getProjectInfo = useCallback(() => {
    sendRequest({ url: `${PROJECTS_BASE_API_URL}/${projectId}` });
  }, [projectId, sendRequest]);

  const requestDelete = () => {
    sendRequest({
      url: `${PROJECTS_BASE_API_URL}/${projectId}`,
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
    const options = getUpdateOptions(changedFormData);
    await sendRequest({
      url: `${PROJECTS_BASE_API_URL}/${projectId}`,
      options,
    });
    getProjectInfo();
  };

  const handleDelete = () => {
    requestDelete();
  };

  useEffect(() => getProjectInfo(), [getProjectInfo]);

  useEffect(() => {
    if (project && !loading) {
      const formDataShape: PartialDocument = {
        name: project.name,
        description: project.description,
        url: project.url,
        newService: undefined,
        newTeamMember: undefined,
        services: project.services,
      };
      setInitialFormData(formDataShape);
      setFormData(formDataShape);
    }
  }, [loading, project]);

  useEffect(() => {
    const changes: PartialDocument = {};

    for (const key in formData) {
      if (
        initialFormData &&
        formData[key as keyof IProjectDocument] !==
          initialFormData[key as keyof IProjectDocument]
      ) {
        if (key === "newService" && formData[key] !== undefined) {
          changes.services = [
            ...(project?.services || []),
            formData.newService as ObjectId | Record<string, unknown>,
          ];
        } else if (key === "newTeamMember" && formData[key] !== undefined) {
          changes.team = [
            ...(project?.team || []),
            formData.newTeamMember as ObjectId | Record<string, unknown>,
          ];
        } else {
          changes[key as keyof IProjectDocument] =
            formData[key as keyof IProjectDocument];
        }
      }
    }
    setChangedFormData(changes);
  }, [formData, initialFormData, project]);

  if (loading) {
    return <Heading text="Loading..." level={1} role="status" />;
  }

  if (error) {
    return <Heading text={error.message} level={1} role="status" />;
  }

  if (!project) {
    return <Heading text="Project not found" level={1} role="status" />;
  }

  return (
    project &&
    !loading &&
    formData && (
      <div className="project-details flex flex-col align-stretch">
        <div className="project-details__actions self-end flex gap-4">
          <Button onClick={handleDelete}>Delete</Button>
        </div>
        <Heading text="Project details" level={1} />
        <FormControlWithActions
          label="Name:"
          id="name"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.name}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="URL:"
          id="url"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.url}
          errors={errors}
          setErrors={setErrors}
          component={UrlInput}
        />
        <FormControlWithActions
          label="Description:"
          id="description"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.description}
          errors={errors}
          setErrors={setErrors}
          component={TextArea}
        />
        <FormControlWithActions
          label="Add service:"
          id="newService"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.newService}
          url={SERVICES_BASE_API_URL}
          getFormattedOptions={getServiceDataOptions}
          errors={errors}
          setErrors={setErrors}
          component={SelectWithFetch}
          showList={true}
          currentList={formData.services}
        />
        {isAdmin ? (
          <FormControlWithActions
            label="Add team member:"
            id="newTeamMember"
            onChange={handleChange}
            onCancel={handleCancel}
            onSave={handleSave}
            value={formData?.newTeamMember}
            url={USERS_BASE_API_URL}
            getFormattedOptions={getUserDataOptions}
            errors={errors}
            setErrors={setErrors}
            component={SelectWithFetch}
            showList={true}
            currentList={formData.team}
          />
        ) : (
          <Link to="/dashboard/users/create">Add team member</Link>
        )}
      </div>
    )
  );
};

export default ProjectDetails;
