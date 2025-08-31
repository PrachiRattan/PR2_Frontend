// src/components/dashboard/KPICards.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const KpiCard = ({ label, value, sublabel, accent = "primary" }) => (
  <Card elevation={0} className="border rounded-xl">
    <CardContent className="p-5">
      <Typography variant="body2" className="text-slate-600">
        {label}
      </Typography>
      <Box className="mt-2 flex items-end gap-2">
        <Typography variant="h5" className="text-slate-900 font-semibold">
          {value}
        </Typography>
        {sublabel && (
          <Typography
            variant="caption"
            className={`rounded px-2 py-0.5 bg-${accent}-50 text-${accent}-700`}
          >
            {sublabel}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default function KPICards({ stats }) {
  const {
    activeSuppliers = 0,
    productsOfInterest = 0,
    carbonSaved = 0,
    procurementValue = 0,
  } = stats || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Active Suppliers"
        value={activeSuppliers}
        sublabel="This period"
        accent="emerald"
      />
      <KpiCard
        label="Products of Interest"
        value={productsOfInterest}
        sublabel="Tracked"
        accent="blue"
      />
      <KpiCard
        label="Carbon Footprint Saved"
        value={`${carbonSaved.toLocaleString()} kg CO2e`}
        sublabel="+YTD"
        accent="emerald"
      />
      <KpiCard
        label="Total Procurement Value"
        value={`$${(procurementValue / 1_000_000).toFixed(1)}M`}
        sublabel="All time"
        accent="slate"
      />
    </div>
  );
}
