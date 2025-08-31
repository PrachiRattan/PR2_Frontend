export const userProfile = {
  personalInfo: {
    name: "John Smith",
    title: "Senior Procurement Manager",
    department: "Supply Chain",
    email: "john.smith@company.com",
    phone: "+1-555-0123",
    photo: "/assets/avatars/john-smith.png",
    location: "New York, USA",
  },
  careerMetrics: {
    yearsInProcurement: 8,
    totalProjectsManaged: 156,
    suppliersWorkedWith: 89,
    totalCarbonSaved: 1250.5, // t CO2e
    sustainabilityImprovement: 32, // %
  },
  productPortfolio: [
    {
      category: "Office Supplies",
      experience: "5 years",
      specialization: "primary",
    },
    {
      category: "Packaging",
      experience: "3 years",
      specialization: "secondary",
    },
  ],
  supplierHistory: [
    {
      supplierId: 2,
      relationshipStart: "2023-01-15",
      projectsCompleted: 12,
      performanceRating: 4.8,
      status: "active",
    },
    {
      supplierId: 1,
      relationshipStart: "2024-03-10",
      projectsCompleted: 6,
      performanceRating: 4.6,
      status: "active",
    },
  ],
  achievements: [
    {
      title: "Sustainability Champion 2024",
      date: "2024-12-15",
      description: "25% carbon reduction across portfolio",
    },
    {
      title: "Supplier Collaboration Award 2023",
      date: "2023-11-02",
      description: "Innovative rail-mode switch program",
    },
  ],
  preferences: {
    defaultFilters: {
      certifications: ["ISO14001"],
      minScore: 7,
      region: ["North America", "Europe"],
    },
    dashboardCards: [
      "KPIs",
      "Products",
      "CarbonChart",
      "Suppliers",
      "Recommendations",
      "ActivityFeed",
    ],
    notificationSettings: { email: true, inApp: true, weeklyDigest: true },
    measurementUnits: { distance: "km", weight: "ton", emissions: "tCO2e" },
    timeZone: "America/New_York",
  },
};
