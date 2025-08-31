// src/context/ProcurementContext.js
import { createContext, useContext, useReducer, useEffect } from "react";
import ApiService from "../services/api";

const ProcurementContext = createContext();

const initialState = {
  projects: [],
  currentProject: null,
  activeProject: null,
  interestedSuppliers: [],
  proposals: [],
  communications: [],
  scenarios: [],
  loading: false,
  error: null,

  // Project creation state
  formData: {
    name: "",
    description: "",
    category: "",
    quantity: 0,
    budget: 0,
    timeline: null,
    sustainabilityPriorities: {
      carbonFootprint: 40,
      recycling: 30,
      certifications: 20,
      policies: 10,
    },
  },

  // Bidding state
  biddingStatus: "draft", // draft, open, evaluation, awarded
  shortlistedSuppliers: [],

  // Evaluation criteria
  evaluationCriteria: {
    price: { weight: 25, score: 0 },
    sustainability: { weight: 30, score: 0 },
    delivery: { weight: 20, score: 0 },
    quality: { weight: 15, score: 0 },
    experience: { weight: 10, score: 0 },
  },
};

const procurementReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_PROJECTS":
      return { ...state, projects: action.payload, loading: false };

    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...state.projects, action.payload],
        currentProject: action.payload,
      };

    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),
        currentProject:
          state.currentProject?.id === action.payload.id
            ? { ...state.currentProject, ...action.payload }
            : state.currentProject,
      };

    case "SELECT_PROJECT":
      return { ...state, currentProject: action.payload };

    case "SET_ACTIVE_PROJECT":
      return { ...state, activeProject: action.payload };

    case "UPDATE_FORM_DATA":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };

    case "RESET_FORM_DATA":
      return { ...state, formData: initialState.formData };

    case "SET_INTERESTED_SUPPLIERS":
      return { ...state, interestedSuppliers: action.payload };

    case "ADD_INTERESTED_SUPPLIER":
      return {
        ...state,
        interestedSuppliers: [...state.interestedSuppliers, action.payload],
      };

    case "UPDATE_SUPPLIER_INTEREST":
      return {
        ...state,
        interestedSuppliers: state.interestedSuppliers.map((supplier) =>
          supplier.supplierId === action.payload.supplierId
            ? { ...supplier, ...action.payload }
            : supplier
        ),
      };

    case "SET_PROPOSALS":
      return { ...state, proposals: action.payload };

    case "ADD_PROPOSAL":
      return { ...state, proposals: [...state.proposals, action.payload] };

    case "UPDATE_PROPOSAL":
      return {
        ...state,
        proposals: state.proposals.map((proposal) =>
          proposal.id === action.payload.id
            ? { ...proposal, ...action.payload }
            : proposal
        ),
      };

    case "SET_COMMUNICATIONS":
      return { ...state, communications: action.payload };

    case "ADD_COMMUNICATION":
      return {
        ...state,
        communications: [...state.communications, action.payload],
      };

    case "ADD_SHORTLISTED_SUPPLIER":
      const exists = state.shortlistedSuppliers.find(
        (s) => s.id === action.payload.id
      );
      if (exists) return state;
      return {
        ...state,
        shortlistedSuppliers: [...state.shortlistedSuppliers, action.payload],
      };

    case "REMOVE_SHORTLISTED_SUPPLIER":
      return {
        ...state,
        shortlistedSuppliers: state.shortlistedSuppliers.filter(
          (s) => s.id !== action.payload
        ),
      };

    case "CLEAR_SHORTLIST":
      return { ...state, shortlistedSuppliers: [] };

    case "SET_BIDDING_STATUS":
      return { ...state, biddingStatus: action.payload };

    case "UPDATE_EVALUATION_CRITERIA":
      return {
        ...state,
        evaluationCriteria: {
          ...state.evaluationCriteria,
          [action.payload.key]: {
            ...state.evaluationCriteria[action.payload.key],
            ...action.payload.updates,
          },
        },
      };

    case "SET_SCENARIOS":
      return { ...state, scenarios: action.payload };

    case "ADD_SCENARIO":
      return { ...state, scenarios: [...state.scenarios, action.payload] };

    default:
      return state;
  }
};

