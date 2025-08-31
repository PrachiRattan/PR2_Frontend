// src/hooks/useSuppliers.js
import { useState, useEffect, useCallback } from "react";
import ApiService from "../services/api";
import DataValidator from "../services/utils/dataValidation";

export const useSuppliers = (initialFilters = {}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // Fetch suppliers with current filters
  const fetchSuppliers = useCallback(
    async (newFilters = filters) => {
      setLoading(true);
      setError(null);

      try {
        const validation = DataValidator.validateFilters(newFilters);
        if (!validation.isValid) {
          throw new Error(`Invalid filters: ${validation.errors.join(", ")}`);
        }

        const response = await ApiService.getSuppliers({
          ...newFilters,
          page,
          pageSize,
        });

        setSuppliers(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch suppliers:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, pageSize]
  );

  // Update filters and refetch
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  // Get single supplier by ID
  const getSupplier = useCallback(async (id) => {
    try {
      const response = await ApiService.getSupplierById(id);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch supplier:", err);
      throw err;
    }
  }, []);

  // Create new supplier
  const createSupplier = useCallback(
    async (supplierData) => {
      try {
        const validation = DataValidator.validateSupplier(supplierData);
        if (!validation.isValid) {
          throw new Error(
            `Invalid supplier data: ${validation.errors.join(", ")}`
          );
        }

        const response = await ApiService.createSupplier(supplierData);

        // Refresh suppliers list
        await fetchSuppliers();

        return response.data;
      } catch (err) {
        console.error("Failed to create supplier:", err);
        throw err;
      }
    },
    [fetchSuppliers]
  );

  // Update existing supplier
  const updateSupplier = useCallback(async (id, supplierData) => {
    try {
      const validation = DataValidator.validateSupplier(supplierData);
      if (!validation.isValid) {
        throw new Error(
          `Invalid supplier data: ${validation.errors.join(", ")}`
        );
      }

      const response = await ApiService.updateSupplier(id, supplierData);

      // Update local state
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === id ? { ...supplier, ...response.data } : supplier
        )
      );

      return response.data;
    } catch (err) {
      console.error("Failed to update supplier:", err);
      throw err;
    }
  }, []);

  // Toggle supplier favorite status
  const toggleFavorite = useCallback(
    async (supplierId) => {
      try {
        const supplier = suppliers.find((s) => s.id === supplierId);
        if (!supplier) throw new Error("Supplier not found");

        await updateSupplier(supplierId, {
          preferred: !supplier.preferred,
        });
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
        throw err;
      }
    },
    [suppliers, updateSupplier]
  );

  // Search suppliers by name or location
  const searchSuppliers = useCallback(
    (query) => {
      updateFilters({ search: query });
    },
    [updateFilters]
  );

  // Filter by certification
  const filterByCertification = useCallback(
    (certifications) => {
      updateFilters({ certifications });
    },
    [updateFilters]
  );

  // Filter by sustainability score range
  const filterBySustainabilityScore = useCallback(
    (scoreRange) => {
      updateFilters({ sustainabilityScore: scoreRange });
    },
    [updateFilters]
  );

  // Filter by geographic region
  const filterByRegion = useCallback(
    (regions) => {
      updateFilters({ regions });
    },
    [updateFilters]
  );

  // Sort suppliers
  const sortSuppliers = useCallback(
    (sortBy, sortOrder = "desc") => {
      updateFilters({ sortBy, sortOrder });
    },
    [updateFilters]
  );

  // Get supplier statistics
  const getSupplierStats = useCallback(() => {
    if (suppliers.length === 0) return null;

    const avgSustainabilityScore =
      suppliers.reduce((sum, s) => sum + s.sustainabilityScore, 0) /
      suppliers.length;
    const avgCarbonFootprint =
      suppliers.reduce((sum, s) => sum + (s.carbonFootprint?.perUnit || 0), 0) /
      suppliers.length;
    const certificationCoverage = {};

    suppliers.forEach((supplier) => {
      supplier.certifications?.forEach((cert) => {
        certificationCoverage[cert] = (certificationCoverage[cert] || 0) + 1;
      });
    });

    return {
      total: suppliers.length,
      avgSustainabilityScore: avgSustainabilityScore.toFixed(1),
      avgCarbonFootprint: avgCarbonFootprint.toFixed(1),
      topCertifications: Object.entries(certificationCoverage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([cert, count]) => ({
          cert,
          count,
          percentage: ((count / suppliers.length) * 100).toFixed(1),
        })),
      riskDistribution: {
        low: suppliers.filter((s) => s.riskLevel === "low").length,
        medium: suppliers.filter((s) => s.riskLevel === "medium").length,
        high: suppliers.filter((s) => s.riskLevel === "high").length,
      },
    };
  }, [suppliers]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    // State
    suppliers,
    loading,
    error,
    filters,
    total,
    page,
    pageSize,

    // Actions
    fetchSuppliers,
    updateFilters,
    resetFilters,
    getSupplier,
    createSupplier,
    updateSupplier,
    toggleFavorite,
    searchSuppliers,
    filterByCertification,
    filterBySustainabilityScore,
    filterByRegion,
    sortSuppliers,
    setPage,

    // Computed
    getSupplierStats,
  };
};

export default useSuppliers;
