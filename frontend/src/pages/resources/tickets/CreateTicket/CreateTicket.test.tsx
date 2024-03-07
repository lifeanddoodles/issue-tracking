import { act, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import CreateTicket from ".";
import { newFakeTicket } from "../../../../__mocks__";
import useForm from "../../../../hooks/useForm";
import { FormElement, TestCaseProps } from "../../../../interfaces";
import {
  IAuthContext,
  adminAuth,
  getFieldByLabel,
  renderWithRouter,
  testEach,
  updateFieldAndCheckValue,
} from "../../../../tests/utils";
import { getReadableInputName } from "../../../../utils";

vi.mock("../../../../hooks/useForm");

const fieldsToTest = [
  { fieldId: "title", newFieldValue: newFakeTicket.title, customLabel: null },
  {
    fieldId: "description",
    newFieldValue: newFakeTicket.description,
    customLabel: null,
  },
  { fieldId: "status", newFieldValue: newFakeTicket.status, customLabel: null },
  {
    fieldId: "assignToTeam",
    newFieldValue: newFakeTicket.assignToTeam,
    customLabel: null,
  },
  {
    fieldId: "assignee",
    newFieldValue: newFakeTicket.assignee,
    customLabel: null,
  },
  {
    fieldId: "reporter",
    newFieldValue: newFakeTicket.reporter,
    customLabel: null,
  },
  {
    fieldId: "priority",
    newFieldValue: newFakeTicket.priority,
    customLabel: null,
  },
  {
    fieldId: "ticketType",
    newFieldValue: newFakeTicket.ticketType,
    customLabel: null,
  },
  {
    fieldId: "estimatedTime",
    newFieldValue: newFakeTicket.estimatedTime,
    customLabel: null,
  },
  {
    fieldId: "deadline",
    newFieldValue: newFakeTicket.deadline,
    customLabel: null,
  },
  {
    fieldId: "isSubtask",
    newFieldValue: newFakeTicket.isSubtask,
    customLabel: null,
  },
  {
    fieldId: "parentTask",
    newFieldValue: newFakeTicket.parentTask,
    customLabel: null,
  },
];

const formDataShape = {
  title: "",
  description: "",
  externalReporter: "",
  assignToTeam: "",
  assignee: "",
  reporter: "",
  status: "",
  priority: "",
  ticketType: "",
  estimatedTime: "",
  deadline: "",
  isSubtask: false,
  parentTask: "",
};

const filledFormData = {
  title: newFakeTicket.title,
  description: newFakeTicket.description,
  assignToTeam: newFakeTicket.assignToTeam,
  assignee: newFakeTicket.assignee,
  reporter: newFakeTicket.reporter,
  status: newFakeTicket.status,
  priority: newFakeTicket.priority,
  ticketType: newFakeTicket.ticketType,
  estimatedTime: newFakeTicket.estimatedTime,
  deadline: newFakeTicket.deadline,
  isSubtask: newFakeTicket.isSubtask,
  parentTask: newFakeTicket.parentTask,
};

describe("CreateTicket", () => {
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
          setFormData: vi.fn(),
          errors: null,
          setErrors: vi.fn(),
          onSubmit: onSubmitSpy,
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
        }));

      auth = {
        ...adminAuth,
      };
    });

    test.each`
      fieldId            | findBy    | customLabel
      ${"heading"}       | ${"role"} | ${"NULL"}
      ${"title"}         | ${"text"} | ${"NULL"}
      ${"description"}   | ${"text"} | ${"NULL"}
      ${"status"}        | ${"text"} | ${"NULL"}
      ${"assignToTeam"}  | ${"text"} | ${"NULL"}
      ${"assignee"}      | ${"text"} | ${"NULL"}
      ${"reporter"}      | ${"text"} | ${"NULL"}
      ${"priority"}      | ${"text"} | ${"NULL"}
      ${"ticketType"}    | ${"text"} | ${"NULL"}
      ${"estimatedTime"} | ${"text"} | ${"NULL"}
      ${"deadline"}      | ${"text"} | ${"NULL"}
      ${"isSubtask"}     | ${"text"} | ${"NULL"}
      ${"parentTask"}    | ${"text"} | ${"NULL"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy, customLabel }) => {
        act(() => renderWithRouter(<CreateTicket />, auth));

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Create ticket",
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
          setFormData: vi.fn(),
          errors: null,
          setErrors: vi.fn(),
          onSubmit: onSubmitSpy,
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

        act(() => renderWithRouter(<CreateTicket />, auth));

        const [field] = await getFieldByLabel(customLabel ?? fieldId);

        await act(() => updateFieldAndCheckValue(field, newFieldValue));
      }
    );
  });

  /**
   * Test submit functionality
   */
  describe("when submitting", async () => {
    beforeEach(async () => {
      vi.mocked(useForm)
        .mockClear()
        .mockImplementation(() => ({
          formData: filledFormData,
          setFormData: vi.fn(),
          errors: null,
          setErrors: vi.fn(),
          onSubmit: onSubmitSpy,
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
        }));

      auth = {
        ...adminAuth,
      };
    });

    test("sends the correct values", async () => {
      user.setup();

      act(() => renderWithRouter(<CreateTicket />, auth));

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
