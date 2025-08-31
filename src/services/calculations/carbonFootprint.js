// src/services/calculations/carbonFootprint.js
import { emissionFactors } from "../../data/mockData/carbonEmissionFactors";

export class CarbonFootprintCalculator {
  constructor() {
    this.factors = emissionFactors;
  }

  /**
   * Calculate total carbon footprint for a supplier and quantity
   */
  calculateSupplierFootprint(supplier, quantity = 1) {
    if (!supplier || !supplier.carbonFootprint) {
      return {
        perUnit: 0,
        total: 0,
        breakdown: {
          scope1: 0,
          scope2: 0,
          scope3: 0,
          transport: 0,
        },
      };
    }

    const { carbonFootprint } = supplier;
    const perUnit = carbonFootprint.perUnit || 0;
    const total = perUnit * quantity;

    return {
      perUnit,
      total,
      breakdown: {
        scope1: ((carbonFootprint.scope1 || 0) * quantity) / 1000, // Convert to per unit
        scope2: ((carbonFootprint.scope2 || 0) * quantity) / 1000,
        scope3: ((carbonFootprint.scope3 || 0) * quantity) / 1000,
        transport: this.calculateTransportEmissions(supplier, quantity),
      },
    };
  }

  /**
   * Calculate transport emissions based on supplier location
   */
  calculateTransportEmissions(supplier, quantity = 1) {
    const distance = this.estimateDistance(supplier.location);
    const weight = quantity * 0.5; // Assume 0.5kg per unit (mock)

    // Default to truck transport
    const emissionFactor = this.factors.transport.truck.kgCO2ePerTonKm;
    return (distance * weight * emissionFactor) / 1000; // Convert to tonnes
  }

  /**
   * Estimate transport distance based on location
   */
  estimateDistance(location) {
    // Mock distance calculation based on region
    const distanceMap = {
      "North America": 800,
      Europe: 1200,
      Asia: 8000,
      "South America": 6000,
      Africa: 7000,
      Oceania: 9000,
    };

    return distanceMap[location?.region] || 1000;
  }

  /**
   * Compare carbon footprints between suppliers
   */
  compareSuppliers(suppliers, quantity = 1) {
    return suppliers.map((supplier) => {
      const footprint = this.calculateSupplierFootprint(supplier, quantity);
      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        ...footprint,
      };
    });
  }

  /**
   * Calculate potential savings by switching suppliers
   */
  calculateSavings(currentSupplier, alternativeSupplier, quantity = 1) {
    const current = this.calculateSupplierFootprint(currentSupplier, quantity);
    const alternative = this.calculateSupplierFootprint(
      alternativeSupplier,
      quantity
    );

    const savings = current.total - alternative.total;
    const savingsPercentage =
      current.total > 0 ? (savings / current.total) * 100 : 0;

    return {
      currentEmissions: current.total,
      alternativeEmissions: alternative.total,
      savings,
      savingsPercentage,
      breakdown: {
        scope1: current.breakdown.scope1 - alternative.breakdown.scope1,
        scope2: current.breakdown.scope2 - alternative.breakdown.scope2,
        scope3: current.breakdown.scope3 - alternative.breakdown.scope3,
        transport:
          current.breakdown.transport - alternative.breakdown.transport,
      },
    };
  }

  /**
   * Calculate lifecycle emissions for a product
   */
  calculateProductLifecycle(product, quantity = 1) {
    if (!product || !product.lifecycle) {
      return { total: 0, breakdown: {} };
    }

    const { lifecycle } = product;
    return {
      total:
        ((lifecycle.manufactureCO2ePerUnit || 0) +
          (lifecycle.useCO2ePerUnit || 0) +
          (lifecycle.endOfLifeCO2ePerUnit || 0)) *
        quantity,
      breakdown: {
        manufacturing: (lifecycle.manufactureCO2ePerUnit || 0) * quantity,
        use: (lifecycle.useCO2ePerUnit || 0) * quantity,
        endOfLife: (lifecycle.endOfLifeCO2ePerUnit || 0) * quantity,
      },
    };
  }

  /**
   * Calculate emissions by transport mode
   */
  calculateTransportModeEmissions(distance, weight, mode = "truck") {
    const factor = this.factors.transport[mode];
    if (!factor) {
      throw new Error(`Unknown transport mode: ${mode}`);
    }

    return distance * weight * factor.kgCO2ePerTonKm;
  }

  /**
   * Get emission factors for different materials
   */
  getMaterialEmissionFactor(material, isRecycled = false) {
    const materialData = this.factors.materials[material.toLowerCase()];
    if (!materialData) return 0;

    if (isRecycled && materialData.kgCO2ePerKgRecycled) {
      return materialData.kgCO2ePerKgRecycled;
    }

    return (
      materialData.kgCO2ePerKgVirgin ||
      materialData.kgCO2ePerKgConventional ||
      0
    );
  }
}

export default new CarbonFootprintCalculator();
