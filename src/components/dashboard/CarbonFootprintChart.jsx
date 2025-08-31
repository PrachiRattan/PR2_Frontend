// src/components/dashboard/CarbonFootprintChart.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import LineChart from "../common/Charts/LineChart";

export default function CarbonFootprintChart({
  dataMonthly = [],
  dataYearly = [],
}) {
  const [mode, setMode] = React.useState("monthly");
  const data = mode === "monthly" ? dataMonthly : dataYearly;

  const totals = React.useMemo(() => {
    const gen = data.reduce((a, d) => a + (d.generated || 0), 0);
    const sav = data.reduce((a, d) => a + (d.saved || 0), 0);
    return { gen, sav, net: sav - gen };
  }, [data]);

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Typography
            variant="subtitle1"
            className="font-semibold text-slate-900"
          >
            Carbon Footprint Analytics
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={mode}
            exclusive
            onChange={(_, v) => v && setMode(v)}
          >
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="yearly">Yearly</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className="mt-3 flex items-center gap-6">
          <Typography variant="subtitle2" className="text-emerald-600">
            +{totals.sav.toLocaleString()} kg{" "}
            <span className="font-normal">Saved</span>
          </Typography>
          <Typography variant="subtitle2" className="text-rose-600">
            -{totals.gen.toLocaleString()} kg{" "}
            <span className="font-normal">Generated</span>
          </Typography>
        </div>

        <div className="mt-4">
          <LineChart
            data={data}
            xKey="label"
            yUnit=" kg"
            series={[
              { dataKey: "saved", color: "#16a34a", name: "Saved" },
              { dataKey: "generated", color: "#ef4444", name: "Generated" },
            ]}
            height={280}
          />
        </div>
      </CardContent>
    </Card>
  );
}
