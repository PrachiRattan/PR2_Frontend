export const emissionFactors = {
  metadata: {
    version: "2025.1",
    lastUpdated: "2025-07-31",
    notes: "Representative mock factors for proof-of-concept.",
  },
  transport: {
    truck: { kgCO2ePerTonKm: 0.1 },
    rail: { kgCO2ePerTonKm: 0.025 },
    sea: { kgCO2ePerTonKm: 0.008 },
    air: { kgCO2ePerTonKm: 0.6 },
  },
  electricityGrid: {
    NorthAmerica: { kgCO2ePerKWh: 0.4 },
    Europe: { kgCO2ePerKWh: 0.25 },
    Asia: { kgCO2ePerKWh: 0.55 },
  },
  materials: {
    paper: { kgCO2ePerKgVirgin: 1.3, kgCO2ePerKgRecycled: 0.9 },
    aluminum: { kgCO2ePerKgVirgin: 16, kgCO2ePerKgRecycled: 4 },
    plastic: { kgCO2ePerKgVirgin: 2.7, kgCO2ePerKgRecycled: 1.5 },
    steel: { kgCO2ePerKgVirgin: 2.0, kgCO2ePerKgRecycled: 0.7 },
    cotton: { kgCO2ePerKgConventional: 5.0, kgCO2ePerKgOrganic: 3.8 },
  },
  packaging: {
    cardboard: { kgCO2ePerKg: 1.2 },
    ldpeFilm: { kgCO2ePerKg: 2.5 },
  },
  defaults: {
    scope1IntensityPerRevenue: 10, // t CO2e per $M (mock baseline)
    scope2IntensityPerRevenue: 8, // t CO2e per $M
    scope3IntensityPerRevenue: 30, // t CO2e per $M
  },
};
