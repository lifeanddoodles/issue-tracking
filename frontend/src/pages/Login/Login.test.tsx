import { render, screen } from "@testing-library/react";
import Login from ".";

describe("Login", () => {
  test("renders correctly", () => {
    render(<Login />);
    const element = screen.getByText("Login");
    expect(element).toBeInTheDocument();
  });
});
