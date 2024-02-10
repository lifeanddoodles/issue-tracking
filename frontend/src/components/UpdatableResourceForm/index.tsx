import {
  Children,
  Dispatch,
  SetStateAction,
  cloneElement,
  isValidElement,
  useMemo,
} from "react";
import { FormElement } from "../../interfaces";
import { getValue, toCapital } from "../../utils";
import Button from "../Button";
import FieldWithControls from "../FieldWithControls";
import Form from "../Form";
import Heading from "../Heading";
import withUpdatableResourceForm from "../withUpdatableResourceForm";

const getChildren = <T,>({
  children,
  errors,
  formData,
  onCancel,
  onChange,
  onSave,
  setErrors,
}: {
  children: JSX.Element | JSX.Element[];
  errors: { [key: string]: string[] } | null;
  formData: T;
  onCancel: () => void;
  onChange: (target: FormElement, updates: Partial<T>) => Partial<T>;
  onSave: () => void;
  setErrors: Dispatch<SetStateAction<{ [key: string]: string[] } | null>>;
}) => {
  return Children.toArray(children).map((child) => {
    if (isValidElement(child) && child?.props?.id) {
      const valueObj =
        child.props?.value !== undefined
          ? { value: getValue(child.props.id, formData) }
          : { checked: getValue(child.props.id, formData) };

      return (
        <FieldWithControls
          id={child.props.id}
          label={child.props.label}
          onCancel={onCancel}
          onSave={onSave}
          key={child.props.id}
        >
          {cloneElement(child, {
            ...child.props,
            ...valueObj,
            ...(child.props?.showList && child?.props?.pathToValue
              ? { currentList: getValue(child?.props?.pathToValue, formData) }
              : {}),
            onChange,
            errors,
            setErrors,
          })}
        </FieldWithControls>
      );
    }
  });
};

const UpdatableResourceForm = withUpdatableResourceForm(
  ({
    resourceName,
    formData,
    errors,
    setErrors,
    onDelete,
    onChange,
    onSave,
    onCancel,
    children,
  }) => {
    const formattedChildren = useMemo(() => {
      return getChildren({
        children,
        errors,
        formData,
        onCancel,
        onChange,
        onSave,
        setErrors,
      });
    }, [children, errors, formData, onCancel, onChange, onSave, setErrors]);

    return (
      <div className={`${resourceName}-details flex flex-col align-stretch`}>
        <div className={`${resourceName}-details__actions self-end flex gap-4`}>
          <Button onClick={onDelete}>Delete</Button>
        </div>
        <Heading text={`${toCapital(resourceName)} Details`} level={1} />
        <Form
          className={`${resourceName}-details__form`}
          ariaLabel={`${resourceName}-details-form`}
        >
          {formattedChildren}
        </Form>
      </div>
    );
  }
);

export default UpdatableResourceForm;
