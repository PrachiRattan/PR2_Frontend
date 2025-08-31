export const suppliers = [
  {
    id: 1,
    name: "EcoTech Solutions",
    logo: "/assets/logos/ecotech.png",
    location: {
      city: "San Francisco",
      country: "USA",
      region: "North America",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    industry: "Technology",
    yearsInOperation: 12,
    companySize: "500-1000",
    sustainabilityScore: 8.6,
    certifications: ["ISO14001", "ISO14067", "B-Corp"],
    policies: [
      { type: "Environmental Policy", document: "/assets/docs/ecotech/env-policy.pdf", lastUpdated: "2025-06-01" },
      { type: "Supplier Code of Conduct", document: "/assets/docs/ecotech/supplier-coc.pdf", lastUpdated: "2025-04-10" }
    ],
    carbonFootprint: {
      perUnit: 2.3,              // kg CO2e per unit (representative mock)
      scope1: 420,               // t CO2e (annual)
      scope2: 260,               // t CO2e (annual)
      scope3: 1180,              // t CO2e (annual)
      intensityPerRevenue: 28.5  // t CO2e per $M
    },
    wasteManagement: {
      totalWaste: 980,           // t/year
      recycledPercentage: 86,
      wasteToEnergy: 9,
      hazardousWaste: 1.2        // t/year
    },
    recyclingContent: 52,        // average % recycled content across key SKUs
    renewableEnergyPercent: 48,
    waterIntensity: 1.1,         // m3 per unit (mock)
    kpis: {
      onTimeDelivery: 97.2,      // %
      defectRate: 0.8,           // %
      auditScore: 92,            // /100
      dataCompleteness: 0.95,    // 0-1
      verification: "third-party"
    },
    sustainabilityPrograms: [
      {
        name: "Zero Waste Initiative",
        status: "active",
        startDate: "2024-01-01",
        targets: "100% waste diversion by 2026",
        progress: 64               // %
      },
      {
        name: "SBTi Near-Term Target",
        status: "active",
        startDate: "2023-09-01",
        targets: "42% Scope 1+2 reduction by 2030",
        progress: 31
      }
    ],
    lastInteraction: "2025-08-25",
    preferred: true,
    riskLevel: "low",
    notes: "Strong circularity program; robust supplier auditing."
  },
  {
    id: 2,
    name: "GreenPaper Co",
    logo: "/assets/logos/greenpaper.png",
    location: {
      city: "Portland",
      country: "USA",
      region: "North America",
      coordinates: { lat: 45.5152, lng: -122.6784 }
    },
    industry: "Manufacturing",
    yearsInOperation: 18,
    companySize: "1000-5000",
    sustainabilityScore: 8.2,
    certifications: ["ISO14001", "FSC", "FairTrade"],
    policies: [
      { type: "Forest Stewardship Policy", document: "/assets/docs/greenpaper/fsc-policy.pdf", lastUpdated: "2025-03-20" }
    ],
    carbonFootprint: {
      perUnit: 1.2,
      scope1: 600,
      scope2: 450,
      scope3: 2200,
      intensityPerRevenue: 35.1
    },
    wasteManagement: {
      totalWaste: 5200,
      recycledPercentage: 90,
      wasteToEnergy: 4,
      hazardousWaste: 3.4
    },
    recyclingContent: 85,
    renewableEnergyPercent: 62,
    waterIntensity: 2.9,
    kpis: {
      onTimeDelivery: 94.8,
      defectRate: 1.3,
      auditScore: 88,
      dataCompleteness: 0.9,
      verification: "third-party"
    },
    sustainabilityPrograms: [
      {
        name: "Closed-Loop Fiber Recovery",
        status: "active",
        startDate: "2024-04-01",
        targets: "95% fiber recovery rate by 2027",
        progress: 58
      }
    ],
    lastInteraction: "2025-08-15",
    preferred: true,
    riskLevel: "medium",
    notes: "High recycled content; moderate water intensity."
  },
  {
    id: 3,
    name: "OceanRail Logistics",
    logo: "/assets/logos/oceanrail.png",
    location: {
      city: "Rotterdam",
      country: "Netherlands",
      region: "Europe",
      coordinates: { lat: 51.9244, lng: 4.4777 }
    },
    industry: "Logistics",
    yearsInOperation: 25,
    companySize: "5000+",
    sustainabilityScore: 7.9,
    certifications: ["ISO14001", "ISO50001"],
    policies: [{ type: "Green Transport Policy", document: "/assets/docs/oceanrail/green-transport.pdf", lastUpdated: "2025-05-05" }],
    carbonFootprint: {
      perUnit: 0.65,
      scope1: 2200,
      scope2: 800,
      scope3: 5400,
      intensityPerRevenue: 52.3
    },
    wasteManagement: {
      totalWaste: 1450,
      recycledPercentage: 74,
      wasteToEnergy: 12,
      hazardousWaste: 2.1
    },
    recyclingContent: 18,
    renewableEnergyPercent: 38,
    waterIntensity: 0.3,
    kpis: {
      onTimeDelivery: 96.1,
      defectRate: 0.4,
      auditScore: 85,
      dataCompleteness: 0.82,
      verification: "self-reported"
    },
    sustainabilityPrograms: [
      {
        name: "Rail Mode Shift",
        status: "active",
        startDate: "2023-03-01",
        targets: "30% shift from road to rail by 2026",
        progress: 22
      }
    ],
    lastInteraction: "2025-08-20",
    preferred: false,
    riskLevel: "low",
    notes: "Strong intermodal capabilities; promoting rail and sea."
  },
  {
    id: 4,
    name: "SunWeave Textiles",
    logo: "/assets/logos/sunweave.png",
    location: {
      city: "Dhaka",
      country: "Bangladesh",
      region: "Asia",
      coordinates: { lat: 23.8103, lng: 90.4125 }
    },
    industry: "Textiles",
    yearsInOperation: 15,
    companySize: "1000-5000",
    sustainabilityScore: 7.5,
    certifications: ["ISO14001", "FairTrade", "OEKO-TEX"],
    policies: [{ type: "Chemical Management Policy", document: "/assets/docs/sunweave/chem-policy.pdf", lastUpdated: "2025-01-12" }],
    carbonFootprint: {
      perUnit: 3.4,
      scope1: 1200,
      scope2: 1500,
      scope3: 3100,
      intensityPerRevenue: 60.5
    },
    wasteManagement: {
      totalWaste: 2600,
      recycledPercentage: 61,
      wasteToEnergy: 6,
      hazardousWaste: 5.8
    },
    recyclingContent: 32,
    renewableEnergyPercent: 22,
    waterIntensity: 4.8,
    kpis: {
      onTimeDelivery: 92.4,
      defectRate: 1.8,
      auditScore: 81,
      dataCompleteness: 0.78,
      verification: "third-party"
    },
    sustainabilityPrograms: [
      { name: "Water Recycling Plant", status: "active", startDate: "2024-07-01", targets: "30% water reuse by 2026", progress: 19 }
    ],
    lastInteraction: "2025-08-18",
    preferred: false,
    riskLevel: "medium",
    notes: "Working on water intensity and renewable energy adoption."
  },
  {
    id: 5,
    name: "CircuMetals",
    logo: "/assets/logos/circumetals.png",
    location: {
      city: "Hamburg",
      country: "Germany",
      region: "Europe",
      coordinates: { lat: 53.5511, lng: 9.9937 }
    },
    industry: "Metals",
    yearsInOperation: 30,
    companySize: "1000-5000",
    sustainabilityScore: 8.1,
    certifications: ["ISO14001", "ResponsibleSteel"],
    policies: [{ type: "Net Zero Roadmap", document: "/assets/docs/circumetals/netzero.pdf", lastUpdated: "2025-02-28" }],
    carbonFootprint: {
      perUnit: 5.8,
      scope1: 2600,
      scope2: 3100,
      scope3: 8900,
      intensityPerRevenue: 75.4
    },
    wasteManagement: {
      totalWaste: 8000,
      recycledPercentage: 78,
      wasteToEnergy: 3,
      hazardousWaste: 9.2
    },
    recyclingContent: 65,
    renewableEnergyPercent: 44,
    waterIntensity: 3.1,
    kpis: {
      onTimeDelivery: 95.6,
      defectRate: 1.2,
      auditScore: 87,
      dataCompleteness: 0.88,
      verification: "third-party"
    },
    sustainabilityPrograms: [
      { name: "Electric Arc Furnace Retrofit", status: "active", startDate: "2023-11-01", targets: "20% intensity cut by 2026", progress: 37 }
    ],
    lastInteraction: "2025-08-12",
    preferred: true,
    riskLevel: "low",
    notes: "High recycled content; strong steel circularity."
  },
  {
    id: 6,
    name: "NordicChem Paints",
    logo: "/assets/logos/nordicchem.png",
    location: {
      city: "Stockholm",
      country: "Sweden",
      region: "Europe",
      coordinates: { lat: 59.3293, lng: 18.0686 }
    },
    industry: "Chemicals",
    yearsInOperation: 22,
    companySize: "500-1000",
    sustainabilityScore: 7.8,
    certifications: ["ISO14001", "ECOLABEL"],
    policies: [{ type: "VOC Reduction Policy", document: "/assets/docs/nordicchem/voc-policy.pdf", lastUpdated: "2025-07-10" }],
    carbonFootprint: {
      perUnit: 2.9,
      scope1: 900,
      scope2: 650,
      scope3: 2700,
      intensityPerRevenue: 48.3
    },
    wasteManagement: {
      totalWaste: 1400,
      recycledPercentage: 69,
      wasteToEnergy: 14,
      hazardousWaste: 4.3
    },
    recyclingContent: 20,
    renewableEnergyPercent: 58,
    waterIntensity: 1.6,
    kpis: { onTimeDelivery: 93.1, defectRate: 1.1, auditScore: 84, dataCompleteness: 0.85, verification: "third-party" },
    sustainabilityPrograms: [
      { name: "Low-VOC Line Transition", status: "active", startDate: "2024-10-01", targets: "90% low-VOC by 2026", progress: 41 }
    ],
    lastInteraction: "2025-08-22",
    preferred: false,
    riskLevel: "low",
    notes: "Strong renewable energy mix; ongoing VOC reduction."
  },
  {
    id: 7,
    name: "Pacifica Plastics",
    logo: "/assets/logos/pacifica.png",
    location: {
      city: "Shenzhen",
      country: "China",
      region: "Asia",
      coordinates: { lat: 22.5431, lng: 114.0579 }
    },
    industry: "Manufacturing",
    yearsInOperation: 10,
    companySize: "500-1000",
    sustainabilityScore: 7.1,
    certifications: ["ISO14001"],
    policies: [{ type: "Plastic Stewardship Policy", document: "/assets/docs/pacifica/plastic-policy.pdf", lastUpdated: "2025-05-30" }],
    carbonFootprint: {
      perUnit: 4.2,
      scope1: 1400,
      scope2: 1700,
      scope3: 4600,
      intensityPerRevenue: 66.2
    },
    wasteManagement: {
      totalWaste: 4100,
      recycledPercentage: 55,
      wasteToEnergy: 7,
      hazardousWaste: 6.7
    },
    recyclingContent: 28,
    renewableEnergyPercent: 18,
    waterIntensity: 2.2,
    kpis: { onTimeDelivery: 91.3, defectRate: 2.1, auditScore: 78, dataCompleteness: 0.72, verification: "self-reported" },
    sustainabilityPrograms: [{ name: "PCR Resin Substitution", status: "planning", startDate: "2025-09-15", targets: "50% PCR by 2027", progress: 0 }],
    lastInteraction: "2025-08-10",
    preferred: false,
    riskLevel: "medium",
    notes: "Improvement opportunity in renewable energy and recycling content."
  },
  {
    id: 8,
    name: "AgroFair Cotton",
    logo: "/assets/logos/agrofair.png",
    location: {
      city: "Ahmedabad",
      country: "India",
      region: "Asia",
      coordinates: { lat: 23.0225, lng: 72.5714 }
    },
    industry: "Agriculture",
    yearsInOperation: 16,
    companySize: "500-1000",
    sustainabilityScore: 7.7,
    certifications: ["FairTrade", "Organic", "ISO14001"],
    policies: [{ type: "Regenerative Agriculture Policy", document: "/assets/docs/agrofair/regenerative.pdf", lastUpdated: "2025-03-03" }],
    carbonFootprint: {
      perUnit: 1.9,
      scope1: 500,
      scope2: 420,
      scope3: 1600,
      intensityPerRevenue: 33.4
    },
    wasteManagement: {
      totalWaste: 600,
      recycledPercentage: 72,
      wasteToEnergy: 5,
      hazardousWaste: 0.8
    },
    recyclingContent: 40,
    renewableEnergyPercent: 26,
    waterIntensity: 3.6,
    kpis: { onTimeDelivery: 93.9, defectRate: 1.4, auditScore: 83, dataCompleteness: 0.8, verification: "third-party" },
    sustainabilityPrograms: [{ name: "Drip Irrigation Expansion", status: "active", startDate: "2024-02-01", targets: "25% water reduction by 2026", progress: 21 }],
    lastInteraction: "2025-08-16",
    preferred: true,
    riskLevel: "low",
    notes: "Good agricultural practices; fair trade premiums reinvested locally."
  }
];

export const filterOptions = {
  certifications: ["ISO14001", "ISO14067", "FairTrade", "B-Corp", "FSC", "ISO50001", "ResponsibleSteel", "ECOLABEL", "OEKO-TEX"],
  carbonFootprintRange: [0, 50],             // kg CO2e per unit (UI slider bounds)
  sustainabilityScoreRange: [1, 10],
  locations: ["North America", "Europe", "Asia"],
  industries: ["Technology", "Manufacturing", "Logistics", "Textiles", "Metals", "Chemicals", "Agriculture"],
  policies: ["Environmental Policy", "Supplier Code of Conduct", "Net Zero Roadmap", "Green Transport Policy", "Chemical Management Policy"],
  companySizes: ["<500", "500-1000", "1000-5000", "5000+"],
  kpiSortKeys: ["sustainabilityScore", "onTimeDelivery", "defectRate", "carbonFootprint.perUnit", "renewableEnergyPercent"]
};
