// src/components/suppliers/SupplierCard.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const getScoreColor = (score) => {
  if (score >= 8.5) return "success";
  if (score >= 7.5) return "primary";
  if (score >= 6.5) return "warning";
  return "error";
};

export default function SupplierCard({
  supplier,
  onCardClick,
  onToggleFavorite,
  isFavorite = false,
}) {
  const handleClick = () => {
    onCardClick?.(supplier);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(supplier.id);
  };

  return (
    <Card
      elevation={0}
      className="border rounded-xl hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-5">
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-center gap-3">
            <Avatar
              src={supplier.logo}
              alt={supplier.name}
              className="w-12 h-12"
            />
            <Box>
              <Typography
                variant="subtitle1"
                className="font-semibold text-slate-900 line-clamp-1"
              >
                {supplier.name}
              </Typography>
              <Typography variant="caption" className="text-slate-500">
                {supplier.location?.city}, {supplier.location?.country}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleFavoriteClick}>
            {isFavorite ? (
              <FavoriteIcon className="text-red-500" />
            ) : (
              <FavoriteBorderIcon className="text-slate-400" />
            )}
          </IconButton>
        </Box>

        <Box className="mb-3">
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="caption" className="text-slate-600">
              Sustainability Score
            </Typography>
            <Typography variant="caption" className="font-medium">
              {supplier.sustainabilityScore}/10
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(supplier.sustainabilityScore / 10) * 100}
            color={getScoreColor(supplier.sustainabilityScore)}
            className="h-2 rounded"
          />
        </Box>

        <Box className="mb-3">
          <Typography variant="caption" className="text-slate-600 mb-1 block">
            Top Certifications
          </Typography>
          <Box className="flex flex-wrap gap-1">
            {supplier.certifications?.slice(0, 3).map((cert) => (
              <Chip
                key={cert}
                label={cert}
                size="small"
                variant="outlined"
                className="text-xs"
              />
            ))}
          </Box>
        </Box>

        <Box className="grid grid-cols-2 gap-3 text-sm">
          <Box>
            <Typography variant="caption" className="text-slate-600 block">
              Carbon Footprint
            </Typography>
            <Typography variant="body2" className="font-medium">
              {supplier.carbonFootprint?.perUnit} kg CO2e
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" className="text-slate-600 block">
              Recycled Content
            </Typography>
            <Typography variant="body2" className="font-medium">
              {supplier.recyclingContent}%
            </Typography>
          </Box>
        </Box>

        <Box className="mt-3 pt-3 border-t">
          <Typography variant="caption" className="text-slate-500">
            Last interaction:{" "}
            {new Date(supplier.lastInteraction).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
