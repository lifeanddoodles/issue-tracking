import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from ".";

describe("Login", () => {
  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const element = screen.getByText("Login");
    expect(element).toBeInTheDocument();
  });
});
