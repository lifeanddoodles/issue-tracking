import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TableRow from ".";
import Table from "../Table";
import TableBody from "../TableBody";
import TableCell from "../TableCell";

describe("TableRow", () => {
  test("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const element = screen.getByRole("row");
    expect(element).toBeInTheDocument();
  });
});
