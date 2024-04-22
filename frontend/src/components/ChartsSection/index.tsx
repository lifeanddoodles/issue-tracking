import { Fragment, useEffect } from "react";
import { UserRole } from "shared/interfaces";
import useChart from "../../hooks/useChart";
import useFetch from "../../hooks/useFetch";
import { ChartListItemProps, ChartProps } from "../../interfaces";
import Row from "../../layout/Row";
import Heading from "../Heading";

const ChartItem = <T,>({ chart }: { chart: ChartProps<T> }) => {
  const renderedChart = useChart<T>({
    data: chart.data,
    attribute: chart.attribute,
    useCount: chart.useCount,
    labelFrom: chart.labelFrom,
    className: chart.className || "basis-[500px] shrink-0",
  });

  const ChartWithWrapper = chart.title ? (
    <figure>
      <figcaption>{chart.title}</figcaption>
      {renderedChart}
    </figure>
  ) : (
    renderedChart
  );

  return ChartWithWrapper;
};

const ChartsSection = <T,>({
  title,
  data,
  url,
  charts,
  userRole,
}: {
  title?: string;
  data?: T[] | [] | null;
  url?: string;
  charts: ChartListItemProps<T>[];
  userRole?: UserRole;
}) => {
  const { data: fetchedData, loading, error, sendRequest } = useFetch<T[]>();

  const dataForCharts = data || fetchedData;

  useEffect(() => {
    if (data !== null && url) sendRequest({ url });
  }, [data, sendRequest, url]);

  return (
    <>
      {loading && <Heading text={"Loading charts..."} role="status" />}
      {error && <Heading text={error.message} role="status" />}
      {!loading && dataForCharts && dataForCharts?.length === 0 && (
        <Heading text={"No data found"} role="status" />
      )}
      {!loading && dataForCharts && dataForCharts?.length > 0 && (
        <>
          {title && <Heading text={title} />}
          <Row className="flex-wrap">
            {charts?.map((chart) =>
              chart.allowedRoles &&
              !chart.allowedRoles.includes(userRole as UserRole) ? (
                <Fragment key={chart.attribute}></Fragment>
              ) : (
                <ChartItem
                  key={chart.attribute}
                  chart={{ ...chart, data: dataForCharts }}
                />
              )
            )}
          </Row>
        </>
      )}
    </>
  );
};

export default ChartsSection;
