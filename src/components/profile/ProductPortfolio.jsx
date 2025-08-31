// src/components/profile/ProductPortfolio.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CategoryIcon from "@mui/icons-material/Category";

const getExperienceColor = (experience) => {
  const years = parseInt(experience);
  if (years >= 5) return "success";
  if (years >= 3) return "primary";
  if (years >= 1) return "warning";
  return "default";
};

const getExperienceLevel = (experience) => {
  const years = parseInt(experience);
  if (years >= 5) return "Expert";
  if (years >= 3) return "Advanced";
  if (years >= 1) return "Intermediate";
  return "Beginner";
};

const CategoryCard = ({ category, onEdit }) => (
  <Card
    elevation={0}
    className="border rounded-lg hover:shadow-md transition-shadow"
  >
    <CardContent className="p-4">
      <Box className="flex items-start justify-between mb-3">
        <Box className="flex items-center gap-2">
          <CategoryIcon className="text-slate-500" />
          <Typography
            variant="subtitle2"
            className="font-semibold text-slate-900"
          >
            {category.category}
          </Typography>
        </Box>
        <Chip
          label={category.specialization}
          color={category.specialization === "primary" ? "primary" : "default"}
          size="small"
          variant="outlined"
        />
      </Box>

      <Box className="mb-3">
        <Box className="flex justify-between items-center mb-1">
          <Typography variant="caption" className="text-slate-600">
            Experience Level
          </Typography>
          <Typography variant="caption" className="font-medium">
            {getExperienceLevel(category.experience)}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(100, parseInt(category.experience) * 20)}
          color={getExperienceColor(category.experience)}
          className="h-2 rounded"
        />

        <Typography variant="caption" className="text-slate-500 mt-1 block">
          {category.experience} experience
        </Typography>
      </Box>

      <Button size="small" variant="text" onClick={() => onEdit?.(category)}>
        Edit Details
      </Button>
    </CardContent>
  </Card>
);

export default function ProductPortfolio({ userProfile, onUpdate }) {
  const portfolio = userProfile?.productPortfolio || [];

  const primaryCategories = portfolio.filter(
    (cat) => cat.specialization === "primary"
  );
  const secondaryCategories = portfolio.filter(
    (cat) => cat.specialization === "secondary"
  );

  return (
    <Box className="space-y-6">
      {/* Portfolio Overview */}
      <Card elevation={0} className="border rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold text-slate-900">
              Product Portfolio
            </Typography>
            <Button startIcon={<AddIcon />} variant="outlined" size="small">
              Add Category
            </Button>
          </Box>

          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} sm={4}>
              <Box className="text-center p-4 bg-blue-50 rounded-lg">
                <BusinessCenterIcon
                  className="text-blue-600 mb-2"
                  fontSize="large"
                />
                <Typography variant="h4" className="font-bold text-blue-700">
                  {portfolio.length}
                </Typography>
                <Typography variant="body2" className="text-blue-600">
                  Total Categories
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box className="text-center p-4 bg-green-50 rounded-lg">
                <CategoryIcon
                  className="text-green-600 mb-2"
                  fontSize="large"
                />
                <Typography variant="h4" className="font-bold text-green-700">
                  {primaryCategories.length}
                </Typography>
                <Typography variant="body2" className="text-green-600">
                  Primary Focus
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box className="text-center p-4 bg-purple-50 rounded-lg">
                <CategoryIcon
                  className="text-purple-600 mb-2"
                  fontSize="large"
                />
                <Typography variant="h4" className="font-bold text-purple-700">
                  {secondaryCategories.length}
                </Typography>
                <Typography variant="body2" className="text-purple-600">
                  Secondary Areas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Primary Specializations */}
      {primaryCategories.length > 0 && (
        <Card elevation={0} className="border rounded-xl">
          <CardContent className="p-6">
            <Typography
              variant="h6"
              className="font-semibold text-slate-900 mb-4"
            >
              Primary Specializations
            </Typography>

            <Grid container spacing={3}>
              {primaryCategories.map((category, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <CategoryCard
                    category={category}
                    onEdit={() => console.log("Edit category:", category)}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Secondary Areas */}
      {secondaryCategories.length > 0 && (
        <Card elevation={0} className="border rounded-xl">
          <CardContent className="p-6">
            <Typography
              variant="h6"
              className="font-semibold text-slate-900 mb-4"
            >
              Secondary Areas
            </Typography>

            <Grid container spacing={3}>
              {secondaryCategories.map((category, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <CategoryCard
                    category={category}
                    onEdit={() => console.log("Edit category:", category)}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {portfolio.length === 0 && (
        <Card elevation={0} className="border rounded-xl">
          <CardContent className="p-6">
            <Box className="text-center py-8">
              <CategoryIcon
                className="text-slate-300 mb-4"
                style={{ fontSize: 64 }}
              />
              <Typography variant="h6" className="text-slate-600 mb-2">
                No Product Categories Yet
              </Typography>
              <Typography variant="body2" className="text-slate-500 mb-4">
                Add your areas of expertise to showcase your procurement
                specializations
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Add First Category
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
