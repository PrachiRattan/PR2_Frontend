// src/components/scenarios/ScenarioBuilder.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";

export default function ScenarioBuilder({
  onCreateScenario,
  onUpdateScenario,
}) {
  const [scenario, setScenario] = useState({
    name: "",
    description: "",
    products: [{ name: "", quantity: 0, specifications: "" }],
    deliveryRequirements: "",
    sustainabilityPriorities: {
      carbonFootprint: 40,
      recycling: 30,
      certifications: 20,
      policies: 10,
    },
  });

  const handleProductChange = (index, field, value) => {
    const newProducts = [...scenario.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setScenario({ ...scenario, products: newProducts });
  };

  const addProduct = () => {
    setScenario({
      ...scenario,
      products: [
        ...scenario.products,
        { name: "", quantity: 0, specifications: "" },
      ],
    });
  };

  const removeProduct = (index) => {
    setScenario({
      ...scenario,
      products: scenario.products.filter((_, i) => i !== index),
    });
  };

  const handlePriorityChange = (key, value) => {
    setScenario({
      ...scenario,
      sustainabilityPriorities: {
        ...scenario.sustainabilityPriorities,
        [key]: value,
      },
    });
  };

  const handleSubmit = () => {
    onCreateScenario?.(scenario);
  };

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold text-slate-900 mb-4">
          Scenario Builder
        </Typography>

        <Box className="space-y-4">
          <TextField
            fullWidth
            label="Scenario Name"
            placeholder="e.g., Q3 Production Run"
            value={scenario.name}
            onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
          />

          <Box>
            <Typography variant="subtitle2" className="font-medium mb-2">
              Product Details
            </Typography>
            {scenario.products.map((product, index) => (
              <Grid container spacing={2} key={index} className="mb-3">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Product name"
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "name", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Specifications"
                    value={product.specifications}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "specifications",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeProduct(index)}
                    disabled={scenario.products.length === 1}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" size="small" onClick={addProduct}>
              Add Product
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Delivery Requirements"
            placeholder="Specify delivery requirements"
            value={scenario.deliveryRequirements}
            onChange={(e) =>
              setScenario({ ...scenario, deliveryRequirements: e.target.value })
            }
          />

          <Box>
            <Typography variant="subtitle2" className="font-medium mb-3">
              Sustainability Priorities (%)
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(scenario.sustainabilityPriorities).map(
                ([key, value]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {value}%
                        </Typography>
                      </Box>
                      <Slider
                        value={value}
                        onChange={(_, newValue) =>
                          handlePriorityChange(key, newValue)
                        }
                        min={0}
                        max={100}
                        step={5}
                      />
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </Box>

          <Box className="flex gap-3 pt-4">
            <Button variant="outlined" color="inherit">
              Reset
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Build Scenario
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
