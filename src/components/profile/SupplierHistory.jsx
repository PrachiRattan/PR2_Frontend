// src/components/profile/SupplierHistory.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BusinessIcon from "@mui/icons-material/Business";

const SupplierCard = ({ supplier, onViewDetails }) => (
  <Card
    elevation={0}
    className="border rounded-lg hover:shadow-md transition-shadow"
  >
    <CardContent className="p-4">
      <Box className="flex items-start justify-between mb-3">
        <Box className="flex items-center gap-3">
          <Avatar
            src={`/assets/logos/supplier-${supplier.supplierId}.png`}
            className="w-10 h-10"
          />
          <Box>
            <Typography
              variant="subtitle2"
              className="font-semibold text-slate-900"
            >
              Supplier #{supplier.supplierId}
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              Since {new Date(supplier.relationshipStart).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={supplier.status}
          color={supplier.status === "active" ? "success" : "default"}
          size="small"
        />
      </Box>

      <Grid container spacing={2} className="mb-3">
        <Grid item xs={6}>
          <Typography variant="caption" className="text-slate-600 block">
            Projects Completed
          </Typography>
          <Typography variant="body2" className="font-medium">
            {supplier.projectsCompleted}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" className="text-slate-600 block">
            Performance Rating
          </Typography>
          <Box className="flex items-center gap-1">
            <Rating value={supplier.performanceRating} size="small" readOnly />
            <Typography variant="body2" className="font-medium">
              {supplier.performanceRating}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Button
        size="small"
        variant="text"
        startIcon={<VisibilityIcon />}
        onClick={() => onViewDetails(supplier)}
        className="w-full"
      >
        View Details
      </Button>
    </CardContent>
  </Card>
);

export default function SupplierHistory({ userProfile, onViewSupplier }) {
  const [timelineView, setTimelineView] = useState(false);
  const supplierHistory = userProfile?.supplierHistory || [];

  // Sort suppliers by performance rating
  const topPerformers = [...supplierHistory]
    .sort((a, b) => b.performanceRating - a.performanceRating)
    .slice(0, 6);

  const getTrendIcon = (trend) => {
    return (
      <TrendingUpIcon
        className={trend > 0 ? "text-green-500" : "text-red-500"}
      />
    );
  };

  return (
    <Box className="space-y-6">
      {/* Summary Stats */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Supplier Relationship Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box className="text-center p-4 bg-blue-50 rounded-lg">
                <BusinessIcon className="text-blue-600 mb-2" fontSize="large" />
                <Typography variant="h4" className="font-bold text-blue-700">
                  {supplierHistory.length}
                </Typography>
                <Typography variant="body2" className="text-blue-600">
                  Total Suppliers
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUpIcon
                  className="text-green-600 mb-2"
                  fontSize="large"
                />
                <Typography variant="h4" className="font-bold text-green-700">
                  {supplierHistory.filter((s) => s.status === "active").length}
                </Typography>
                <Typography variant="body2" className="text-green-600">
                  Active Relationships
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box className="text-center p-4 bg-purple-50 rounded-lg">
                <Typography variant="h4" className="font-bold text-purple-700">
                  {supplierHistory.reduce(
                    (acc, s) => acc + s.projectsCompleted,
                    0
                  )}
                </Typography>
                <Typography variant="body2" className="text-purple-600">
                  Total Projects
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold text-slate-900">
              Supplier Relationships
            </Typography>
            <Box className="flex gap-2">
              <Button
                size="small"
                variant={!timelineView ? "contained" : "outlined"}
                onClick={() => setTimelineView(false)}
              >
                Grid View
              </Button>
              <Button
                size="small"
                variant={timelineView ? "contained" : "outlined"}
                onClick={() => setTimelineView(true)}
              >
                Timeline
              </Button>
            </Box>
          </Box>

          {!timelineView ? (
            // Grid View
            <Grid container spacing={3}>
              {topPerformers.map((supplier) => (
                <Grid item xs={12} md={6} lg={4} key={supplier.supplierId}>
                  <SupplierCard
                    supplier={supplier}
                    onViewDetails={onViewSupplier}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            // Timeline View
            <Timeline>
              {supplierHistory
                .sort(
                  (a, b) =>
                    new Date(b.relationshipStart) -
                    new Date(a.relationshipStart)
                )
                .map((supplier, index) => (
                  <TimelineItem key={supplier.supplierId}>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          supplier.status === "active" ? "primary" : "grey"
                        }
                      />
                      {index < supplierHistory.length - 1 && (
                        <TimelineConnector />
                      )}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Box className="pb-4">
                        <Box className="flex items-center justify-between mb-2">
                          <Typography
                            variant="subtitle2"
                            className="font-semibold"
                          >
                            Supplier #{supplier.supplierId}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-slate-500"
                          >
                            {new Date(
                              supplier.relationshipStart
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box className="flex items-center gap-4 text-sm">
                          <Box>
                            <Typography
                              variant="caption"
                              className="text-slate-600"
                            >
                              Projects: {supplier.projectsCompleted}
                            </Typography>
                          </Box>
                          <Box className="flex items-center gap-1">
                            <Rating
                              value={supplier.performanceRating}
                              size="small"
                              readOnly
                            />
                            <Typography variant="caption">
                              {supplier.performanceRating}
                            </Typography>
                          </Box>
                          <Chip
                            label={supplier.status}
                            size="small"
                            color={
                              supplier.status === "active"
                                ? "success"
                                : "default"
                            }
                          />
                        </Box>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                ))}
            </Timeline>
          )}
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Relationship Performance
          </Typography>

          <Box className="space-y-3">
            <Box className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Typography variant="body2" className="font-medium">
                Average Supplier Rating
              </Typography>
              <Box className="flex items-center gap-2">
                <Rating
                  value={
                    supplierHistory.reduce(
                      (acc, s) => acc + s.performanceRating,
                      0
                    ) / supplierHistory.length || 0
                  }
                  readOnly
                  precision={0.1}
                  size="small"
                />
                <Typography variant="body2" className="font-semibold">
                  {(
                    supplierHistory.reduce(
                      (acc, s) => acc + s.performanceRating,
                      0
                    ) / supplierHistory.length || 0
                  ).toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Box className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Typography variant="body2" className="font-medium">
                Success Rate
              </Typography>
              <Typography
                variant="body2"
                className="font-semibold text-green-600"
              >
                {supplierHistory.length > 0
                  ? Math.round(
                      (supplierHistory.filter((s) => s.status === "active")
                        .length /
                        supplierHistory.length) *
                        100
                    )
                  : 0}
                %
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
