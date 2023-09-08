import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TicketMain from ".";
import { fakeComments, fakePopulatedTickets } from "../../__mocks__";

const fakeTicket = fakePopulatedTickets[0];

describe("TicketMain", () => {
  test("renders correctly", () => {
    render(<TicketMain ticket={fakeTicket} comments={fakeComments} />);
    const element = screen.getByRole("heading", {
      level: 1,
      name: fakeTicket.title,
    });
    expect(element).toBeInTheDocument();
  });

  test("if comments exist, renders correct amount of comments", () => {
    render(<TicketMain ticket={fakeTicket} comments={fakeComments} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toEqual(fakeComments.length);
  });

  test("if no comments exist, comments list is not rendered", () => {
    render(<TicketMain ticket={fakeTicket} comments={[]} />);
    const element = screen.queryByRole("list");
    expect(element).not.toBeInTheDocument();
  });
});
