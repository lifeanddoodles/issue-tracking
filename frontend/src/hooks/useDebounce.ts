import { useEffect, useRef, useState } from "react";

const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue as T;
};

export default useDebounce;
