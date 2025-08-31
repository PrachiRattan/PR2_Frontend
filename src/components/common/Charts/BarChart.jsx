// src/components/common/Charts/BarChart.jsx
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BarChart({
  data = [],
  xKey = "label",
  bars = [{ dataKey: "value", color: "#3b82f6", name: "Value" }],
  stacked = false,
  height = 300,
  yUnit = "",
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
        <RBarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis tickFormatter={(v) => `${v}${yUnit}`} />
          <Tooltip formatter={(value) => [`${value}${yUnit}`, ""]} />
          <Legend />
          {bars.map((b, idx) => (
            <Bar
              key={b.dataKey}
              dataKey={b.dataKey}
              name={b.name}
              stackId={stacked ? "a" : undefined}
              fill={b.color || `hsl(${(idx * 57) % 360} 80% 50%)`}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
