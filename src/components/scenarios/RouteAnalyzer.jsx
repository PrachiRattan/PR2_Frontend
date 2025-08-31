// src/components/scenarios/RouteAnalyzer.jsx
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

const transportModes = [
  { value: "sea", label: "Sea", emission: 0.008, cost: 0.5, time: 72 },
  { value: "rail", label: "Rail", emission: 0.025, cost: 1.5, time: 48 },
  { value: "truck", label: "Truck", emission: 0.1, cost: 2.0, time: 24 },
  { value: "air", label: "Air", emission: 0.6, cost: 5.0, time: 6 },
];

export default function RouteAnalyzer({
  suppliers = [],
  selectedRoute,
  onRouteChange,
}) {
  const [transportMode, setTransportMode] = useState("sea");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (suppliers.length > 0) {
      analyzeRoutes();
    }
  }, [suppliers, transportMode]);

  const calculateDistance = (location) => {
    // Mock distance calculation based on region
    const distanceMap = {
      "North America": 800,
      Europe: 1200,
      Asia: 8000,
      "South America": 6000,
      Africa: 7000,
      Oceania: 9000,
    };
    return distanceMap[location?.region] || 1000;
  };

  const analyzeRoutes = () => {
    const mode = transportModes.find((m) => m.value === transportMode);

    const routes = suppliers
      .map((supplier) => {
        const distance = calculateDistance(supplier.location);
        const weight = 10; // Assume 10 tons for calculation

        return {
          supplierId: supplier.id,
          supplierName: supplier.name,
          origin: `${supplier.location?.city}, ${supplier.location?.country}`,
          distance,
          mode: transportMode,
          carbonEmission: distance * weight * mode.emission,
          cost: distance * weight * mode.cost,
          timeHours: mode.time + (distance / 1000) * 2, // Additional time for long distances
          efficiency: (1000 / (mode.emission * distance)) * 100, // Efficiency score
        };
      })
      .sort((a, b) => a.carbonEmission - b.carbonEmission);

    setAnalysis({ routes, mode });
  };

  const getEmissionColor = (emission) => {
    if (emission < 50) return "success";
    if (emission < 150) return "warning";
    return "error";
  };

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold text-slate-900 mb-4">
          Route & Transport Analyzer
        </Typography>

        <Box className="mb-4">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Transport Mode</InputLabel>
                <Select
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value)}
                  label="Transport Mode"
                >
                  {transportModes.map((mode) => (
                    <MenuItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              {analysis?.mode && (
                <Box className="space-y-2">
                  <Typography variant="body2" className="text-slate-600">
                    Selected Mode: <strong>{analysis.mode.label}</strong>
                  </Typography>
                  <Typography variant="caption" className="text-slate-500">
                    Emission Factor: {analysis.mode.emission} kg CO2e per ton-km
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Interactive Map Placeholder */}
        <Box className="mb-4 h-64 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden">
          {/* Mock map visualization */}
          <Box className="absolute inset-0 flex items-center justify-center">
            <Box className="w-full h-full relative">
              {/* Central warehouse point */}
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
                <Typography
                  variant="caption"
                  className="absolute -bottom-6 -left-8 text-xs font-medium text-slate-700"
                >
                  Central DC
                </Typography>
              </Box>

              {/* Supplier points */}
              {analysis?.routes.slice(0, 3).map((route, index) => (
                <Box
                  key={route.supplierId}
                  className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-md ${
                    index === 0
                      ? "bg-green-500 top-1/4 right-1/4"
                      : index === 1
                      ? "bg-yellow-500 top-3/4 left-1/4"
                      : "bg-red-500 top-1/3 right-2/3"
                  }`}
                >
                  <Typography
                    variant="caption"
                    className="absolute -bottom-6 -left-4 text-xs font-medium text-slate-700"
                  >
                    {route.supplierName.slice(0, 8)}
                  </Typography>

                  {/* Route line */}
                  <Box
                    className={`absolute w-px h-16 transform rotate-45 origin-center ${
                      index === 0
                        ? "bg-green-400"
                        : index === 1
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    } opacity-50`}
                  ></Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md">
            <Typography variant="caption" className="font-medium">
              Transport Analysis Map
            </Typography>
          </Box>
        </Box>

        {/* Route Analysis Results */}
        <Box className="space-y-3">
          <Box className="flex justify-between items-center">
            <Typography variant="subtitle2" className="font-medium">
              Route Analysis Results
            </Typography>
            <Chip
              label={`${analysis?.routes.length || 0} Routes Analyzed`}
              size="small"
            />
          </Box>

          {analysis?.routes.slice(0, 5).map((route, index) => (
            <Box key={route.supplierId} className="p-3 bg-slate-50 rounded-lg">
              <Box className="flex justify-between items-start mb-2">
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {route.supplierName}
                  </Typography>
                  <Typography variant="caption" className="text-slate-500">
                    {route.origin} → Central DC
                  </Typography>
                </Box>
                <Chip
                  label={`Rank #${index + 1}`}
                  size="small"
                  color={
                    index === 0
                      ? "success"
                      : index === 1
                      ? "warning"
                      : "default"
                  }
                />
              </Box>

              <Grid container spacing={2} className="text-sm">
                <Grid item xs={3}>
                  <Typography variant="caption" className="text-slate-600">
                    Distance
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {route.distance.toLocaleString()} km
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption" className="text-slate-600">
                    Carbon Impact
                  </Typography>
                  <Box className="flex items-center gap-1">
                    <Typography variant="body2" className="font-medium">
                      {route.carbonEmission.toFixed(0)} kg CO2e
                    </Typography>
                    <Chip
                      size="small"
                      label={
                        getEmissionColor(route.carbonEmission) === "success"
                          ? "Low"
                          : getEmissionColor(route.carbonEmission) === "warning"
                          ? "Medium"
                          : "High"
                      }
                      color={getEmissionColor(route.carbonEmission)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption" className="text-slate-600">
                    Est. Cost
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    ${route.cost.toFixed(0)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="caption" className="text-slate-600">
                    Transit Time
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {Math.round(route.timeHours)}h
                  </Typography>
                </Grid>
              </Grid>

              <Box className="mt-2">
                <Box className="flex justify-between text-xs mb-1">
                  <span>Route Efficiency</span>
                  <span>{route.efficiency.toFixed(0)}%</span>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, route.efficiency)}
                  color={
                    route.efficiency > 80
                      ? "success"
                      : route.efficiency > 60
                      ? "warning"
                      : "error"
                  }
                  className="h-2 rounded"
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
