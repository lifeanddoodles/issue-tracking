import { Fragment, useEffect } from "react";
import { UserRole } from "shared/interfaces";
import useChart from "../../hooks/useChart";
import useDimensions from "../../hooks/useDimensions";
import useFetch from "../../hooks/useFetch";
import useResponsive from "../../hooks/useResponsive";
import { ChartListItemProps, ChartProps } from "../../interfaces";
import Row from "../../layout/Row";
import Heading from "../Heading";

type ChartListProps<T> = {
  title?: string;
  data?: T[] | [] | null;
  url?: string;
  charts: ChartListItemProps<T>[];
  userRole?: UserRole;
};

const ChartItem = <T,>({ chart }: { chart: ChartProps<T> }) => {
  // const currentWidth = useMemo(() => chart.width, [chart.width]);
  const renderedChart = useChart<T>({
    data: chart.data,
    attribute: chart.attribute,
    useCount: chart.useCount,
    labelFrom: chart.labelFrom,
    className: chart.className || "shrink-0",
    width: chart.width,
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
}: ChartListProps<T>) => {
  const { data: fetchedData, loading, error, sendRequest } = useFetch<T[]>();
  const { elementRef, dimensions, setIsReady } =
    useDimensions<HTMLDivElement>();
  const { isMobile } = useResponsive();

  const dataForCharts = data || fetchedData;

  useEffect(() => {
    if (data !== null && url) sendRequest({ url });
  }, [data, sendRequest, url]);

  useEffect(() => {
    if (!loading && dataForCharts && dataForCharts?.length > 0) {
      setIsReady(true);
    }
  }, [dataForCharts, loading, setIsReady]);

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
          <Row className="flex-wrap" ref={elementRef}>
            {charts?.map((chart) =>
              chart.allowedRoles &&
              !chart.allowedRoles.includes(userRole as UserRole) ? (
                <Fragment key={chart.attribute}></Fragment>
              ) : (
                <ChartItem
                  key={chart.attribute}
                  chart={{
                    ...chart,
                    data: dataForCharts,
                    width: isMobile ? dimensions.width : dimensions.width / 2,
                  }}
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
