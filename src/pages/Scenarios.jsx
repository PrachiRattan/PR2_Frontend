// src/pages/Scenarios.jsx
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

// Common components
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

// Scenario components
import ScenarioBuilder from "../components/scenarios/ScenarioBuilder";
import RouteAnalyzer from "../components/scenarios/RouteAnalyzer";
import AIRecommendations from "../components/scenarios/AIRecommendations";
import ComparisonMatrix from "../components/scenarios/ComparisonMatrix";
import ImpactSimulator from "../components/scenarios/ImpactSimulator";

// Mock data
import { suppliers } from "../data/mockData/suppliers";
import { userProfile } from "../data/mockData/userProfile";
import { scenarioComparison } from "../data/mockData/scenarios";

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="mt-6">
    {value === index && children}
  </div>
);

export default function Scenarios() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarios, setScenarios] = useState(scenarioComparison);

  const handleCreateScenario = (scenarioData) => {
    const newScenario = {
      id: Math.max(...scenarios.map((s) => s.id), 0) + 1,
      ...scenarioData,
      totalImpact: {
        carbon: 450,
        cost: 48000,
        sustainabilityScore: 8.1,
        delivery: 12,
      },
    };
    setScenarios([...scenarios, newScenario]);
    setCurrentScenario(newScenario);
  };

  const handleRecommendationSelect = (recommendation) => {
    console.log("Selected recommendation:", recommendation);
    // Apply recommendation logic
  };

  const handleScenarioSelect = (scenario) => {
    setCurrentScenario(scenario);
    console.log("Selected scenario:", scenario);
  };

  const tabs = [
    { label: "Scenario Builder", value: 0 },
    { label: "AI Recommendations", value: 1 },
    { label: "Route Analysis", value: 2 },
    { label: "Comparison Matrix", value: 3 },
    { label: "Impact Simulator", value: 4 },
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
        currentPath="/scenarios"
        onNavigate={() => {}}
      />

      <Container maxWidth="xl" className="py-6">
        <Typography variant="h4" className="font-semibold text-slate-900 mb-2">
          Scenario Analysis
        </Typography>
        <Typography variant="body2" className="text-slate-500 mb-6">
          Build and analyze procurement scenarios to optimize sustainability and
          cost-effectiveness.
        </Typography>

        <Box className="bg-white rounded-lg border">
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            className="border-b"
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
              <ScenarioBuilder onCreateScenario={handleCreateScenario} />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box className="p-6">
              <AIRecommendations
                projectData={currentScenario}
                suppliers={suppliers}
                onRecommendationSelect={handleRecommendationSelect}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box className="p-6">
              <RouteAnalyzer
                suppliers={suppliers}
                selectedRoute={null}
                onRouteChange={(route) => console.log("Route changed:", route)}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box className="p-6">
              <ComparisonMatrix
                scenarios={scenarios}
                onScenarioSelect={handleScenarioSelect}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Box className="p-6">
              <ImpactSimulator
                baselineScenario={currentScenario}
                onSimulationChange={(simulation) =>
                  console.log("Simulation:", simulation)
                }
              />
            </Box>
          </TabPanel>
        </Box>
      </Container>
    </div>
  );
}
