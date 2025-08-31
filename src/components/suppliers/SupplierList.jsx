// src/components/suppliers/SupplierList.jsx
import { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

const getScoreColor = (score) => {
  if (score >= 90) return "success";
  if (score >= 80) return "primary";
  if (score >= 70) return "warning";
  return "error";
};

const formatCarbonFootprint = (footprint) => {
  return `${footprint} Tons CO2e`;
};

export default function SupplierList({
  suppliers = [],
  onSupplierClick,
  onViewDetails,
  sortBy = "sustainabilityScore",
  sortOrder = "desc",
}) {
  const [sort, setSort] = useState({ field: sortBy, direction: sortOrder });

  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => {
      let aVal = a[sort.field];
      let bVal = b[sort.field];

      // Handle nested properties like carbonFootprint.perUnit
      if (sort.field === "carbonFootprint") {
        aVal = a.carbonFootprint?.perUnit || 0;
        bVal = b.carbonFootprint?.perUnit || 0;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sort.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [suppliers, sort]);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="border rounded-lg"
    >
      <Table>
        <TableHead className="bg-slate-50">
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sort.field === "name"}
                direction={sort.field === "name" ? sort.direction : "asc"}
                onClick={() => handleSort("name")}
              >
                <Typography variant="subtitle2" className="font-semibold">
                  SUPPLIER
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort.field === "location"}
                direction={sort.field === "location" ? sort.direction : "asc"}
                onClick={() => handleSort("location")}
              >
                <Typography variant="subtitle2" className="font-semibold">
                  LOCATION
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort.field === "sustainabilityScore"}
                direction={
                  sort.field === "sustainabilityScore" ? sort.direction : "asc"
                }
                onClick={() => handleSort("sustainabilityScore")}
              >
                <Typography variant="subtitle2" className="font-semibold">
                  SUST. SCORE
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" className="font-semibold">
                CERTIFICATIONS
              </Typography>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort.field === "carbonFootprint"}
                direction={
                  sort.field === "carbonFootprint" ? sort.direction : "asc"
                }
                onClick={() => handleSort("carbonFootprint")}
              >
                <Typography variant="subtitle2" className="font-semibold">
                  CARBON FOOTPRINT
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sort.field === "lastInteraction"}
                direction={
                  sort.field === "lastInteraction" ? sort.direction : "asc"
                }
                onClick={() => handleSort("lastInteraction")}
              >
                <Typography variant="subtitle2" className="font-semibold">
                  LAST INTERACTION
                </Typography>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" className="font-semibold">
                ACTION
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSuppliers.map((supplier) => (
            <TableRow
              key={supplier.id}
              hover
              className="cursor-pointer hover:bg-slate-25"
              onClick={() => onSupplierClick?.(supplier)}
            >
              <TableCell>
                <Box className="flex items-center gap-3">
                  <Avatar
                    src={supplier.logo}
                    alt={supplier.name}
                    className="w-8 h-8"
                  />
                  <Typography
                    variant="body2"
                    className="font-medium text-slate-900"
                  >
                    {supplier.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="text-slate-700">
                  {supplier.location?.city}, {supplier.location?.country}
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="flex items-center gap-2 min-w-[120px]">
                  <LinearProgress
                    variant="determinate"
                    value={(supplier.sustainabilityScore / 10) * 100}
                    color={getScoreColor(supplier.sustainabilityScore * 10)}
                    className="flex-1 h-2 rounded"
                  />
                  <Typography
                    variant="body2"
                    className="font-medium min-w-[24px]"
                  >
                    {Math.round(supplier.sustainabilityScore * 10)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box className="flex flex-wrap gap-1">
                  {supplier.certifications?.slice(0, 2).map((cert) => (
                    <Chip
                      key={cert}
                      label={cert}
                      size="small"
                      variant="outlined"
                      className="text-xs"
                    />
                  ))}
                  {supplier.certifications?.length > 2 && (
                    <Chip
                      label={`+${supplier.certifications.length - 2}`}
                      size="small"
                      variant="outlined"
                      className="text-xs"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="text-slate-700">
                  {formatCarbonFootprint(
                    supplier.carbonFootprint?.perUnit || 0
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className="text-slate-700">
                  {new Date(supplier.lastInteraction).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Button
                  variant="text"
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.(supplier);
                  }}
                  className="text-red-600"
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
