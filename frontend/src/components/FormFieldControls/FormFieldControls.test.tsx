import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, vi } from "vitest";
import FormFieldControls from ".";

describe("FormFieldControls", () => {
  let updatableIsEditable: boolean;
  let toggleEdit: () => void;
  let controlsProps: {
    onToggleEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    isEditable: boolean;
    setResetFieldValue: () => void;
  };

  const fieldProps = {
    label: "Name",
  };

  beforeEach(() => {
    updatableIsEditable = false;

    toggleEdit = vi.fn(() => {
      updatableIsEditable = !updatableIsEditable;
    });
    controlsProps = {
      onToggleEdit: toggleEdit,
      onCancel: vi.fn(),
      onSave: vi.fn(),
      isEditable: updatableIsEditable,
      setResetFieldValue: vi.fn(),
    };
  });

  test("renders correctly", () => {
    render(
      <FormFieldControls
        label={fieldProps.label}
        onToggleEdit={controlsProps.onToggleEdit}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        isEditable={controlsProps.isEditable}
      />
    );

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

    const { rerender } = render(
      <FormFieldControls
        label={fieldProps.label}
        onToggleEdit={controlsProps.onToggleEdit}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        isEditable={updatableIsEditable}
      />
    );

    const editButton = screen.getByRole("button", {
      name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
    });

    await user.click(editButton);

    expect(controlsProps.onToggleEdit).toHaveBeenCalled();

    rerender(
      <FormFieldControls
        label={fieldProps.label}
        onToggleEdit={controlsProps.onToggleEdit}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        isEditable={updatableIsEditable}
      />
    );

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

    const { rerender } = render(
      <FormFieldControls
        label={fieldProps.label}
        onToggleEdit={controlsProps.onToggleEdit}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        isEditable={updatableIsEditable}
      />
    );

    const editButton = screen.getByRole("button", {
      name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
    });

    await user.click(editButton);

    rerender(
      <FormFieldControls
        label={fieldProps.label}
        onToggleEdit={controlsProps.onToggleEdit}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        isEditable={updatableIsEditable}
      />
    );

    const saveButton = screen.getByRole("button", {
      name: RegExp(`^save ${fieldProps.label.replace(":", "")}`, "i"),
    });

    await user.click(saveButton);

    expect(controlsProps.onSave).toHaveBeenCalled();
  });

  test("handles onCancel event", async () => {
    user.setup();

    const { rerender } = render(
      <FormFieldControls
        label={fieldProps.label}
        onToggleEdit={controlsProps.onToggleEdit}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        isEditable={updatableIsEditable}
      />
    );

    const editButton = screen.getByRole("button", {
      name: RegExp(`^edit ${fieldProps.label.replace(":", "")}`, "i"),
    });
    const cancelButton = screen.getByRole("button", {
      name: RegExp(
        `^cancel changes to ${fieldProps.label.replace(":", "")}`,
        "i"
      ),
    });

    await user.click(editButton);

    rerender(
      <FormFieldControls
        label={fieldProps.label}
        onToggleEdit={controlsProps.onToggleEdit}
        onCancel={controlsProps.onCancel}
        onSave={controlsProps.onSave}
        isEditable={updatableIsEditable}
      />
    );

    await user.click(cancelButton);

    expect(controlsProps.onCancel).toHaveBeenCalled();
  });
});
