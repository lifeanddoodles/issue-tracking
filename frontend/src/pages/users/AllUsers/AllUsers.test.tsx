import { render, screen } from "@testing-library/react";
import AllUsers from ".";

describe("AllUsers", () => {
  test("renders correctly", () => {
    render(<AllUsers />);
    const element = screen.getByRole("table");
    expect(element).toBeInTheDocument();
  });
});
