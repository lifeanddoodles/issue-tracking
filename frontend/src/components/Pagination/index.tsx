import NavControls from "./NavControls";

const Pagination = ({
  currentPage,
  total,
  limit = 10,
  onClick,
}: {
  currentPage: number;
  total: number;
  limit?: number;
  onClick: (arg: number) => void;
}) => {
  return (
    <NavControls
      currentPage={currentPage}
      limit={limit}
      total={total}
      onClick={onClick}
    />
  );
};

export default Pagination;
