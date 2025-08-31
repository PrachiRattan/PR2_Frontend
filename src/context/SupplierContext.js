// src/context/SupplierContext.js
import { createContext, useContext, useReducer, useEffect } from "react";
import ApiService from "../services/api";
import { suppliers as mockSuppliers } from "../data/mockData/suppliers";

const SupplierContext = createContext();

const initialState = {
  suppliers: [],
  filteredSuppliers: [],
  selectedSuppliers: [],
  currentSupplier: null,
  filters: {
    search: "",
    certifications: [],
    sustainabilityScore: [1, 10],
    carbonPerUnit: [0, 50],
    regions: [],
    industries: [],
    preferred: false,
  },
  view: "list", // list, card, map
  sortBy: "sustainabilityScore",
  sortOrder: "desc",
  loading: false,
  error: null,
  totalCount: 0,
  pagination: {
    page: 1,
    pageSize: 20,
  },
};

const supplierReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_SUPPLIERS":
      return {
        ...state,
        suppliers: action.payload.suppliers,
        totalCount: action.payload.total,
        loading: false,
        error: null,
      };

    case "SET_FILTERED_SUPPLIERS":
      return { ...state, filteredSuppliers: action.payload };

    case "ADD_SUPPLIER":
      return {
        ...state,
        suppliers: [...state.suppliers, action.payload],
        totalCount: state.totalCount + 1,
      };

    case "UPDATE_SUPPLIER":
      return {
        ...state,
        suppliers: state.suppliers.map((supplier) =>
          supplier.id === action.payload.id
            ? { ...supplier, ...action.payload }
            : supplier
        ),
      };

    case "DELETE_SUPPLIER":
      return {
        ...state,
        suppliers: state.suppliers.filter((s) => s.id !== action.payload),
        selectedSuppliers: state.selectedSuppliers.filter(
          (s) => s.id !== action.payload
        ),
        totalCount: state.totalCount - 1,
      };

    case "SELECT_SUPPLIER":
      return { ...state, currentSupplier: action.payload };

    case "TOGGLE_SUPPLIER_SELECTION":
      const exists = state.selectedSuppliers.find(
        (s) => s.id === action.payload.id
      );
      return {
        ...state,
        selectedSuppliers: exists
          ? state.selectedSuppliers.filter((s) => s.id !== action.payload.id)
          : [...state.selectedSuppliers, action.payload],
      };

    case "CLEAR_SELECTION":
      return { ...state, selectedSuppliers: [] };

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }, // Reset to first page
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
        pagination: { ...state.pagination, page: 1 },
      };

    case "SET_VIEW":
      return { ...state, view: action.payload };

    case "SET_SORTING":
      return {
        ...state,
        sortBy: action.payload.field,
        sortOrder: action.payload.order,
      };

    case "SET_PAGINATION":
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    default:
      return state;
  }
};

export const SupplierProvider = ({ children }) => {
  const [state, dispatch] = useReducer(supplierReducer, initialState);

  // Load suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  // Apply filters when filters or suppliers change
  useEffect(() => {
    applyFilters();
  }, [state.suppliers, state.filters, state.sortBy, state.sortOrder]);

  const loadSuppliers = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await ApiService.getSuppliers({
        ...state.filters,
        page: state.pagination.page,
        pageSize: state.pagination.pageSize,
      });

      dispatch({
        type: "SET_SUPPLIERS",
        payload: {
          suppliers: response.data,
          total: response.total || response.data.length,
        },
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const applyFilters = () => {
    let filtered = [...state.suppliers];

    // Apply search filter
    if (state.filters.search) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.name
            .toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          supplier.location?.city
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          supplier.location?.country
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase())
      );
    }

    // Apply certification filter
    if (state.filters.certifications?.length > 0) {
      filtered = filtered.filter((supplier) =>
        state.filters.certifications.some((cert) =>
          supplier.certifications?.includes(cert)
        )
      );
    }

    // Apply sustainability score filter
    if (state.filters.sustainabilityScore) {
      const [min, max] = state.filters.sustainabilityScore;
      filtered = filtered.filter(
        (supplier) =>
          supplier.sustainabilityScore >= min &&
          supplier.sustainabilityScore <= max
      );
    }

    // Apply carbon footprint filter
    if (state.filters.carbonPerUnit) {
      const [min, max] = state.filters.carbonPerUnit;
      filtered = filtered.filter((supplier) => {
        const carbon = supplier.carbonFootprint?.perUnit || 0;
        return carbon >= min && carbon <= max;
      });
    }

    // Apply region filter
    if (state.filters.regions?.length > 0) {
      filtered = filtered.filter((supplier) =>
        state.filters.regions.includes(supplier.location?.region)
      );
    }

    // Apply industry filter
    if (state.filters.industries?.length > 0) {
      filtered = filtered.filter((supplier) =>
        state.filters.industries.includes(supplier.industry)
      );
    }

    // Apply preferred filter
    if (state.filters.preferred) {
      filtered = filtered.filter((supplier) => supplier.preferred);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = getNestedValue(a, state.sortBy);
      let bVal = getNestedValue(b, state.sortBy);

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (state.sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    dispatch({ type: "SET_FILTERED_SUPPLIERS", payload: filtered });
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj) || 0;
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: "UPDATE_FILTERS", payload: newFilters });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const setView = (view) => {
    dispatch({ type: "SET_VIEW", payload: view });
  };

  const setSorting = (field, order) => {
    dispatch({ type: "SET_SORTING", payload: { field, order } });
  };

  const selectSupplier = (supplier) => {
    dispatch({ type: "SELECT_SUPPLIER", payload: supplier });
  };

  const toggleSupplierSelection = (supplier) => {
    dispatch({ type: "TOGGLE_SUPPLIER_SELECTION", payload: supplier });
  };

  const clearSelection = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const addSupplier = async (supplierData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await ApiService.createSupplier(supplierData);
      dispatch({ type: "ADD_SUPPLIER", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const updateSupplier = async (id, supplierData) => {
    try {
      const response = await ApiService.updateSupplier(id, supplierData);
      dispatch({ type: "UPDATE_SUPPLIER", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await ApiService.deleteSupplier(id);
      dispatch({ type: "DELETE_SUPPLIER", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const refreshSuppliers = () => {
    loadSuppliers();
  };

  const value = {
    // State
    ...state,

    // Actions
    updateFilters,
    resetFilters,
    setView,
    setSorting,
    selectSupplier,
    toggleSupplierSelection,
    clearSelection,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers,

    // Computed values
    hasSelection: state.selectedSuppliers.length > 0,
    selectionCount: state.selectedSuppliers.length,
  };

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplierContext = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error(
      "useSupplierContext must be used within a SupplierProvider"
    );
  }
  return context;
};

export default SupplierContext;
