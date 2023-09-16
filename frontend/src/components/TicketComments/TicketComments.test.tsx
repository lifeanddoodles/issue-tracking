import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TicketComments from ".";
import { fakeComments } from "../../__mocks__";

describe("TicketComments", () => {
  test("renders correctly", () => {
    render(<TicketComments comments={fakeComments} />);
    const element = screen.getByRole("list");
    expect(element).toBeInTheDocument();
  });

  test("if comments exist, renders correct amount of comments", () => {
    render(<TicketComments comments={fakeComments} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toEqual(fakeComments.length);
  });

  test("if no comments exist, comments list is not rendered", () => {
    render(<TicketComments comments={[]} />);
    const element = screen.queryByRole("list");
    expect(element).not.toBeInTheDocument();
  });
});
