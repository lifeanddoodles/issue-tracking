import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type Dimensions = {
  width: number;
  height: number;
};

type UseDimensionsProps<T extends HTMLElement> = {
  elementRef: RefObject<T>;
  dimensions: Dimensions;
  setIsReady: Dispatch<SetStateAction<boolean>>;
};

/**
 * Custom hook that returns the dimensions of a specific HTMLElement.
 *
 * @return {Object} An object containing a reference to the element and its dimensions.
 */
const useDimensions = <T extends HTMLElement>(): UseDimensionsProps<T> => {
  const elementRef = useRef<T>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const setDimensionsFromRef = () => {
      if (elementRef.current && isReady) {
        setDimensions({
          width: elementRef.current.offsetWidth,
          height: elementRef.current.offsetHeight,
        });
      }
    };

    setDimensionsFromRef();

    window.addEventListener("resize", setDimensionsFromRef);

    return () => {
      window.removeEventListener("resize", setDimensionsFromRef);
    };
  }, [elementRef, isReady]);

  return {
    elementRef,
    dimensions,
    setIsReady,
  };
};

export default useDimensions;
