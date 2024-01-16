import { useCallback, useState } from "react";

const useFormFieldControls = () => {
  const [isEditable, setIsEditable] = useState(false);

  const onToggleEdit = useCallback(() => {
    setIsEditable((prev) => !prev);
  }, [setIsEditable]);

  return {
    isEditable,
    setIsEditable,
    onToggleEdit,
  };
};

export default useFormFieldControls;