export const ProcurementProvider = ({ children }) => {
  const [state, dispatch] = useReducer(procurementReducer, initialState);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await ApiService.getProcurementProjects();
      dispatch({ type: "SET_PROJECTS", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const createProject = async (projectData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await ApiService.createProcurementProject(projectData);
      dispatch({ type: "ADD_PROJECT", payload: response.data });
      dispatch({ type: "SET_ACTIVE_PROJECT", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const response = await ApiService.updateProcurementProject(id, updates);
      dispatch({ type: "UPDATE_PROJECT", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const selectProject = (project) => {
    dispatch({ type: "SELECT_PROJECT", payload: project });
  };

  const setActiveProject = (project) => {
    dispatch({ type: "SET_ACTIVE_PROJECT", payload: project });
  };

  const updateFormData = (updates) => {
    dispatch({ type: "UPDATE_FORM_DATA", payload: updates });
  };

  const resetFormData = () => {
    dispatch({ type: "RESET_FORM_DATA" });
  };

  const addInterestedSupplier = (supplierData) => {
    dispatch({ type: "ADD_INTERESTED_SUPPLIER", payload: supplierData });
  };

  const updateSupplierInterest = (supplierId, updates) => {
    dispatch({
      type: "UPDATE_SUPPLIER_INTEREST",
      payload: { supplierId, ...updates },
    });
  };

  const addProposal = (proposalData) => {
    dispatch({ type: "ADD_PROPOSAL", payload: proposalData });
  };

  const updateProposal = (id, updates) => {
    dispatch({ type: "UPDATE_PROPOSAL", payload: { id, ...updates } });
  };

  const sendMessage = async (projectId, supplierId, message) => {
    try {
      const communicationData = {
        projectId,
        supplierId,
        message,
        timestamp: new Date().toISOString(),
        direction: "outbound",
      };

      dispatch({ type: "ADD_COMMUNICATION", payload: communicationData });

      // In real app, this would call API
      // await ApiService.sendMessage(communicationData);

      return communicationData;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const addToShortlist = (supplier) => {
    dispatch({ type: "ADD_SHORTLISTED_SUPPLIER", payload: supplier });
  };

  const removeFromShortlist = (supplierId) => {
    dispatch({ type: "REMOVE_SHORTLISTED_SUPPLIER", payload: supplierId });
  };

  const clearShortlist = () => {
    dispatch({ type: "CLEAR_SHORTLIST" });
  };

  const setBiddingStatus = (status) => {
    dispatch({ type: "SET_BIDDING_STATUS", payload: status });
  };

  const updateEvaluationCriteria = (key, updates) => {
    dispatch({
      type: "UPDATE_EVALUATION_CRITERIA",
      payload: { key, updates },
    });
  };

  const calculateProposalScore = (proposal) => {
    const { evaluationCriteria } = state;
    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(evaluationCriteria).forEach(([key, criteria]) => {
      if (proposal[key] !== undefined) {
        totalScore += (proposal[key] * criteria.weight) / 100;
        totalWeight += criteria.weight;
      }
    });

    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  };

  const submitProject = async () => {
    try {
      if (!state.formData.name || !state.formData.category) {
        throw new Error("Project name and category are required");
      }

      const projectData = {
        ...state.formData,
        status: "draft",
        createdAt: new Date().toISOString(),
        shortlistedSuppliers: state.shortlistedSuppliers.map((s) => s.id),
      };

      const project = await createProject(projectData);
      resetFormData();
      return project;
    } catch (error) {
      throw error;
    }
  };

  const startBidding = async (projectId) => {
    try {
      await updateProject(projectId, {
        "bidding.status": "accepting_bids",
        "timeline.biddingStarted": new Date().toISOString(),
      });
      setBiddingStatus("open");
    } catch (error) {
      throw error;
    }
  };

  const closeBidding = async (projectId) => {
    try {
      await updateProject(projectId, {
        "bidding.status": "evaluation",
        "timeline.biddingClosed": new Date().toISOString(),
      });
      setBiddingStatus("evaluation");
    } catch (error) {
      throw error;
    }
  };

  const awardContract = async (projectId, proposalId) => {
    try {
      await updateProject(projectId, {
        "bidding.status": "awarded",
        "bidding.awardedProposal": proposalId,
        "timeline.awarded": new Date().toISOString(),
      });
      setBiddingStatus("awarded");
    } catch (error) {
      throw error;
    }
  };

  const value = {
    // State
    ...state,

    // Actions
    loadProjects,
    createProject,
    updateProject,
    selectProject,
    setActiveProject,
    updateFormData,
    resetFormData,
    submitProject,

    // Supplier management
    addInterestedSupplier,
    updateSupplierInterest,
    addToShortlist,
    removeFromShortlist,
    clearShortlist,

    // Bidding process
    startBidding,
    closeBidding,
    setBiddingStatus,

    // Proposals
    addProposal,
    updateProposal,
    calculateProposalScore,
    awardContract,

    // Communication
    sendMessage,

    // Evaluation
    updateEvaluationCriteria,

    // Computed values
    hasActiveProject: !!state.activeProject,
    shortlistCount: state.shortlistedSuppliers.length,
    proposalCount: state.proposals.length,
    canStartBidding:
      state.shortlistedSuppliers.length > 0 && state.biddingStatus === "draft",
  };

  return (
    <ProcurementContext.Provider value={value}>
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurementContext = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error(
      "useProcurementContext must be used within a ProcurementProvider"
    );
  }
  return context;
};

export default ProcurementContext;
