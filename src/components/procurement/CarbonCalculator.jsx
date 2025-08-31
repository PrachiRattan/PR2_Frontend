// src/components/procurement/CarbonCalculator.jsx
import { useState, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";

export default function CarbonCalculator({
  currentSupplier,
  alternativeSuppliers = [],
  quantity = 1000,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(null);

  const calculations = useMemo(() => {
    if (!currentSupplier || !selectedAlternative) {
      return {
        currentEmissions: 0,
        projectedEmissions: 0,
        savings: 0,
        savingsPercentage: 0,
      };
    }

    const currentEmissions =
      (currentSupplier.carbonFootprint?.perUnit || 0) * quantity;
    const projectedEmissions =
      (selectedAlternative.carbonFootprint?.perUnit || 0) * quantity;
    const savings = currentEmissions - projectedEmissions;
    const savingsPercentage =
      currentEmissions > 0 ? (savings / currentEmissions) * 100 : 0;

    return {
      currentEmissions,
      projectedEmissions,
      savings,
      savingsPercentage,
    };
  }, [currentSupplier, selectedAlternative, quantity]);

  return (
    <Card elevation={0} className="border rounded-xl bg-emerald-50">
      <CardContent className="p-6">
        <Typography
          variant="h6"
          className="font-semibold text-emerald-800 mb-2"
        >
          Carbon Savings Calculator
        </Typography>

        <Box className="text-center mb-4">
          <Typography variant="caption" className="text-emerald-600">
            Estimated Carbon Savings
          </Typography>
          <Typography variant="h3" className="font-bold text-emerald-700">
            {Math.abs(calculations.savings).toLocaleString()}
          </Typography>
          <Typography variant="body2" className="text-emerald-600">
            kg CO2e
          </Typography>
        </Box>

        {calculations.savings > 0 && (
          <Box className="space-y-3">
            <Box className="flex justify-between items-center">
              <Typography variant="body2" className="text-slate-700">
                Current Emissions
              </Typography>
              <Typography variant="body2" className="font-medium">
                {calculations.currentEmissions.toLocaleString()} kg CO2e
              </Typography>
            </Box>

            <Box className="flex justify-between items-center">
              <Typography variant="body2" className="text-slate-700">
                Projected Emissions
              </Typography>
              <Typography variant="body2" className="font-medium">
                {calculations.projectedEmissions.toLocaleString()} kg CO2e
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, calculations.savingsPercentage))}
              className="h-2 rounded"
              color="success"
            />

            <Box className="flex justify-center">
              <Chip
                label={`${calculations.savingsPercentage.toFixed(
                  1
                )}% Reduction`}
                color="success"
                size="small"
              />
            </Box>
          </Box>
        )}

        {alternativeSuppliers.length > 0 && (
          <Box className="mt-4">
            <Typography variant="subtitle2" className="font-medium mb-2">
              Compare with Suppliers:
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {alternativeSuppliers.map((supplier) => (
                <Chip
                  key={supplier.id}
                  label={supplier.name}
                  onClick={() => setSelectedAlternative(supplier)}
                  color={
                    selectedAlternative?.id === supplier.id
                      ? "primary"
                      : "default"
                  }
                  variant={
                    selectedAlternative?.id === supplier.id
                      ? "filled"
                      : "outlined"
                  }
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
