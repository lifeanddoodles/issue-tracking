import { Fragment } from "react";
import { FormField, ResourceUpdatableFormProps } from "../../interfaces";
import UpdatableResourceForm from "../UpdatableResourceForm";

const UpdatableDetailsForm = <T extends Record<string, unknown>>({
  resourceUrl,
  resourceId,
  resourceName,
  onChange,
  formShape,
  fields,
  isAdmin,
}: ResourceUpdatableFormProps<T> & {
  fields: FormField[];
  isAdmin?: boolean;
}) => {
  const renderedChildren = fields.map(
    ({
      Component,
      id,
      ensureAdmin = false,
      fieldProps = {},
      ...otherProps
    }: FormField) => {
      if (ensureAdmin && !isAdmin) return <Fragment key={id}></Fragment>;

      const value = formShape[id as keyof T];

      return (
        <Component
          {...fieldProps}
          {...otherProps}
          id={id}
          value={value}
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
    >
      {renderedChildren}
    </UpdatableResourceForm>
  );
};

export default UpdatableDetailsForm;
