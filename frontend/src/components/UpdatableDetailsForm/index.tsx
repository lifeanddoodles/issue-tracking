import { Fragment } from "react";
import { UserRole } from "../../../../shared/interfaces";
import { FormField, ResourceUpdatableFormProps } from "../../interfaces";
import UpdatableResourceForm from "../UpdatableResourceForm";

const UpdatableDetailsForm = <T extends Record<string, unknown>>({
  resourceUrl,
  resourceId,
  resourceName,
  onChange,
  formShape,
  fields,
  userRole,
}: ResourceUpdatableFormProps<T> & {
  fields: FormField[];
  userRole?: UserRole;
}) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const renderedChildren = fields.map(
    ({
      Component,
      id,
      disabled,
      ensureAdmin = false,
      fieldProps = {},
      ...otherProps
    }: FormField & {
      disabled?: boolean | ((userRole: UserRole) => boolean);
    }) => {
      if (ensureAdmin && !isAdmin) return <Fragment key={id}></Fragment>;

      const value = formShape[id as keyof T];
      const disabledValue =
        typeof disabled === "function"
          ? disabled(userRole as UserRole)
          : disabled;

      return (
        <Component
          {...fieldProps}
          {...otherProps}
          id={id}
          value={value}
          disabled={disabledValue}
          key={id}
        />
      );
    }
  );

  return (
    <UpdatableResourceForm
      resourceUrl={resourceUrl}
      resourceId={resourceId}
      resourceName={resourceName}
      onChange={onChange}
      formShape={formShape}
      userRole={userRole}
    >
      {renderedChildren}
    </UpdatableResourceForm>
  );
};

export default UpdatableDetailsForm;
