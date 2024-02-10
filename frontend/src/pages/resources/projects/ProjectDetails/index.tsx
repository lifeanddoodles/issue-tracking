import { ObjectId } from "mongoose";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  IProjectDocument,
  UserRole,
} from "../../../../../../shared/interfaces";
import { TextInput, UrlInput } from "../../../../components/Input";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import UpdatableDetailsForm from "../../../../components/UpdatableDetailsForm";
import { useAuthContext } from "../../../../context/AuthProvider";
import { FormElement } from "../../../../interfaces";
import {
  PROJECTS_BASE_API_URL,
  SERVICES_BASE_API_URL,
  USERS_BASE_API_URL,
} from "../../../../routes";
import { getServiceDataOptions, getUserDataOptions } from "../../../../utils";

type ProjectFormData = Partial<IProjectDocument> & {
  newService?: ObjectId | Record<string, unknown>;
  newTeamMember?: ObjectId | Record<string, unknown>;
};

const fields = [
  {
    Component: TextInput,
    label: "Name:",
    id: "name",
    required: true,
  },
  {
    Component: UrlInput,
    label: "URL:",
    id: "url",
  },
  {
    Component: TextArea,
    label: "Description:",
    id: "description",
  },
  {
    Component: SelectWithFetch,
    label: "Add service:",
    id: "newService",
    fieldProps: {
      url: SERVICES_BASE_API_URL,
      getFormattedOptions: getServiceDataOptions,
      showList: true,
      pathToValue: "services",
    },
  },
  {
    Component: SelectWithFetch,
    label: "Add team member:",
    id: "newTeamMember",
    ensureAdmin: true,
    fieldProps: {
      url: USERS_BASE_API_URL,
      getFormattedOptions: getUserDataOptions,
      showList: true,
      pathToValue: "team",
    },
  },
];

const ProjectDetails = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === UserRole.ADMIN;
  const params = useParams();
  const projectId = params.projectId;

  const formShape: ProjectFormData = {
    name: "",
    description: "",
    url: "",
    newService: "" as unknown as ObjectId,
    newTeamMember: "" as unknown as ObjectId,
    services: [],
  };

  const handleChange = useCallback(
    (target: FormElement, updatedFormData: ProjectFormData) => {
      const newFormData = { ...updatedFormData };

      if (target.name === "newTeamMember") {
        newFormData[target.name as keyof IProjectDocument] = target.value;
        newFormData.team = [
          ...(newFormData?.team || []),
          target.value as unknown as ObjectId | Record<string, unknown>,
        ];
      } else if (target.name === "newService") {
        newFormData[target.name as keyof IProjectDocument] = target.value;
        newFormData.services = [
          ...(newFormData?.services || []),
          target.value as unknown as ObjectId | Record<string, unknown>,
        ];
      } else {
        newFormData[target.name as keyof IProjectDocument] =
          target.type === "checkbox"
            ? (target as HTMLInputElement).checked
            : target.value !== "" && target.value
            ? target.value
            : null;
      }

      return newFormData;
    },
    []
  );

  return (
    <>
      <UpdatableDetailsForm
        resourceUrl={PROJECTS_BASE_API_URL}
        resourceId={projectId as string}
        resourceName={"project"}
        onChange={handleChange}
        formShape={formShape}
        fields={fields}
        isAdmin={isAdmin}
      />
      {!isAdmin && <Link to="/dashboard/users/create">Add team member</Link>}
    </>
  );
};

export default ProjectDetails;
