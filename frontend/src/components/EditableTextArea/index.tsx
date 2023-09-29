import { useState } from "react";
import { paragraphsFromMultiLineText } from "../../utils";
import Button from "../Button";
import TextArea from "../TextArea";

interface IEditableTextArea {
  label?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  errors?: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] } | null>
  >;
}

const EditableTextArea = ({
  label,
  id,
  value,
  onChange,
  onSave,
  errors,
  setErrors,
}: IEditableTextArea) => {
  const [toggleEdit, setToggleEdit] = useState(false);

  const handleUpdate = () => {
    if (toggleEdit) {
      onSave && onSave();
    }
    setToggleEdit(false);
  };

  const handleCancel = () => {
    setToggleEdit(false);
  };

  return toggleEdit ? (
    <div className="editable-textarea">
      <TextArea
        label={label}
        id={id}
        onChange={onChange}
        value={value}
        required
        errors={errors}
        setErrors={setErrors}
        className="editable-textarea__textarea"
      />
      <footer className="editable-textarea__footer editable-textarea__footer--actions flex gap-4">
        <Button label="Save" onClick={handleUpdate} variant="link" />
        <Button label="Cancel" onClick={handleCancel} variant="link" />
      </footer>
    </div>
  ) : (
    <div
      className="editable-textarea__toggle"
      onClick={() => setToggleEdit(true)}
    >
      {paragraphsFromMultiLineText(value)}
    </div>
  );
};

export default EditableTextArea;
