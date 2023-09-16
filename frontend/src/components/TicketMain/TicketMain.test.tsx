import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TicketMain from ".";
import { fakePopulatedTickets } from "../../__mocks__";

const fakeTicket = fakePopulatedTickets[0];

describe("TicketMain", () => {
  test("renders correctly", () => {
    render(<TicketMain ticket={fakeTicket} />);
    const element = screen.getByRole("heading", {
      level: 1,
      name: fakeTicket.title,
    });
    expect(element).toBeInTheDocument();
  });
});
