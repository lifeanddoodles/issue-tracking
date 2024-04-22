import { UserRole } from "../../../shared/interfaces";

export type ChartDataItemProps = {
  name: string;
  value: number;
};

export type ChartProps<T> = {
  data: T[] | [] | null;
  attribute: string;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  useCount?: boolean;
  labelFrom?: string;
};

export type ChartListItemProps<T> = Omit<ChartProps<T>, "data"> & {
  allowedRoles?: UserRole[];
  query?: string;
};
