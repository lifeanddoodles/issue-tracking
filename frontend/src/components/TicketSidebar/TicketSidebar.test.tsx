import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TicketSidebar from ".";
import { fakeDevUser, fakeStaffUser, fakeTickets } from "../../__mocks__";

const fakeTicket = fakeTickets[0];

describe("TicketSidebar", () => {
  test("renders correctly", () => {
    render(<TicketSidebar ticket={fakeTicket} />);
    const element = screen.getByText(fakeTicket.status);
    expect(element).toBeInTheDocument();
  });

  test("renders assignee info", () => {
    render(<TicketSidebar ticket={fakeTicket} />);
    const element = screen.getByText(
      `${fakeDevUser.firstName} ${fakeDevUser.lastName}`
    );
    expect(element).toBeInTheDocument();
  });

  test("renders reporter info", () => {
    render(<TicketSidebar ticket={fakeTicket} />);
    const element = screen.getByText(
      `${fakeStaffUser.firstName} ${fakeStaffUser.lastName}`
    );
    expect(element).toBeInTheDocument();
  });
});
