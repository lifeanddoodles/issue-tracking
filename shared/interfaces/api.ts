export type NavigationProps = {
  page: number;
  limit: number;
};

export type PaginationProps = {
  prev?: NavigationProps;
  next?: NavigationProps;
};

export type FormattedResultsProps = {
  success: boolean;
  count: number;
  pagination?: PaginationProps;
  data: unknown;
};
