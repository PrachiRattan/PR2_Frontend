// src/components/common/Charts/PieChart.jsx
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const defaultColors = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#0ea5e9",
  "#14b8a6",
];

export default function PieChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  height = 280,
  innerRadius = 60,
  outerRadius = 90,
  colors = defaultColors,
}) {
  if (!data?.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-500 border rounded">
        No data
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <RPieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            padAngle={2}
            cornerRadius={6}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </RPieChart>
      </ResponsiveContainer>
    </div>
  );
}
