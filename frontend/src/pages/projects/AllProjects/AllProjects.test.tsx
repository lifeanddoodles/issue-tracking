import { render, screen } from "@testing-library/react";
import AllProjects from ".";

describe("AllProjects", () => {
  test("renders correctly", () => {
    render(<AllProjects />);
    const element = screen.getByRole("table");
    expect(element).toBeInTheDocument();
  });
});
