// src/pages/Profile.jsx
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

// Common components
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

// Profile components
import PersonalInfo from "../components/profile/PersonalInfo";
import CareerMetrics from "../components/profile/CareerMetrics";
import ProductPortfolio from "../components/profile/ProductPortfolio";
import SupplierHistory from "../components/profile/SupplierHistory";
import Settings from "../components/profile/Settings";

// Mock data
import { userProfile } from "../data/mockData/userProfile";
import { suppliers } from "../data/mockData/suppliers";

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="mt-6">
    {value === index && children}
  </div>
);

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleProfileUpdate = (updates) => {
    console.log("Profile update:", updates);
    // In real app, this would update the profile via API
  };

  const handleViewSupplier = (supplier) => {
    console.log("View supplier:", supplier);
    // Navigate to supplier details or open modal
  };

  const tabs = [
    { label: "Personal Info", value: 0 },
    { label: "Career Metrics", value: 1 },
    { label: "Product Portfolio", value: 2 },
    { label: "Supplier History", value: 3 },
    { label: "Settings", value: 4 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        onSearch={() => {}}
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
        currentPath="/profile"
        onNavigate={() => {}}
      />

      <Container maxWidth="xl" className="py-6">
        <Typography variant="h4" className="font-semibold text-slate-900 mb-2">
          Profile & Settings
        </Typography>
        <Typography variant="body2" className="text-slate-500 mb-6">
          Manage your personal information, career progress, and account
          preferences
        </Typography>

        <Box className="bg-white rounded-lg border">
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            className="border-b"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                className={tabValue === tab.value ? "text-red-600" : ""}
              />
            ))}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box className="p-6">
              <PersonalInfo
                userProfile={userProfile}
                onUpdate={handleProfileUpdate}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box className="p-6">
              <CareerMetrics userProfile={userProfile} />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box className="p-6">
              <ProductPortfolio
                userProfile={userProfile}
                onUpdate={handleProfileUpdate}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box className="p-6">
              <SupplierHistory
                userProfile={userProfile}
                onViewSupplier={handleViewSupplier}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Box className="p-6">
              <Settings
                userProfile={userProfile}
                onUpdate={handleProfileUpdate}
              />
            </Box>
          </TabPanel>
        </Box>
      </Container>
    </div>
  );
}
