import * as d3 from "d3";
import { useMemo, useRef } from "react";
import { removeDashes, toTitleCase } from "../../utils";
import styles from "./pie-chart.module.css";

type DataItem = {
  name: string;
  value: number;
};
type PieChartProps = {
  width: number;
  height: number;
  data: DataItem[];
  className?: string;
};

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLECTION_PADDING = 10; // space between donut and label inflection point

const colors = [
  "#1E40AF",
  "#AB38A4",
  "#F14985",
  "#FF7E64",
  "#FFBC54",
  "#F9F871",
  "#5260D5",
  "#CB58C2",
  "#FF629A",
  "#FF8D72",
  "#FFC45C",
];

export const PieChart = ({ width, height, data, className }: PieChartProps) => {
  const ref = useRef<SVGGElement | null>(null);

  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;

  const pie = useMemo(() => {
    const pieGenerator = d3.pie<unknown, DataItem>().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  const arcGenerator = d3.arc();

  const shapes = pie.map((grp, i) => {
    // First arc is for the Pie
    const sliceInfo = {
      innerRadius: 0,
      outerRadius: radius,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const centroid = arcGenerator.centroid(sliceInfo);
    const slicePath = arcGenerator(sliceInfo);

    // Second arc is for the legend inflection point
    const inflectionInfo = {
      innerRadius: radius + INFLECTION_PADDING,
      outerRadius: radius + INFLECTION_PADDING,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const inflectionPoint = arcGenerator.centroid(inflectionInfo);

    const isRightLabel = inflectionPoint[0] > 0;
    const labelPosX = inflectionPoint[0] + 10 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";
    const label = grp.data.name + " (" + grp.value + ")";

    return (
      <g
        key={i}
        className={styles.slice}
        onMouseEnter={() => {
          if (ref.current) {
            ref.current.classList?.add(styles.hasHighlight);
          }
        }}
        onMouseLeave={() => {
          if (ref.current) {
            ref.current.classList.remove(styles.hasHighlight);
          }
        }}
      >
        <path d={slicePath!} fill={colors[i]} />
        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflectionPoint[0]}
          y2={inflectionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <line
          x1={inflectionPoint[0]}
          y1={inflectionPoint[1]}
          x2={labelPosX}
          y2={inflectionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <text
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={inflectionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={12}
          lengthAdjust={"spacingAndGlyphs"}
        >
          {toTitleCase(removeDashes(label))}
        </text>
      </g>
    );
  });

  return (
    <svg
      width={width}
      height={height}
      style={{ display: "inline-block" }}
      className={className}
    >
      <g
        transform={`translate(${width / 2}, ${height / 2})`}
        className={styles.container}
        ref={ref}
      >
        {shapes}
      </g>
    </svg>
  );
};
