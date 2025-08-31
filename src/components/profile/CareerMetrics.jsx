// src/components/profile/CareerMetrics.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import EcoIcon from "@mui/icons-material/Eco";

const MetricCard = ({
  icon,
  title,
  value,
  subtitle,
  progress,
  color = "primary",
}) => (
  <Card elevation={0} className="border rounded-lg h-full">
    <CardContent className="p-4">
      <Box className="flex items-center justify-between mb-3">
        <Box className={`p-2 rounded-lg bg-${color}-50`}>{icon}</Box>
        {progress !== undefined && (
          <Typography variant="caption" className="text-slate-500">
            {progress}%
          </Typography>
        )}
      </Box>

      <Typography variant="h4" className="font-bold text-slate-900 mb-1">
        {value}
      </Typography>

      <Typography variant="body2" className="font-medium text-slate-700 mb-1">
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="caption" className="text-slate-500">
          {subtitle}
        </Typography>
      )}

      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={progress}
          color={color}
          className="mt-3 h-2 rounded"
        />
      )}
    </CardContent>
  </Card>
);

export default function CareerMetrics({ userProfile }) {
  const metrics = userProfile?.careerMetrics || {};
  const achievements = userProfile?.achievements || [];

  return (
    <Box className="space-y-6">
      {/* Career Overview */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Career Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={<WorkIcon className="text-blue-600" />}
                title="Years in Procurement"
                value={metrics.yearsInProcurement || 0}
                subtitle="Experience"
                color="primary"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={<BusinessIcon className="text-green-600" />}
                title="Projects Managed"
                value={metrics.totalProjectsManaged || 0}
                subtitle="Successfully completed"
                color="success"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={<TrendingUpIcon className="text-purple-600" />}
                title="Suppliers Worked With"
                value={metrics.suppliersWorkedWith || 0}
                subtitle="Partnerships established"
                color="secondary"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                icon={<EcoIcon className="text-emerald-600" />}
                title="Carbon Saved"
                value={`${(metrics.totalCarbonSaved || 0).toLocaleString()} t`}
                subtitle="CO2e equivalent"
                progress={metrics.sustainabilityImprovement || 0}
                color="success"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Achievement Timeline */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Achievements & Recognition
          </Typography>

          {achievements.length > 0 ? (
            <Box className="space-y-4">
              {achievements.map((achievement, index) => (
                <Box
                  key={index}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg"
                >
                  <Box className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <Box className="flex-1">
                    <Box className="flex items-center justify-between mb-2">
                      <Typography
                        variant="subtitle2"
                        className="font-semibold text-slate-900"
                      >
                        {achievement.title}
                      </Typography>
                      <Typography variant="caption" className="text-slate-500">
                        {new Date(achievement.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="text-slate-600">
                      {achievement.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="text-center py-8">
              <Typography variant="body2" className="text-slate-500">
                No achievements recorded yet
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 mb-4"
          >
            Performance Insights
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" className="font-medium mb-2">
                  Sustainability Impact
                </Typography>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="text-slate-600">
                    Carbon Reduction Achievement
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {metrics.sustainabilityImprovement || 0}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metrics.sustainabilityImprovement || 0}
                  color="success"
                  className="h-2 rounded"
                />
                <Typography
                  variant="caption"
                  className="text-slate-500 mt-1 block"
                >
                  Above industry average of 15%
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" className="font-medium mb-3">
                  Key Strengths
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  <Chip
                    label="Sustainable Sourcing"
                    color="success"
                    size="small"
                  />
                  <Chip
                    label="Supplier Relations"
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label="Cost Optimization"
                    color="secondary"
                    size="small"
                  />
                  <Chip label="Risk Management" color="warning" size="small" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
