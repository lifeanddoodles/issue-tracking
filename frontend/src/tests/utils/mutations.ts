import { act, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import { expect } from "vitest";
import { FormElement } from "../../interfaces";

export const updateInputOrTextarea = async (
  field: FormElement,
  newFieldValue: string
) => {
  await user.clear(field);
  await user.type(field, newFieldValue);
};

export const updateSelect = async (
  field: FormElement,
  options: HTMLOptionElement[],
  newFieldValue: number
) => {
  act(() =>
    fireEvent.select(field, {
      target: { value: options[newFieldValue as number].value },
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

    expect(field.value).toBe(newFieldValue);
  }

  if (field instanceof HTMLSelectElement) {
    expect(field).toHaveAttribute("disabled", "");

    const options = Array.from(
      (field as HTMLSelectElement).querySelectorAll("option")
    );
    await updateSelect(field, options, newFieldValue as number);

    expect(field.value).toBe(options[newFieldValue as number].value);
  }
};
