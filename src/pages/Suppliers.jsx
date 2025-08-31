// src/pages/Suppliers.jsx
import React, { useState, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";

// Components
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import SupplierList from "../components/suppliers/SupplierList";
import SupplierCard from "../components/suppliers/SupplierCard";
import SupplierFilters from "../components/suppliers/SupplierFilters";
import SupplierModal from "../components/suppliers/SupplierModal";
import SupplierComparison from "../components/suppliers/SupplierComparison";

// Mock data
import { suppliers, filterOptions } from "../data/mockData/suppliers";
import { userProfile } from "../data/mockData/userProfile";

export default function Suppliers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("list"); // list, card, map
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("sustainabilityScore");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [favorites, setFavorites] = useState(new Set([1, 5, 8])); // Mock favorites
  const [filters, setFilters] = useState({});

  // Filter and search suppliers
  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.location?.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          supplier.location?.country
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply advanced filters
    if (filters.certifications?.length > 0) {
      result = result.filter((supplier) =>
        filters.certifications.some((cert) =>
          supplier.certifications?.includes(cert)
        )
      );
    }

    if (filters.sustainabilityScore) {
      const [min, max] = filters.sustainabilityScore;
      result = result.filter(
        (supplier) =>
          supplier.sustainabilityScore >= min &&
          supplier.sustainabilityScore <= max
      );
    }

    if (filters.regions?.length > 0) {
      result = result.filter((supplier) =>
        filters.regions.includes(supplier.location?.region)
      );
    }

    if (filters.industries?.length > 0) {
      result = result.filter((supplier) =>
        filters.industries.includes(supplier.industry)
      );
    }

    return result;
  }, [suppliers, searchQuery, filters]);

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  const handleToggleFavorite = (supplierId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(supplierId)) {
        newFavorites.delete(supplierId);
      } else {
        newFavorites.add(supplierId);
      }
      return newFavorites;
    });
  };

  const viewButtons = [
    { value: "list", icon: <ViewListIcon />, label: "List View" },
    { value: "card", icon: <ViewModuleIcon />, label: "Card View" },
    { value: "map", icon: <MapIcon />, label: "Map View" },
  ];

  const sortOptions = [
    { value: "sustainabilityScore", label: "Sustainability Score" },
    { value: "name", label: "Alphabetical" },
    { value: "carbonFootprint", label: "Carbon Footprint" },
    { value: "lastInteraction", label: "Recent Activity" },
  ];

  const renderSuppliers = () => {
    if (view === "list") {
      return (
        <SupplierList
          suppliers={filteredSuppliers}
          onSupplierClick={handleSupplierClick}
          onViewDetails={handleSupplierClick}
          sortBy={sortBy}
        />
      );
    }

    if (view === "card") {
      return (
        <Grid container spacing={3}>
          {filteredSuppliers.map((supplier) => (
            <Grid item xs={12} sm={6} lg={4} key={supplier.id}>
              <SupplierCard
                supplier={supplier}
                onCardClick={handleSupplierClick}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.has(supplier.id)}
              />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (view === "map") {
      return (
        <Box className="h-96 bg-slate-100 rounded-lg flex items-center justify-center">
          <Typography variant="body1" className="text-slate-500">
            Map view coming soon...
          </Typography>
        </Box>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        onSearch={setSearchQuery}
        userProfile={userProfile}
        kpis={{
          activeSuppliers: suppliers.length,
          productsOfInterest: 12,
          carbonSavedYTD: 1.5,
          procurementValue: 5200000,
        }}
        notificationsCount={3}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath="/suppliers"
        onNavigate={() => {}}
      />

      <Container maxWidth="xl" className="py-6">
        <Box className="flex items-center justify-between mb-6">
          <Box>
            <Typography variant="h4" className="font-semibold text-slate-900">
              Suppliers
            </Typography>
            <Typography variant="body2" className="text-slate-500 mt-1">
              {filteredSuppliers.length} suppliers found
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Supplier
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <SupplierFilters
              filterOptions={filterOptions}
              onFiltersChange={setFilters}
              onApplyFilters={setFilters}
              onResetFilters={() => setFilters({})}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Box className="mb-4 flex items-center justify-between">
              <Box className="flex items-center gap-4">
                <TextField
                  size="small"
                  placeholder="Search suppliers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  className="w-80"
                />

                <ButtonGroup>
                  {viewButtons.map((button) => (
                    <Button
                      key={button.value}
                      variant={view === button.value ? "contained" : "outlined"}
                      onClick={() => setView(button.value)}
                      size="small"
                    >
                      {button.icon}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>

              <Box className="flex items-center gap-2">
                <SortIcon className="text-slate-500" />
                <FormControl size="small" className="min-w-48">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {comparisonMode ? (
              <SupplierComparison
                suppliers={filteredSuppliers.slice(0, 3)}
                onRemoveSupplier={() => {}}
                onAddSupplier={() => {}}
              />
            ) : (
              renderSuppliers()
            )}
          </Grid>
        </Grid>
      </Container>

      <SupplierModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        supplier={selectedSupplier}
        onRequestQuote={() => console.log("Request quote")}
        onScheduleMeeting={() => console.log("Schedule meeting")}
        onDownloadReport={() => console.log("Download report")}
      />
    </div>
  );
}
