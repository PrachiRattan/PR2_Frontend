// src/context/UserContext.js
import { createContext, useContext, useReducer, useEffect } from "react";
import ApiService from "../services/api";

const UserContext = createContext();

const initialState = {
  profile: null,
  preferences: {
    theme: "light",
    language: "en",
    currency: "USD",
    measurementUnits: {
      distance: "km",
      weight: "kg",
      emissions: "tCO2e",
    },
    dashboardLayout: {
      cards: [
        "KPIs",
        "Products",
        "CarbonChart",
        "Suppliers",
        "Recommendations",
        "Activity",
      ],
    },
    notifications: {
      email: true,
      inApp: true,
      weeklyDigest: true,
    },
    defaultFilters: {
      sustainabilityScore: [7, 10],
      certifications: ["ISO14001"],
      regions: ["North America"],
    },
  },
  loading: false,
  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_PROFILE":
      return { ...state, profile: action.payload, loading: false, error: null };

    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
        loading: false,
        error: null,
      };

    case "SET_PREFERENCES":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    case "UPDATE_DASHBOARD_LAYOUT":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          dashboardLayout: {
            ...state.preferences.dashboardLayout,
            ...action.payload,
          },
        },
      };

    case "UPDATE_NOTIFICATION_SETTINGS":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          notifications: {
            ...state.preferences.notifications,
            ...action.payload,
          },
        },
      };

    case "UPDATE_DEFAULT_FILTERS":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          defaultFilters: {
            ...state.preferences.defaultFilters,
            ...action.payload,
          },
        },
      };

    case "RESET_PREFERENCES":
      return { ...state, preferences: initialState.preferences };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
    loadUserPreferences();
  }, []);

  // Load user profile from API
  const loadUserProfile = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await ApiService.getUserProfile();
      dispatch({ type: "SET_PROFILE", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  // Load user preferences from localStorage
  const loadUserPreferences = () => {
    try {
      const saved = localStorage.getItem("user_preferences");
      if (saved) {
        const preferences = JSON.parse(saved);
        dispatch({ type: "SET_PREFERENCES", payload: preferences });
      }
    } catch (error) {
      console.error("Failed to load user preferences:", error);
    }
  };

  // Save preferences to localStorage
  const savePreferences = (preferences) => {
    try {
      localStorage.setItem("user_preferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Failed to save user preferences:", error);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await ApiService.updateUserProfile(profileData);
      dispatch({ type: "UPDATE_PROFILE", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  // Update preferences
  const updatePreferences = (newPreferences) => {
    const updatedPreferences = { ...state.preferences, ...newPreferences };
    dispatch({ type: "SET_PREFERENCES", payload: updatedPreferences });
    savePreferences(updatedPreferences);
  };

  // Update dashboard layout
  const updateDashboardLayout = (layoutConfig) => {
    dispatch({ type: "UPDATE_DASHBOARD_LAYOUT", payload: layoutConfig });
    const updatedPreferences = {
      ...state.preferences,
      dashboardLayout: {
        ...state.preferences.dashboardLayout,
        ...layoutConfig,
      },
    };
    savePreferences(updatedPreferences);
  };

  // Update notification settings
  const updateNotificationSettings = (notificationSettings) => {
    dispatch({
      type: "UPDATE_NOTIFICATION_SETTINGS",
      payload: notificationSettings,
    });
    const updatedPreferences = {
      ...state.preferences,
      notifications: {
        ...state.preferences.notifications,
        ...notificationSettings,
      },
    };
    savePreferences(updatedPreferences);
  };

  // Update default filters
  const updateDefaultFilters = (filterSettings) => {
    dispatch({ type: "UPDATE_DEFAULT_FILTERS", payload: filterSettings });
    const updatedPreferences = {
      ...state.preferences,
      defaultFilters: {
        ...state.preferences.defaultFilters,
        ...filterSettings,
      },
    };
    savePreferences(updatedPreferences);
  };

  // Reset preferences to default
  const resetPreferences = () => {
    dispatch({ type: "RESET_PREFERENCES" });
    localStorage.removeItem("user_preferences");
  };

  // Get user's sustainability impact
  const getSustainabilityImpact = () => {
    if (!state.profile?.careerMetrics) return null;

    const { careerMetrics } = state.profile;
    return {
      totalCarbonSaved: careerMetrics.totalCarbonSaved,
      sustainabilityImprovement: careerMetrics.sustainabilityImprovement,
      projectsManaged: careerMetrics.totalProjectsManaged,
      suppliersWorked: careerMetrics.suppliersWorkedWith,
      yearsExperience: careerMetrics.yearsInProcurement,
    };
  };

  // Check if user has specific permission/role
  const hasPermission = (permission) => {
    // Mock permission system - would integrate with actual auth
    const userRole = state.profile?.role || "user";
    const rolePermissions = {
      admin: ["read", "write", "delete", "manage"],
      manager: ["read", "write", "approve"],
      user: ["read", "write"],
    };

    return rolePermissions[userRole]?.includes(permission) || false;
  };

  // Get user's preferred measurement unit
  const getPreferredUnit = (type) => {
    return state.preferences.measurementUnits[type] || "metric";
  };

  // Check if feature is enabled for user
  const isFeatureEnabled = (featureName) => {
    // Mock feature flags - would integrate with feature flag service
    const userFeatures = state.profile?.enabledFeatures || [];
    return userFeatures.includes(featureName);
  };

  const value = {
    // State
    profile: state.profile,
    preferences: state.preferences,
    loading: state.loading,
    error: state.error,

    // Actions
    loadUserProfile,
    updateProfile,
    updatePreferences,
    updateDashboardLayout,
    updateNotificationSettings,
    updateDefaultFilters,
    resetPreferences,

    // Utilities
    getSustainabilityImpact,
    hasPermission,
    getPreferredUnit,
    isFeatureEnabled,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
