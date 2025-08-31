// src/pages/Procurement.jsx
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Common components
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

// Procurement components
import ProjectForm from "../components/procurement/ProjectForm";
import CarbonCalculator from "../components/procurement/CarbonCalculator";
import SupplierSelection from "../components/procurement/SupplierSelection";
import BiddingDashboard from "../components/procurement/BiddingDashboard";
import ProposalEvaluation from "../components/procurement/ProposalEvaluation";

// Mock data
import { suppliers } from "../data/mockData/suppliers";
import { procurementProjects } from "../data/mockData/procurementProjects";
import { userProfile } from "../data/mockData/userProfile";

export default function Procurement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [shortlistedSuppliers, setShortlistedSuppliers] = useState([]);

  const handleCreateProject = (projectData) => {
    console.log("Creating project:", projectData);
    setActiveProject(projectData);
  };

  const handleSupplierShortlist = (supplier) => {
    setShortlistedSuppliers((prev) => {
      const exists = prev.find((s) => s.id === supplier.id);
      if (exists) {
        return prev.filter((s) => s.id !== supplier.id);
      } else {
        return [...prev, supplier];
      }
    });
  };

  const mockProposals = [
    {
      supplierId: 1,
      supplierName: "EcoTech Solutions",
      price: 45000,
      sustainability: 8.6,
      delivery: 14,
      quality: 92,
      experience: 12,
    },
    {
      supplierId: 2,
      supplierName: "GreenPaper Co",
      price: 42000,
      sustainability: 8.2,
      delivery: 16,
      quality: 88,
      experience: 18,
    },
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
        currentPath="/procurement"
        onNavigate={() => {}}
      />

      <Container maxWidth="xl" className="py-6">
        <Typography variant="h4" className="font-semibold text-slate-900 mb-6">
          New Procurement Project
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Box className="space-y-6">
              <ProjectForm onSubmit={handleCreateProject} onCancel={() => {}} />

              {activeProject && (
                <BiddingDashboard
                  projects={[activeProject, ...procurementProjects]}
                  interestedSuppliers={
                    procurementProjects?.interestedSuppliers || []
                  }
                  onViewProposal={(proposal) =>
                    console.log("View proposal:", proposal)
                  }
                  onSendMessage={(message) =>
                    console.log("Send message:", message)
                  }
                />
              )}

              {shortlistedSuppliers.length >= 2 && (
                <ProposalEvaluation
                  proposals={mockProposals}
                  onEvaluate={(proposals, weights) =>
                    console.log("Evaluate:", proposals, weights)
                  }
                  onAward={(proposal) => console.log("Award to:", proposal)}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box className="space-y-6">
              <CarbonCalculator
                currentSupplier={suppliers}
                alternativeSuppliers={suppliers.slice(1, 4)}
                quantity={5000}
              />

              <SupplierSelection
                availableSuppliers={suppliers}
                shortlistedSuppliers={shortlistedSuppliers}
                onSupplierShortlist={handleSupplierShortlist}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
