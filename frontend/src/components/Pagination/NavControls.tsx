import { useMemo } from "react";
import Row from "../../layout/Row";
import Button from "../Button";

const NavControls = ({
  currentPage,
  total,
  limit,
  onClick,
}: {
  currentPage: number;
  total: number;
  limit: number;
  onClick: (arg: number) => void;
}) => {
  const totalPages = useMemo(() => Math.ceil(total / limit), [limit, total]);

  const handleClick = (page: number) => {
    if (page <= totalPages && page > 0) {
      onClick(page);
    }
  };

  return (
    <Row
      className="justify-center flex-row gap-2"
      as="nav"
      aria-label="Pagination"
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <Button
          key={index}
          onClick={() => handleClick(index + 1)}
          variant={currentPage === index + 1 ? "primary" : "transparent"}
        >
          {index + 1}
        </Button>
      ))}
    </Row>
  );
};

export default NavControls;
