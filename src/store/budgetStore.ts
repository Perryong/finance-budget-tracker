
import { create } from 'zustand';
import { budgetService } from '@/services/budgetService';

interface BudgetState {
  budgets: Record<string, number>;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBudgets: (month: number, year: number) => Promise<void>;
  setBudget: (categoryName: string, amount: number, month: number, year: number) => Promise<void>;
  setBulkBudgets: (budgets: Record<string, number>, month: number, year: number) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: {},
  loading: false,
  error: null,

  fetchBudgets: async (month, year) => {
    try {
      set({ error: null });
      const budgets = await budgetService.getBudgets(month, year);
      set({ budgets });
    } catch (error) {
      console.error('Error fetching budgets:', error);
      set({ error: (error as Error).message });
    }
  },

  setBudget: async (categoryName, amount, month, year) => {
    try {
      set({ error: null });
      await budgetService.setBudget(categoryName, amount, month, year);
      set((state) => ({
        budgets: { ...state.budgets, [categoryName]: amount }
      }));
    } catch (error) {
      console.error('Error setting budget:', error);
      set({ error: (error as Error).message });
    }
  },

  setBulkBudgets: async (budgets, month, year) => {
    try {
      set({ error: null });
      await budgetService.setBulkBudgets(budgets, month, year);
      set({ budgets });
    } catch (error) {
      console.error('Error setting bulk budgets:', error);
      set({ error: (error as Error).message });
    }
  },
}));
