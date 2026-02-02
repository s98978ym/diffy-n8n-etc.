import { create } from "zustand";
import type { Proposal, User, Workflow, DashboardStats } from "@/types";

interface AppState {
  currentUser: User | null;
  proposals: Proposal[];
  workflows: Workflow[];
  stats: DashboardStats;

  setCurrentUser: (user: User) => void;
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  removeProposal: (id: string) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  setStats: (stats: DashboardStats) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  proposals: [],
  workflows: [],
  stats: {
    totalProposals: 0,
    activeProposals: 0,
    implementedCount: 0,
    feedbackCount: 0,
    activeWorkflows: 0,
    improvementRate: 0,
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  addProposal: (proposal) =>
    set((state) => ({ proposals: [proposal, ...state.proposals] })),

  updateProposal: (id, updates) =>
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),

  removeProposal: (id) =>
    set((state) => ({ proposals: state.proposals.filter((p) => p.id !== id) })),

  addWorkflow: (workflow) =>
    set((state) => ({ workflows: [workflow, ...state.workflows] })),

  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ),
    })),

  setStats: (stats) => set({ stats }),
}));
