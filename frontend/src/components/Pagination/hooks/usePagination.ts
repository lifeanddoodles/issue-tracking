import { useState } from "react";

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return {
    currentPage,
    setCurrentPage,
  };
};

export default usePagination;
