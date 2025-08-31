// src/components/scenarios/ImpactSimulator.jsx
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

export default function ImpactSimulator({
  baselineScenario,
  onSimulationChange,
}) {
  const [parameters, setParameters] = useState({
    quantity: 1000,
    sustainabilityWeight: 30,
    costWeight: 25,
    deliveryWeight: 20,
    riskWeight: 25,
    carbonReductionTarget: 15,
    budgetConstraint: 50000,
  });

  const [simulation, setSimulation] = useState({
    projectedCost: 0,
    projectedCarbon: 0,
    projectedSustainability: 0,
    tradeOffs: [],
    confidence: 0,
    recommendations: [],
  });

  useEffect(() => {
    runSimulation();
  }, [parameters, baselineScenario]);

  const runSimulation = () => {
    if (!baselineScenario) return;

    // Mock simulation calculations
    const quantityMultiplier = parameters.quantity / 1000;
    const baseCost = 45000;
    const baseCarbon = 500;
    const baseSustainability = 7.5;

    // Apply parameter influences
    const costInfluence = (parameters.costWeight / 100) * 0.8;
    const carbonInfluence = (parameters.sustainabilityWeight / 100) * 0.7;
    const sustainabilityBonus = (parameters.sustainabilityWeight / 100) * 1.2;

    const projectedCost = Math.round(
      baseCost * quantityMultiplier * (1 - costInfluence)
    );
    const projectedCarbon = Math.round(
      baseCarbon * quantityMultiplier * (1 - carbonInfluence)
    );
    const projectedSustainability = Math.min(
      10,
      baseSustainability * (1 + sustainabilityBonus)
    );

    // Calculate trade-offs
    const tradeOffs = [
      {
        aspect: "Cost vs Sustainability",
        impact:
          parameters.sustainabilityWeight > parameters.costWeight
            ? "Higher cost for better sustainability"
            : "Lower cost with sustainability trade-offs",
        severity:
          Math.abs(parameters.sustainabilityWeight - parameters.costWeight) /
          100,
      },
      {
        aspect: "Speed vs Carbon",
        impact:
          parameters.deliveryWeight > parameters.sustainabilityWeight
            ? "Faster delivery with higher emissions"
            : "Slower delivery for carbon reduction",
        severity:
          Math.abs(
            parameters.deliveryWeight - parameters.sustainabilityWeight
          ) / 100,
      },
    ];

    // Calculate confidence based on parameter balance
    const weightBalance =
      Math.abs(
        100 -
          (parameters.sustainabilityWeight +
            parameters.costWeight +
            parameters.deliveryWeight +
            parameters.riskWeight)
      ) / 100;
    const confidence = Math.max(0.1, 1 - weightBalance);

    const recommendations = generateRecommendations();

    setSimulation({
      projectedCost,
      projectedCarbon,
      projectedSustainability,
      tradeOffs,
      confidence,
      recommendations,
    });

    onSimulationChange?.({
      parameters,
      results: {
        projectedCost,
        projectedCarbon,
        projectedSustainability,
        confidence,
      },
    });
  };

  const generateRecommendations = () => {
    const recs = [];

    if (parameters.sustainabilityWeight < 25) {
      recs.push({
        type: "sustainability",
        message:
          "Consider increasing sustainability weight for better environmental impact",
        impact: "Could reduce carbon footprint by 10-15%",
      });
    }

    if (parameters.costWeight > 40) {
      recs.push({
        type: "cost",
        message: "High cost focus may compromise sustainability goals",
        impact: "Balance with sustainability for long-term value",
      });
    }

    if (simulation.projectedCarbon > parameters.carbonReductionTarget * 10) {
      recs.push({
        type: "carbon",
        message: "Current parameters may not meet carbon reduction target",
        impact: "Adjust sustainability weight or supplier selection",
      });
    }

    return recs;
  };

  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const resetParameters = () => {
    setParameters({
      quantity: 1000,
      sustainabilityWeight: 30,
      costWeight: 25,
      deliveryWeight: 20,
      riskWeight: 25,
      carbonReductionTarget: 15,
      budgetConstraint: 50000,
    });
  };

  const getImpactColor = (value, threshold) => {
    if (value <= threshold * 0.8) return "success";
    if (value <= threshold) return "warning";
    return "error";
  };

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold text-slate-900 mb-4">
          Impact Simulator
        </Typography>

        <Box className="space-y-6">
          {/* Parameter Controls */}
          <Box>
            <Typography variant="subtitle2" className="font-medium mb-3">
              Simulation Parameters
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" className="mb-2">
                    Quantity: {parameters.quantity.toLocaleString()} units
                  </Typography>
                  <Slider
                    value={parameters.quantity}
                    onChange={(_, value) =>
                      handleParameterChange("quantity", value)
                    }
                    min={100}
                    max={5000}
                    step={100}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" className="mb-2">
                    Carbon Reduction Target: {parameters.carbonReductionTarget}%
                  </Typography>
                  <Slider
                    value={parameters.carbonReductionTarget}
                    onChange={(_, value) =>
                      handleParameterChange("carbonReductionTarget", value)
                    }
                    min={5}
                    max={50}
                    step={5}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Decision Criteria Weights */}
          <Box>
            <Typography variant="subtitle2" className="font-medium mb-3">
              Decision Criteria Weights (Total:{" "}
              {parameters.sustainabilityWeight +
                parameters.costWeight +
                parameters.deliveryWeight +
                parameters.riskWeight}
              %)
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  key: "sustainabilityWeight",
                  label: "Sustainability",
                  color: "green",
                },
                { key: "costWeight", label: "Cost", color: "blue" },
                {
                  key: "deliveryWeight",
                  label: "Delivery Speed",
                  color: "orange",
                },
                { key: "riskWeight", label: "Risk Management", color: "red" },
              ].map(({ key, label, color }) => (
                <Grid item xs={12} md={6} key={key}>
                  <Box>
                    <Box className="flex justify-between mb-1">
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="body2" className="font-medium">
                        {parameters[key]}%
                      </Typography>
                    </Box>
                    <Slider
                      value={parameters[key]}
                      onChange={(_, value) => handleParameterChange(key, value)}
                      min={0}
                      max={50}
                      step={5}
                      className={`text-${color}-600`}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Simulation Results */}
          <Box className="p-4 bg-slate-50 rounded-lg">
            <Typography variant="subtitle2" className="font-medium mb-3">
              Projected Impact
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box className="text-center">
                  <Typography variant="h4" className="font-bold text-blue-600">
                    ${simulation.projectedCost.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" className="text-slate-600">
                    Total Cost
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (simulation.projectedCost / parameters.budgetConstraint) *
                      100
                    }
                    color={getImpactColor(
                      simulation.projectedCost,
                      parameters.budgetConstraint
                    )}
                    className="mt-1"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box className="text-center">
                  <Typography variant="h4" className="font-bold text-green-600">
                    {simulation.projectedCarbon}
                  </Typography>
                  <Typography variant="caption" className="text-slate-600">
                    kg CO2e
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={100 - parameters.carbonReductionTarget}
                    color="success"
                    className="mt-1"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box className="text-center">
                  <Typography
                    variant="h4"
                    className="font-bold text-purple-600"
                  >
                    {simulation.projectedSustainability.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" className="text-slate-600">
                    Sustainability Score
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={simulation.projectedSustainability * 10}
                    color="secondary"
                    className="mt-1"
                  />
                </Box>
              </Grid>
            </Grid>

            <Box className="mt-4 flex items-center justify-between">
              <Box className="flex items-center gap-2">
                <Typography variant="body2" className="text-slate-600">
                  Simulation Confidence:
                </Typography>
                <Chip
                  label={`${Math.round(simulation.confidence * 100)}%`}
                  color={
                    simulation.confidence > 0.8
                      ? "success"
                      : simulation.confidence > 0.6
                      ? "warning"
                      : "error"
                  }
                  size="small"
                />
              </Box>
              <Button variant="outlined" size="small" onClick={resetParameters}>
                Reset Parameters
              </Button>
            </Box>
          </Box>

          {/* Trade-offs Analysis */}
          {simulation.tradeOffs.length > 0 && (
            <Box>
              <Typography variant="subtitle2" className="font-medium mb-3">
                Trade-off Analysis
              </Typography>
              <Box className="space-y-2">
                {simulation.tradeOffs.map((tradeOff, index) => (
                  <Box
                    key={index}
                    className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <Typography
                      variant="body2"
                      className="font-medium text-yellow-800"
                    >
                      {tradeOff.aspect}
                    </Typography>
                    <Typography variant="body2" className="text-yellow-700">
                      {tradeOff.impact}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={tradeOff.severity * 100}
                      color="warning"
                      className="mt-1"
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Recommendations */}
          {simulation.recommendations.length > 0 && (
            <Box>
              <Typography variant="subtitle2" className="font-medium mb-3">
                Optimization Recommendations
              </Typography>
              <Box className="space-y-2">
                {simulation.recommendations.map((rec, index) => (
                  <Box key={index} className="p-3 border rounded-lg">
                    <Box className="flex items-start gap-2">
                      <Chip
                        label={rec.type}
                        size="small"
                        color={
                          rec.type === "sustainability"
                            ? "success"
                            : rec.type === "cost"
                            ? "primary"
                            : "warning"
                        }
                        variant="outlined"
                      />
                      <Box className="flex-1">
                        <Typography variant="body2" className="font-medium">
                          {rec.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-slate-500"
                        >
                          {rec.impact}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
