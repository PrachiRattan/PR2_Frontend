// src/services/utils/formatters.js

export class DataFormatter {
  /**
   * Format numbers with appropriate units
   */
  formatNumber(value, decimals = 1) {
    if (value === null || value === undefined) return "N/A";
    return parseFloat(value).toFixed(decimals);
  }

  /**
   * Format currency values
   */
  formatCurrency(value, currency = "USD", locale = "en-US") {
    if (value === null || value === undefined) return "N/A";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Format large numbers with K, M, B suffixes
   */
  formatLargeNumber(value, decimals = 1) {
    if (value === null || value === undefined) return "N/A";

    const absValue = Math.abs(value);

    if (absValue >= 1e9) {
      return `${(value / 1e9).toFixed(decimals)}B`;
    } else if (absValue >= 1e6) {
      return `${(value / 1e6).toFixed(decimals)}M`;
    } else if (absValue >= 1e3) {
      return `${(value / 1e3).toFixed(decimals)}K`;
    }

    return value.toFixed(decimals);
  }

  /**
   * Format carbon emissions
   */
  formatCarbonEmissions(value, unit = "kg") {
    if (value === null || value === undefined) return "N/A";

    const absValue = Math.abs(value);

    if (unit === "kg" && absValue >= 1000) {
      return `${(value / 1000).toFixed(1)} tCO2e`;
    }

    return `${value.toFixed(1)} ${unit}CO2e`;
  }

  /**
   * Format percentage values
   */
  formatPercentage(value, decimals = 1) {
    if (value === null || value === undefined) return "N/A";
    return `${parseFloat(value).toFixed(decimals)}%`;
  }

  /**
   * Format dates
   */
  formatDate(date, options = {}) {
    if (!date) return "N/A";

    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    };

    return new Intl.DateTimeFormat("en-US", defaultOptions).format(
      new Date(date)
    );
  }

  /**
   * Format relative time (e.g., "2 days ago")
   */
  formatRelativeTime(date) {
    if (!date) return "N/A";

    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = now - targetDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return `${Math.floor(diffDays / 365)} years ago`;
  }

  /**
   * Format sustainability score with color coding
   */
  formatSustainabilityScore(score) {
    if (score === null || score === undefined)
      return { value: "N/A", color: "gray" };

    const numScore = parseFloat(score);
    let color;

    if (numScore >= 8.5) color = "green";
    else if (numScore >= 7.0) color = "blue";
    else if (numScore >= 5.5) color = "yellow";
    else color = "red";

    return {
      value: numScore.toFixed(1),
      outOf: "10",
      color,
      label: this.getSustainabilityLabel(numScore),
    };
  }

  /**
   * Get sustainability performance label
   */
  getSustainabilityLabel(score) {
    if (score >= 9.0) return "Excellent";
    if (score >= 8.0) return "Very Good";
    if (score >= 7.0) return "Good";
    if (score >= 6.0) return "Fair";
    if (score >= 4.0) return "Poor";
    return "Very Poor";
  }

  /**
   * Format risk level with appropriate styling
   */
  formatRiskLevel(riskLevel) {
    const riskMap = {
      low: { label: "Low Risk", color: "green" },
      medium: { label: "Medium Risk", color: "yellow" },
      high: { label: "High Risk", color: "red" },
    };

    return riskMap[riskLevel] || { label: "Unknown", color: "gray" };
  }

  /**
   * Format certification list
   */
  formatCertifications(certifications, maxDisplay = 3) {
    if (!Array.isArray(certifications) || certifications.length === 0) {
      return { displayed: [], additional: 0 };
    }

    const displayed = certifications.slice(0, maxDisplay);
    const additional = Math.max(0, certifications.length - maxDisplay);

    return { displayed, additional };
  }

  /**
   * Format address from location object
   */
  formatAddress(location, includeCountry = true) {
    if (!location) return "N/A";

    const parts = [];

    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (includeCountry && location.country) parts.push(location.country);

    return parts.join(", ") || "N/A";
  }

  /**
   * Format duration in human readable format
   */
  formatDuration(days) {
    if (!days || days < 0) return "N/A";

    if (days < 7) return `${days} day${days !== 1 ? "s" : ""}`;
    if (days < 30)
      return `${Math.floor(days / 7)} week${
        Math.floor(days / 7) !== 1 ? "s" : ""
      }`;
    if (days < 365)
      return `${Math.floor(days / 30)} month${
        Math.floor(days / 30) !== 1 ? "s" : ""
      }`;

    return `${Math.floor(days / 365)} year${
      Math.floor(days / 365) !== 1 ? "s" : ""
    }`;
  }

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Truncate text with ellipsis
   */
  truncateText(text, maxLength = 100, suffix = "...") {
    if (!text || text.length <= maxLength) return text || "";
    return text.substring(0, maxLength).trim() + suffix;
  }

  /**
   * Format KPI status
   */
  formatKPIStatus(value, benchmark, higherIsBetter = true) {
    if (value === null || value === undefined)
      return { status: "unknown", color: "gray" };

    const ratio = value / benchmark;
    let status, color;

    if (higherIsBetter) {
      if (ratio >= 1.1) {
        status = "excellent";
        color = "green";
      } else if (ratio >= 0.95) {
        status = "good";
        color = "blue";
      } else if (ratio >= 0.85) {
        status = "fair";
        color = "yellow";
      } else {
        status = "poor";
        color = "red";
      }
    } else {
      if (ratio <= 0.9) {
        status = "excellent";
        color = "green";
      } else if (ratio <= 1.05) {
        status = "good";
        color = "blue";
      } else if (ratio <= 1.15) {
        status = "fair";
        color = "yellow";
      } else {
        status = "poor";
        color = "red";
      }
    }

    return { status, color, ratio: ratio.toFixed(2) };
  }
}

export default new DataFormatter();
