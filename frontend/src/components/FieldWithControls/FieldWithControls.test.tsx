import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, vi } from "vitest";
import FieldWithControls from ".";
import { TextInput } from "../Input";

describe("FieldWithControls", () => {
  const controlsProps = {
    onCancel: vi.fn(),
    onSave: vi.fn(),
    isEditable: false,
    resetFieldValue: false,
    setResetFieldValue: vi.fn(),
  };
  const fieldProps = {
    label: "Name:",
    id: "name",
    required: true,
    value: "",
  };

  const renderField = () => {
    render(
      <FieldWithControls
        label={fieldProps.label}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        key={fieldProps.id}
      >
        <TextInput
          label={fieldProps.label}
          id={fieldProps.id}
          required
          value={fieldProps.value}
        />
      </FieldWithControls>
    );
  };

  test("renders correctly", () => {
    renderField();

    const editButton = screen.getByRole("button", {
      name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
    });
    const cancelButton = screen.getByRole("button", {
      name: RegExp(
        `^cancel changes to ${fieldProps.label.replace(":", "")}`,
        "i"
      ),
    });

    expect(editButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  test("handles onToggleEdit event", async () => {
    user.setup();

    renderField();

    const editButton = screen.getByRole("button", {
      name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
    });

    await user.click(editButton);

    const saveButton = screen.getByRole("button", {
      name: RegExp(`^save ${fieldProps.label.replace(":", "")}`, "i"),
    });

    expect(
      screen.queryByRole("button", {
        name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
      })
    ).not.toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  test("handles onSave event", async () => {
    user.setup();

    renderField();

    const editButton = screen.getByRole("button", {
      name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
    });

    await user.click(editButton);

    const saveButton = screen.getByRole("button", {
      name: RegExp(`^save ${fieldProps.label.replace(":", "")}`, "i"),
    });

    await user.click(saveButton);

    expect(controlsProps.onSave).toHaveBeenCalled();
  });

  test("handles onCancel event", async () => {
    user.setup();

    renderField();

    const editButton = screen.getByRole("button", {
      name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
    });

    await user.click(editButton);

    const cancelButton = screen.getByRole("button", {
      name: RegExp(
        `^cancel changes to ${fieldProps.label.replace(":", "")}`,
        "i"
      ),
    });

    await user.click(cancelButton);

    expect(controlsProps.onCancel).toHaveBeenCalled();
  });
});
