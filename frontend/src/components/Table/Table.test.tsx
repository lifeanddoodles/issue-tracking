import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Table from ".";

describe("Table", () => {
  test("renders correctly", () => {
    render(
      <Table>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        </tbody>
      </Table>
    );
    const element = screen.getByRole("table");
    expect(element).toBeInTheDocument();
  });
});
