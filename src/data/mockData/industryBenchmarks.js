export const industryBenchmarks = {
  sectors: {
    Technology: {
      avgScore: 7.8,
      topQuartile: 8.6,
      recycledContentTarget: 40,
      renewableEnergyTarget: 50,
    },
    Manufacturing: {
      avgScore: 7.2,
      topQuartile: 8.2,
      recycledContentTarget: 50,
      renewableEnergyTarget: 40,
    },
    Logistics: {
      avgScore: 7.5,
      topQuartile: 8.3,
      recycledContentTarget: 20,
      renewableEnergyTarget: 35,
    },
    Textiles: {
      avgScore: 7.1,
      topQuartile: 8.0,
      recycledContentTarget: 35,
      renewableEnergyTarget: 30,
    },
    Metals: {
      avgScore: 7.4,
      topQuartile: 8.3,
      recycledContentTarget: 60,
      renewableEnergyTarget: 45,
    },
    Chemicals: {
      avgScore: 7.3,
      topQuartile: 8.1,
      recycledContentTarget: 25,
      renewableEnergyTarget: 50,
    },
    Agriculture: {
      avgScore: 7.0,
      topQuartile: 7.9,
      recycledContentTarget: 30,
      renewableEnergyTarget: 25,
    },
  },
  thresholds: {
    perUnitCO2e: {
      OfficeSupplies: { good: 0.0, average: 2.0, poor: 4.0 }, // kg CO2e per unit category thresholds (mock)
      Packaging: { good: 0.0, average: 4.0, poor: 8.0 },
      Chemicals: { good: 0.0, average: 2.5, poor: 5.0 },
      Apparel: { good: 0.0, average: 2.2, poor: 4.5 },
    },
    kpis: {
      onTimeDeliveryGoodMin: 95, // %
      defectRateGoodMax: 1.5, // %
      auditScoreGoodMin: 85, // /100
    },
  },
  certificationWeights: {
    ISO14001: 0.15,
    ISO14067: 0.1,
    FSC: 0.08,
    FairTrade: 0.1,
    "B-Corp": 0.1,
    ISO50001: 0.08,
    ResponsibleSteel: 0.1,
    ECOLABEL: 0.08,
    "OEKO-TEX": 0.08,
  },
  policyWeights: {
    "Environmental Policy": 0.1,
    "Supplier Code of Conduct": 0.05,
    "Green Transport Policy": 0.05,
    "Net Zero Roadmap": 0.12,
    "Chemical Management Policy": 0.06,
  },
  scoreNormalization: {
    carbonWeight: 0.4,
    certWeight: 0.2,
    recyclingWeight: 0.15,
    policyWeight: 0.1,
    wasteWeight: 0.15,
  },
  recyclingTargets: {
    paper: 85,
    aluminum: 60,
    plastic: 35,
    cotton: 40,
    steel: 60,
  },
};
