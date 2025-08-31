export const products = [
  {
    id: 101,
    name: "Recycled Paper A4 80gsm",
    category: "Office Supplies",
    unit: "ream",
    specifications: "A4, 80gsm, 100% recycled",
    baselineSupplierId: 2, // GreenPaper Co
    currentSupplierId: 2,
    sustainabilityScore: 8.5,
    priority: "high",
    tags: ["paper", "recycled", "office"],
    lastUpdated: "2025-08-28",
    lifecycle: {
      manufactureCO2ePerUnit: 1.1, // kg
      useCO2ePerUnit: 0.0, // kg
      endOfLifeCO2ePerUnit: 0.2, // kg
      recycledContentPercent: 85,
    },
    targets: {
      recycledContentPercent: 90,
      intensityReductionPercent: 10,
      certificationsRequired: ["FSC", "ISO14001"],
    },
  },
  {
    id: 102,
    name: "Aluminum Bottle 750ml",
    category: "Packaging",
    unit: "piece",
    specifications: "Food-grade, anodized, BPA-free",
    baselineSupplierId: 5, // CircuMetals
    currentSupplierId: 5,
    sustainabilityScore: 8.0,
    priority: "medium",
    tags: ["aluminum", "reusable", "packaging"],
    lastUpdated: "2025-08-20",
    lifecycle: {
      manufactureCO2ePerUnit: 5.2,
      useCO2ePerUnit: -0.1, // credit for long-term reuse (mock)
      endOfLifeCO2ePerUnit: 0.6,
      recycledContentPercent: 60,
    },
    targets: {
      recycledContentPercent: 70,
      intensityReductionPercent: 12,
      certificationsRequired: ["ISO14001"],
    },
  },
  {
    id: 103,
    name: "Low-VOC Interior Paint",
    category: "Chemicals",
    unit: "liter",
    specifications: "VOC ≤ 30 g/L, matte finish",
    baselineSupplierId: 6, // NordicChem Paints
    currentSupplierId: 6,
    sustainabilityScore: 7.9,
    priority: "medium",
    tags: ["low-VOC", "paint", "indoor-air"],
    lastUpdated: "2025-08-22",
    lifecycle: {
      manufactureCO2ePerUnit: 2.3,
      useCO2ePerUnit: 0.0,
      endOfLifeCO2ePerUnit: 0.4,
      recycledContentPercent: 15,
    },
    targets: {
      recycledContentPercent: 25,
      intensityReductionPercent: 8,
      certificationsRequired: ["ECOLABEL", "ISO14001"],
    },
  },
  {
    id: 104,
    name: "Organic Cotton T-Shirt",
    category: "Apparel",
    unit: "piece",
    specifications: "100% organic cotton, unisex",
    baselineSupplierId: 8, // AgroFair Cotton
    currentSupplierId: 8,
    sustainabilityScore: 7.6,
    priority: "low",
    tags: ["cotton", "organic", "textiles"],
    lastUpdated: "2025-08-16",
    lifecycle: {
      manufactureCO2ePerUnit: 2.0,
      useCO2ePerUnit: 0.2,
      endOfLifeCO2ePerUnit: 0.3,
      recycledContentPercent: 35,
    },
    targets: {
      recycledContentPercent: 45,
      intensityReductionPercent: 10,
      certificationsRequired: ["FairTrade", "OEKO-TEX"],
    },
  },
];
