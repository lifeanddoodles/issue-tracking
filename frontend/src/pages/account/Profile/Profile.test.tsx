import { act, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Mock, describe, expect, vi } from "vitest";
import Profile from ".";
import { IUserDocument } from "../../../../../shared/interfaces";
import { fakeAdminUser, fakeClientUserNoCompany } from "../../../__mocks__";
import {
  getUseResourceInfoMockReturnValue,
  requestUpdateResourceMock,
  useResourceInfoMockReturnWithSuccess,
} from "../../../__mocks__/useResourceInfo";
import mockedUseProfileData from "../../../hooks/useProfileData";
import mockedUseResourceInfo from "../../../hooks/useResourceInfo";
import { FormElement, ResourceState } from "../../../interfaces";
import { USERS_BASE_API_URL } from "../../../routes";
import {
  compareValue,
  fieldNotDisabled,
  getFieldByLabel,
  testEach,
  updateFieldAndCheckValue,
} from "../../../tests/utils";
import { getReadableInputName } from "../../../utils";

vi.mock("../../../hooks/useResourceInfo");
vi.mock(`../../../hooks/useProfileData`);

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actualReactRouterDom: Record<string, unknown> = await vi.importActual(
    `react-router-dom`
  );

  return {
    ...actualReactRouterDom,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const fieldsToTest = [
  { fieldId: "firstName", newFieldValue: "New name" },
  { fieldId: "lastName", newFieldValue: "New last name" },
  { fieldId: "email", newFieldValue: "newemail@company.com" },
  { fieldId: "position", newFieldValue: "New position" },
  { fieldId: "department", newFieldValue: "1" },
  { fieldId: "company", newFieldValue: "new-company" },
];

const fieldsToTestWithoutSelects = [
  { fieldId: "firstName", newFieldValue: "New name" },
  { fieldId: "lastName", newFieldValue: "New last name" },
  { fieldId: "email", newFieldValue: "newemail@company.com" },
  { fieldId: "position", newFieldValue: "New position" },
  { fieldId: "company", newFieldValue: "new-company" },
];

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("if user does not exist", () => {
    beforeEach(() => {
      vi.mocked(mockedUseProfileData)
        .mockClear()
        .mockImplementation(() => ({
          userInfo: null,
          loading: false,
          error: new Error("User not found"),
          getUserInfo: vi.fn(),
        }));
    });

    test("throws error", async () => {
      act(() =>
        render(
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        )
      );

      const title = await screen.findByText(/User not found/i);

      expect(title).toBeInTheDocument();
    });
  });

  describe("if user exists", () => {
    let fakeUser: IUserDocument;
    let useResourceInfoMockReturn: ResourceState<unknown>;

    beforeAll(() => {
      vi.clearAllMocks();
    });

    describe("and has a company", () => {
      beforeEach(async () => {
        fakeUser = fakeAdminUser as IUserDocument;

        useResourceInfoMockReturn =
          useResourceInfoMockReturnWithSuccess(fakeUser);

        await getUseResourceInfoMockReturnValue(
          mockedUseResourceInfo,
          useResourceInfoMockReturn
        );

        vi.mocked(mockedUseProfileData)
          .mockClear()
          .mockReturnValue({
            userInfo: fakeUser as IUserDocument,
            loading: false,
            error: null,
            getUserInfo: vi.fn(),
          });
      });

      test.each`
        fieldId         | findBy
        ${"heading"}    | ${"role"}
        ${"firstName"}  | ${"label"}
        ${"lastName"}   | ${"label"}
        ${"email"}      | ${"label"}
        ${"position"}   | ${"label"}
        ${"department"} | ${"label"}
        ${"company"}    | ${"label"}
      `(
        "renders $fieldId with the correct value",
        async ({ fieldId, findBy }) => {
          await act(() =>
            render(
              <MemoryRouter>
                <Profile />
              </MemoryRouter>
            )
          );

          await waitFor(async () => {
            if (findBy === "role") {
              const title = await screen.findByRole(fieldId, {
                name: "Profile",
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

          await act(() =>
            render(
              <MemoryRouter>
                <Profile />
              </MemoryRouter>
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
       * - department
       */
      testEach(
        fieldsToTestWithoutSelects,
        "when saving changes on $fieldId, the correct data is sent to the server",
        async ({ fieldId, newFieldValue }) => {
          user.setup();

          await act(() =>
            render(
              <MemoryRouter>
                <Profile />
              </MemoryRouter>
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
       *
       * TODO: Fix failing tests for the select fields:
       * - department
       */
      testEach(
        fieldsToTestWithoutSelects,
        "when on edit mode, can cancel changes on $fieldId field's value",
        async ({ fieldId, newFieldValue }) => {
          user.setup();

          await act(() =>
            render(
              <MemoryRouter>
                <Profile />
              </MemoryRouter>
            )
          );

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

    describe("and does not have company", async () => {
      beforeEach(async () => {
        fakeUser = fakeClientUserNoCompany as IUserDocument;

        useResourceInfoMockReturn =
          useResourceInfoMockReturnWithSuccess(fakeUser);

        await getUseResourceInfoMockReturnValue(
          mockedUseResourceInfo,
          useResourceInfoMockReturn
        );

        vi.mocked(mockedUseProfileData)
          .mockClear()
          .mockImplementation(() => ({
            userInfo: fakeUser as IUserDocument,
            loading: false,
            error: null,
            getUserInfo: vi.fn(),
          }));
      });

      test.each`
        fieldId         | findBy
        ${"heading"}    | ${"role"}
        ${"firstName"}  | ${"label"}
        ${"lastName"}   | ${"label"}
        ${"email"}      | ${"label"}
        ${"position"}   | ${"label"}
        ${"department"} | ${"label"}
        ${"company"}    | ${"text"}
      `(
        "renders $fieldId with the correct value",
        async ({ fieldId, findBy }) => {
          await act(() =>
            render(
              <MemoryRouter>
                <Profile />
              </MemoryRouter>
            )
          );

          await waitFor(async () => {
            if (findBy === "role") {
              const title = await screen.findByRole(fieldId, {
                name: "Profile",
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
  });
});
