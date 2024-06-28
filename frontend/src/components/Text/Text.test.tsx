import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Text from ".";

describe("Text", () => {
  test("renders correctly", () => {
    render(<Text>Lorem ipsum dolor</Text>);

    const element = screen.getByRole("paragraph");

    expect(element).toBeInTheDocument();
  });

  test("given the 'as' prop has correct tag", () => {
    render(<Text as={"span"}>This is a span</Text>);

    const element = screen.queryByRole("paragraph");

    expect(element).not.toBeInTheDocument();
  });
});
