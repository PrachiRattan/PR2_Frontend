// src/components/procurement/ProjectForm.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const productCategories = [
  "Office Supplies",
  "Packaging",
  "Electronics",
  "Chemicals",
  "Textiles",
  "Metals",
  "Logistics",
  "Raw Materials",
];

const geographicPreferences = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
  "Oceania",
];

const sustainabilityPriorities = [
  { key: "carbonFootprint", label: "Carbon Footprint" },
  { key: "recycling", label: "Recycling Content" },
  { key: "certifications", label: "Certifications" },
  { key: "policies", label: "Environmental Policies" },
  { key: "renewable", label: "Renewable Energy" },
];

export default function ProjectForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    specifications: "",
    budget: "",
    timeline: null,
    geographicPreference: "",
    sustainabilityPriorities: {
      carbonFootprint: 40,
      recycling: 30,
      certifications: 20,
      policies: 5,
      renewable: 5,
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriorityChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      sustainabilityPriorities: {
        ...prev.sustainabilityPriorities,
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Card elevation={0} className="border rounded-xl">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold text-slate-900 mb-4">
          Project Creation
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Project Description"
                placeholder="Describe the project"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Product Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  label="Product Category"
                >
                  {productCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                type="number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget"
                placeholder="Enter budget"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                type="number"
                InputProps={{ startAdornment: "$" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Timeline"
                  value={formData.timeline}
                  onChange={(date) => handleChange("timeline", date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Specifications"
                placeholder="Enter product specifications"
                value={formData.specifications}
                onChange={(e) => handleChange("specifications", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Geographic Preferences</InputLabel>
                <Select
                  value={formData.geographicPreference}
                  onChange={(e) =>
                    handleChange("geographicPreference", e.target.value)
                  }
                  label="Geographic Preferences"
                >
                  {geographicPreferences.map((pref) => (
                    <MenuItem key={pref} value={pref}>
                      {pref}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box className="mt-6">
            <Typography variant="subtitle2" className="font-semibold mb-3">
              Sustainability Priorities
            </Typography>
            <Grid container spacing={3}>
              {sustainabilityPriorities.map(({ key, label }) => (
                <Grid item xs={12} md={6} key={key}>
                  <Box className="space-y-2">
                    <Box className="flex justify-between">
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="body2" className="font-medium">
                        {formData.sustainabilityPriorities[key]}%
                      </Typography>
                    </Box>
                    <Slider
                      value={formData.sustainabilityPriorities[key]}
                      onChange={(_, value) => handlePriorityChange(key, value)}
                      min={0}
                      max={100}
                      step={5}
                      className="text-blue-600"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box className="flex gap-3 pt-4">
            <Button onClick={onCancel} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Project
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
