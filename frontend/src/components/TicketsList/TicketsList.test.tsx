import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect } from "vitest";
import TicketsList from ".";
import { fakeTickets } from "../../__mocks__";

describe("TicketsList", () => {
  test("renders correctly", () => {
    render(
      <BrowserRouter>
        <TicketsList tickets={fakeTickets} />
      </BrowserRouter>
    );
    const element = screen.getByRole("list");
    expect(element).toBeInTheDocument();
  });
});
