import { useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce";

export const useResponsive = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  const debouncedWidth = useDebounce(width, 300);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isExtraSmall = useMemo(() => debouncedWidth <= 640, [debouncedWidth]);
  const isMobile = useMemo(
    () => debouncedWidth > 640 && debouncedWidth <= 768,
    [debouncedWidth]
  );
  const isTablet = useMemo(
    () => debouncedWidth > 768 && debouncedWidth <= 1024,
    [debouncedWidth]
  );
  const isDesktop = useMemo(() => debouncedWidth > 1024, [debouncedWidth]);

  return {
    isExtraSmall,
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default useResponsive;
