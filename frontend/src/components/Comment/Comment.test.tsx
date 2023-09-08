import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Comment from ".";
import { fakeComments } from "../../__mocks__";

const fakeComment = fakeComments[0];

describe("Comment", () => {
  test("renders correctly", () => {
    render(<Comment comment={fakeComment} />);
    const element = screen.getByRole("listitem");
    expect(element).toBeInTheDocument();
  });

  test("displays comment's author's full name", () => {
    render(<Comment comment={fakeComment} />);
    const element = screen.getByRole("banner");
    expect(element).toHaveTextContent(
      `${fakeComment.author.firstName} ${fakeComment.author.lastName}`
    );
  });
});
