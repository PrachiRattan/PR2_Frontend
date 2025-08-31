// src/components/dashboard/SupplierOverview.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

const SupplierPill = ({ supplier }) => (
  <Card elevation={0} className="border rounded-xl min-w-[180px]">
    <CardContent className="p-4 flex items-center gap-3">
      <Avatar src={supplier.logo} alt={supplier.name} className="w-10 h-10" />
      <Box className="flex-1">
        <Typography
          variant="body2"
          className="text-slate-900 font-medium truncate"
        >
          {supplier.name}
        </Typography>
        <div className="flex items-center gap-2">
          <Typography variant="caption" className="text-slate-500">
            Score:
          </Typography>
          <Typography variant="caption" className="text-slate-700">
            {supplier.sustainabilityScore}
          </Typography>
        </div>
      </Box>
    </CardContent>
  </Card>
);

export default function SupplierOverview({ suppliers = [] }) {
  const top = [...suppliers]
    .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
    .slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {top.map((s) => (
          <SupplierPill key={s.id} supplier={s} />
        ))}
      </div>
    </div>
  );
}
