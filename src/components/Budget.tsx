
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseStore } from '@/store/supabaseStore';
import { BudgetOverview } from '@/components/budget/BudgetOverview';
import { EnhancedBudgetCategories } from '@/components/budget/EnhancedBudgetCategories';
import { BudgetChart } from '@/components/budget/BudgetChart';
import { BudgetInsights } from '@/components/budget/BudgetInsights';
import { BudgetModal } from '@/components/budget/BudgetModal';
import { budgetService } from '@/services/budgetService';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const Budget = () => {
  const { transactions, categories, loading: dataLoading } = useSupabaseStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [budgets, setBudgets] = React.useState<Record<string, number>>({});
  const [budgetsLoading, setBudgetsLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter((transaction) =>
    isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
  );
  
  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  const totalSpent = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const expensesByCategory = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const categoryName = transaction.category;
      acc[categoryName] = (acc[categoryName] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  // Load budgets from Supabase only when main data is loaded
  React.useEffect(() => {
    const loadBudgets = async () => {
      if (dataLoading || initialized) return;
      
      setBudgetsLoading(true);
      try {
        console.log('Loading budgets for', currentMonth.getMonth() + 1, currentMonth.getFullYear());
        const budgetData = await budgetService.getBudgets(
          currentMonth.getMonth() + 1,
          currentMonth.getFullYear()
        );
        console.log('Loaded budget data:', budgetData);
        setBudgets(budgetData);
        setInitialized(true);
      } catch (error) {
        console.error('Error loading budgets:', error);
        toast.error('Failed to load budgets');
      } finally {
        setBudgetsLoading(false);
      }
    };

    if (!dataLoading && transactions.length >= 0 && categories.length >= 0) {
      loadBudgets();
    }
  }, [currentMonth, dataLoading, transactions, categories, initialized]);

  const handleSaveBudgets = async () => {
    try {
      await budgetService.setBulkBudgets(
        budgets,
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear()
      );
      toast.success('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budgets:', error);
      toast.error('Failed to save budget');
    }
  };

  const isLoading = dataLoading || budgetsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading budget data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
          <p className="text-gray-600">{format(currentMonth, 'MMMM yyyy')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Quick Set Budget
        </Button>
      </div>

      <BudgetOverview
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        remainingBudget={remainingBudget}
        budgetProgress={budgetProgress}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedBudgetCategories
          categories={categories}
          budgets={budgets}
          setBudgets={setBudgets}
          onSaveBudgets={handleSaveBudgets}
        />
        
        <BudgetChart
          budgetData={budgets}
          actualData={expensesByCategory}
          categories={categories}
        />
      </div>

      <BudgetInsights
        budgets={budgets}
        expensesByCategory={expensesByCategory}
        budgetProgress={budgetProgress}
      />

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        budgets={budgets}
        setBudgets={setBudgets}
      />
    </div>
  );
};
