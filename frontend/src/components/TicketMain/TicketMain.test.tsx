import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import TicketMain from ".";
import { ITicketPopulatedDocument } from "../../../../shared/interfaces";
import { fakePopulatedTickets } from "../../__mocks__";

const fakeTicket = fakePopulatedTickets[0];

describe("TicketMain", () => {
  test("renders correctly", () => {
    const mockOnChange = vi.fn();
    const mockOnSave = vi.fn();
    const errors = {};
    const setErrors = vi.fn();

    render(
      <TicketMain
        ticket={fakeTicket as ITicketPopulatedDocument}
        onChange={mockOnChange}
        onSave={mockOnSave}
        errors={errors}
        setErrors={setErrors}
      />
    );
    const element = screen.getByRole("heading", {
      level: 1,
      name: fakeTicket.title,
    });
    expect(element).toBeInTheDocument();
  });
});
