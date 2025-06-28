
// Re-export all stores for backward compatibility
export { useTransactionStore } from './transactionStore';
export { useCategoryStore } from './categoryStore';
export { useBudgetStore } from './budgetStore';
export { useRecurringBudgetStore } from './recurringBudgetStore';
export { useUserSettingsStore } from './userSettingsStore';

// Create a combined hook for components that need access to multiple stores
import { useTransactionStore } from './transactionStore';
import { useCategoryStore } from './categoryStore';
import { useBudgetStore } from './budgetStore';
import { useRecurringBudgetStore } from './recurringBudgetStore';
import { useUserSettingsStore } from './userSettingsStore';

export const useSupabaseStore = () => {
  const transactionStore = useTransactionStore();
  const categoryStore = useCategoryStore();
  const budgetStore = useBudgetStore();
  const recurringBudgetStore = useRecurringBudgetStore();
  const userSettingsStore = useUserSettingsStore();

  return {
    // Transaction methods
    transactions: transactionStore.transactions,
    fetchTransactions: transactionStore.fetchTransactions,
    addTransaction: transactionStore.addTransaction,
    updateTransaction: transactionStore.updateTransaction,
    deleteTransaction: transactionStore.deleteTransaction,

    // Category methods
    categories: categoryStore.categories,
    fetchCategories: categoryStore.fetchCategories,
    addCategory: categoryStore.addCategory,
    updateCategory: categoryStore.updateCategory,
    deleteCategory: categoryStore.deleteCategory,

    // Budget methods
    budgets: budgetStore.budgets,
    fetchBudgets: budgetStore.fetchBudgets,
    setBudget: budgetStore.setBudget,
    setBulkBudgets: budgetStore.setBulkBudgets,

    // Recurring Budget methods
    recurringBudgets: recurringBudgetStore.recurringBudgets,
    fetchRecurringBudgets: recurringBudgetStore.fetchRecurringBudgets,
    setRecurringBudget: recurringBudgetStore.setRecurringBudget,
    setBulkRecurringBudgets: recurringBudgetStore.setBulkRecurringBudgets,
    generateMonthlyBudgets: recurringBudgetStore.generateMonthlyBudgets,
    deleteRecurringBudget: recurringBudgetStore.deleteRecurringBudget,

    // User Settings methods
    monthlyIncomeTarget: userSettingsStore.monthlyIncomeTarget,
    emergencyFundGoal: userSettingsStore.emergencyFundGoal,
    savingAmount: userSettingsStore.savingAmount,
    currentSavings: userSettingsStore.currentSavings,
    fetchUserSettings: userSettingsStore.fetchUserSettings,
    setMonthlyIncomeTarget: userSettingsStore.setMonthlyIncomeTarget,
    setEmergencyFundGoal: userSettingsStore.setEmergencyFundGoal,
    setSavingAmount: userSettingsStore.setSavingAmount,
    setCurrentSavings: userSettingsStore.setCurrentSavings,

    // Essential loading states (only for core data needed for page to function)
    loading: transactionStore.loading || categoryStore.loading || budgetStore.loading || userSettingsStore.loading,
    
    // Separate loading states for optional features
    recurringBudgetLoading: recurringBudgetStore.loading,
    
    // Combined error states
    error: transactionStore.error || categoryStore.error || budgetStore.error || recurringBudgetStore.error || userSettingsStore.error,
    initialized: userSettingsStore.initialized,
  };
};