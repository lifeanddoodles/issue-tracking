import { useCallback, useEffect, useState } from "react";
import { PieChart } from "../components/PieChart";
import { ChartDataItemProps, ChartProps } from "../interfaces";

type NameLabel = "firstName" | "name";

type DataItem = {
  [label in NameLabel]: string;
} & {
  _id: string;
  [key: string]: unknown;
};

const useChart = <T,>({
  data,
  attribute,
  width = 500,
  height = 300,
  className,
  useCount = true,
}: ChartProps<T>) => {
  const [chartData, setChartData] = useState<ChartDataItemProps[] | []>([]);

  const getChartData = useCallback(() => {
    if (!data) return;

    const extractValue = (value: string | DataItem) => {
      if (typeof value === "object" && value && "_id" in value) {
        const label: NameLabel = "firstName" in value ? "firstName" : "name";
        return value[label] as string;
      } else if (Array.isArray(value) && useCount) {
        return value.length;
      }
      return value as string;
    };

    const tempChartData: Record<string, number> = {};

    Object.values(data).forEach((item) => {
      Object.entries(item as Record<string, string | DataItem>).forEach(
        ([key, value]) => {
          if (key === attribute) {
            if (Array.isArray(value)) {
              return value.map(
                (v) =>
                  (tempChartData[!useCount ? v : item["name" as keyof T]] =
                    (tempChartData[!useCount ? v : item["name" as keyof T]] ||
                      0) + 1)
              );
            }

            const extractedValue = extractValue(value);
            tempChartData[extractedValue] =
              (tempChartData[extractedValue] || 0) + 1;
          }
        }
      );
    });

    const formattedChartData = Object.entries(tempChartData).map(
      ([key, value]) => {
        return { name: key || "N/A", value };
      }
    );

    setChartData(formattedChartData);
  }, [data, attribute, useCount]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

  return (
    <PieChart
      data={chartData}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default useChart;
