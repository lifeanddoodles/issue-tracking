import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

export const useResponsive = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  const debouncedHandleWindowSizeChange = useDebounce(
    handleWindowSizeChange,
    300
  );

  useEffect(() => {
    window.addEventListener("resize", debouncedHandleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", debouncedHandleWindowSizeChange);
    };
  }, [debouncedHandleWindowSizeChange]);

  const isExtraSmall = width <= 640;
  const isMobile = width <= 768;
  const isTablet = width <= 1024;
  const isDesktop = width > 1024;

  return { isExtraSmall, isMobile, isTablet, isDesktop };
};

export default useResponsive;
