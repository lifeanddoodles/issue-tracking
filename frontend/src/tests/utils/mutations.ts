import { act, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import { expect } from "vitest";
import { FormElement } from "../../interfaces";

export const toggleChecked = async (
  field: HTMLInputElement,
  newFieldValue?: string
) => {
  if (newFieldValue) {
    const newFieldValueBoolean =
      newFieldValue === "true" || newFieldValue === "1";
    return (field.checked = newFieldValueBoolean);
  }
  await user.click(field);
};

export const updateInputOrTextarea = async (
  field: FormElement,
  newFieldValue: string
) => {
  if (field instanceof HTMLInputElement && field.type === "checkbox") {
    return await toggleChecked(field, newFieldValue);
  }
  if (newFieldValue.trim() === "") return;
  await user.clear(field);
  await user.type(field, newFieldValue);
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
  newFieldValue: string | number
) => {
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    await updateInputOrTextarea(field, newFieldValue as string);
    const fieldValue =
      field!.type === "checkbox"
        ? (field as HTMLInputElement).checked
        : field.value;
    const formattedNewFieldValue =
      field!.type === "checkbox"
        ? newFieldValue === "true" || newFieldValue === "1"
        : newFieldValue;

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

    await updateSelect(field, options, newFieldValue);

    expect(field.value).toBe(expectedSelectValue);
    return expectedSelectValue;
  }
};
