
// Re-export all stores for backward compatibility
export { useTransactionStore } from './transactionStore';
export { useCategoryStore } from './categoryStore';
export { useBudgetStore } from './budgetStore';
export { useUserSettingsStore } from './userSettingsStore';

// Create a combined hook for components that need access to multiple stores
import { useTransactionStore } from './transactionStore';
import { useCategoryStore } from './categoryStore';
import { useBudgetStore } from './budgetStore';
import { useUserSettingsStore } from './userSettingsStore';

export const useSupabaseStore = () => {
  const transactionStore = useTransactionStore();
  const categoryStore = useCategoryStore();
  const budgetStore = useBudgetStore();
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

    // User Settings methods
    theme: userSettingsStore.theme,
    monthlyIncomeTarget: userSettingsStore.monthlyIncomeTarget,
    emergencyFundGoal: userSettingsStore.emergencyFundGoal,
    savingAmount: userSettingsStore.savingAmount,
    currentSavings: userSettingsStore.currentSavings,
    fetchUserSettings: userSettingsStore.fetchUserSettings,
    setMonthlyIncomeTarget: userSettingsStore.setMonthlyIncomeTarget,
    setEmergencyFundGoal: userSettingsStore.setEmergencyFundGoal,
    setSavingAmount: userSettingsStore.setSavingAmount,
    setCurrentSavings: userSettingsStore.setCurrentSavings,
    toggleTheme: userSettingsStore.toggleTheme,

    // Combined loading and error states
    loading: transactionStore.loading || categoryStore.loading || userSettingsStore.loading,
    error: transactionStore.error || categoryStore.error || budgetStore.error || userSettingsStore.error,
  };
};
