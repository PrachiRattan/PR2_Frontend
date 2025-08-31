// src/components/common/Sidebar.jsx
import { useMemo } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FactoryIcon from "@mui/icons-material/Factory";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import RouteIcon from "@mui/icons-material/Route";
import PersonIcon from "@mui/icons-material/Person";

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    key: "suppliers",
    label: "Suppliers",
    icon: <FactoryIcon />,
    path: "/suppliers",
  },
  {
    key: "procurement",
    label: "Procurement",
    icon: <AssignmentTurnedInIcon />,
    path: "/procurement",
  },
  {
    key: "scenarios",
    label: "Scenarios",
    icon: <RouteIcon />,
    path: "/scenarios",
  },
  { key: "profile", label: "Profile", icon: <PersonIcon />, path: "/profile" },
];

export default function Sidebar({
  open,
  onClose,
  currentPath = "/dashboard",
  onNavigate,
  width = 260,
}) {
  const items = useMemo(() => navItems, []);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{ style: { width } }}
    >
      <div className="py-3 px-4">
        <div className="text-slate-900 font-semibold text-lg">Menu</div>
      </div>
      <Divider />
      <List className="pt-2">
        {items.map((item) => {
          const active = currentPath.startsWith(item.path);
          return (
            <ListItem key={item.key} disablePadding>
              <Tooltip title={item.label} placement="right" arrow>
                <ListItemButton
                  selected={active}
                  onClick={() => {
                    onNavigate?.(item.path);
                    onClose?.();
                  }}
                  className={active ? "bg-slate-100" : ""}
                >
                  <ListItemIcon
                    className={active ? "text-slate-900" : "text-slate-600"}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      className: active
                        ? "text-slate-900 font-medium"
                        : "text-slate-700",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <div className="mt-auto p-4 text-xs text-slate-500">
        v1.0 • Sustainable Sourcing
      </div>
    </Drawer>
  );
}
