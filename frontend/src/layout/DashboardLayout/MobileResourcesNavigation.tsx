import { XMarkIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useCallback } from "react";
import { createPortal } from "react-dom";
import Button from "../../components/Button";
import ResourcesNavigation from "../../components/ResourcesNavigation";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

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
  const { onDisableLockNavigation, onDisableLock } = useLockBodyScroll({
    isOpen,
    setIsOpen,
  });

  const handleRemoveMobileMenu = useCallback(() => {
    const mobileNav = document.getElementById("mobile-navigation");
    if (mobileNav) {
      mobileNav.remove();
    }
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    handleRemoveMobileMenu();
    onDisableLock();
  }, [handleRemoveMobileMenu, onDisableLock]);

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
                onClick={onDisableLockNavigation}
              />
            </div>
          </FullHeightWrapper>,
          document.body
        )}
    </>
  );
};

export default MobileResourcesNavigation;
