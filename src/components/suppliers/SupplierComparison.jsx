// src/components/suppliers/SupplierComparison.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RadarChart from "../common/Charts/RadarChart";

const ComparisonCard = ({ supplier, onRemove }) => (
  <Card elevation={0} className="border rounded-xl">
    <CardContent className="p-4">
      <Box className="flex items-center justify-between mb-3">
        <Box className="flex items-center gap-2">
          <Avatar
            src={supplier.logo}
            alt={supplier.name}
            className="w-10 h-10"
          />
          <Box>
            <Typography variant="subtitle2" className="font-semibold">
              {supplier.name}
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              {supplier.location?.city}, {supplier.location?.country}
            </Typography>
          </Box>
        </Box>
        <Button
          size="small"
          color="error"
          onClick={() => onRemove(supplier.id)}
        >
          Remove
        </Button>
      </Box>

      <Box className="space-y-2">
        <Box className="flex justify-between">
          <Typography variant="caption">Sustainability Score:</Typography>
          <Typography variant="caption" className="font-medium">
            {supplier.sustainabilityScore}/10
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(supplier.sustainabilityScore / 10) * 100}
          className="h-2 rounded"
        />

        <Box className="flex justify-between">
          <Typography variant="caption">Carbon Footprint:</Typography>
          <Typography variant="caption" className="font-medium">
            {supplier.carbonFootprint?.perUnit} kg CO2e
          </Typography>
        </Box>

        <Box className="flex justify-between">
          <Typography variant="caption">Recycled Content:</Typography>
          <Typography variant="caption" className="font-medium">
            {supplier.recyclingContent}%
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function SupplierComparison({
  suppliers = [],
  onRemoveSupplier,
  onAddSupplier,
}) {
  const [selectedSuppliers, setSelectedSuppliers] = useState(
    suppliers.slice(0, 3)
  );

  const handleRemoveSupplier = (supplierId) => {
    const updated = selectedSuppliers.filter((s) => s.id !== supplierId);
    setSelectedSuppliers(updated);
    onRemoveSupplier?.(supplierId);
  };

  const comparisonMetrics = [
    { key: "sustainabilityScore", label: "Sustainability Score", unit: "/10" },
    {
      key: "carbonFootprint.perUnit",
      label: "Carbon Footprint",
      unit: " kg CO2e",
    },
    { key: "recyclingContent", label: "Recycled Content", unit: "%" },
    { key: "renewableEnergyPercent", label: "Renewable Energy", unit: "%" },
    { key: "kpis.onTimeDelivery", label: "On-time Delivery", unit: "%" },
    { key: "kpis.auditScore", label: "Audit Score", unit: "/100" },
    { key: "yearsInOperation", label: "Years in Operation", unit: " years" },
  ];

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((o, i) => o?.[i], obj);
  };

  // Prepare data for radar chart
  const radarData = [
    "Sustainability",
    "Carbon Efficiency",
    "Recycling",
    "Renewable Energy",
    "Delivery Performance",
    "Quality Score",
  ].map((metric, index) => {
    const dataPoint = { metric };
    selectedSuppliers.forEach((supplier, supplierIndex) => {
      let value;
      switch (index) {
        case 0:
          value = supplier.sustainabilityScore;
          break;
        case 1:
          value = Math.max(0, 10 - (supplier.carbonFootprint?.perUnit || 0));
          break;
        case 2:
          value = supplier.recyclingContent / 10;
          break;
        case 3:
          value = supplier.renewableEnergyPercent / 10;
          break;
        case 4:
          value = (supplier.kpis?.onTimeDelivery || 0) / 10;
          break;
        case 5:
          value = (supplier.kpis?.auditScore || 0) / 10;
          break;
        default:
          value = 0;
      }
      dataPoint[`supplier${supplierIndex}`] = Math.min(10, Math.max(0, value));
    });
    return dataPoint;
  });

  const radarSeries = selectedSuppliers.map((supplier, index) => ({
    dataKey: `supplier${index}`,
    name: supplier.name,
    color: `hsl(${(index * 120) % 360}, 70%, 50%)`,
  }));

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between">
        <Typography variant="h6" className="font-semibold">
          Supplier Comparison ({selectedSuppliers.length}/4)
        </Typography>
        {selectedSuppliers.length < 4 && (
          <Button variant="outlined" onClick={onAddSupplier}>
            Add Supplier
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {selectedSuppliers.map((supplier) => (
          <Grid item xs={12} md={6} lg={4} key={supplier.id}>
            <ComparisonCard
              supplier={supplier}
              onRemove={handleRemoveSupplier}
            />
          </Grid>
        ))}
      </Grid>

      {selectedSuppliers.length >= 2 && (
        <>
          <Typography variant="h6" className="font-semibold">
            Performance Comparison
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card elevation={0} className="border rounded-xl">
                <CardContent className="p-4">
                  <Typography
                    variant="subtitle2"
                    className="font-semibold mb-3"
                  >
                    Detailed Metrics Comparison
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Metric</strong>
                          </TableCell>
                          {selectedSuppliers.map((supplier) => (
                            <TableCell key={supplier.id} align="center">
                              <strong>{supplier.name}</strong>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {comparisonMetrics.map((metric) => (
                          <TableRow key={metric.key}>
                            <TableCell>{metric.label}</TableCell>
                            {selectedSuppliers.map((supplier) => (
                              <TableCell key={supplier.id} align="center">
                                {getNestedValue(supplier, metric.key) || "N/A"}
                                {metric.unit}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card elevation={0} className="border rounded-xl">
                <CardContent className="p-4">
                  <Typography
                    variant="subtitle2"
                    className="font-semibold mb-3"
                  >
                    Performance Radar
                  </Typography>
                  <RadarChart
                    data={radarData}
                    categoryKey="metric"
                    series={radarSeries}
                    height={280}
                    max={10}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
