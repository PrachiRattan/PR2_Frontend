// src/hooks/useScenarios.js
import { useState, useCallback, useMemo } from "react";
import CarbonFootprintCalculator from "../services/calculations/carbonFootprint";
import ApiService from "../services/api";

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new scenario
  const createScenario = useCallback((name, suppliers, allocations) => {
    const newScenario = {
      id: Date.now(), // Simple ID generation
      name,
      suppliers,
      allocations,
      createdAt: new Date().toISOString(),
      totalImpact: calculateScenarioImpact(suppliers, allocations),
    };

    setScenarios((prev) => [...prev, newScenario]);
    return newScenario;
  }, []);

  // Calculate scenario impact
  const calculateScenarioImpact = useCallback((suppliers, allocations) => {
    let totalCarbon = 0;
    let totalCost = 0;
    let weightedSustainabilityScore = 0;
    const totalQuantity = allocations.reduce(
      (sum, alloc) => sum + alloc.quantity,
      0
    );

    allocations.forEach(({ supplierId, quantity }) => {
      const supplier = suppliers.find((s) => s.id === supplierId);
      if (!supplier) return;

      const footprint = CarbonFootprintCalculator.calculateSupplierFootprint(
        supplier,
        quantity
      );
      totalCarbon += footprint.total;

      // Mock cost calculation (would use real pricing data)
      const estimatedCost = quantity * 50; // $50 per unit as example
      totalCost += estimatedCost;

      const weight = quantity / totalQuantity;
      weightedSustainabilityScore += supplier.sustainabilityScore * weight;
    });

    return {
      carbon: totalCarbon,
      cost: totalCost,
      sustainabilityScore: weightedSustainabilityScore,
      deliveryTime: calculateWeightedDeliveryTime(suppliers, allocations),
    };
  }, []);

  // Calculate weighted delivery time
  const calculateWeightedDeliveryTime = (suppliers, allocations) => {
    let weightedTime = 0;
    const totalQuantity = allocations.reduce(
      (sum, alloc) => sum + alloc.quantity,
      0
    );

    allocations.forEach(({ supplierId, quantity }) => {
      const supplier = suppliers.find((s) => s.id === supplierId);
      if (!supplier) return;

      // Mock delivery time based on location
      const deliveryTime = getEstimatedDeliveryTime(supplier);
      const weight = quantity / totalQuantity;
      weightedTime += deliveryTime * weight;
    });

    return Math.round(weightedTime);
  };

  // Get estimated delivery time for a supplier
  const getEstimatedDeliveryTime = (supplier) => {
    const regionTimes = {
      "North America": 5,
      Europe: 7,
      Asia: 14,
      "South America": 21,
      Africa: 18,
      Oceania: 16,
    };

    return regionTimes[supplier.location?.region] || 10;
  };

  // Compare scenarios
  const compareScenarios = useCallback(
    (scenarioIds) => {
      const selectedScenarios = scenarios.filter((s) =>
        scenarioIds.includes(s.id)
      );

      if (selectedScenarios.length === 0) return null;

      const comparison = {
        scenarios: selectedScenarios,
        metrics: {
          carbon: {
            values: selectedScenarios.map((s) => s.totalImpact.carbon),
            best: Math.min(
              ...selectedScenarios.map((s) => s.totalImpact.carbon)
            ),
            worst: Math.max(
              ...selectedScenarios.map((s) => s.totalImpact.carbon)
            ),
          },
          cost: {
            values: selectedScenarios.map((s) => s.totalImpact.cost),
            best: Math.min(...selectedScenarios.map((s) => s.totalImpact.cost)),
            worst: Math.max(
              ...selectedScenarios.map((s) => s.totalImpact.cost)
            ),
          },
          sustainability: {
            values: selectedScenarios.map(
              (s) => s.totalImpact.sustainabilityScore
            ),
            best: Math.max(
              ...selectedScenarios.map((s) => s.totalImpact.sustainabilityScore)
            ),
            worst: Math.min(
              ...selectedScenarios.map((s) => s.totalImpact.sustainabilityScore)
            ),
          },
          delivery: {
            values: selectedScenarios.map((s) => s.totalImpact.deliveryTime),
            best: Math.min(
              ...selectedScenarios.map((s) => s.totalImpact.deliveryTime)
            ),
            worst: Math.max(
              ...selectedScenarios.map((s) => s.totalImpact.deliveryTime)
            ),
          },
        },
      };

      return comparison;
    },
    [scenarios]
  );

  // Optimize scenario allocations
  const optimizeScenario = useCallback(
    (suppliers, requirements, optimizationGoal = "carbon") => {
      const totalQuantity = requirements.quantity || 1000;

      // Sort suppliers based on optimization goal
      let sortedSuppliers;
      switch (optimizationGoal) {
        case "carbon":
          sortedSuppliers = [...suppliers].sort(
            (a, b) =>
              (a.carbonFootprint?.perUnit || 0) -
              (b.carbonFootprint?.perUnit || 0)
          );
          break;
        case "sustainability":
          sortedSuppliers = [...suppliers].sort(
            (a, b) => b.sustainabilityScore - a.sustainabilityScore
          );
          break;
        case "cost":
          // Mock cost sorting (would use real cost data)
          sortedSuppliers = [...suppliers].sort(() => Math.random() - 0.5);
          break;
        default:
          sortedSuppliers = suppliers;
      }

      // Generate optimized allocations
      const allocations = [];
      let remainingQuantity = totalQuantity;

      // Primary supplier gets 60% max
      if (sortedSuppliers.length > 0) {
        const primaryAllocation = Math.min(
          totalQuantity * 0.6,
          remainingQuantity
        );
        allocations.push({
          supplierId: sortedSuppliers[0].id,
          quantity: primaryAllocation,
        });
        remainingQuantity -= primaryAllocation;
      }

      // Distribute remaining among next best suppliers
      for (
        let i = 1;
        i < Math.min(3, sortedSuppliers.length) && remainingQuantity > 0;
        i++
      ) {
        const allocation = Math.min(totalQuantity * 0.3, remainingQuantity);
        allocations.push({
          supplierId: sortedSuppliers[i].id,
          quantity: allocation,
        });
        remainingQuantity -= allocation;
      }

      const optimizedScenario = createScenario(
        `Optimized for ${optimizationGoal}`,
        suppliers,
        allocations
      );

      return optimizedScenario;
    },
    [createScenario]
  );

  // Analyze transportation routes
  const analyzeTransportation = useCallback((suppliers, destination) => {
    return suppliers.map((supplier) => {
      const routes = ["truck", "rail", "sea", "air"].map((mode) => {
        const distance = CarbonFootprintCalculator.estimateDistance(
          supplier.location
        );
        const emissions =
          CarbonFootprintCalculator.calculateTransportModeEmissions(
            distance,
            1000, // 1 ton
            mode
          );

        return {
          mode,
          distance,
          emissions,
          cost: getTransportCost(mode, distance), // Mock cost
          time: getTransportTime(mode, distance), // Mock time
        };
      });

      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        routes: routes.sort((a, b) => a.emissions - b.emissions), // Sort by emissions
      };
    });
  }, []);

  // Mock transport cost calculation
  const getTransportCost = (mode, distance) => {
    const rates = {
      truck: 0.5,
      rail: 0.3,
      sea: 0.1,
      air: 2.0,
    };
    return distance * (rates[mode] || 0.5);
  };

  // Mock transport time calculation
  const getTransportTime = (mode, distance) => {
    const speeds = {
      truck: 80, // km/h
      rail: 60,
      sea: 25,
      air: 800,
    };
    return Math.round(distance / (speeds[mode] || 80));
  };

  // Load predefined scenarios
  const loadScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getScenarios();
      setScenarios(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load scenarios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update scenario
  const updateScenario = useCallback((scenarioId, updates) => {
    setScenarios((prev) =>
      prev.map((scenario) =>
        scenario.id === scenarioId
          ? { ...scenario, ...updates, updatedAt: new Date().toISOString() }
          : scenario
      )
    );
  }, []);

  // Delete scenario
  const deleteScenario = useCallback(
    (scenarioId) => {
      setScenarios((prev) => prev.filter((s) => s.id !== scenarioId));
      if (currentScenario?.id === scenarioId) {
        setCurrentScenario(null);
      }
    },
    [currentScenario]
  );

  // Clone scenario
  const cloneScenario = useCallback(
    (scenarioId, newName) => {
      const originalScenario = scenarios.find((s) => s.id === scenarioId);
      if (!originalScenario) return null;

      const clonedScenario = {
        ...originalScenario,
        id: Date.now(),
        name: newName || `${originalScenario.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };

      setScenarios((prev) => [...prev, clonedScenario]);
      return clonedScenario;
    },
    [scenarios]
  );

  // Get scenario recommendations
  const getScenarioRecommendations = useCallback(
    (requirements) => {
      if (scenarios.length === 0) return [];

      const recommendations = [];

      // Find best carbon scenario
      const bestCarbonScenario = scenarios.reduce((best, current) =>
        current.totalImpact.carbon < best.totalImpact.carbon ? current : best
      );

      recommendations.push({
        type: "carbon_optimization",
        scenario: bestCarbonScenario,
        reason: "Lowest carbon footprint",
        impact: `${bestCarbonScenario.totalImpact.carbon.toFixed(1)} tCO2e`,
      });

      // Find best sustainability scenario
      const bestSustainabilityScenario = scenarios.reduce((best, current) =>
        current.totalImpact.sustainabilityScore >
        best.totalImpact.sustainabilityScore
          ? current
          : best
      );

      recommendations.push({
        type: "sustainability_optimization",
        scenario: bestSustainabilityScenario,
        reason: "Highest sustainability score",
        impact: `${bestSustainabilityScenario.totalImpact.sustainabilityScore.toFixed(
          1
        )}/10`,
      });

      return recommendations;
    },
    [scenarios]
  );

  // Memoized computed values
  const scenarioStats = useMemo(() => {
    if (scenarios.length === 0) return null;

    const carbonValues = scenarios.map((s) => s.totalImpact.carbon);
    const costValues = scenarios.map((s) => s.totalImpact.cost);
    const sustainabilityValues = scenarios.map(
      (s) => s.totalImpact.sustainabilityScore
    );

    return {
      count: scenarios.length,
      carbonRange: {
        min: Math.min(...carbonValues),
        max: Math.max(...carbonValues),
        avg: carbonValues.reduce((sum, v) => sum + v, 0) / carbonValues.length,
      },
      costRange: {
        min: Math.min(...costValues),
        max: Math.max(...costValues),
        avg: costValues.reduce((sum, v) => sum + v, 0) / costValues.length,
      },
      sustainabilityRange: {
        min: Math.min(...sustainabilityValues),
        max: Math.max(...sustainabilityValues),
        avg:
          sustainabilityValues.reduce((sum, v) => sum + v, 0) /
          sustainabilityValues.length,
      },
    };
  }, [scenarios]);

  return {
    // State
    scenarios,
    currentScenario,
    loading,
    error,

    // Actions
    createScenario,
    updateScenario,
    deleteScenario,
    cloneScenario,
    setCurrentScenario,
    loadScenarios,

    // Analysis
    calculateScenarioImpact,
    compareScenarios,
    optimizeScenario,
    analyzeTransportation,
    getScenarioRecommendations,

    // Computed
    scenarioStats,
  };
};

export default useScenarios;
