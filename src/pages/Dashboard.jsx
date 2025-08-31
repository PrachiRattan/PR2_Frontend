// src/pages/Dashboard.jsx
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Common
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

// Dashboard sections
import KPICards from "../components/dashboard/KPICards";
import ProductCards from "../components/dashboard/ProductCards";
import CarbonFootprintChart from "../components/dashboard/CarbonFootprintChart";
import SupplierOverview from "../components/dashboard/SupplierOverview";
import RecommendationsPanel from "../components/dashboard/RecommendationsPanel";
import ActivityFeed from "../components/dashboard/ActivityFeed";

// Mock data
import { suppliers } from "../data/mockData/suppliers";
import { products } from "../data/mockData/products";
import { userProfile } from "../data/mockData/userProfile";
import { procurementProjects } from "../data/mockData/procurementProjects";
import { aiRecommendations } from "../data/mockData/scenarios";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // KPIs (derive where possible)
  const kpis = {
    activeSuppliers: suppliers.length,
    productsOfInterest: products.length,
    carbonSaved: 1500, // demo metric for YTD saved (kg)
    procurementValue: 5_200_000,
  };

  // Header KPIs
  const headerKpis = {
    activeSuppliers: kpis.activeSuppliers,
    productsOfInterest: kpis.productsOfInterest,
    carbonSavedYTD: (kpis.carbonSaved / 1000).toFixed(1),
    procurementValue: kpis.procurementValue,
  };

  // Carbon chart data
  const monthly = [
    { label: "Jan", generated: 320, saved: 450 },
    { label: "Feb", generated: 300, saved: 480 },
    { label: "Mar", generated: 290, saved: 500 },
    { label: "Apr", generated: 270, saved: 540 },
    { label: "May", generated: 260, saved: 560 },
    { label: "Jun", generated: 250, saved: 600 },
    { label: "Jul", generated: 240, saved: 620 },
    { label: "Aug", generated: 235, saved: 650 },
  ];
  const yearly = [
    { label: "2021", generated: 4100, saved: 4600 },
    { label: "2022", generated: 3900, saved: 5100 },
    { label: "2023", generated: 3700, saved: 5600 },
    { label: "2024", generated: 3600, saved: 6000 },
    { label: "2025", generated: 3450, saved: 6245 },
  ];

  // Recommendations (compose from AI + curated actions)
  const recs = [
    {
      title: "Switch to Supplier D",
      description:
        "Offers a similar product with a 20% lower carbon footprint.",
      impact: "−20% CO2e",
      confidence: 0.82,
      primary: "View Supplier",
      onPrimary: () => {},
      secondary: "Learn More",
      onSecondary: () => {},
    },
    {
      title: "Optimize Shipping Routes",
      description:
        "Reduce emissions by 15% by prioritizing rail over road in West corridor.",
      impact: "−15% CO2e",
      confidence: 0.78,
      primary: "View Recommendations",
      onPrimary: () => {},
    },
    {
      title: "Invest in Renewable Energy",
      description:
        "Install rooftop solar at Plant A to offset scope 2 electricity.",
      impact: "+320 kg Saved",
      confidence: 0.7,
      primary: "Learn More",
      onPrimary: () => {},
    },
  ];

  // Activity feed (derive from projects and supplier interactions)
  const activities = [
    {
      type: "supplier_onboarded",
      title: "New Supplier Onboarded",
      subtitle: "Supplier E added to the system",
      timestamp: new Date().toISOString(),
    },
    {
      type: "category_updated",
      title: "Product Category Updated",
      subtitle: "Category: Packaging updated",
      timestamp: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    },
    {
      type: "report_generated",
      title: "Sustainability Report Generated",
      subtitle: "Report for Q3 2025 generated",
      timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onToggleSidebar={() => setSidebarOpen(true)}
        onSearch={() => {}}
        userProfile={userProfile}
        kpis={headerKpis}
        notificationsCount={3}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath="/dashboard"
        onNavigate={() => {}}
      />

      <Container maxWidth="xl" className="py-6">
        <Typography variant="h5" className="text-slate-900 font-semibold">
          Dashboard
        </Typography>
        <Typography variant="body2" className="text-slate-500">
          Welcome back, {userProfile.personalInfo.name.split(" ")}. Here’s your
          sustainable procurement overview.
        </Typography>

        <div className="mt-4">
          <KPICards stats={kpis} />
        </div>

        <div className="mt-8">
          <Typography
            variant="subtitle1"
            className="font-semibold text-slate-900 mb-3"
          >
            Products of Interest
          </Typography>
          <ProductCards products={products} suppliers={suppliers} />
        </div>

        <Grid container spacing={3} className="mt-2">
          <Grid item xs={12} md={8}>
            <CarbonFootprintChart dataMonthly={monthly} dataYearly={yearly} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              className="font-semibold text-slate-900 mb-3"
            >
              Actionable Recommendations
            </Typography>
            <RecommendationsPanel recommendations={recs} />
          </Grid>
        </Grid>

        <Grid container spacing={3} className="mt-1">
          <Grid item xs={12} md={8}>
            <Typography
              variant="subtitle1"
              className="font-semibold text-slate-900 mb-3"
            >
              Supplier Performance Overview
            </Typography>
            <SupplierOverview suppliers={suppliers} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActivityFeed activities={activities} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
