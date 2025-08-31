// src/hooks/useCarbonCalculation.js
import { useState, useEffect, useMemo } from "react";
import CarbonFootprintCalculator from "../services/calculations/carbonFootprint";

export const useCarbonCalculation = (suppliers = [], quantity = 1000) => {
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [baselineSupplier, setBaselineSupplier] = useState(null);
  const [calculations, setCalculations] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculate footprints for all suppliers
  const supplierFootprints = useMemo(() => {
    if (suppliers.length === 0) return [];

    return CarbonFootprintCalculator.compareSuppliers(suppliers, quantity);
  }, [suppliers, quantity]);

  // Calculate savings compared to baseline
  const savingsCalculations = useMemo(() => {
    if (!baselineSupplier || selectedSuppliers.length === 0) return {};

    const results = {};

    selectedSuppliers.forEach((supplier) => {
      results[supplier.id] = CarbonFootprintCalculator.calculateSavings(
        baselineSupplier,
        supplier,
        quantity
      );
    });

    return results;
  }, [baselineSupplier, selectedSuppliers, quantity]);

  // Get best performing supplier
  const bestSupplier = useMemo(() => {
    if (supplierFootprints.length === 0) return null;

    return supplierFootprints.reduce((best, current) =>
      current.perUnit < best.perUnit ? current : best
    );
  }, [supplierFootprints]);

  // Get worst performing supplier
  const worstSupplier = useMemo(() => {
    if (supplierFootprints.length === 0) return null;

    return supplierFootprints.reduce((worst, current) =>
      current.perUnit > worst.perUnit ? current : worst
    );
  }, [supplierFootprints]);

  // Calculate potential optimization
  const optimizationPotential = useMemo(() => {
    if (!bestSupplier || !worstSupplier) return null;

    const avgFootprint =
      supplierFootprints.reduce((sum, s) => sum + s.perUnit, 0) /
      supplierFootprints.length;
    const potentialSavings = (avgFootprint - bestSupplier.perUnit) * quantity;
    const percentageSavings =
      avgFootprint > 0
        ? (potentialSavings / (avgFootprint * quantity)) * 100
        : 0;

    return {
      potentialSavings,
      percentageSavings,
      currentAverage: avgFootprint,
      bestPerformance: bestSupplier.perUnit,
      worstPerformance: worstSupplier.perUnit,
    };
  }, [bestSupplier, worstSupplier, supplierFootprints, quantity]);

  // Calculate transport emissions by mode
  const calculateTransportEmissions = (supplier, transportMode = "truck") => {
    const distance = CarbonFootprintCalculator.estimateDistance(
      supplier.location
    );
    const weight = quantity * 0.5; // Assume 0.5kg per unit

    return CarbonFootprintCalculator.calculateTransportModeEmissions(
      distance,
      weight,
      transportMode
    );
  };

  // Compare transport modes for a supplier
  const compareTransportModes = (supplier) => {
    const modes = ["truck", "rail", "sea", "air"];

    return modes.map((mode) => ({
      mode,
      emissions: calculateTransportEmissions(supplier, mode),
      distance: CarbonFootprintCalculator.estimateDistance(supplier.location),
    }));
  };

  // Calculate lifecycle emissions for products
  const calculateProductLifecycle = (products) => {
    return products.map((product) =>
      CarbonFootprintCalculator.calculateProductLifecycle(product, quantity)
    );
  };

  // Get material emission factors
  const getMaterialEmissions = (material, isRecycled = false) => {
    return CarbonFootprintCalculator.getMaterialEmissionFactor(
      material,
      isRecycled
    );
  };

  // Calculate scenario impact
  const calculateScenarioImpact = (supplierAllocations) => {
    let totalEmissions = 0;
    let totalCost = 0; // Would need cost data

    supplierAllocations.forEach(({ supplier, allocation }) => {
      const footprint = CarbonFootprintCalculator.calculateSupplierFootprint(
        supplier,
        allocation
      );
      totalEmissions += footprint.total;
    });

    return {
      totalEmissions,
      totalCost,
      averageEmissionsPerUnit: totalEmissions / quantity,
      breakdown: supplierAllocations.map(({ supplier, allocation }) => ({
        supplierId: supplier.id,
        supplierName: supplier.name,
        allocation,
        emissions: CarbonFootprintCalculator.calculateSupplierFootprint(
          supplier,
          allocation
        ).total,
        percentage: (allocation / quantity) * 100,
      })),
    };
  };

  // Set baseline supplier for comparisons
  const setBaseline = (supplier) => {
    setBaselineSupplier(supplier);
  };

  // Add supplier to comparison
  const addSupplierToComparison = (supplier) => {
    setSelectedSuppliers((prev) => {
      if (prev.find((s) => s.id === supplier.id)) return prev;
      return [...prev, supplier];
    });
  };

  // Remove supplier from comparison
  const removeSupplierFromComparison = (supplierId) => {
    setSelectedSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
  };

  // Clear all comparisons
  const clearComparisons = () => {
    setSelectedSuppliers([]);
    setBaselineSupplier(null);
  };

  // Get summary statistics
  const getSummaryStats = () => {
    if (supplierFootprints.length === 0) return null;

    const emissions = supplierFootprints.map((s) => s.perUnit);
    const total = emissions.reduce((sum, e) => sum + e, 0);
    const avg = total / emissions.length;
    const min = Math.min(...emissions);
    const max = Math.max(...emissions);
    const median = emissions.sort((a, b) => a - b)[
      Math.floor(emissions.length / 2)
    ];

    return {
      average: avg,
      median,
      minimum: min,
      maximum: max,
      range: max - min,
      standardDeviation: Math.sqrt(
        emissions.reduce((sum, e) => sum + Math.pow(e - avg, 2), 0) /
          emissions.length
      ),
    };
  };

  return {
    // State
    selectedSuppliers,
    baselineSupplier,
    calculations,
    loading,

    // Computed data
    supplierFootprints,
    savingsCalculations,
    bestSupplier,
    worstSupplier,
    optimizationPotential,

    // Actions
    setBaseline,
    addSupplierToComparison,
    removeSupplierFromComparison,
    clearComparisons,

    // Calculations
    calculateTransportEmissions,
    compareTransportModes,
    calculateProductLifecycle,
    getMaterialEmissions,
    calculateScenarioImpact,
    getSummaryStats,
  };
};

export default useCarbonCalculation;
