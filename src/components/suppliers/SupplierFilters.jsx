// src/components/suppliers/SupplierFilters.jsx
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FilterPanel from "../common/FilterPanel";

export default function SupplierFilters({
  filterOptions = {},
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  onSavePreset,
}) {
  const [filters, setFilters] = useState({
    search: "",
    certifications: [],
    carbonPerUnit: [0, 50],
    sustainabilityScore: [1, 10],
    recyclingMin: 0,
    policies: [],
    regions: [],
    industries: [],
    companySize: "",
    yearsInOperationMin: 0,
    kpiSortKey: "sustainabilityScore",
    hasNetZero: false,
    preferred: false,
    riskLevel: [],
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      certifications: [],
      carbonPerUnit: [0, 50],
      sustainabilityScore: [1, 10],
      recyclingMin: 0,
      policies: [],
      regions: [],
      industries: [],
      companySize: "",
      yearsInOperationMin: 0,
      kpiSortKey: "sustainabilityScore",
      hasNetZero: false,
      preferred: false,
      riskLevel: [],
    };
    setFilters(resetFilters);
    onResetFilters?.(resetFilters);
  };

  const handleSavePreset = () => {
    onSavePreset?.(filters);
  };

  return (
    <Paper elevation={0} className="border rounded-lg p-4 sticky top-4">
      <Typography variant="h6" className="font-semibold text-slate-900 mb-4">
        Filters
      </Typography>
      <FilterPanel
        filterOptions={filterOptions}
        value={filters}
        onChange={handleFilterChange}
        onApply={handleApply}
        onReset={handleReset}
        onSavePreset={handleSavePreset}
      />
    </Paper>
  );
}
