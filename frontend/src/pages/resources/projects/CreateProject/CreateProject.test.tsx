import { act, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateProject from ".";
import { fakeServices, newFakeProject } from "../../../../__mocks__";
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
  { fieldId: "name", newFieldValue: newFakeProject.name, customLabel: null },
  { fieldId: "url", newFieldValue: newFakeProject.url, customLabel: null },
  {
    fieldId: "description",
    newFieldValue: newFakeProject.description,
    customLabel: null,
  },
  { fieldId: "company", newFieldValue: "1", customLabel: "Add company" },
  { fieldId: "teamMember", newFieldValue: "1", customLabel: "Add team member" },
  { fieldId: "newService", newFieldValue: "1", customLabel: "Add service" },
];

const formDataShape = {
  name: "",
  url: "",
  description: "",
  company: "",
  teamMember: "",
  newService: "",
  team: [],
  services: [],
  tickets: [],
};

const filledFormData = {
  name: newFakeProject.name,
  url: newFakeProject.url,
  description: newFakeProject.description,
  company: newFakeProject.company,
  teamMember: "New team member",
  newService: fakeServices[1]._id,
  team: newFakeProject.team,
  services: newFakeProject.services,
  tickets: newFakeProject.tickets,
};

describe("CreateProject", () => {
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
      ${"url"}         | ${"text"} | ${"NULL"}
      ${"description"} | ${"text"} | ${"NULL"}
      ${"company"}     | ${"text"} | ${"Add company"}
      ${"teamMember"}  | ${"text"} | ${"Add team member"}
      ${"newService"}  | ${"text"} | ${"Add service"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy, customLabel }) => {
        act(() =>
          render(
            <MemoryRouter>
              <CreateProject />
            </MemoryRouter>
          )
        );

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Create project",
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
              <CreateProject />
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
            <CreateProject />
          </MemoryRouter>
        )
      );

      const filteredLabels = [
        { fieldLabel: "name", newValue: newFakeProject.name },
        { fieldLabel: "url", newValue: newFakeProject.url },
        { fieldLabel: "description", newValue: newFakeProject.description },
        { fieldLabel: "add company", newValue: newFakeProject.company },
        { fieldLabel: "add team member", newValue: "1" },
        { fieldLabel: "add service", newValue: filledFormData.newService },
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

      const {
        newService,
        teamMember,
        team = [],
        services = [],
        ...restOfFormData
      } = filledFormData;

      const body = {
        ...restOfFormData,
        team: [...team, teamMember].filter(Boolean),
        services: [...services, newService].filter(Boolean),
      };

      await waitFor(async () => {
        expect(onSubmitSpy).toHaveBeenCalled();
        expect(onSubmitSpy).toHaveBeenCalledWith("POST", body);
      });
    });
  });
});
