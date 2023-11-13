import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, vi } from "vitest";
import TicketSidebar from ".";
import { fakePopulatedTickets, fakeUsers } from "../../__mocks__";
import { getStatusText } from "../../utils";

const fakeTicket = fakePopulatedTickets[0];
const formData = { ...fakeTicket };

describe("TicketSidebar", () => {
  test("renders correctly", () => {
    const formData = { ...fakeTicket };
    const errors = {};
    const setErrors = vi.fn();
    const mockOnChange = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <MemoryRouter>
        <TicketSidebar
          formData={formData}
          onChange={mockOnChange}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          errors={errors}
          setErrors={setErrors}
        />
      </MemoryRouter>
    );
    const element = screen.queryByText(getStatusText(fakeTicket.status));
    expect(element).toBeInTheDocument();
  });

  test("has correct assignee value", async () => {
    const errors = {};
    const setErrors = vi.fn();
    const mockOnChange = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();
    const fakeAssignee = fakeUsers.find(
      (user) => user._id === formData.assignee?._id
    );

    act(() =>
      render(
        <MemoryRouter>
          <TicketSidebar
            formData={formData}
            onChange={mockOnChange}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            errors={errors}
            setErrors={setErrors}
          />
        </MemoryRouter>
      )
    );

    const element = (await screen.findByLabelText(
      /assignee/i
    )) as HTMLSelectElement;
    expect(element.value).toEqual(fakeAssignee?._id);
  });

  test("has correct reporter value", async () => {
    const errors = {};
    const setErrors = vi.fn();
    const mockOnChange = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();
    const fakeReporter = fakeUsers.find(
      (user) => user._id === formData.reporter?._id
    );

    act(() =>
      render(
        <MemoryRouter>
          <TicketSidebar
            formData={formData}
            onChange={mockOnChange}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            errors={errors}
            setErrors={setErrors}
          />
        </MemoryRouter>
      )
    );

    const element = (await screen.findByLabelText(
      /reporter/i
    )) as HTMLSelectElement;
    expect(element.value).toEqual(fakeReporter?._id);
  });
});
