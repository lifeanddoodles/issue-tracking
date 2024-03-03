import { act, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateService from ".";
import { newFakeService } from "../../../../__mocks__";
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
  { fieldId: "name", newFieldValue: newFakeService.name, customLabel: null },
  {
    fieldId: "description",
    newFieldValue: newFakeService.description,
    customLabel: null,
  },
  { fieldId: "url", newFieldValue: newFakeService.url, customLabel: null },
  {
    fieldId: "version",
    newFieldValue: newFakeService.version,
    customLabel: null,
  },
  { fieldId: "tier", newFieldValue: newFakeService.tier, customLabel: null },
];

const formDataShape = {
  name: "",
  description: "",
  url: "",
  version: "",
  tier: "",
};

const filledFormData = {
  name: newFakeService.name,
  url: newFakeService.url,
  description: newFakeService.description,
  version: newFakeService.version,
  tier: newFakeService.tier,
};

describe("CreateService", () => {
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
      fieldId          | findBy    | customLabel
      ${"heading"}     | ${"role"} | ${"NULL"}
      ${"name"}        | ${"text"} | ${"NULL"}
      ${"description"} | ${"text"} | ${"NULL"}
      ${"url"}         | ${"text"} | ${"NULL"}
      ${"version"}     | ${"text"} | ${"NULL"}
      ${"tier"}        | ${"text"} | ${"NULL"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy, customLabel }) => {
        act(() =>
          render(
            <MemoryRouter>
              <CreateService />
            </MemoryRouter>
          )
        );

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Create service",
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
    });

    testEach(
      fieldsToTest,
      "can change $fieldId field's value",
      async ({ fieldId, newFieldValue, customLabel }) => {
        user.setup();

        act(() =>
          render(
            <MemoryRouter>
              <CreateService />
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
            <CreateService />
          </MemoryRouter>
        )
      );

      const filteredLabels = [
        { fieldLabel: "name", newValue: newFakeService.name },
        { fieldLabel: "description", newValue: newFakeService.description },
        { fieldLabel: "url", newValue: newFakeService.url },
        { fieldLabel: "version", newValue: newFakeService.version },
        { fieldLabel: "tier", newValue: newFakeService.tier },
      ];

      for (const { fieldLabel, newValue } of filteredLabels) {
        const field = (await screen.findByLabelText(
          RegExp(`^${fieldLabel}`, "i")
        )) as FormElement;

        expect(field).toBeInTheDocument();

        await act(() => updateFieldAndCheckValue(field, newValue));
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
