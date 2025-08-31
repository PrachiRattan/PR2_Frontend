// src/services/utils/dataValidation.js

export class DataValidator {
  /**
   * Validate supplier data structure
   */
  validateSupplier(supplier) {
    const errors = [];

    if (!supplier.name || typeof supplier.name !== "string") {
      errors.push("Supplier name is required and must be a string");
    }

    if (!supplier.location || !supplier.location.country) {
      errors.push("Supplier location with country is required");
    }

    if (supplier.sustainabilityScore !== undefined) {
      if (
        typeof supplier.sustainabilityScore !== "number" ||
        supplier.sustainabilityScore < 0 ||
        supplier.sustainabilityScore > 10
      ) {
        errors.push("Sustainability score must be a number between 0 and 10");
      }
    }

    if (supplier.certifications && !Array.isArray(supplier.certifications)) {
      errors.push("Certifications must be an array");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate procurement project data
   */
  validateProcurementProject(project) {
    const errors = [];

    if (!project.name || typeof project.name !== "string") {
      errors.push("Project name is required");
    }

    if (!project.category || typeof project.category !== "string") {
      errors.push("Product category is required");
    }

    if (project.quantity !== undefined) {
      if (typeof project.quantity !== "number" || project.quantity <= 0) {
        errors.push("Quantity must be a positive number");
      }
    }

    if (project.budget !== undefined) {
      if (typeof project.budget !== "number" || project.budget <= 0) {
        errors.push("Budget must be a positive number");
      }
    }

    if (project.sustainabilityPriorities) {
      const priorities = project.sustainabilityPriorities;
      const prioritySum = Object.values(priorities).reduce(
        (sum, val) => sum + (val || 0),
        0
      );

      if (Math.abs(prioritySum - 100) > 1) {
        // Allow 1% tolerance
        errors.push("Sustainability priorities must sum to 100%");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate carbon footprint data
   */
  validateCarbonFootprint(carbonData) {
    const errors = [];

    if (carbonData.perUnit !== undefined) {
      if (typeof carbonData.perUnit !== "number" || carbonData.perUnit < 0) {
        errors.push("Carbon footprint per unit must be a non-negative number");
      }
    }

    ["scope1", "scope2", "scope3"].forEach((scope) => {
      if (carbonData[scope] !== undefined) {
        if (typeof carbonData[scope] !== "number" || carbonData[scope] < 0) {
          errors.push(`${scope} emissions must be a non-negative number`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate filter parameters
   */
  validateFilters(filters) {
    const errors = [];

    if (filters.sustainabilityScore) {
      const [min, max] = filters.sustainabilityScore;
      if (
        typeof min !== "number" ||
        typeof max !== "number" ||
        min < 0 ||
        max > 10 ||
        min > max
      ) {
        errors.push(
          "Sustainability score range must be valid numbers between 0-10"
        );
      }
    }

    if (filters.carbonPerUnit) {
      const [min, max] = filters.carbonPerUnit;
      if (
        typeof min !== "number" ||
        typeof max !== "number" ||
        min < 0 ||
        min > max
      ) {
        errors.push(
          "Carbon footprint range must be valid non-negative numbers"
        );
      }
    }

    if (filters.certifications && !Array.isArray(filters.certifications)) {
      errors.push("Certifications filter must be an array");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize input data
   */
  sanitizeString(input, maxLength = 255) {
    if (typeof input !== "string") return "";

    return input
      .trim()
      .slice(0, maxLength)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""); // Remove scripts
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date format
   */
  validateDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Check required fields
   */
  checkRequiredFields(data, requiredFields) {
    const missing = requiredFields.filter((field) => {
      const value = this.getNestedValue(data, field);
      return value === undefined || value === null || value === "";
    });

    return {
      isValid: missing.length === 0,
      missingFields: missing,
    };
  }

  /**
   * Get nested object value
   */
  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  /**
   * Validate numeric range
   */
  validateNumericRange(value, min, max) {
    return typeof value === "number" && value >= min && value <= max;
  }

  /**
   * Validate array of unique values
   */
  validateUniqueArray(arr) {
    if (!Array.isArray(arr)) return false;
    return arr.length === new Set(arr).size;
  }
}

export default new DataValidator();
