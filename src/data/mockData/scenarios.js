export const scenarioComparison = [
  {
    id: 1,
    name: "Current Supplier Mix",
    suppliers: [
      {
        supplierId: 2,
        allocation: 60,
        carbonFootprint: 75,
        cost: 30000,
        deliveryTime: 14,
      },
      {
        supplierId: 1,
        allocation: 40,
        carbonFootprint: 50,
        cost: 20000,
        deliveryTime: 10,
      },
    ],
    totalImpact: { carbon: 125, cost: 50000, sustainabilityScore: 7.9 },
  },
  {
    id: 2,
    name: "Rail-First Logistics",
    suppliers: [
      {
        supplierId: 3,
        allocation: 50,
        carbonFootprint: 42,
        cost: 26000,
        deliveryTime: 12,
      },
      {
        supplierId: 2,
        allocation: 50,
        carbonFootprint: 58,
        cost: 24000,
        deliveryTime: 15,
      },
    ],
    totalImpact: { carbon: 100, cost: 50000, sustainabilityScore: 8.1 },
  },
  {
    id: 3,
    name: "High Recycled Content",
    suppliers: [
      {
        supplierId: 5,
        allocation: 55,
        carbonFootprint: 60,
        cost: 29000,
        deliveryTime: 20,
      },
      {
        supplierId: 2,
        allocation: 45,
        carbonFootprint: 52,
        cost: 22000,
        deliveryTime: 14,
      },
    ],
    totalImpact: { carbon: 112, cost: 51000, sustainabilityScore: 8.0 },
  },
];

export const transportAnalysis = [
  {
    route: "GreenPaper Co (Portland) to Central DC",
    modes: [
      {
        type: "truck",
        distanceKm: 500,
        carbonEmission: 45,
        cost: 2000,
        timeHours: 24,
      },
      {
        type: "rail",
        distanceKm: 520,
        carbonEmission: 25,
        cost: 1500,
        timeHours: 48,
      },
    ],
  },
  {
    route: "EcoTech (San Francisco) to Plant A",
    modes: [
      {
        type: "truck",
        distanceKm: 80,
        carbonEmission: 5,
        cost: 400,
        timeHours: 6,
      },
      {
        type: "sea",
        distanceKm: 600,
        carbonEmission: 7,
        cost: 900,
        timeHours: 72,
      },
    ],
  },
];

export const aiRecommendations = {
  optimalMix: [
    { supplierId: 2, percentage: 40 },
    { supplierId: 1, percentage: 35 },
    { supplierId: 3, percentage: 25 },
  ],
  reasoning:
    "Mix prioritizes rail-capable routes and high recycled content to reduce emissions while preserving lead times.",
  confidence: 0.87,
  alternativeScenarios: [
    {
      scenarioId: 2,
      rationale: "Rail-first routes cut logistics emissions by ~20%.",
    },
    {
      scenarioId: 3,
      rationale:
        "Higher recycled content improves circularity with slight cost increase.",
    },
  ],
};
