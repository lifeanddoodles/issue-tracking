import { render, screen } from "@testing-library/react";
import AllServices from ".";

describe("AllServices", () => {
  test("renders correctly", () => {
    render(<AllServices />);
    const element = screen.getByRole("table");
    expect(element).toBeInTheDocument();
  });
});
