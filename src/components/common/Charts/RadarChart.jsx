// src/components/common/Charts/RadarChart.jsx
import {
  Radar,
  RadarChart as RRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RadarChart({
  data = [],
  categoryKey = "metric",
  series = [{ dataKey: "score", name: "Score", color: "#3b82f6" }],
  height = 320,
  max = 10,
}) {
  if (!data?.length) {
    return (
      <div className="h-[320px] flex items-center justify-center text-slate-500 border rounded">
        No data
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <RRadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey={categoryKey} />
          <PolarRadiusAxis angle={30} domain={[0, max]} />
          <Tooltip />
          <Legend />
          {series.map((s) => (
            <Radar
              key={s.dataKey}
              name={s.name}
              dataKey={s.dataKey}
              stroke={s.color}
              fill={s.color}
              fillOpacity={0.35}
            />
          ))}
        </RRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
