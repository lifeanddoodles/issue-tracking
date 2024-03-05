import { act, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateCompany from ".";
import { SubscriptionStatus } from "../../../../../../shared/interfaces";
import { newFakeCompany } from "../../../../__mocks__";
import useForm from "../../../../hooks/useForm";
import { FormElement } from "../../../../interfaces";
import {
  getFieldByLabel,
  testEach,
  updateFieldAndCheckValue,
} from "../../../../tests/utils";
import { getReadableInputName } from "../../../../utils";

vi.mock("../../../../hooks/useForm");

const fieldsToTest = [
  { fieldId: "name", newFieldValue: newFakeCompany.name, customLabel: null },
  { fieldId: "url", newFieldValue: newFakeCompany.url, customLabel: "website" },
  { fieldId: "phone", newFieldValue: newFakeCompany.phone, customLabel: null },
  { fieldId: "email", newFieldValue: newFakeCompany.email, customLabel: null },
  {
    fieldId: "address.street",
    newFieldValue: newFakeCompany.address.street,
    customLabel: null,
  },
  {
    fieldId: "address.city",
    newFieldValue: newFakeCompany.address.city,
    customLabel: null,
  },
  {
    fieldId: "address.state",
    newFieldValue: newFakeCompany.address.state,
    customLabel: null,
  },
  {
    fieldId: "address.zip",
    newFieldValue: newFakeCompany.address.zip,
    customLabel: null,
  },
  {
    fieldId: "address.country",
    newFieldValue: newFakeCompany.address.country,
    customLabel: null,
  },
  { fieldId: "dba", newFieldValue: newFakeCompany.dba, customLabel: null },
  { fieldId: "industry", newFieldValue: "1", customLabel: null },
  {
    fieldId: "description",
    newFieldValue: newFakeCompany.description,
    customLabel: null,
  },
];

const formDataShape = {
  name: "",
  url: "",
  phone: "",
  description: "",
  industry: "",
  subscriptionStatus: SubscriptionStatus.ONBOARDING,
  email: "",
  address: {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
  employees: [],
  projects: [],
  dba: "",
};

const filledFormData = {
  name: newFakeCompany.name,
  url: newFakeCompany.url,
  phone: newFakeCompany.phone,
  email: newFakeCompany.email,
  subscriptionStatus: newFakeCompany.subscriptionStatus,
  employees: newFakeCompany.employees,
  projects: newFakeCompany.projects,
  industry: newFakeCompany.industry,
  dba: newFakeCompany.dba,
  description: newFakeCompany.description,
  address: {
    street: newFakeCompany.address.street,
    city: newFakeCompany.address.city,
    state: newFakeCompany.address.state,
    zip: newFakeCompany.address.zip,
    country: newFakeCompany.address.country,
  },
};

describe("CreateCompany", () => {
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
    });

    test.each`
      fieldId              | findBy    | customLabel
      ${"heading"}         | ${"role"} | ${"NULL"}
      ${"name"}            | ${"text"} | ${"NULL"}
      ${"url"}             | ${"text"} | ${"website"}
      ${"phone"}           | ${"text"} | ${"NULL"}
      ${"email"}           | ${"text"} | ${"NULL"}
      ${"address.street"}  | ${"text"} | ${"NULL"}
      ${"address.city"}    | ${"text"} | ${"NULL"}
      ${"address.state"}   | ${"text"} | ${"NULL"}
      ${"address.zip"}     | ${"text"} | ${"NULL"}
      ${"address.country"} | ${"text"} | ${"NULL"}
      ${"dba"}             | ${"text"} | ${"NULL"}
      ${"industry"}        | ${"text"} | ${"NULL"}
      ${"description"}     | ${"text"} | ${"NULL"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy, customLabel }) => {
        act(() =>
          render(
            <MemoryRouter>
              <CreateCompany />
            </MemoryRouter>
          )
        );

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Create company",
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
    testEach(
      fieldsToTest,
      "can change $fieldId field's value",
      async ({ fieldId, newFieldValue, customLabel }) => {
        user.setup();

        act(() =>
          render(
            <MemoryRouter>
              <CreateCompany />
            </MemoryRouter>
          )
        );

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
    });
    test("sends the correct values", async () => {
      user.setup();

      act(() =>
        render(
          <MemoryRouter>
            <CreateCompany />
          </MemoryRouter>
        )
      );

      for (const { fieldId, newFieldValue, customLabel } of fieldsToTest) {
        const [field] = await getFieldByLabel(customLabel || fieldId);

        expect(field).toBeInTheDocument();

        await act(() => updateFieldAndCheckValue(field, newFieldValue));
      }

      const submitButton = screen.getByRole("button", {
        name: "Submit",
      });

      expect(submitButton).toBeInTheDocument();

      await user.click(submitButton);

      const body = {
        ...filledFormData,
        employeeId: "",
      };

      await waitFor(async () => {
        expect(onSubmitSpy).toHaveBeenCalled();
        expect(onSubmitSpy).toHaveBeenCalledWith("POST", body);
      });
    });
  });
});
