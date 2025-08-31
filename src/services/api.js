// src/services/api.js
import { suppliers } from "../data/mockData/suppliers";
import { products } from "../data/mockData/products";
import { procurementProjects } from "../data/mockData/procurementProjects";
import { userProfile } from "../data/mockData/userProfile";
import {
  scenarioComparison,
  aiRecommendations,
} from "../data/mockData/scenarios";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class ApiService {
  // Supplier endpoints
  async getSuppliers(filters = {}) {
    await delay(300);
    let filteredSuppliers = [...suppliers];

    // Apply filters
    if (filters.search) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          supplier.location?.city
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    if (filters.certifications?.length > 0) {
      filteredSuppliers = filteredSuppliers.filter((supplier) =>
        filters.certifications.some((cert) =>
          supplier.certifications?.includes(cert)
        )
      );
    }

    if (filters.sustainabilityScore) {
      const [min, max] = filters.sustainabilityScore;
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) =>
          supplier.sustainabilityScore >= min &&
          supplier.sustainabilityScore <= max
      );
    }

    return { data: filteredSuppliers, total: filteredSuppliers.length };
  }

  async getSupplierById(id) {
    await delay(200);
    const supplier = suppliers.find((s) => s.id === parseInt(id));
    if (!supplier) throw new Error("Supplier not found");
    return { data: supplier };
  }

  async createSupplier(supplierData) {
    await delay(500);
    const newSupplier = {
      id: Math.max(...suppliers.map((s) => s.id)) + 1,
      ...supplierData,
      lastInteraction: new Date().toISOString(),
      sustainabilityScore: 0,
      certifications: [],
      preferred: false,
      riskLevel: "medium",
    };
    suppliers.push(newSupplier);
    return { data: newSupplier };
  }

  async updateSupplier(id, supplierData) {
    await delay(400);
    const index = suppliers.findIndex((s) => s.id === parseInt(id));
    if (index === -1) throw new Error("Supplier not found");

    suppliers[index] = { ...suppliers[index], ...supplierData };
    return { data: suppliers[index] };
  }

  // Product endpoints
  async getProducts(filters = {}) {
    await delay(250);
    let filteredProducts = [...products];

    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters.priority) {
      filteredProducts = filteredProducts.filter(
        (p) => p.priority === filters.priority
      );
    }

    return { data: filteredProducts, total: filteredProducts.length };
  }

  async getProductById(id) {
    await delay(200);
    const product = products.find((p) => p.id === parseInt(id));
    if (!product) throw new Error("Product not found");
    return { data: product };
  }

  // Procurement endpoints
  async getProcurementProjects(filters = {}) {
    await delay(300);
    return { data: procurementProjects, total: procurementProjects.length };
  }

  async createProcurementProject(projectData) {
    await delay(600);
    const newProject = {
      id: Math.max(...procurementProjects.map((p) => p.id)) + 1,
      ...projectData,
      bidding: {
        method: "Open Tender",
        status: "draft",
        shortlistedSupplierIds: [],
      },
      interestedSuppliers: [],
      communications: [],
      milestones: [
        {
          name: "Bid Opening",
          date: projectData.timeline?.bidDeadline,
          status: "upcoming",
        },
        { name: "Evaluation Complete", status: "upcoming" },
        { name: "Award", status: "upcoming" },
      ],
    };
    procurementProjects.push(newProject);
    return { data: newProject };
  }

  async updateProcurementProject(id, projectData) {
    await delay(400);
    const index = procurementProjects.findIndex((p) => p.id === parseInt(id));
    if (index === -1) throw new Error("Project not found");

    procurementProjects[index] = {
      ...procurementProjects[index],
      ...projectData,
    };
    return { data: procurementProjects[index] };
  }

  // Scenario endpoints
  async getScenarios() {
    await delay(200);
    return { data: scenarioComparison };
  }

  async getAiRecommendations(projectData = {}) {
    await delay(800); // Simulate AI processing time
    return { data: aiRecommendations };
  }

  // User profile endpoints
  async getUserProfile() {
    await delay(150);
    return { data: userProfile };
  }

  async updateUserProfile(profileData) {
    await delay(400);
    Object.assign(userProfile, profileData);
    return { data: userProfile };
  }

  // Dashboard endpoints
  async getDashboardStats() {
    await delay(200);
    return {
      data: {
        activeSuppliers: suppliers.length,
        productsOfInterest: products.length,
        carbonSaved: 1500,
        procurementValue: 5200000,
        carbonFootprintData: [
          { label: "Jan", generated: 320, saved: 450 },
          { label: "Feb", generated: 300, saved: 480 },
          { label: "Mar", generated: 290, saved: 500 },
          { label: "Apr", generated: 270, saved: 540 },
          { label: "May", generated: 260, saved: 560 },
          { label: "Jun", generated: 250, saved: 600 },
          { label: "Jul", generated: 240, saved: 620 },
          { label: "Aug", generated: 235, saved: 650 },
        ],
      },
    };
  }
}

export default new ApiService();
