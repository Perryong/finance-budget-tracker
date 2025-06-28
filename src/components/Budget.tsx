
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseStore } from '@/store/supabaseStore';
import { BudgetOverview } from '@/components/budget/BudgetOverview';
import { EnhancedBudgetCategories } from '@/components/budget/EnhancedBudgetCategories';
import { BudgetChart } from '@/components/budget/BudgetChart';
import { BudgetInsights } from '@/components/budget/BudgetInsights';
import { BudgetModal } from '@/components/budget/BudgetModal';
import { RecurringBudgetModal } from './budget/RecurringBudgetModal';
import { budgetService } from '@/services/budgetService';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Plus, Repeat, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export const Budget = () => {
  const { transactions, categories, loading: dataLoading, generateMonthlyBudgets } = useSupabaseStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = React.useState(false);
  const [budgets, setBudgets] = React.useState<Record<string, number>>({});
  const [budgetsLoading, setBudgetsLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
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

  // Load budgets from Supabase when date changes
  React.useEffect(() => {
    const loadBudgets = async () => {
      if (dataLoading) return;
      
      setBudgetsLoading(true);
      try {
        console.log('Loading budgets for', currentDate.getMonth() + 1, currentDate.getFullYear());
        const budgetData = await budgetService.getBudgets(
          currentDate.getMonth() + 1,
          currentDate.getFullYear()
        );
        console.log('Loaded budget data:', budgetData);
        setBudgets(budgetData);
        
        // If no budgets exist for this month, try to generate from recurring templates
        if (Object.keys(budgetData).length === 0) {
          try {
            await generateMonthlyBudgets(currentDate.getMonth() + 1, currentDate.getFullYear());
            // Reload budgets after generation
            const newBudgetData = await budgetService.getBudgets(
              currentDate.getMonth() + 1,
              currentDate.getFullYear()
            );
            if (Object.keys(newBudgetData).length > 0) {
              setBudgets(newBudgetData);
              toast.success('Budget generated from recurring templates!');
            }
          } catch (error) {
            console.log('No recurring templates available or error generating:', error);
          }
        }
        
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
  }, [currentDate, dataLoading, transactions, categories, generateMonthlyBudgets]);

  const handleSaveBudgets = async () => {
    try {
      await budgetService.setBulkBudgets(
        budgets,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      toast.success('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budgets:', error);
      toast.error('Failed to save budget');
    }
  };

  const handleCopyFromPreviousMonth = async () => {
    try {
      const prevBudgets = await budgetService.copyFromPreviousMonth(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      
      if (Object.keys(prevBudgets).length > 0) {
        setBudgets(prevBudgets);
        toast.success('Budget copied from previous month!');
      } else {
        toast.info('No budget found for previous month');
      }
    } catch (error) {
      console.error('Error copying from previous month:', error);
      toast.error('Failed to copy from previous month');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setInitialized(false); // Reset to reload data for new month
  };

  // Only show main loading for essential data, not for recurring budgets
  const isEssentialDataLoading = dataLoading || budgetsLoading;

  if (isEssentialDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading budget data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="text-gray-600 font-medium">{format(currentDate, 'MMMM yyyy')}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleCopyFromPreviousMonth}
            className="flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Previous</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsRecurringModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Repeat className="h-4 w-4" />
            <span>Recurring Templates</span>
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Quick Set Budget  
          </Button>
        </div>
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

      <RecurringBudgetModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        categories={categories}
        currentBudgets={budgets}
        setBudgets={setBudgets}
        currentMonth={currentDate.getMonth() + 1}
        currentYear={currentDate.getFullYear()}
      />
    </div>
  );
};