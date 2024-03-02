import { UserRole } from "../../../../shared/interfaces";
import { FormField, ResourceUpdatableFormProps } from "../../interfaces";
import { renderFields } from "../../utils";
import UpdatableResourceForm from "../UpdatableResourceForm";

const UpdatableDetailsForm = <T extends Record<string, unknown>>({
  resourceUrl,
  resourceId,
  resourceName,
  onChange,
  formShape,
  fields,
  userRole,
  title,
}: ResourceUpdatableFormProps<T> & {
  fields: FormField[];
  userRole?: UserRole;
}) => {
  const renderedChildren = renderFields(fields, formShape, userRole);

  return (
    <UpdatableResourceForm
      resourceUrl={resourceUrl}
      resourceId={resourceId}
      resourceName={resourceName}
      onChange={onChange}
      formShape={formShape}
      userRole={userRole}
      title={title}
    >
      {renderedChildren}
    </UpdatableResourceForm>
  );
};

export default UpdatableDetailsForm;
