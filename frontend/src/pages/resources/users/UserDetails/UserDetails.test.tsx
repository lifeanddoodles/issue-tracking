import { act, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { IUserDocument } from "shared/interfaces";
import { vi } from "vitest";
import UserDetails from ".";
import {
  fakeClientUserNoCompany,
  fakeClientUserWithCompany,
} from "../../../../__mocks__";
import {
  getUseResourceInfoMockReturnValue,
  requestUpdateResourceMock,
  useResourceInfoMockReturnWithError,
  useResourceInfoMockReturnWithSuccess,
} from "../../../../__mocks__/useResourceInfo";
import useResourceInfo from "../../../../hooks/useResourceInfo";
import { FormElement, ResourceState } from "../../../../interfaces";
import { USERS_BASE_API_URL } from "../../../../routes";
import {
  IAuthContext,
  adminAuth,
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
  { fieldId: "firstName", newFieldValue: "New name" },
  { fieldId: "lastName", newFieldValue: "New last name" },
  { fieldId: "email", newFieldValue: "newemail@company.com" },
  { fieldId: "company", newFieldValue: "new-company" },
  { fieldId: "position", newFieldValue: "New position" },
];

describe("UserDetails", () => {
  let auth: IAuthContext;
  let useResourceInfoMockReturn: ResourceState<unknown>;

  describe("if user does not exist", async () => {
    beforeEach(async () => {
      useResourceInfoMockReturn = useResourceInfoMockReturnWithError;

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );

      auth = {
        ...adminAuth,
      };
    });

    test("renders error", async () => {
      act(() => renderWithRouter(<UserDetails />, auth));

      const title = await screen.findByText(/error/i);
      const notApplicableTitle = screen.queryByText(/service details/i);

      expect(title).toBeInTheDocument();
      expect(notApplicableTitle).not.toBeInTheDocument();
    });
  });

  describe("if user exists and has company", async () => {
    let fakeUser: IUserDocument;

    beforeAll(() => {
      vi.clearAllMocks();
    });

    beforeEach(async () => {
      auth = {
        ...adminAuth,
      };

      fakeUser = fakeClientUserWithCompany as IUserDocument;

      useResourceInfoMockReturn =
        useResourceInfoMockReturnWithSuccess(fakeUser);

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );
    });

    test.each`
      fieldId        | findBy
      ${"heading"}   | ${"role"}
      ${"firstName"} | ${"label"}
      ${"lastName"}  | ${"label"}
      ${"email"}     | ${"label"}
      ${"company"}   | ${"label"}
      ${"position"}  | ${"label"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy }) => {
        act(() => renderWithRouter(<UserDetails />, auth));

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "User Details",
            });
            expect(title).toBeInTheDocument();
          }

          if (findBy === "label") {
            const field = (await screen.findByLabelText(
              RegExp(`^${getReadableInputName(fieldId)}`, "i")
            )) as FormElement;

            expect(field).toBeInTheDocument();
            compareValue<IUserDocument>(field.value, fakeUser!, fieldId);
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

        act(() => renderWithRouter(<UserDetails />, auth));

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
     */
    testEach(
      fieldsToTest,
      "when saving changes on $fieldId, the correct data is sent to the server",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<UserDetails />, auth),
            [`/users/${fakeUser?._id}`],
            "/users/:userId"
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
            url: `${USERS_BASE_API_URL}/${fakeUser?._id}`,
            body,
          });
        });
      }
    );

    /**
     * Test cancel changes functionality
     */
    testEach(
      fieldsToTest,
      "when on edit mode, can cancel changes on $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() => renderWithRouter(<UserDetails />, auth));

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
          compareValue<IUserDocument>(
            field.value,
            fakeUser!,
            fieldId as keyof IUserDocument
          );
        });
      }
    );
  });

  describe("if user exists and does not have company", async () => {
    let fakeUser: IUserDocument;

    beforeAll(() => {
      vi.clearAllMocks();
    });

    beforeEach(async () => {
      auth = {
        ...adminAuth,
      };

      fakeUser = fakeClientUserNoCompany as IUserDocument;

      useResourceInfoMockReturn =
        useResourceInfoMockReturnWithSuccess(fakeUser);

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );
    });

    test.each`
      fieldId        | findBy
      ${"heading"}   | ${"role"}
      ${"firstName"} | ${"label"}
      ${"lastName"}  | ${"label"}
      ${"email"}     | ${"label"}
      ${"company"}   | ${"text"}
      ${"position"}  | ${"label"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy }) => {
        act(() => renderWithRouter(<UserDetails />, auth));

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "User Details",
            });
            expect(title).toBeInTheDocument();
          }

          if (findBy === "label") {
            const field = (await screen.findByLabelText(
              RegExp(`^${getReadableInputName(fieldId)}`, "i")
            )) as FormElement;

            expect(field).toBeInTheDocument();
            compareValue<IUserDocument>(field.value, fakeUser!, fieldId);
          }

          if (findBy === "text") {
            const link = (await screen.findByText(
              RegExp(`^add ${fieldId}`, "i")
            )) as HTMLAnchorElement;

            expect(link).toBeInTheDocument();
          }
        });
      }
    );
  });

  /**
   * TODO: Add tests for different roles to test permissions
   *
   * - Staff
   *   - Should not be able to edit company directly
   * - Client
   *   - Should only be able to view users from same company
   *   - Should not be able to edit company directly
   */
});
