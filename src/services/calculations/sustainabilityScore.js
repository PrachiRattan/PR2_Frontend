// src/services/calculations/sustainabilityScore.js
import { industryBenchmarks } from "../../data/mockData/industryBenchmarks";

export class SustainabilityScoreCalculator {
  constructor() {
    this.benchmarks = industryBenchmarks;
  }

  /**
   * Calculate overall sustainability score for a supplier
   */
  calculateSupplierScore(supplier, weights = null) {
    const defaultWeights = this.benchmarks.scoreNormalization;
    const scoreWeights = weights || defaultWeights;

    const carbonScore = this.calculateCarbonScore(supplier);
    const certificationScore = this.calculateCertificationScore(supplier);
    const recyclingScore = this.calculateRecyclingScore(supplier);
    const policyScore = this.calculatePolicyScore(supplier);
    const wasteScore = this.calculateWasteManagementScore(supplier);

    const totalScore =
      carbonScore * scoreWeights.carbonWeight +
      certificationScore * scoreWeights.certWeight +
      recyclingScore * scoreWeights.recyclingWeight +
      policyScore * scoreWeights.policyWeight +
      wasteScore * scoreWeights.wasteWeight;

    return {
      total: Math.min(10, Math.max(0, totalScore)),
      breakdown: {
        carbon: carbonScore,
        certifications: certificationScore,
        recycling: recyclingScore,
        policies: policyScore,
        wasteManagement: wasteScore,
      },
      weights: scoreWeights,
    };
  }

  /**
   * Calculate carbon intensity score (inverted - lower is better)
   */
  calculateCarbonScore(supplier) {
    const carbonPerUnit = supplier.carbonFootprint?.perUnit || 0;

    // Industry-specific thresholds
    const industryBenchmark = this.benchmarks.sectors[supplier.industry];
    const avgCarbon = industryBenchmark?.avgCarbonIntensity || 5; // Default threshold

    // Score inversely proportional to carbon intensity
    const score = Math.max(0, 10 - (carbonPerUnit / avgCarbon) * 10);
    return Math.min(10, score);
  }

  /**
   * Calculate certification score based on weighted certifications
   */
  calculateCertificationScore(supplier) {
    if (!supplier.certifications || supplier.certifications.length === 0) {
      return 0;
    }

    const certWeights = this.benchmarks.certificationWeights;
    let totalWeight = 0;
    let achievedWeight = 0;

    // Calculate weighted score
    supplier.certifications.forEach((cert) => {
      if (certWeights[cert]) {
        achievedWeight += certWeights[cert];
      }
    });

    // Normalize to 0-10 scale
    const maxPossibleWeight = Math.max(...Object.values(certWeights)) * 3; // Assume top 3 certs
    return (achievedWeight / maxPossibleWeight) * 10;
  }

  /**
   * Calculate recycling content score
   */
  calculateRecyclingScore(supplier) {
    const recyclingContent = supplier.recyclingContent || 0;
    const industryTarget =
      this.benchmarks.sectors[supplier.industry]?.recycledContentTarget || 50;

    // Score based on performance against industry target
    return Math.min(10, (recyclingContent / industryTarget) * 10);
  }

  /**
   * Calculate policy score based on available policies
   */
  calculatePolicyScore(supplier) {
    if (!supplier.policies || supplier.policies.length === 0) {
      return 0;
    }

    const policyWeights = this.benchmarks.policyWeights;
    let totalWeight = 0;

    supplier.policies.forEach((policy) => {
      if (policyWeights[policy.type]) {
        totalWeight += policyWeights[policy.type];
      }
    });

    // Normalize to 0-10 scale
    const maxPossibleWeight = Math.max(...Object.values(policyWeights)) * 2; // Assume top 2 policies
    return (totalWeight / maxPossibleWeight) * 10;
  }

  /**
   * Calculate waste management score
   */
  calculateWasteManagementScore(supplier) {
    const wasteData = supplier.wasteManagement;
    if (!wasteData) return 0;

    const recyclingRate = wasteData.recycledPercentage || 0;
    const wasteToEnergyRate = wasteData.wasteToEnergy || 0;

    // Combined score for waste diversion
    const diversionRate = recyclingRate + wasteToEnergyRate;
    return Math.min(10, (diversionRate / 100) * 10);
  }

  /**
   * Calculate renewable energy score
   */
  calculateRenewableEnergyScore(supplier) {
    const renewablePercent = supplier.renewableEnergyPercent || 0;
    const industryTarget =
      this.benchmarks.sectors[supplier.industry]?.renewableEnergyTarget || 50;

    return Math.min(10, (renewablePercent / industryTarget) * 10);
  }

  /**
   * Compare supplier against industry benchmarks
   */
  benchmarkSupplier(supplier) {
    const industry = supplier.industry;
    const benchmark = this.benchmarks.sectors[industry];

    if (!benchmark) {
      return {
        industry,
        comparison: "No benchmark available",
        percentile: null,
      };
    }

    const supplierScore = this.calculateSupplierScore(supplier).total;
    let percentile;

    if (supplierScore >= benchmark.topQuartile) {
      percentile = "Top 25%";
    } else if (supplierScore >= benchmark.avgScore) {
      percentile = "Above Average";
    } else {
      percentile = "Below Average";
    }

    return {
      industry,
      supplierScore,
      industryAverage: benchmark.avgScore,
      topQuartile: benchmark.topQuartile,
      percentile,
      gap: benchmark.topQuartile - supplierScore,
    };
  }

  /**
   * Calculate improvement recommendations
   */
  getImprovementRecommendations(supplier) {
    const score = this.calculateSupplierScore(supplier);
    const recommendations = [];

    // Carbon intensity improvements
    if (score.breakdown.carbon < 6) {
      recommendations.push({
        area: "Carbon Footprint",
        priority: "high",
        suggestion:
          "Implement energy efficiency measures and renewable energy adoption",
        impact: "Could improve overall score by up to 1.5 points",
      });
    }

    // Certification gaps
    if (score.breakdown.certifications < 5) {
      recommendations.push({
        area: "Certifications",
        priority: "medium",
        suggestion:
          "Pursue ISO 14001 and industry-specific sustainability certifications",
        impact: "Could improve overall score by up to 2 points",
      });
    }

    // Recycling improvements
    if (score.breakdown.recycling < 6) {
      recommendations.push({
        area: "Recycled Content",
        priority: "medium",
        suggestion: "Increase use of recycled materials in products",
        impact: "Could improve overall score by up to 1 point",
      });
    }

    return recommendations;
  }

  /**
   * Calculate trend analysis for supplier scores over time
   */
  calculateScoreTrend(supplierHistory) {
    // Mock trend calculation - in real app would use historical data
    const scores = supplierHistory.map((entry) => ({
      date: entry.date,
      score: this.calculateSupplierScore(entry.supplier).total,
    }));

    const trend =
      scores.length > 1 ? scores[scores.length - 1].score - scores[0].score : 0;

    return {
      scores,
      trend,
      trendDescription:
        trend > 0.5 ? "Improving" : trend < -0.5 ? "Declining" : "Stable",
    };
  }
}

export default new SustainabilityScoreCalculator();
