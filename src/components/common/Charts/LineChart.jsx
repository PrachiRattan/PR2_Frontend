// src/components/common/Charts/LineChart.jsx
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function LineChart({
  data = [],
  xKey = "label",
  series = [
    { dataKey: "generated", color: "#ef4444", name: "Generated" },
    { dataKey: "saved", color: "#22c55e", name: "Saved" },
  ],
  height = 300,
  yUnit = "",
  showGrid = true,
  showLegend = true,
  referenceZero = true,
}) {
  if (!data?.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500 border rounded">
        No data
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <RLineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis tickFormatter={(v) => `${v}${yUnit}`} />
          <Tooltip formatter={(value) => [`${value}${yUnit}`, ""]} />
          {showLegend && <Legend />}
          {referenceZero && <ReferenceLine y={0} stroke="#94a3b8" />}
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}
