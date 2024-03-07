import { act, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import CreateUser from ".";
import { newFakeUser } from "../../../../__mocks__";
import useForm from "../../../../hooks/useForm";
import { ErrorType, FormElement, TestCaseProps } from "../../../../interfaces";
import {
  IAuthContext,
  adminAuth,
  componentWithRouter,
  getFieldByLabel,
  renderWithRouter,
  testEach,
  updateFieldAndCheckValue,
} from "../../../../tests/utils";
import { getFieldErrorMessage, getReadableInputName } from "../../../../utils";

vi.mock("../../../../hooks/useForm");

const mockImplementationReturnBase = {
  setFormData: vi.fn(),
  errors: null,
  setErrors: vi.fn(),
  setObjectShape: vi.fn(),
  initialFormData: vi.fn(),
  setInitialFormData: vi.fn(),
  changedFormData: vi.fn(),
  setChangedFormData: vi.fn(),
  data: null,
  loading: false,
  error: null,
  requestGetResource: vi.fn(),
  requestPostResource: vi.fn(),
  requestUpdateResource: vi.fn(),
  requestDeleteResource: vi.fn(),
};

const fieldsToTest = [
  {
    fieldId: "firstName",
    newFieldValue: newFakeUser.firstName,
    customLabel: null,
  },
  {
    fieldId: "lastName",
    newFieldValue: newFakeUser.lastName,
    customLabel: null,
  },
  {
    fieldId: "email",
    newFieldValue: newFakeUser.email,
    customLabel: null,
  },
  {
    fieldId: "department",
    newFieldValue: newFakeUser.department,
    customLabel: null,
  },
  {
    fieldId: "role",
    newFieldValue: newFakeUser.role,
    customLabel: null,
  },
  {
    fieldId: "company",
    newFieldValue: newFakeUser.company,
    customLabel: null,
  },
  {
    fieldId: "position",
    newFieldValue: newFakeUser.position,
    customLabel: null,
  },
  {
    fieldId: "password",
    newFieldValue: newFakeUser.password,
    customLabel: null,
  },
  {
    fieldId: "confirmPassword",
    newFieldValue: newFakeUser.password,
    customLabel: null,
  },
];

const formDataShape = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  role: "",
  company: "",
  position: "",
  password: "",
  confirmPassword: "",
};

const filledFormData = {
  firstName: newFakeUser.firstName,
  lastName: newFakeUser.lastName,
  email: newFakeUser.email,
  department: newFakeUser.department,
  role: newFakeUser.role,
  company: newFakeUser.company,
  position: newFakeUser.position,
  password: newFakeUser.password,
  confirmPassword: newFakeUser.password,
};

const filledFormDataWithPasswordMismatch = {
  firstName: newFakeUser.firstName,
  lastName: newFakeUser.lastName,
  email: newFakeUser.email,
  department: newFakeUser.department,
  role: newFakeUser.role,
  company: newFakeUser.company,
  position: newFakeUser.position,
  password: newFakeUser.password,
  confirmPassword: "mismatched-password",
};

