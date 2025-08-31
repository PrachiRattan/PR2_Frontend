// src/components/scenarios/ComparisonMatrix.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import BarChart from "../common/Charts/BarChart";

export default function ComparisonMatrix({ scenarios = [], onScenarioSelect }) {
  const [selectedMetrics, setSelectedMetrics] = useState([
    "cost",
    "carbon",
    "sustainability",
  ]);

  const metrics = [
    {
      key: "cost",
      label: "Total Cost",
      unit: "$",
      format: (val) => `$${val?.toLocaleString()}`,
    },
    {
      key: "carbon",
      label: "Carbon Footprint",
      unit: "kg CO2e",
      format: (val) => `${val} kg`,
    },
    {
      key: "sustainability",
      label: "Sustainability Score",
      unit: "/10",
      format: (val) => `${val}/10`,
    },
    {
      key: "delivery",
      label: "Avg Delivery Time",
      unit: "days",
      format: (val) => `${val} days`,
    },
    { key: "risk", label: "Risk Level", unit: "", format: (val) => val },
  ];

  const getScoreColor = (value, metric) => {
    switch (metric) {
      case "cost":
        return value < 45000 ? "success" : value < 55000 ? "warning" : "error";
      case "carbon":
        return value < 400 ? "success" : value < 600 ? "warning" : "error";
      case "sustainability":
        return value >= 8 ? "success" : value >= 7 ? "warning" : "error";
      case "delivery":
        return value <= 10 ? "success" : value <= 15 ? "warning" : "error";
      default:
        return "default";
    }
  };

  const getBestPerformer = (metric) => {
    if (scenarios.length === 0) return null;

    const isLowerBetter = ["cost", "carbon", "delivery"].includes(metric);
    return scenarios.reduce((best, scenario) => {
      const currentValue =
        scenario.totalImpact?.[metric] || scenario[metric] || 0;
      const bestValue = best.totalImpact?.[metric] || best[metric] || 0;

      if (isLowerBetter) {
        return currentValue < bestValue ? scenario : best;
      } else {
        return currentValue > bestValue ? scenario : best;
      }
    });
  };

  const chartData = scenarios.map((scenario) => ({
    name: scenario.name,
    cost: (scenario.totalImpact?.cost || 0) / 1000, // Convert to thousands
    carbon: scenario.totalImpact?.carbon || 0,
    sustainability: (scenario.totalImpact?.sustainabilityScore || 0) * 10, // Scale to match other metrics
  }));

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold text-slate-900 mb-4">
          Scenario Comparison Matrix
        </Typography>

        {scenarios.length > 0 ? (
          <Box className="space-y-6">
            {/* Visual Comparison Chart */}
            <Box>
              <Typography variant="subtitle2" className="font-medium mb-3">
                Visual Comparison
              </Typography>
              <BarChart
                data={chartData}
                xKey="name"
                bars={[
                  { dataKey: "cost", name: "Cost ($k)", color: "#ef4444" },
                  {
                    dataKey: "carbon",
                    name: "Carbon (kg CO2e)",
                    color: "#f59e0b",
                  },
                  {
                    dataKey: "sustainability",
                    name: "Sustainability (×10)",
                    color: "#22c55e",
                  },
                ]}
                height={300}
              />
            </Box>

            {/* Detailed Comparison Table */}
            <Box>
              <Typography variant="subtitle2" className="font-medium mb-3">
                Detailed Metrics Comparison
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          className="font-semibold"
                        >
                          SCENARIO
                        </Typography>
                      </TableCell>
                      {metrics.map((metric) => (
                        <TableCell key={metric.key} align="center">
                          <Typography
                            variant="subtitle2"
                            className="font-semibold"
                          >
                            {metric.label.toUpperCase()}
                          </Typography>
                        </TableCell>
                      ))}
                      <TableCell align="center">
                        <Typography
                          variant="subtitle2"
                          className="font-semibold"
                        >
                          CONFIDENCE
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle2"
                          className="font-semibold"
                        >
                          ACTION
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scenarios.map((scenario, index) => (
                      <TableRow key={scenario.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" className="font-medium">
                              {scenario.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="text-slate-500"
                            >
                              Scenario {index + 1}
                            </Typography>
                          </Box>
                        </TableCell>
                        {metrics.map((metric) => {
                          const value =
                            scenario.totalImpact?.[metric.key] ||
                            scenario[metric.key] ||
                            0;
                          const bestPerformer = getBestPerformer(metric.key);
                          const isBest = bestPerformer?.id === scenario.id;

                          return (
                            <TableCell key={metric.key} align="center">
                              <Box className="flex flex-col items-center gap-1">
                                <Typography
                                  variant="body2"
                                  className={
                                    isBest ? "font-bold text-green-600" : ""
                                  }
                                >
                                  {metric.format(value)}
                                </Typography>
                                {isBest && (
                                  <Chip
                                    label="Best"
                                    size="small"
                                    color="success"
                                  />
                                )}
                              </Box>
                            </TableCell>
                          );
                        })}
                        <TableCell align="center">
                          <Chip
                            label="High (90%)"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => onScenarioSelect?.(scenario)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Performance Summary */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Box className="p-4 bg-green-50 rounded-lg">
                <Typography
                  variant="subtitle2"
                  className="font-medium text-green-800"
                >
                  Most Sustainable
                </Typography>
                <Typography variant="h6" className="font-bold text-green-700">
                  {getBestPerformer("sustainability")?.name || "N/A"}
                </Typography>
                <Typography variant="caption" className="text-green-600">
                  Highest sustainability score
                </Typography>
              </Box>

              <Box className="p-4 bg-blue-50 rounded-lg">
                <Typography
                  variant="subtitle2"
                  className="font-medium text-blue-800"
                >
                  Most Cost Effective
                </Typography>
                <Typography variant="h6" className="font-bold text-blue-700">
                  {getBestPerformer("cost")?.name || "N/A"}
                </Typography>
                <Typography variant="caption" className="text-blue-600">
                  Lowest total cost
                </Typography>
              </Box>

              <Box className="p-4 bg-purple-50 rounded-lg">
                <Typography
                  variant="subtitle2"
                  className="font-medium text-purple-800"
                >
                  Lowest Carbon
                </Typography>
                <Typography variant="h6" className="font-bold text-purple-700">
                  {getBestPerformer("carbon")?.name || "N/A"}
                </Typography>
                <Typography variant="caption" className="text-purple-600">
                  Minimal carbon footprint
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className="text-center py-8">
            <Typography variant="body1" className="text-slate-500">
              No scenarios to compare yet
            </Typography>
            <Typography variant="body2" className="text-slate-400 mt-1">
              Create scenarios using the Scenario Builder to see comparisons
              here
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
