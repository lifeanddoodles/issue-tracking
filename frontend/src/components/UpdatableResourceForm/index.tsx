import {
  Children,
  Dispatch,
  SetStateAction,
  cloneElement,
  isValidElement,
  useMemo,
} from "react";
import { UserRole } from "../../../../shared/interfaces";
import { FormElement, WrapperWithLinkFallbackProps } from "../../interfaces";
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
  userRole,
}: {
  children: JSX.Element | JSX.Element[];
  errors: { [key: string]: string[] } | null;
  formData: T;
  onCancel: () => void;
  onChange: (target: FormElement, updates: Partial<T>) => Partial<T>;
  onSave: () => void;
  setErrors: Dispatch<SetStateAction<{ [key: string]: string[] } | null>>;
  userRole?: UserRole;
}) => {
  return Children.toArray(children).map((child) => {
    if (isValidElement(child) && child?.props) {
      const { id, label, wrapperProps = {}, ...rest } = child.props;
      const valueObj =
        child.props?.value !== undefined
          ? { value: getValue(id, formData) }
          : { checked: getValue(id, formData) };

      const disableToggleEdit = wrapperProps?.disableToggleEdit
        ? wrapperProps?.disableToggleEdit(userRole, [UserRole.ADMIN])
        : false;

      const newChild = (
        <FieldWithControls
          id={id}
          label={label}
          onCancel={onCancel}
          onSave={onSave}
          disableToggleEdit={disableToggleEdit}
          key={id}
        >
          {cloneElement(child, {
            ...rest,
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

      const ChildWithWrapper = ({
        Wrapper,
        getResourceId,
        resourceName,
        uiResourceBaseUrl,
      }: {
        Wrapper: (args: WrapperWithLinkFallbackProps) => JSX.Element;
        getResourceId: (formData: T, key: string) => string;
        resourceName: string;
        uiResourceBaseUrl: string;
      }) => {
        if (!Wrapper) {
          return;
        }

        const resourceId = getResourceId(formData, resourceName);

        return (
          <Wrapper
            resourceId={resourceId}
            resourceName={resourceName}
            uiResourceBaseUrl={uiResourceBaseUrl}
            key={id}
          >
            {newChild}
          </Wrapper>
        );
      };

      return Object.keys(wrapperProps).length > 0
        ? ChildWithWrapper({ ...wrapperProps })
        : newChild;
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
    userRole,
    title,
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
        userRole,
      });
    }, [
      children,
      errors,
      formData,
      onCancel,
      onChange,
      onSave,
      setErrors,
      userRole,
    ]);

    return (
      <div className={`${resourceName}-details flex flex-col align-stretch`}>
        <div className={`${resourceName}-details__actions self-end flex gap-4`}>
          <Button onClick={onDelete}>Delete</Button>
        </div>
        <Heading
          text={title ?? `${toCapital(resourceName)} Details`}
          level={1}
        />
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
