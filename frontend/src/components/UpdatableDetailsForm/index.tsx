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
  fields: FormField<unknown>[];
  userRole?: UserRole;
}) => {
  const renderedChildren = renderFields<T>(fields, formShape as T, userRole);

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
      {renderedChildren as JSX.Element[]}
    </UpdatableResourceForm>
  );
};

export default UpdatableDetailsForm;
