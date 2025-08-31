// src/hooks/useRecommendations.js
import { useState, useEffect, useCallback, useMemo } from "react";
import RecommendationEngine from "../services/calculations/recommendations";
import ApiService from "../services/api";

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Generate supplier recommendations for a project
  const generateSupplierRecommendations = useCallback(
    async (projectRequirements, userHistory = []) => {
      setLoading(true);
      setError(null);

      try {
        const result = RecommendationEngine.generateSupplierRecommendations(
          projectRequirements,
          userHistory
        );

        setRecommendations(result.recommendations);
        return result;
      } catch (err) {
        setError(err.message);
        console.error("Failed to generate supplier recommendations:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Generate procurement optimization recommendations
  const generateProcurementRecommendations = useCallback(
    async (currentSuppliers, requirements) => {
      setLoading(true);
      setError(null);

      try {
        const result = RecommendationEngine.generateProcurementRecommendations(
          currentSuppliers,
          requirements
        );

        return result;
      } catch (err) {
        setError(err.message);
        console.error("Failed to generate procurement recommendations:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Generate supplier allocation recommendations
  const generateAllocationRecommendations = useCallback(
    async (suppliers, requirements) => {
      setLoading(true);
      setError(null);

      try {
        const result = RecommendationEngine.generateAllocationRecommendations(
          suppliers,
          requirements
        );

        return result;
      } catch (err) {
        setError(err.message);
        console.error("Failed to generate allocation recommendations:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get AI-powered recommendations from API
  const getAiRecommendations = useCallback(async (projectData = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getAiRecommendations(projectData);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error("Failed to get AI recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter recommendations by type
  const filterRecommendations = useCallback(
    (type) => {
      return recommendations.filter((rec) => rec.type === type);
    },
    [recommendations]
  );

  // Get high-confidence recommendations
  const getHighConfidenceRecommendations = useCallback(
    (minConfidence = 0.8) => {
      return recommendations.filter((rec) => rec.confidence >= minConfidence);
    },
    [recommendations]
  );

  // Sort recommendations by various criteria
  const sortRecommendations = useCallback(
    (sortBy = "confidence") => {
      return [...recommendations].sort((a, b) => {
        switch (sortBy) {
          case "confidence":
            return b.confidence - a.confidence;
          case "impact":
            // Extract numeric impact if possible
            const aImpact = parseFloat(
              a.estimatedSavings?.percentageSavings || 0
            );
            const bImpact = parseFloat(
              b.estimatedSavings?.percentageSavings || 0
            );
            return bImpact - aImpact;
          case "rank":
            return a.rank - b.rank;
          default:
            return 0;
        }
      });
    },
    [recommendations]
  );

  // Get recommendations by category
  const getRecommendationsByCategory = useCallback(() => {
    const categories = {
      sustainability: [],
      cost: [],
      risk: [],
      performance: [],
    };

    recommendations.forEach((rec) => {
      if (
        rec.reasoning?.includes("carbon") ||
        rec.reasoning?.includes("sustainability")
      ) {
        categories.sustainability.push(rec);
      }
      if (rec.reasoning?.includes("cost") || rec.reasoning?.includes("price")) {
        categories.cost.push(rec);
      }
      if (
        rec.reasoning?.includes("risk") ||
        rec.reasoning?.includes("diversif")
      ) {
        categories.risk.push(rec);
      }
      if (
        rec.reasoning?.includes("performance") ||
        rec.reasoning?.includes("delivery")
      ) {
        categories.performance.push(rec);
      }
    });

    return categories;
  }, [recommendations]);

  // Track recommendation interactions
  const trackRecommendationAction = useCallback((recommendationId, action) => {
    // In a real app, this would send analytics data
    console.log("Recommendation action:", { recommendationId, action });
  }, []);

  // Accept a recommendation
  const acceptRecommendation = useCallback(
    (recommendationId) => {
      trackRecommendationAction(recommendationId, "accepted");
      // Implementation would depend on recommendation type
    },
    [trackRecommendationAction]
  );

  // Dismiss a recommendation
  const dismissRecommendation = useCallback(
    (recommendationId) => {
      setRecommendations((prev) =>
        prev.filter((rec) => rec.id !== recommendationId)
      );
      trackRecommendationAction(recommendationId, "dismissed");
    },
    [trackRecommendationAction]
  );

  // Get recommendation impact summary
  const getImpactSummary = useCallback(() => {
    if (recommendations.length === 0) return null;

    const totalPotentialSavings = recommendations.reduce((sum, rec) => {
      const savings = parseFloat(rec.estimatedSavings?.percentageSavings || 0);
      return sum + savings;
    }, 0);

    const avgConfidence =
      recommendations.reduce((sum, rec) => sum + rec.confidence, 0) /
      recommendations.length;

    const typeDistribution = {};
    recommendations.forEach((rec) => {
      const type = rec.type || "general";
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    return {
      totalRecommendations: recommendations.length,
      totalPotentialSavings,
      averageConfidence: avgConfidence,
      typeDistribution,
      highConfidenceCount: recommendations.filter((r) => r.confidence >= 0.8)
        .length,
    };
  }, [recommendations]);

  // Generate dashboard recommendations
  const generateDashboardRecommendations = useCallback(
    async (userProfile, recentActivity) => {
      setLoading(true);

      try {
        // Simulate generating contextual recommendations based on user activity
        const contextualRecs = [
          {
            id: "dashboard_1",
            type: "optimization",
            title: "Review Supplier Performance",
            description:
              "Several suppliers have declining sustainability scores this quarter",
            priority: "medium",
            confidence: 0.75,
            action: () => console.log("Navigate to supplier review"),
          },
          {
            id: "dashboard_2",
            type: "opportunity",
            title: "New Sustainable Suppliers Available",
            description:
              "Found 3 new suppliers in your region with better carbon footprints",
            priority: "low",
            confidence: 0.68,
            action: () => console.log("View new suppliers"),
          },
        ];

        return contextualRecs;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Memoized computed values
  const topRecommendations = useMemo(() => {
    return sortRecommendations("confidence").slice(0, 5);
  }, [sortRecommendations]);

  const recommendationStats = useMemo(() => {
    return getImpactSummary();
  }, [getImpactSummary]);

  return {
    // State
    recommendations,
    loading,
    error,
    filters,

    // Actions
    generateSupplierRecommendations,
    generateProcurementRecommendations,
    generateAllocationRecommendations,
    getAiRecommendations,
    generateDashboardRecommendations,

    // Filtering and sorting
    filterRecommendations,
    getHighConfidenceRecommendations,
    sortRecommendations,
    getRecommendationsByCategory,

    // Interaction tracking
    acceptRecommendation,
    dismissRecommendation,
    trackRecommendationAction,

    // Computed values
    topRecommendations,
    recommendationStats,
    getImpactSummary,

    // Utilities
    setFilters,
  };
};

export default useRecommendations;
