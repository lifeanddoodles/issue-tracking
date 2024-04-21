import {
  Children,
  Dispatch,
  Fragment,
  SetStateAction,
  cloneElement,
  isValidElement,
  useMemo,
} from "react";
import { UserRole } from "../../../../shared/interfaces";
import {
  FormElement,
  SecondaryLabel,
  WrapperWithLinkFallbackProps,
} from "../../interfaces";
import { getValue, toCapital, userIsAuthorized } from "../../utils";
import Button from "../Button";
import FieldWithControls from "../FieldWithControls";
import Form from "../Form";
import Heading from "../Heading";
import withUpdatableResourceForm from "../withUpdatableResourceForm";

const getFormattedFields = <T,>({
  children,
  errors,
  data,
  formData,
  onCancel,
  onChange,
  onSave,
  setErrors,
  userRole,
}: {
  children: JSX.Element | JSX.Element[];
  errors: { [key: string]: string[] } | null;
  data: T;
  formData: T;
  onCancel: () => void;
  onChange: (target: FormElement, updates: Partial<T>) => Partial<T>;
  onSave: () => void;
  setErrors: Dispatch<SetStateAction<{ [key: string]: string[] } | null>>;
  userRole?: UserRole;
}) => {
  return Children.toArray(children).map((child) => {
    if (isValidElement(child) && child?.props) {
      const {
        id,
        label,
        wrapperProps = {},
        permissions,
        ...rest
      } = child.props;

      if (
        userRole &&
        permissions?.VIEW &&
        !userIsAuthorized(userRole as UserRole, permissions.VIEW)
      )
        return;

      const valueObj =
        child.props?.checked !== undefined
          ? { checked: getValue(id, formData) }
          : { value: getValue(id, formData) };

      const disableToggleEdit = wrapperProps?.disableToggleEdit
        ? userRole && permissions?.EDIT
          ? wrapperProps?.disableToggleEdit(userRole, permissions?.EDIT)
          : wrapperProps?.disableToggleEdit(id, formData)
        : false;

      const forceVisible = wrapperProps?.forceVisible
        ? wrapperProps?.forceVisible(userRole, permissions?.VIEW)
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
              ? { currentList: getValue(child?.props?.pathToValue, data) }
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
        secondaryLabels,
        forceVisible,
      }: {
        Wrapper: (args: WrapperWithLinkFallbackProps) => JSX.Element;
        getResourceId: (formData: T, key: string) => string;
        resourceName: string;
        uiResourceBaseUrl: string;
        secondaryLabels?: Partial<{
          [key in SecondaryLabel]: string;
        }>;
        forceVisible?: boolean;
      }) => {
        if (!Wrapper) {
          return <Fragment key={id}>{newChild}</Fragment>;
        }

        const resourceId = getResourceId(formData, resourceName);

        return (
          <Wrapper
            resourceId={resourceId}
            resourceName={resourceName}
            uiResourceBaseUrl={uiResourceBaseUrl}
            secondaryLabels={secondaryLabels}
            forceVisible={forceVisible}
            key={id}
          >
            {newChild}
          </Wrapper>
        );
      };

      return Object.keys(wrapperProps).length > 0
        ? ChildWithWrapper({ ...wrapperProps, forceVisible })
        : newChild;
    }
  });
};

const UpdatableResourceForm = withUpdatableResourceForm(
  ({
    resourceName,
    data,
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
      return getFormattedFields({
        children,
        data,
        formData,
        onCancel,
        onChange,
        onSave,
        errors,
        setErrors,
        userRole,
      });
    }, [
      children,
      data,
      formData,
      onCancel,
      onChange,
      onSave,
      errors,
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
