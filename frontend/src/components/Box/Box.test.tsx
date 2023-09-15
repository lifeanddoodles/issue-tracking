import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Box from ".";

describe("Box", () => {
  test("renders correctly", () => {
    render(
      <Box>
        <p>Box title</p>
      </Box>
    );

    const element = screen.getByText("Box title");
    expect(element).toBeInTheDocument();
  });
});
