export const procurementProjects = [
  {
    id: 9001,
    name: "Q4 Office Supplies Procurement",
    description: "Consolidated paper and stationery purchase for Q4.",
    products: [
      {
        productId: 101,
        quantity: 5000,
        unit: "ream",
        specifications: "A4, 80gsm, 100% recycled",
      },
    ],
    budget: 50000,
    timeline: {
      start: "2025-09-01",
      bidDeadline: "2025-09-15",
      award: "2025-09-30",
      deliveryWindow: "2025-10-10 to 2025-10-20",
    },
    sustainabilityPriorities: {
      carbonFootprint: 0.4,
      recycling: 0.3,
      certifications: 0.3,
    },
    baseline: {
      currentEmissions: 120, // t CO2e
      projectedEmissions: 85, // t CO2e
      savingsPercentage: 29.2, // %
      costImplication: 5000, // currency units
    },
    bidding: {
      method: "Open Tender",
      status: "accepting_bids",
      shortlistedSupplierIds: [2, 1, 3],
    },
    interestedSuppliers: [
      {
        supplierId: 2,
        interestLevel: "high",
        preliminaryProposal: {
          price: 45000,
          deliveryTimeDays: 14,
          sustainabilityScore: 8.2,
        },
      },
      {
        supplierId: 1,
        interestLevel: "medium",
        preliminaryProposal: {
          price: 46200,
          deliveryTimeDays: 10,
          sustainabilityScore: 8.5,
        },
      },
    ],
    communications: [
      {
        supplierId: 2,
        timestamp: "2025-09-03T10:05:00Z",
        message: "Submitted clarifications and preliminary pricing.",
      },
      {
        supplierId: 1,
        timestamp: "2025-09-04T14:30:00Z",
        message: "Can commit to 10-day delivery with rail transport.",
      },
    ],
    milestones: [
      { name: "Bid Opening", date: "2025-09-16", status: "upcoming" },
      { name: "Evaluation Complete", date: "2025-09-25", status: "upcoming" },
      { name: "Award", date: "2025-09-30", status: "upcoming" },
    ],
  },
  {
    id: 9002,
    name: "FY2025 Electronics Sourcing",
    description: "Components for Q1 device builds with low embodied carbon.",
    products: [
      {
        productId: 102,
        quantity: 30000,
        unit: "piece",
        specifications: "Aluminum bottle 750ml",
      },
    ],
    budget: 480000,
    timeline: {
      start: "2025-10-05",
      bidDeadline: "2025-10-25",
      award: "2025-11-05",
      deliveryWindow: "2025-12-01 to 2026-01-15",
    },
    sustainabilityPriorities: {
      carbonFootprint: 0.5,
      recycling: 0.2,
      certifications: 0.3,
    },
    baseline: {
      currentEmissions: 640,
      projectedEmissions: 520,
      savingsPercentage: 18.8,
      costImplication: -12000,
    },
    bidding: {
      method: "Selective Bidding",
      status: "draft",
      shortlistedSupplierIds: [5, 1, 7],
    },
    interestedSuppliers: [
      {
        supplierId: 5,
        interestLevel: "high",
        preliminaryProposal: {
          price: 445000,
          deliveryTimeDays: 28,
          sustainabilityScore: 8.1,
        },
      },
      {
        supplierId: 7,
        interestLevel: "low",
        preliminaryProposal: {
          price: 430000,
          deliveryTimeDays: 35,
          sustainabilityScore: 7.0,
        },
      },
    ],
    communications: [],
    milestones: [
      { name: "RFQ Issue", date: "2025-10-10", status: "upcoming" },
      { name: "Bid Opening", date: "2025-10-26", status: "upcoming" },
    ],
  },
];
