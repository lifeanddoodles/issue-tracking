import { render, screen } from "@testing-library/react";
import AllTickets from ".";

describe("AllTickets", () => {
  test("renders correctly", () => {
    render(<AllTickets />);
    const element = screen.getByRole("table");
    expect(element).toBeInTheDocument();
  });
});
