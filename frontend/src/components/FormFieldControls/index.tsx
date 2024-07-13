import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { IFormFieldControls } from "../../interfaces";
import IconButton from "../Button/IconButton";

const FormFieldControls = ({
  isEditable,
  label,
  onToggleEdit,
  onSave,
  onCancel,
  disableToggleEdit,
}: IFormFieldControls) => {
  return (
    <div role="group" className="flex gap-2">
      <IconButton
        onClick={!isEditable ? onToggleEdit : onSave}
        ariaLabel={isEditable ? `Save ${label}` : `Edit ${label}`}
        disabled={disableToggleEdit}
      >
        {isEditable ? (
          <CheckIcon title="Save" className="w-6 h-6" />
        ) : (
          <PencilIcon title="Edit" className="w-6 h-6" />
        )}
      </IconButton>
      <IconButton
        onClick={onCancel}
        disabled={!isEditable}
        ariaLabel={`Cancel changes to ${label}`}
      >
        <XMarkIcon title="Cancel" className="w-6 h-6" />
      </IconButton>
    </div>
  );
};

export default FormFieldControls;
