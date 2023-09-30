import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect } from "vitest";
import TicketSidebar from ".";
import {
  fakeDevUser,
  fakePopulatedTickets,
  fakeStaffUser,
} from "../../__mocks__";
import { getStatusText } from "../../utils";

const fakeTicket = fakePopulatedTickets[0];

describe("TicketSidebar", () => {
  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <TicketSidebar ticket={fakeTicket} />
      </MemoryRouter>
    );
    const element = screen.getByText(getStatusText(fakeTicket.status));
    expect(element).toBeInTheDocument();
  });

  test("renders assignee info", () => {
    render(
      <MemoryRouter>
        <TicketSidebar ticket={fakeTicket} />
      </MemoryRouter>
    );
    const element = screen.getByText(
      `${fakeDevUser.firstName} ${fakeDevUser.lastName}`
    );
    expect(element).toBeInTheDocument();
  });

  test("renders reporter info", () => {
    render(
      <MemoryRouter>
        <TicketSidebar ticket={fakeTicket} />
      </MemoryRouter>
    );
    const element = screen.getByText(
      `${fakeStaffUser.firstName} ${fakeStaffUser.lastName}`
    );
    expect(element).toBeInTheDocument();
  });
});
