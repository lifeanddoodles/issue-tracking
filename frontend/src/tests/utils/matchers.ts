import { screen } from "@testing-library/react";
import { FormElement } from "../../interfaces";
import { getReadableInputName, getValue } from "../../utils";

export const fieldNotDisabled = (field: FormElement) => {
  if (field instanceof HTMLSelectElement) {
    return expect(field).toHaveAttribute("disabled", "");
  }

  expect(field).not.toHaveAttribute("disabled");
};

export const getFieldByLabel = async (fieldId: string) => {
  const fieldLabel = getReadableInputName(fieldId);
  const field = (await screen.findByLabelText(
    RegExp(`^${fieldLabel}`, "i")
  )) as FormElement;

  return [field, fieldLabel] as [FormElement, string];
};

export const getFieldValue = (field: FormElement, valueType: string) => {
  switch (valueType) {
    case "checkedValue":
      return (field as HTMLInputElement).checked;
    case "valueAsNumber":
      return +field.value;
    default:
      return field.value;
  }
};

export const compareValue: <T>(
  elementValue: unknown,
  dataObj: T | Partial<T>,
  id: keyof T,
  getIdFromPopulated?: boolean
) => void = (elementValue, dataObj, id, getIdFromPopulated = false) => {
  const dataValue = getValue(id, dataObj, getIdFromPopulated);
  if (dataValue === undefined || dataValue === "") {
    expect(elementValue).toBe("");
  } else {
    expect(elementValue).toBe(dataValue);
  }
};
