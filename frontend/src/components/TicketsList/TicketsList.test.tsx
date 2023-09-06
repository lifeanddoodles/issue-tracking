import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TicketsList from ".";
import { fakeTickets } from "../../__mocks__";

describe("TicketsList", () => {
  test("renders correctly", () => {
    render(<TicketsList tickets={fakeTickets} />);
    const element = screen.getByRole("list");
    expect(element).toBeInTheDocument();
  });
});