describe("CreateUser", () => {
  let auth: IAuthContext;
  const onSubmitSpy = vi.fn(() => {
    return Promise.resolve();
  });

  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("on initial render", async () => {
    beforeEach(async () => {
      vi.mocked(useForm)
        .mockClear()
        .mockImplementation(() => ({
          formData: formDataShape,
          onSubmit: onSubmitSpy,
          ...mockImplementationReturnBase,
        }));

      auth = {
        ...adminAuth,
      };
    });

    test.each`
      fieldId              | findBy    | customLabel
      ${"heading"}         | ${"role"} | ${"NULL"}
      ${"firstName"}       | ${"text"} | ${"NULL"}
      ${"lastName"}        | ${"text"} | ${"NULL"}
      ${"email"}           | ${"text"} | ${"NULL"}
      ${"department"}      | ${"text"} | ${"NULL"}
      ${"role"}            | ${"text"} | ${"NULL"}
      ${"company"}         | ${"text"} | ${"NULL"}
      ${"position"}        | ${"text"} | ${"NULL"}
      ${"password"}        | ${"text"} | ${"NULL"}
      ${"confirmPassword"} | ${"text"} | ${"NULL"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy, customLabel }) => {
        act(() => renderWithRouter(<CreateUser />, auth));

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Create user",
            });
            expect(title).toBeInTheDocument();
          }

          if (findBy === "text") {
            const label =
              customLabel !== "NULL"
                ? customLabel
                : getReadableInputName(fieldId);
            const field = (await screen.findByLabelText(
              RegExp(`^${label}`, "i")
            )) as FormElement;

            expect(field).toBeInTheDocument();
            expect(field.value).toBe("");
          }
        });
      }
    );
  });

  /**
   * Test on change functionality
   */
  describe("when filling the form", async () => {
    beforeEach(async () => {
      vi.mocked(useForm)
        .mockClear()
        .mockImplementation(() => ({
          formData: formDataShape,
          onSubmit: onSubmitSpy,
          ...mockImplementationReturnBase,
        }));

      auth = {
        ...adminAuth,
      };
    });

    testEach(
      fieldsToTest as TestCaseProps[],
      "can change $fieldId field's value",
      async ({ fieldId, newFieldValue, customLabel }) => {
        user.setup();

        act(() => renderWithRouter(<CreateUser />, auth));

        const [field] = await getFieldByLabel(customLabel ?? fieldId);

        await act(() => updateFieldAndCheckValue(field, newFieldValue));
      }
    );
  });

  /**
   * Test submit functionality
   */
  describe("given invalid input cannot submit and shows an error", async () => {
    beforeEach(async () => {
      vi.mocked(useForm)
        .mockClear()
        .mockImplementation(() => ({
          formData: filledFormData,
          onSubmit: onSubmitSpy,
          ...mockImplementationReturnBase,
        }));

      auth = {
        ...adminAuth,
      };
    });

    test("for mismatched passwords, ", async () => {
      user.setup();

      const { rerender } = render(componentWithRouter(<CreateUser />, auth));

      for (const [fieldId, newFieldValue] of Object.entries(
        filledFormDataWithPasswordMismatch
      )) {
        const [field] = await getFieldByLabel(fieldId);

        expect(field).toBeInTheDocument();

        await act(() =>
          updateFieldAndCheckValue(
            field,
            newFieldValue as string | number | boolean
          )
        );
      }

      const passwordMismatchErrorMessage = getFieldErrorMessage({
        id: "confirmPassword",
        type: ErrorType.MISMATCH,
      });

      vi.mocked(useForm)
        .mockClear()
        .mockImplementation(() => ({
          formData: filledFormData,
          onSubmit: onSubmitSpy,
          ...mockImplementationReturnBase,
          errors: {
            confirmPassword: [passwordMismatchErrorMessage],
          },
        }));

      rerender(componentWithRouter(<CreateUser />, auth));

      const submitButton = screen.getByRole("button", {
        name: "Submit",
      });
      const errorsList = screen.getByRole("list");
      const mismatchError = screen.getByText(passwordMismatchErrorMessage);

      expect(submitButton).toBeInTheDocument();
      expect(errorsList).toBeInTheDocument();
      expect(mismatchError).toBeInTheDocument();

      await user.click(submitButton);

      await waitFor(async () => {
        expect(onSubmitSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("given no errors when submitting", async () => {
    beforeEach(async () => {
      vi.mocked(useForm)
        .mockClear()
        .mockImplementation(() => ({
          formData: filledFormData,
          onSubmit: onSubmitSpy,
          ...mockImplementationReturnBase,
        }));

      auth = {
        ...adminAuth,
      };
    });

    test("sends the correct values", async () => {
      user.setup();

      act(() => renderWithRouter(<CreateUser />, auth));

      for (const { fieldId, newFieldValue } of fieldsToTest) {
        const [field] = await getFieldByLabel(fieldId);

        expect(field).toBeInTheDocument();

        await act(() =>
          updateFieldAndCheckValue(
            field,
            newFieldValue as string | number | boolean
          )
        );
      }

      const submitButton = screen.getByRole("button", {
        name: "Submit",
      });

      expect(submitButton).toBeInTheDocument();

      await user.click(submitButton);

      const body = {
        ...filledFormData,
      };

      await waitFor(async () => {
        expect(onSubmitSpy).toHaveBeenCalled();
        expect(onSubmitSpy).toHaveBeenCalledWith("POST", body);
      });
    });
  });
});
