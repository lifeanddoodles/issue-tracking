import { ErrorType } from "../interfaces";
import { getFieldErrorMessage } from "../utils";

const addErrors = (
  id: string,
  errorText: string,
  errors: { [key: string]: string[] } | null
) => {
  if (
    errors === null ||
    (!!errors && (!errors?.[id] || !errors?.[id].includes(errorText)))
  ) {
    return {
      ...errors,
      [`${id}`]: [...(errors?.[id] ?? []), errorText],
    };
  }
  return errors;
};

const removeErrors = (
  id: string,
  errorText: string,
  errors: { [key: string]: string[] } | null
) => {
  const newErrors = () => {
    if (!!errors?.[id] && errors?.[id].includes(errorText)) {
      const filteredErrorsList = errors?.[id].filter((e) => e !== errorText);

      if (filteredErrorsList?.length === 0) {
        const tempErrors = { ...errors };
        delete tempErrors?.[id];
        return { ...tempErrors };
      }

      return {
        ...errors,
        [`${id}`]: [...(filteredErrorsList ?? [])],
      };
    }
    return { ...errors };
  };

  return Object.keys(newErrors()).length !== 0 ? newErrors() : null;
};

const useValidation = () => {
  const updateErrors = (
    id: string,
    errorText: string,
    errors: { [key: string]: string[] } | null,
    addError: boolean = true,
    removeError: boolean = false
  ) => {
    if (addError && !removeError) {
      return addErrors(id, errorText, errors);
    }
    if (removeError && !addError) {
      return removeErrors(id, errorText, errors);
    }
    return errors;
  };

  function validateInput({
    target,
    setErrors,
  }: {
    target: HTMLInputElement;
    setErrors: React.Dispatch<
      React.SetStateAction<{
        [key: string]: string[];
      } | null>
    >;
    elementToCompare?: { id: string; value: string | undefined } | undefined;
  }) {
    const { id, value } = target;
    const errorPatternText = getFieldErrorMessage({
      id,
      type: ErrorType.PATTERN,
      options: { pattern: target?.pattern },
    });
    if (target.pattern && errorPatternText) {
      const shouldAdd = !value.match(target.pattern);

      setErrors((errors) =>
        updateErrors(id, errorPatternText, errors, shouldAdd, !shouldAdd)
      );
    }
  }

  function validateInputOrTextArea({
    target,
    setErrors,
  }: {
    target: HTMLInputElement | HTMLTextAreaElement;
    setErrors: React.Dispatch<
      React.SetStateAction<{
        [key: string]: string[];
      } | null>
    >;
    elementToCompare?: { id: string; value: string | undefined } | undefined;
  }) {
    const { id, value, minLength } = target;
    const errorMinLengthText = getFieldErrorMessage({
      id,
      type: ErrorType.MINLENGTH,
      options: { minLength },
    });
    if (minLength) {
      const shouldAdd = value.length < minLength;

      setErrors((errors) =>
        updateErrors(id, errorMinLengthText, errors, shouldAdd, !shouldAdd)
      );
    }
  }

  function validateField({
    target,
    setErrors,
    elementToCompare,
  }: {
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setErrors: React.Dispatch<
      React.SetStateAction<{
        [key: string]: string[];
      } | null>
    >;
    elementToCompare?: { id: string; value: string | undefined } | undefined;
  }) {
    const isTextArea = target.tagName === "TEXTAREA";
    const isSelect = target.tagName === "SELECT";
    const { id, value, required } = target;
    const errorRequiredText = getFieldErrorMessage({
      id,
      type: ErrorType.REQUIRED,
    });

    const errorMismatchText = getFieldErrorMessage({
      id,
      type: ErrorType.MISMATCH,
      options: { idToCompare: elementToCompare?.id },
    });

    if (required) {
      const shouldAdd = target.validity.valueMissing;
      const shouldRemove = value.length !== 0;

      setErrors((errors) =>
        updateErrors(id, errorRequiredText, errors, shouldAdd, shouldRemove)
      );
    }

    if (elementToCompare) {
      const shouldAdd = value !== elementToCompare.value;

      setErrors((errors) =>
        updateErrors(id, errorMismatchText, errors, shouldAdd, !shouldAdd)
      );
    }

    if (!isTextArea && !isSelect) {
      validateInput({ target: target as HTMLInputElement, setErrors });
    }

    if (!isSelect) {
      validateInputOrTextArea({
        target: target as HTMLInputElement | HTMLTextAreaElement,
        setErrors,
      });
    }
  }

  return {
    validateField,
  };
};
export default useValidation;
