import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from ".";

describe("Register", () => {
  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const element = screen.getByText("Register");
    expect(element).toBeInTheDocument();
  });
});
