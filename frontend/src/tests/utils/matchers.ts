import { screen } from "@testing-library/react";
import { FormElement } from "../../interfaces";
import { getReadableInputName, getValue } from "../../utils";

export const getFieldByLabel = async (fieldId: string) => {
  const fieldLabel = getReadableInputName(fieldId);
  const field = (await screen.findByLabelText(
    RegExp(`^${fieldLabel}`, "i")
  )) as FormElement;

  return [field, fieldLabel] as [FormElement, string];
};

export const compareValue: <T>(
  elementValue: unknown,
  dataObj: Partial<T>,
  id: keyof T
) => void = (elementValue, dataObj, id) => {
  const dataValue = getValue(id as string, dataObj);
  if (dataValue === undefined || dataValue === "") {
    expect(elementValue).toBe("");
  } else {
    expect(elementValue).toBe(dataValue);
  }
};
