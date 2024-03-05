import { act, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import { expect } from "vitest";
import { FormElement } from "../../interfaces";

export const toggleChecked = async (
  field: HTMLInputElement,
  newFieldValue?: string | boolean
) => {
  if (newFieldValue) {
    const newFieldValueBoolean =
      typeof newFieldValue === "string"
        ? newFieldValue === "true" || newFieldValue === "1"
        : newFieldValue;
    return (field.checked = newFieldValueBoolean);
  }
  await user.click(field);
};

export const updateInputOrTextarea = async (
  field: FormElement,
  newFieldValue: string | number | boolean
) => {
  if (field instanceof HTMLInputElement && field.type === "checkbox") {
    return await toggleChecked(field, newFieldValue as string | boolean);
  }
  if (newFieldValue.toString().trim() === "") return;

  await user.clear(field);
  await user.type(field, newFieldValue.toString());
};

export const updateSelect = async (
  field: FormElement,
  options: HTMLOptionElement[],
  newFieldValue: number | string
) => {
  const newSelectValue = isNaN(+newFieldValue)
    ? newFieldValue
    : options[newFieldValue as number]?.value;

  act(() =>
    fireEvent.select(field, {
      target: { value: newSelectValue },
    })
  );
};

export const updateFieldAndCheckValue = async (
  field: FormElement,
  newFieldValue: string | number | boolean
) => {
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    await updateInputOrTextarea(
      field,
      newFieldValue as string | number | boolean
    );
    const fieldValue =
      field!.type === "checkbox"
        ? (field as HTMLInputElement).checked
        : field.value || "";
    const formattedNewFieldValue =
      field!.type === "checkbox"
        ? typeof newFieldValue === "boolean"
          ? newFieldValue
          : newFieldValue === "true" || newFieldValue === "1"
        : newFieldValue.toString() || "";

    expect(fieldValue).toBe(formattedNewFieldValue);
    return null;
  }

  if (field instanceof HTMLSelectElement) {
    let options: HTMLOptionElement[] = [];
    let expectedSelectValue;

    if (isNaN(+newFieldValue)) {
      expectedSelectValue = newFieldValue;
    } else {
      options = Array.from(
        (field as HTMLSelectElement).querySelectorAll("option")
      );
      expectedSelectValue = options[newFieldValue as number].value;
    }

    await updateSelect(field, options, newFieldValue as string | number);

    expect(field.value).toBe(expectedSelectValue);
    return expectedSelectValue;
  }
};
