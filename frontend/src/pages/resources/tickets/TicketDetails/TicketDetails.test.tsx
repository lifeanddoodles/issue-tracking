import { act, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import {
  ICommentPopulatedDocument,
  ITicketPopulatedDocument,
} from "shared/interfaces";
import { vi } from "vitest";
import TicketDetails from ".";
import { fakeComments, fakePopulatedTickets } from "../../../../__mocks__";
import {
  getUseResourceInfoMockReturnValue,
  requestUpdateResourceMock,
  useResourceInfoMockReturnWithError,
  useResourceInfoMockReturnWithSuccess,
} from "../../../../__mocks__/useResourceInfo";
import useResourceInfo from "../../../../hooks/useResourceInfo";
import { FormElement, ResourceState } from "../../../../interfaces";
import { TICKETS_BASE_API_URL } from "../../../../routes";
import {
  IAuthContext,
  adminAuth,
  compareValue,
  componentWithAuthContext,
  getFieldByLabel,
  getFieldValue,
  renderWithRouter,
  renderWithRouterFromRoute,
  testEach,
  updateFieldAndCheckValue,
} from "../../../../tests/utils";
import { getReadableInputName } from "../../../../utils";

vi.mock("../../../../hooks/useResourceInfo");

const fieldsToTest = [
  { fieldId: "status", newFieldValue: "1", findBy: "testId" },
  { fieldId: "assignToTeam", newFieldValue: "1", findBy: "label" },
  { fieldId: "assignee", newFieldValue: "1", findBy: "label" },
  { fieldId: "reporter", newFieldValue: "1", findBy: "label" },
  { fieldId: "priority", newFieldValue: "1", findBy: "label" },
  { fieldId: "ticketType", newFieldValue: "2", findBy: "label" },
  { fieldId: "estimatedTime", newFieldValue: "20", findBy: "label" },
  {
    fieldId: "deadline",
    newFieldValue: "2023-09-15T22:22:30.440Z",
    findBy: "label",
  },
  { fieldId: "isSubtask", newFieldValue: "true", findBy: "label" },
  { fieldId: "parentTask", newFieldValue: "1", findBy: "label" },
];

const fieldsToTestNoSelects = [
  { fieldId: "estimatedTime", newFieldValue: "20", findBy: "label" },
  {
    fieldId: "deadline",
    newFieldValue: "2023-09-15T22:22:30.440Z",
    findBy: "label",
  },
  // { fieldId: "isSubtask", newFieldValue: "true", findBy: "label" },
];

describe("TicketDetails", () => {
  let auth: IAuthContext;
  let useResourceInfoMockReturn: ResourceState<unknown>;

  describe("if ticket does not exist", async () => {
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
      act(() => renderWithRouter(<TicketDetails />, auth));

      const title = await screen.findByText(/error/i);
      const notApplicableTitle = screen.queryByRole("heading", {
        level: 2,
        name: "Description",
      });

      expect(title).toBeInTheDocument();
      expect(notApplicableTitle).not.toBeInTheDocument();
    });
  });

  describe("if ticket exists", async () => {
    let fakeTicket: ITicketPopulatedDocument;

    beforeAll(() => {
      vi.clearAllMocks();
    });

    beforeEach(async () => {
      auth = {
        ...adminAuth,
      };

      fakeTicket = fakePopulatedTickets[0] as ITicketPopulatedDocument;

      const fakeTicketComments = (fakeComments.filter(
        (comment) => comment.ticketId === fakeTicket._id
      ) || []) as Partial<ICommentPopulatedDocument>[];

      useResourceInfoMockReturn = useResourceInfoMockReturnWithSuccess({
        ticket: fakeTicket,
        comments: fakeTicketComments,
      });

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );
    });

    test.each`
      fieldId            | findBy      | valueType
      ${"heading"}       | ${"role"}   | ${"value"}
      ${"status"}        | ${"testId"} | ${"value"}
      ${"assignToTeam"}  | ${"label"}  | ${"value"}
      ${"assignee"}      | ${"label"}  | ${"populatedValue"}
      ${"reporter"}      | ${"label"}  | ${"populatedValue"}
      ${"priority"}      | ${"label"}  | ${"value"}
      ${"ticketType"}    | ${"label"}  | ${"value"}
      ${"estimatedTime"} | ${"label"}  | ${"valueAsNumber"}
      ${"deadline"}      | ${"label"}  | ${"value"}
      ${"isSubtask"}     | ${"label"}  | ${"checkedValue"}
      ${"parentTask"}    | ${"label"}  | ${"value"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy, valueType }) => {
        await act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<TicketDetails />, auth),
            [`/dashboard/tickets/${fakeTicket?._id}`],
            "/dashboard/tickets/:ticketId"
          )
        );

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: fakeTicket.title,
              level: 1,
            });
            return expect(title).toBeInTheDocument();
          }

          let field: FormElement;

          if (findBy === "label") {
            field = (await screen.findByLabelText(
              RegExp(`^${getReadableInputName(fieldId)}`, "i")
            )) as FormElement;
          }

          if (findBy === "testId") {
            field = (await screen.findByTestId(
              RegExp(`^${getReadableInputName(fieldId)}`, "i")
            )) as FormElement;
          }

          expect(field!).toBeInTheDocument();

          const fieldValue = getFieldValue(field!, valueType);

          compareValue<ITicketPopulatedDocument>(
            fieldValue,
            fakeTicket!,
            fieldId,
            valueType === "populatedValue"
          );
        });
      }
    );

    /**
     * Test on change functionality
     */
    testEach(
      fieldsToTest,
      "can change $fieldId field's value",
      async ({ fieldId, newFieldValue, findBy }) => {
        await act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<TicketDetails />, auth),
            [`/dashboard/tickets/${fakeTicket?._id}`],
            "/dashboard/tickets/:ticketId"
          )
        );

        let foundField: FormElement;

        if (findBy === "label") {
          const [field] = await getFieldByLabel(fieldId);
          foundField = field;
        }
        if (findBy === "testId") {
          foundField = (await screen.findByTestId(fieldId)) as FormElement;
        }

        await act(() => updateFieldAndCheckValue(foundField, newFieldValue));
      }
    );

    /**
     * Test on save functionality
     *
     * TODO: Fix failing tests for the select fields:
     * - status
     * - assignToTeam
     * - assignee
     * - reporter
     * - ticketType
     * - priority
     * - parentTask
     */
    testEach(
      fieldsToTestNoSelects,
      "can save $fieldId field's value",
      async ({ fieldId, newFieldValue, findBy }) => {
        user.setup();

        await act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<TicketDetails />, auth),
            [`/dashboard/tickets/${fakeTicket?._id}`],
            "/dashboard/tickets/:ticketId"
          )
        );

        const saveButton = screen.getByRole("button", {
          name: "Save",
        });

        let foundField: FormElement;

        if (findBy === "label") {
          const [field] = await getFieldByLabel(fieldId);
          foundField = field;
        }
        if (findBy === "testId") {
          foundField = (await screen.findByTestId(fieldId)) as FormElement;
        }

        let selectValue: unknown;
        let bodyValue: unknown;

        expect(saveButton).toBeInTheDocument();
        await act(async () => {
          const returnedValue = await updateFieldAndCheckValue(
            foundField,
            newFieldValue
          );
          if (returnedValue !== null) {
            selectValue = returnedValue;
          }
          bodyValue =
            foundField instanceof HTMLSelectElement
              ? selectValue
              : newFieldValue;
        });

        await user.click(saveButton);

        const body = {
          [fieldId]: bodyValue,
        };

        await waitFor(async () => {
          expect(requestUpdateResourceMock).toHaveBeenCalled();
          expect(requestUpdateResourceMock).toHaveBeenCalledWith({
            url: `${TICKETS_BASE_API_URL}/${fakeTicket?._id}`,
            body,
          });
        });
      }
    );

    /**
     * TODO: Cancel changes functionality
     */
  });
});
