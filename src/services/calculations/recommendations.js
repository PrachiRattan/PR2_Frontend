// src/services/calculations/recommendations.js
import sustainabilityScoreCalculator from "./sustainabilityScore";
import carbonFootprintCalculator from "./carbonFootprint";
import { suppliers } from "../../data/mockData/suppliers";
import { industryBenchmarks } from "../../data/mockData/industryBenchmarks";

export class RecommendationEngine {
  constructor() {
    this.scoreCalculator = sustainabilityScoreCalculator;
    this.carbonCalculator = carbonFootprintCalculator;
    this.benchmarks = industryBenchmarks;
  }

  /**
   * Generate supplier recommendations for a procurement project
   */
  generateSupplierRecommendations(projectRequirements, userHistory = []) {
    const {
      category,
      quantity = 1000,
      budget,
      sustainabilityPriorities = {},
      geographicPreference,
      timeline,
    } = projectRequirements;

    // Filter suppliers based on basic criteria
    let eligibleSuppliers = this.filterEligibleSuppliers(projectRequirements);

    // Score suppliers based on project priorities
    const scoredSuppliers = eligibleSuppliers.map((supplier) => ({
      supplier,
      score: this.calculateProjectFitScore(supplier, projectRequirements),
      reasoning: this.generateRecommendationReasoning(
        supplier,
        projectRequirements
      ),
    }));

    // Sort by score and return top recommendations
    const topRecommendations = scoredSuppliers
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item, index) => ({
        rank: index + 1,
        supplier: item.supplier,
        score: item.score,
        reasoning: item.reasoning,
        confidence: this.calculateConfidence(
          item.supplier,
          projectRequirements
        ),
        estimatedSavings: this.estimateCarbonSavings(
          item.supplier,
          projectRequirements
        ),
      }));

    return {
      recommendations: topRecommendations,
      totalEvaluated: eligibleSuppliers.length,
      criteria: this.getRecommendationCriteria(projectRequirements),
    };
  }

  /**
   * Filter suppliers based on project requirements
   */
  filterEligibleSuppliers(requirements) {
    return suppliers.filter((supplier) => {
      // Geographic preference
      if (
        requirements.geographicPreference &&
        supplier.location?.region !== requirements.geographicPreference
      ) {
        return false;
      }

      // Industry alignment (flexible matching)
      const industryMatch = this.checkIndustryAlignment(
        supplier.industry,
        requirements.category
      );
      if (!industryMatch) return false;

      // Minimum sustainability score (if specified)
      if (
        requirements.minSustainabilityScore &&
        supplier.sustainabilityScore < requirements.minSustainabilityScore
      ) {
        return false;
      }

      // Risk level filter
      if (
        requirements.maxRiskLevel &&
        this.getRiskLevelNumeric(supplier.riskLevel) >
          this.getRiskLevelNumeric(requirements.maxRiskLevel)
      ) {
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate project fit score for a supplier
   */
  calculateProjectFitScore(supplier, requirements) {
    const priorities = requirements.sustainabilityPriorities || {};
    const weights = {
      carbonFootprint: priorities.carbonFootprint || 0.3,
      recycling: priorities.recycling || 0.2,
      certifications: priorities.certifications || 0.2,
      policies: priorities.policies || 0.15,
      renewable: priorities.renewable || 0.15,
    };

    // Normalize weights
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach((key) => {
      weights[key] = weights[key] / totalWeight;
    });

    // Calculate component scores
    const carbonScore = this.scoreCalculator.calculateCarbonScore(supplier);
    const recyclingScore =
      this.scoreCalculator.calculateRecyclingScore(supplier);
    const certificationScore =
      this.scoreCalculator.calculateCertificationScore(supplier);
    const policyScore = this.scoreCalculator.calculatePolicyScore(supplier);
    const renewableScore =
      this.scoreCalculator.calculateRenewableEnergyScore(supplier);

    // Weighted total score
    const weightedScore =
      carbonScore * weights.carbonFootprint +
      recyclingScore * weights.recycling +
      certificationScore * weights.certifications +
      policyScore * weights.policies +
      renewableScore * weights.renewable;

    // Apply bonus factors
    let bonusScore = 0;

    // Preferred supplier bonus
    if (supplier.preferred) bonusScore += 0.5;

    // Low risk bonus
    if (supplier.riskLevel === "low") bonusScore += 0.3;

    // High performance KPIs bonus
    if (supplier.kpis?.onTimeDelivery > 95) bonusScore += 0.2;
    if (supplier.kpis?.defectRate < 1) bonusScore += 0.2;

    return Math.min(10, weightedScore + bonusScore);
  }

  /**
   * Generate reasoning for recommendation
   */
  generateRecommendationReasoning(supplier, requirements) {
    const reasons = [];

    // Sustainability strengths
    if (supplier.sustainabilityScore >= 8.0) {
      reasons.push(
        `Excellent sustainability score (${supplier.sustainabilityScore}/10)`
      );
    }

    // Carbon efficiency
    const carbonPerUnit = supplier.carbonFootprint?.perUnit || 0;
    if (carbonPerUnit < 3) {
      reasons.push(`Low carbon footprint (${carbonPerUnit} kg CO2e per unit)`);
    }

    // Certifications
    const keyDeepCerts = ["ISO14001", "ISO14067", "B-Corp"];
    const hasCerts = supplier.certifications?.some((cert) =>
      keyDeepCerts.includes(cert)
    );
    if (hasCerts) {
      reasons.push("Strong environmental certifications");
    }

    // Geographic alignment
    if (requirements.geographicPreference === supplier.location?.region) {
      reasons.push("Preferred geographic region");
    }

    // Recycling content
    if (supplier.recyclingContent > 50) {
      reasons.push(`High recycled content (${supplier.recyclingContent}%)`);
    }

    // Performance track record
    if (supplier.kpis?.onTimeDelivery > 95) {
      reasons.push("Excellent delivery performance");
    }

    return reasons.length > 0 ? reasons.join("; ") : "Meets basic requirements";
  }

  /**
   * Calculate recommendation confidence level
   */
  calculateConfidence(supplier, requirements) {
    let confidence = 0.5; // Base confidence

    // Data completeness factor
    const dataCompleteness = supplier.kpis?.dataCompleteness || 0.7;
    confidence += dataCompleteness * 0.2;

    // Verification method factor
    if (supplier.kpis?.verification === "third-party") {
      confidence += 0.15;
    } else if (supplier.kpis?.verification === "self-reported") {
      confidence += 0.05;
    }

    // Historical performance factor (mock)
    if (supplier.preferred) {
      confidence += 0.1;
    }

    // Risk level factor
    const riskFactor = {
      low: 0.1,
      medium: 0.05,
      high: -0.1,
    };
    confidence += riskFactor[supplier.riskLevel] || 0;

    return Math.min(1.0, Math.max(0.1, confidence));
  }

  /**
   * Estimate carbon savings potential
   */
  estimateCarbonSavings(supplier, requirements) {
    // Find baseline supplier or use industry average
    const quantity = requirements.quantity || 1000;
    const supplierEmissions = this.carbonCalculator.calculateSupplierFootprint(
      supplier,
      quantity
    );

    // Estimate industry average emissions
    const avgEmissionsPerUnit = 4.0; // Mock industry average
    const industryEmissions = avgEmissionsPerUnit * quantity;

    const savings = industryEmissions - supplierEmissions.total;
    const savingsPercentage =
      industryEmissions > 0 ? (savings / industryEmissions) * 100 : 0;

    return {
      absoluteSavings: Math.max(0, savings),
      percentageSavings: Math.max(0, savingsPercentage),
      comparison: "vs industry average",
    };
  }

  /**
   * Generate actionable recommendations for procurement optimization
   */
  generateProcurementRecommendations(currentSuppliers, requirements) {
    const recommendations = [];

    // Supplier diversification analysis
    const regionConcentration = this.analyzeSupplierConcentration(
      currentSuppliers,
      "region"
    );
    if (regionConcentration.maxConcentration > 0.7) {
      recommendations.push({
        type: "diversification",
        title: "Diversify Geographic Risk",
        description: `${Math.round(
          regionConcentration.maxConcentration * 100
        )}% of suppliers are in ${regionConcentration.dominantValue}`,
        impact: "15-25% risk reduction",
        confidence: 0.85,
        action: "Consider suppliers from other regions",
      });
    }

    // Carbon optimization opportunities
    const carbonOptimization =
      this.identifyCarbonOptimization(currentSuppliers);
    if (carbonOptimization.potential > 0) {
      recommendations.push({
        type: "carbon_optimization",
        title: "Optimize Carbon Footprint",
        description: carbonOptimization.description,
        impact: `${carbonOptimization.potential}% CO2 reduction`,
        confidence: 0.78,
        action: "Switch to lower-carbon suppliers",
      });
    }

    // Certification gaps
    const certGaps = this.identifyCertificationGaps(currentSuppliers);
    if (certGaps.length > 0) {
      recommendations.push({
        type: "certification",
        title: "Improve Supplier Certifications",
        description: `Missing key certifications: ${certGaps.join(", ")}`,
        impact: "10-15% compliance improvement",
        confidence: 0.72,
        action: "Prioritize certified suppliers",
      });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Generate supplier allocation recommendations
   */
  generateAllocationRecommendations(suppliers, requirements) {
    const totalQuantity = requirements.quantity || 1000;
    const sortedSuppliers = suppliers
      .map((supplier) => ({
        supplier,
        score: this.calculateProjectFitScore(supplier, requirements),
      }))
      .sort((a, b) => b.score - a.score);

    // Risk-based allocation strategy
    const allocations = [];
    let remainingQuantity = totalQuantity;

    // Primary supplier (best score) gets largest share but max 60%
    const primaryAllocation = Math.min(0.6 * totalQuantity, remainingQuantity);
    allocations.push({
      supplierId: sortedSuppliers[0].supplier.id,
      supplierName: sortedSuppliers[0].supplier.name,
      allocation: primaryAllocation,
      percentage: (primaryAllocation / totalQuantity) * 100,
      rationale: "Primary supplier - highest sustainability score",
    });
    remainingQuantity -= primaryAllocation;

    // Secondary suppliers
    for (
      let i = 1;
      i < Math.min(3, sortedSuppliers.length) && remainingQuantity > 0;
      i++
    ) {
      const allocation = Math.min(0.3 * totalQuantity, remainingQuantity);
      allocations.push({
        supplierId: sortedSuppliers[i].supplier.id,
        supplierName: sortedSuppliers[i].supplier.name,
        allocation,
        percentage: (allocation / totalQuantity) * 100,
        rationale: `Secondary supplier ${i} - risk diversification`,
      });
      remainingQuantity -= allocation;
    }

    return {
      allocations,
      strategy: "Risk-optimized allocation with sustainability priority",
      totalAllocated: totalQuantity - remainingQuantity,
      confidence: 0.82,
    };
  }

  // Helper methods
  checkIndustryAlignment(supplierIndustry, productCategory) {
    const alignmentMap = {
      "Office Supplies": ["Manufacturing", "Technology"],
      Packaging: ["Manufacturing", "Materials"],
      Electronics: ["Technology", "Manufacturing"],
      Chemicals: ["Chemicals", "Manufacturing"],
      Textiles: ["Textiles", "Manufacturing"],
      Logistics: ["Logistics", "Transportation"],
    };

    const validIndustries = alignmentMap[productCategory] || ["Manufacturing"];
    return validIndustries.includes(supplierIndustry);
  }

  getRiskLevelNumeric(riskLevel) {
    const map = { low: 1, medium: 2, high: 3 };
    return map[riskLevel] || 2;
  }

  analyzeSupplierConcentration(suppliers, dimension) {
    const counts = {};
    suppliers.forEach((supplier) => {
      const value =
        dimension === "region" ? supplier.location?.region : supplier.industry;
      counts[value] = (counts[value] || 0) + 1;
    });

    const total = suppliers.length;
    const maxCount = Math.max(...Object.values(counts));
    const dominantValue = Object.keys(counts).find(
      (key) => counts[key] === maxCount
    );

    return {
      maxConcentration: maxCount / total,
      dominantValue,
      distribution: counts,
    };
  }

  identifyCarbonOptimization(suppliers) {
    const avgCarbon =
      suppliers.reduce((sum, s) => sum + (s.carbonFootprint?.perUnit || 0), 0) /
      suppliers.length;
    const bestCarbon = Math.min(
      ...suppliers.map((s) => s.carbonFootprint?.perUnit || Infinity)
    );

    if (avgCarbon > bestCarbon * 1.2) {
      const potential = ((avgCarbon - bestCarbon) / avgCarbon) * 100;
      return {
        potential: Math.round(potential),
        description: `Current average: ${avgCarbon.toFixed(
          1
        )} kg CO2e, best performer: ${bestCarbon.toFixed(1)} kg CO2e`,
      };
    }

    return { potential: 0 };
  }

  identifyCertificationGaps(suppliers) {
    const keyCertifications = ["ISO14001", "ISO14067", "B-Corp"];
    const coverageMap = {};

    keyCertifications.forEach((cert) => {
      const coverage =
        suppliers.filter((s) => s.certifications?.includes(cert)).length /
        suppliers.length;
      if (coverage < 0.5) {
        // Less than 50% coverage
        coverageMap[cert] = coverage;
      }
    });

    return Object.keys(coverageMap);
  }

  getRecommendationCriteria(requirements) {
    return {
      sustainabilityPriorities: requirements.sustainabilityPriorities,
      geographicPreference: requirements.geographicPreference,
      category: requirements.category,
      evaluationWeights: {
        sustainability: 0.4,
        performance: 0.3,
        risk: 0.2,
        cost: 0.1,
      },
    };
  }
}

export default new RecommendationEngine();
