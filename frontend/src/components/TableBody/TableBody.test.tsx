import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TableBody from ".";
import Table from "../Table";
import TableCell from "../TableCell";
import TableRow from "../TableRow";

describe("TableBody", () => {
  test("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const element = screen.getByRole("rowgroup");
    expect(element).toBeInTheDocument();
  });
});
