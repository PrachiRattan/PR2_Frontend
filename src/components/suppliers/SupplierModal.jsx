// src/components/suppliers/SupplierModal.jsx
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import RadarChart from "../common/Charts/RadarChart";
import BarChart from "../common/Charts/BarChart";

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="mt-4">
    {value === index && children}
  </div>
);

const MetricCard = ({ label, value, unit, color = "primary" }) => (
  <Box className="p-3 border rounded-lg">
    <Typography variant="caption" className="text-slate-600 block">
      {label}
    </Typography>
    <Typography variant="h6" className={`font-semibold text-${color}-600`}>
      {value}
      {unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
    </Typography>
  </Box>
);

export default function SupplierModal({
  open,
  onClose,
  supplier,
  onRequestQuote,
  onScheduleMeeting,
  onDownloadReport,
}) {
  const [tabValue, setTabValue] = useState(0);

  if (!supplier) return null;

  const sustainabilityMetrics = [
    {
      metric: "Carbon Intensity",
      score: 10 - supplier.carbonFootprint?.perUnit / 5,
    },
    { metric: "Recycling", score: supplier.recyclingContent / 10 },
    { metric: "Renewable Energy", score: supplier.renewableEnergyPercent / 10 },
    {
      metric: "Waste Management",
      score: supplier.wasteManagement?.recycledPercentage / 10,
    },
    { metric: "Certifications", score: supplier.certifications?.length || 0 },
    { metric: "Policies", score: supplier.policies?.length || 0 },
  ];

  const emissionsData = [
    { label: "Scope 1", value: supplier.carbonFootprint?.scope1 || 0 },
    { label: "Scope 2", value: supplier.carbonFootprint?.scope2 || 0 },
    { label: "Scope 3", value: supplier.carbonFootprint?.scope3 || 0 },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box className="flex items-center justify-between p-6 pb-0">
        <Box className="flex items-center gap-4">
          <Avatar
            src={supplier.logo}
            alt={supplier.name}
            className="w-16 h-16"
          />
          <Box>
            <Typography variant="h5" className="font-semibold text-slate-900">
              {supplier.name}
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              {supplier.location?.city}, {supplier.location?.country} •{" "}
              {supplier.industry}
            </Typography>
            <Box className="flex items-center gap-2 mt-1">
              <Typography variant="body2" className="text-slate-700">
                Sustainability Score:
              </Typography>
              <Typography variant="body2" className="font-semibold">
                {supplier.sustainabilityScore}/10
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(supplier.sustainabilityScore / 10) * 100}
                className="w-20 h-1"
              />
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider className="mx-6" />

      <Box className="px-6">
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          <Tab label="Overview" />
          <Tab label="Sustainability" />
          <Tab label="Performance" />
          <Tab label="Documents" />
          <Tab label="Activity" />
        </Tabs>
      </Box>

      <DialogContent className="px-6">
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-semibold mb-3">
                Key Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <MetricCard
                    label="Years in Operation"
                    value={supplier.yearsInOperation}
                    unit="years"
                  />
                </Grid>
                <Grid item xs={6}>
                  <MetricCard
                    label="Company Size"
                    value={supplier.companySize}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MetricCard
                    label="On-time Delivery"
                    value={supplier.kpis?.onTimeDelivery}
                    unit="%"
                    color="success"
                  />
                </Grid>
                <Grid item xs={6}>
                  <MetricCard
                    label="Audit Score"
                    value={supplier.kpis?.auditScore}
                    unit="/100"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-semibold mb-3">
                Certifications
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {supplier.certifications?.map((cert) => (
                  <Chip key={cert} label={cert} color="primary" />
                ))}
              </Box>
              <Typography variant="h6" className="font-semibold mb-3 mt-4">
                Contact Information
              </Typography>
              <Typography variant="body2" className="text-slate-600">
                Industry: {supplier.industry}
              </Typography>
              <Typography variant="body2" className="text-slate-600">
                Risk Level:{" "}
                <span
                  className={`capitalize font-medium ${
                    supplier.riskLevel === "low"
                      ? "text-green-600"
                      : supplier.riskLevel === "medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {supplier.riskLevel}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-semibold mb-3">
                Sustainability Overview
              </Typography>
              <RadarChart
                data={sustainabilityMetrics}
                categoryKey="metric"
                series={[{ dataKey: "score", name: "Score", color: "#22c55e" }]}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-semibold mb-3">
                Carbon Footprint Breakdown
              </Typography>
              <BarChart
                data={emissionsData}
                xKey="label"
                bars={[
                  {
                    dataKey: "value",
                    color: "#ef4444",
                    name: "Emissions (tCO2e)",
                  },
                ]}
                height={300}
                yUnit=" tCO2e"
              />
            </Grid>
          </Grid>

          <Box className="mt-6">
            <Typography variant="h6" className="font-semibold mb-3">
              Sustainability Programs
            </Typography>
            <Grid container spacing={2}>
              {supplier.sustainabilityPrograms?.map((program, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box className="p-4 border rounded-lg">
                    <Typography variant="subtitle2" className="font-semibold">
                      {program.name}
                    </Typography>
                    <Typography variant="body2" className="text-slate-600 mt-1">
                      {program.targets}
                    </Typography>
                    <Box className="flex items-center gap-2 mt-2">
                      <LinearProgress
                        variant="determinate"
                        value={program.progress}
                        className="flex-1 h-2"
                      />
                      <Typography variant="caption">
                        {program.progress}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MetricCard
                label="On-time Delivery Rate"
                value={supplier.kpis?.onTimeDelivery}
                unit="%"
                color="success"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard
                label="Defect Rate"
                value={supplier.kpis?.defectRate}
                unit="%"
                color="error"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard
                label="Audit Score"
                value={supplier.kpis?.auditScore}
                unit="/100"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" className="font-semibold mb-3">
            Available Documents
          </Typography>
          <Box className="space-y-2">
            {supplier.policies?.map((policy, index) => (
              <Box
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {policy.type}
                  </Typography>
                  <Typography variant="caption" className="text-slate-500">
                    Last updated:{" "}
                    {new Date(policy.lastUpdated).toLocaleDateString()}
                  </Typography>
                </Box>
                <Button size="small" variant="outlined">
                  Download
                </Button>
              </Box>
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" className="font-semibold mb-3">
            Recent Activity
          </Typography>
          <Box className="space-y-3">
            <Box className="p-3 bg-slate-50 rounded-lg">
              <Typography variant="body2">
                Last interaction:{" "}
                {new Date(supplier.lastInteraction).toLocaleDateString()}
              </Typography>
            </Box>
            <Box className="p-3 bg-slate-50 rounded-lg">
              <Typography variant="body2">
                Status:{" "}
                {supplier.preferred ? "Preferred Supplier" : "Regular Supplier"}
              </Typography>
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions className="p-6">
        <Button variant="outlined" onClick={onDownloadReport}>
          Download Report
        </Button>
        <Button variant="outlined" onClick={onScheduleMeeting}>
          Schedule Meeting
        </Button>
        <Button variant="contained" onClick={onRequestQuote}>
          Request Quote
        </Button>
      </DialogActions>
    </Dialog>
  );
}
