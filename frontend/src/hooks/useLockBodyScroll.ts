import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

const useLockBodyScroll = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [currentYPosition, setCurrentYPosition] = useState(0);
  const body = document.querySelector("body");
  const appRoot = document.getElementById("root");

  const scrollToPrevPosition = useCallback(() => {
    window.scrollTo(0, currentYPosition);
  }, [currentYPosition]);

  const addLockScrollAttributes = useCallback(() => {
    body?.classList.add("overflow-hidden", "max-h-screen");
    appRoot?.classList.add("overflow-hidden", "max-h-screen");
    appRoot?.setAttribute("tabindex", "-1");
  }, [appRoot, body?.classList]);

  const removeLockScrollAttributes = useCallback(() => {
    body?.classList.remove("overflow-hidden", "max-h-screen");
    appRoot?.classList.remove("overflow-hidden", "max-h-screen");
    appRoot?.removeAttribute("tabindex");
  }, [appRoot, body?.classList]);

  const handleDisableLockScrollOnNavigation = useCallback(() => {
    setIsOpen(false);
    removeLockScrollAttributes();
    window.scrollTo(0, 0);
  }, [removeLockScrollAttributes, setIsOpen]);

  const handleDisableLockScroll = useCallback(() => {
    setIsOpen(false);
    removeLockScrollAttributes();
    scrollToPrevPosition();
  }, [removeLockScrollAttributes, setIsOpen, scrollToPrevPosition]);

  useEffect(() => {
    if (isOpen) {
      setCurrentYPosition(window.scrollY);
      addLockScrollAttributes();
    }
  }, [addLockScrollAttributes, isOpen]);

  return {
    onDisableLockNavigation: handleDisableLockScrollOnNavigation,
    onDisableLock: handleDisableLockScroll,
  };
};

export default useLockBodyScroll;
