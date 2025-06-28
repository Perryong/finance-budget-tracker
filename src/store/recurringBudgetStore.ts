
import { create } from 'zustand';
import { recurringBudgetService } from '@/services/recurringBudgetService';

interface RecurringBudgetState {
  recurringBudgets: Record<string, number>;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRecurringBudgets: () => Promise<void>;
  setRecurringBudget: (categoryName: string, amount: number) => Promise<void>;
  setBulkRecurringBudgets: (budgets: Record<string, number>) => Promise<void>;
  generateMonthlyBudgets: (month: number, year: number) => Promise<void>;
  deleteRecurringBudget: (categoryName: string) => Promise<void>;
}

export const useRecurringBudgetStore = create<RecurringBudgetState>((set, get) => ({
  recurringBudgets: {},
  loading: false,
  error: null,

  fetchRecurringBudgets: async () => {
    try {
      set({ loading: true, error: null });
      const recurringBudgets = await recurringBudgetService.getRecurringBudgets();
      set({ recurringBudgets, loading: false });
    } catch (error) {
      console.error('Error fetching recurring budgets:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  setRecurringBudget: async (categoryName, amount) => {
    try {
      set({ error: null });
      await recurringBudgetService.setRecurringBudget(categoryName, amount);
      set((state) => ({
        recurringBudgets: { ...state.recurringBudgets, [categoryName]: amount }
      }));
    } catch (error) {
      console.error('Error setting recurring budget:', error);
      set({ error: (error as Error).message });
    }
  },

  setBulkRecurringBudgets: async (budgets) => {
    try {
      set({ error: null });
      await recurringBudgetService.setBulkRecurringBudgets(budgets);
      set({ recurringBudgets: budgets });
    } catch (error) {
      console.error('Error setting bulk recurring budgets:', error);
      set({ error: (error as Error).message });
    }
  },

  generateMonthlyBudgets: async (month, year) => {
    try {
      set({ error: null });
      await recurringBudgetService.generateMonthlyBudgets(month, year);
    } catch (error) {
      console.error('Error generating monthly budgets:', error);
      set({ error: (error as Error).message });
    }
  },

  deleteRecurringBudget: async (categoryName) => {
    try {
      set({ error: null });
      await recurringBudgetService.deleteRecurringBudget(categoryName);
      set((state) => {
        const { [categoryName]: _, ...rest } = state.recurringBudgets;
        return { recurringBudgets: rest };
      });
    } catch (error) {
      console.error('Error deleting recurring budget:', error);
      set({ error: (error as Error).message });
    }
  },
}));