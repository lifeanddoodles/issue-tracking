import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { IFormFieldControls } from "../../interfaces";
import IconButton from "../Button/IconButton";

const FormFieldControls = ({
  isEditable,
  label,
  onToggleEdit,
  onSave,
  onCancel,
}: IFormFieldControls) => {
  return (
    <div role="group" className="flex gap-2">
      <IconButton
        onClick={!isEditable ? onToggleEdit : onSave}
        ariaLabel={isEditable ? `Save ${label}` : `Edit ${label}`}
      >
        {isEditable ? <CheckIcon title="Save" /> : <PencilIcon title="Edit" />}
      </IconButton>
      <IconButton
        onClick={onCancel}
        disabled={!isEditable}
        ariaLabel={`Cancel changes to ${label}`}
      >
        <XMarkIcon title="Cancel" />
      </IconButton>
    </div>
  );
};

export default FormFieldControls;
