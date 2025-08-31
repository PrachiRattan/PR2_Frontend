// src/services/utils/constants.js

export const SUSTAINABILITY_THRESHOLDS = {
  EXCELLENT: 9.0,
  VERY_GOOD: 8.0,
  GOOD: 7.0,
  FAIR: 6.0,
  POOR: 4.0,
};

export const CARBON_INTENSITY_BENCHMARKS = {
  OFFICE_SUPPLIES: { good: 1.5, average: 3.0, poor: 5.0 },
  PACKAGING: { good: 2.0, average: 4.0, poor: 7.0 },
  ELECTRONICS: { good: 3.0, average: 6.0, poor: 10.0 },
  CHEMICALS: { good: 2.5, average: 5.0, poor: 8.0 },
  TEXTILES: { good: 2.0, average: 4.5, poor: 7.5 },
};

export const RISK_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const PROCUREMENT_STATUSES = {
  DRAFT: "draft",
  ACCEPTING_BIDS: "accepting_bids",
  BID_EVALUATION: "bid_evaluation",
  AWARDED: "awarded",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const SUPPLIER_VERIFICATION_TYPES = {
  THIRD_PARTY: "third-party",
  SELF_REPORTED: "self-reported",
  INTERNAL_AUDIT: "internal-audit",
};

export const PRODUCT_CATEGORIES = [
  "Office Supplies",
  "Packaging",
  "Electronics",
  "Chemicals",
  "Textiles",
  "Metals",
  "Logistics",
  "Raw Materials",
];

export const GEOGRAPHIC_REGIONS = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
  "Oceania",
];

export const COMPANY_SIZES = ["<500", "500-1000", "1000-5000", "5000+"];

export const KEY_CERTIFICATIONS = [
  "ISO14001",
  "ISO14067",
  "ISO50001",
  "FairTrade",
  "B-Corp",
  "FSC",
  "ResponsibleSteel",
  "ECOLABEL",
  "OEKO-TEX",
  "Organic",
];

export const TRANSPORT_MODES = {
  TRUCK: "truck",
  RAIL: "rail",
  SEA: "sea",
  AIR: "air",
};

export const EMISSION_SCOPES = {
  SCOPE_1: "scope1",
  SCOPE_2: "scope2",
  SCOPE_3: "scope3",
};

export const KPI_BENCHMARKS = {
  ON_TIME_DELIVERY: {
    excellent: 98,
    good: 95,
    fair: 90,
    poor: 85,
  },
  DEFECT_RATE: {
    excellent: 0.5,
    good: 1.0,
    fair: 2.0,
    poor: 3.0,
  },
  AUDIT_SCORE: {
    excellent: 95,
    good: 85,
    fair: 75,
    poor: 65,
  },
};

export const RECOMMENDATION_TYPES = {
  SUPPLIER_SWITCH: "supplier_switch",
  CARBON_OPTIMIZATION: "carbon_optimization",
  DIVERSIFICATION: "diversification",
  CERTIFICATION: "certification",
  COST_OPTIMIZATION: "cost_optimization",
};

export const CHART_COLORS = {
  PRIMARY: "#3b82f6",
  SUCCESS: "#22c55e",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#06b6d4",
  PURPLE: "#8b5cf6",
};

export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  ISO: "yyyy-MM-dd",
};

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const API_ENDPOINTS = {
  SUPPLIERS: "/api/suppliers",
  PRODUCTS: "/api/products",
  PROCUREMENT: "/api/procurement",
  SCENARIOS: "/api/scenarios",
  USER: "/api/user",
  DASHBOARD: "/api/dashboard",
};

export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: "user_preferences",
  FILTER_PRESETS: "filter_presets",
  DASHBOARD_CONFIG: "dashboard_config",
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ["pdf", "doc", "docx", "xls", "xlsx", "csv"],
};
