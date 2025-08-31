// src/components/common/Header.jsx
import { useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Header({
  onToggleSidebar,
  onSearch,
  userProfile,
  kpis = {
    activeSuppliers: 0,
    productsOfInterest: 0,
    carbonSavedYTD: 0,
    procurementValue: 0,
  },
  notificationsCount = 0,
}) {
  const name = userProfile?.personalInfo?.name || "Procurement Manager";
  const photo = userProfile?.personalInfo?.photo || undefined;

  const kpiChips = useMemo(
    () => [
      { label: `Suppliers: ${kpis.activeSuppliers}`, color: "success" },
      { label: `Products: ${kpis.productsOfInterest}`, color: "primary" },
      { label: `CO2 Saved YTD: ${kpis.carbonSavedYTD} t`, color: "secondary" },
    ],
    [kpis]
  );

  return (
    <AppBar position="sticky" elevation={0} className="bg-white">
      <Toolbar className="flex w-full items-center gap-3 px-4">
        <IconButton
          edge="start"
          onClick={onToggleSidebar}
          aria-label="menu"
          size="large"
          className="text-slate-700"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className="text-slate-800 font-semibold mr-2">
          Sustainable Procurement
        </Typography>

        <Box className="hidden md:flex flex-1 max-w-xl">
          <TextField
            fullWidth
            size="small"
            placeholder="Search suppliers, products, procurement..."
            onChange={(e) => onSearch?.(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-slate-500" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className="hidden lg:flex items-center gap-2">
          {kpiChips.map((c, i) => (
            <Chip
              key={i}
              label={c.label}
              color={c.color}
              size="small"
              variant="outlined"
              className="font-medium"
            />
          ))}
        </Box>

        <Box className="flex-1 md:hidden" />

        <Box className="flex items-center gap-2">
          <Tooltip title="Notifications">
            <IconButton className="text-slate-700">
              <Badge badgeContent={notificationsCount} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={name}>
            <Avatar alt={name} src={photo} className="ring-2 ring-slate-200" />
          </Tooltip>
        </Box>
      </Toolbar>
      <div className="md:hidden px-4 pb-3">
        <TextField
          fullWidth
          size="small"
          placeholder="Search suppliers, products, procurement..."
          onChange={(e) => onSearch?.(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-slate-500" />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </AppBar>
  );
}
