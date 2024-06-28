import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Button from "../../components/Button";
import ResourcesNavigation from "../../components/ResourcesNavigation";

const FullHeightWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="absolute left-0 top-0 z-10 px-4 py-2 flex flex-col h-full w-full gap-4 bg-neutral-100">
      {children}
    </aside>
  );
};

const MobileResourcesNavigation = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const mobileClasses = "flex flex-col gap-4";
  const [currentYPosition, setCurrentYPosition] = useState(0);
  const body = document.querySelector("body");
  const appRoot = document.getElementById("root");

  const handleOnClick = useCallback(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [setIsOpen]);

  const scrollToPrevPosition = useCallback(() => {
    window.scrollTo(0, currentYPosition);
  }, [currentYPosition]);

  const handleRemoveMobileMenu = useCallback(() => {
    const mobileNav = document.getElementById("mobile-navigation");
    if (mobileNav) {
      mobileNav.remove();
    }
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsOpen(false);
    handleRemoveMobileMenu();
    body?.classList.remove("overflow-hidden", "max-h-screen");
    appRoot?.classList.remove("overflow-hidden", "max-h-screen");
    appRoot?.removeAttribute("tabindex");
    scrollToPrevPosition();
  }, [
    appRoot,
    body?.classList,
    handleRemoveMobileMenu,
    setIsOpen,
    scrollToPrevPosition,
  ]);

  useEffect(() => {
    if (isOpen) {
      setCurrentYPosition(window.scrollY);
      body?.classList.add("overflow-hidden", "max-h-screen");
      appRoot?.classList.add("overflow-hidden", "max-h-screen");
      appRoot?.setAttribute("tabindex", "-1");
    }
  }, [isOpen, handleRemoveMobileMenu, body?.classList, appRoot]);

  return (
    <>
      {isOpen &&
        createPortal(
          <FullHeightWrapper>
            <Button
              className="self-end"
              onClick={handleCloseMobileMenu}
              ariaLabel="Close menu"
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>
            <div className="flex-1 overflow-y-auto">
              <ResourcesNavigation
                className={mobileClasses}
                id="mobile-navigation"
                onClick={handleOnClick}
              />
            </div>
          </FullHeightWrapper>,
          document.body
        )}
    </>
  );
};

export default MobileResourcesNavigation;
