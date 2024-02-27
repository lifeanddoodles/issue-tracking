import { act, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { IProjectDocument, IUserDocument } from "shared/interfaces";
import { vi } from "vitest";
import ProjectDetails from ".";
import { fakeClientUserNoCompany, fakeProjects } from "../../../../__mocks__";
import {
  getUseResourceInfoMockReturnValue,
  requestUpdateResourceMock,
  useResourceInfoMockReturnWithError,
  useResourceInfoMockReturnWithSuccess,
} from "../../../../__mocks__/useResourceInfo";
import useResourceInfo from "../../../../hooks/useResourceInfo";
import { FormElement, ResourceState } from "../../../../interfaces";
import { PROJECTS_BASE_API_URL } from "../../../../routes";
import {
  IAuthContext,
  adminAuth,
  authBase,
  compareValue,
  componentWithAuthContext,
  fieldNotDisabled,
  getFieldByLabel,
  renderWithRouter,
  renderWithRouterFromRoute,
  testEach,
  updateFieldAndCheckValue,
} from "../../../../tests/utils";
import { getReadableInputName } from "../../../../utils";

vi.mock("../../../../hooks/useResourceInfo");

const fieldsToTest = [
  { fieldId: "name", newFieldValue: "New name" },
  { fieldId: "url", newFieldValue: "https://new-url.com" },
  { fieldId: "description", newFieldValue: "New description" },
  { fieldId: "newService", newFieldValue: "1" },
  { fieldId: "newTeamMember", newFieldValue: "1" },
];

const fieldsToTestNoSelects = [
  { fieldId: "name", newFieldValue: "New name" },
  { fieldId: "url", newFieldValue: "https://new-url.com" },
  { fieldId: "description", newFieldValue: "New description" },
];

describe("ProjectDetails", () => {
  let auth: IAuthContext;
  let useResourceInfoMockReturn: ResourceState<unknown>;

  describe("if project does not exist", async () => {
    beforeEach(async () => {
      useResourceInfoMockReturn = useResourceInfoMockReturnWithError;

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );

      auth = {
        user: {
          ...fakeClientUserNoCompany,
        } as IUserDocument,
        ...authBase,
      };
    });

    test("renders error", async () => {
      act(() => renderWithRouter(<ProjectDetails />, auth));

      const title = await screen.findByText(/error/i);
      const notApplicableTitle = screen.queryByText(/project details/i);

      expect(title).toBeInTheDocument();
      expect(notApplicableTitle).not.toBeInTheDocument();
    });
  });

  describe("if project exists", async () => {
    let project: IProjectDocument;

    beforeAll(() => {
      vi.clearAllMocks();
    });

    beforeEach(async () => {
      auth = {
        ...adminAuth,
      };

      project = fakeProjects.find(
        (project) => project.company === auth.user.company
      ) as unknown as IProjectDocument;

      useResourceInfoMockReturn = useResourceInfoMockReturnWithSuccess(project);

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );
    });

    test.each`
      fieldId            | findBy
      ${"heading"}       | ${"role"}
      ${"name"}          | ${"label"}
      ${"url"}           | ${"label"}
      ${"description"}   | ${"label"}
      ${"newService"}    | ${"label"}
      ${"newTeamMember"} | ${"label"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy }) => {
        act(() => renderWithRouter(<ProjectDetails />, auth));

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Project Details",
            });
            expect(title).toBeInTheDocument();
          }

          if (findBy === "label") {
            const field = (await screen.findByLabelText(
              RegExp(`^${getReadableInputName(fieldId)}`, "i")
            )) as FormElement;

            expect(field).toBeInTheDocument();
            compareValue<IProjectDocument>(field.value, project!, fieldId);
          }
        });
      }
    );

    /**
     * Test on change functionality
     */
    testEach(
      fieldsToTest,
      "when on edit mode, can change $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() => renderWithRouter(<ProjectDetails />, auth));

        const [field, fieldLabel] = await getFieldByLabel(fieldId);

        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });

        expect(field).toHaveAttribute("disabled");
        expect(fieldEditButton).toBeInTheDocument();

        await user.click(fieldEditButton!);

        const fieldSaveButton = screen.queryByRole("button", {
          name: RegExp(`^save ${fieldLabel}`, "i"),
        });

        fieldNotDisabled(field);
        expect(
          screen.queryByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          })
        ).not.toBeInTheDocument();
        expect(fieldSaveButton).toBeInTheDocument();

        await act(() => updateFieldAndCheckValue(field, newFieldValue));
      }
    );

    /**
     * Test save changes functionality
     *
     * TODO: Fix failing tests for the select fields:
     * - newService
     * - newTeamMember
     */
    testEach(
      fieldsToTestNoSelects,
      "when saving changes on $fieldId, the correct data is sent to the server",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<ProjectDetails />, auth),
            [`/projects/${project?._id}`],
            "/projects/:projectId"
          )
        );

        const [field, fieldLabel] = await getFieldByLabel(fieldId);

        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });

        expect(field).toHaveAttribute("disabled");
        expect(fieldEditButton).toBeInTheDocument();

        await user.click(fieldEditButton!);

        const fieldSaveButton = screen.queryByRole("button", {
          name: RegExp(`^save ${fieldLabel}`, "i"),
        });

        expect(
          screen.queryByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          })
        ).not.toBeInTheDocument();
        expect(fieldSaveButton).toBeInTheDocument();

        await act(() => updateFieldAndCheckValue(field, newFieldValue));

        await user.click(fieldSaveButton!);

        const body = {
          [fieldId]: newFieldValue,
        };

        await waitFor(async () => {
          expect(requestUpdateResourceMock).toHaveBeenCalled();
          expect(requestUpdateResourceMock).toHaveBeenCalledWith({
            url: `${PROJECTS_BASE_API_URL}/${project?._id}`,
            body,
          });
        });
      }
    );

    /**
     * Test cancel changes functionality
     *
     * TODO: Fix failing tests for the select fields:
     * - newService
     * - newTeamMember
     */
    testEach(
      fieldsToTestNoSelects,
      "when on edit mode, can cancel changes on $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() => renderWithRouter(<ProjectDetails />, auth));

        const [field, fieldLabel] = await getFieldByLabel(fieldId);

        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });
        const fieldCancelButton = await screen.findByRole("button", {
          name: RegExp(`^cancel changes to ${fieldLabel}`, "i"),
        });

        expect(fieldCancelButton).toBeInTheDocument();

        await user.click(fieldEditButton!);

        await act(() => updateFieldAndCheckValue(field, newFieldValue));

        await user.click(fieldCancelButton!);

        await waitFor(() => {
          compareValue<IProjectDocument>(
            field.value,
            project!,
            fieldId as keyof IProjectDocument
          );
        });
      }
    );
  });
});
