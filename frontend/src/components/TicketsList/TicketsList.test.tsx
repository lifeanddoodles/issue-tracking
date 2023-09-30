import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect } from "vitest";
import TicketsList from ".";
import { fakePopulatedTickets } from "../../__mocks__";

describe("TicketsList", () => {
  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <TicketsList tickets={fakePopulatedTickets} />
      </MemoryRouter>
    );
    const element = screen.getByRole("list");
    expect(element).toBeInTheDocument();
  });
});
