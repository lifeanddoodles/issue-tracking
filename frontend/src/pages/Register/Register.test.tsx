import { render, screen } from "@testing-library/react";
import Register from ".";

describe("Register", () => {
  test("renders correctly", () => {
    render(<Register />);
    const element = screen.getByText("Register");
    expect(element).toBeInTheDocument();
  });
});
