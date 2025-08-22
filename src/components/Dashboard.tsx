import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseStore } from '@/store/supabaseStore';
import { DoughnutChart } from './DoughnutChart';
import { TransactionCalendar } from './TransactionCalendar';
import { TransactionModal } from './TransactionModal';
import { InlineEdit } from './InlineEdit';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet } from 'lucide-react';

export const Dashboard = () => {
  const { 
    transactions, 
    categories, 
    savingAmount, 
    currentSavings,
    setSavingAmount,
    setCurrentSavings,
    loading,
    initialized
  } = useSupabaseStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter((transaction) =>
    isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
  );
  
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const netBalance = totalIncome - totalExpenses;
  
  const displaySavingAmount = savingAmount ?? netBalance;
  const displayCurrentSavings = currentSavings ?? 0;
  
  // Calculate Current Savings Balance (Monthly Savings + Current Savings)
  const currentSavingsBalance = displaySavingAmount + displayCurrentSavings;
  
  const expensesByCategory = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = categories.find((c) => c.name === transaction.category);
      const categoryName = category?.name || 'Other';
      acc[categoryName] = (acc[categoryName] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const handleSavingAmountChange = async (value: number) => {
    await setSavingAmount(value);
  };

  const handleCurrentSavingsChange = async (value: number) => {
    await setCurrentSavings(value);
  };

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">{format(currentMonth, 'MMMM yyyy')}</p>
        <div className="mt-4">
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-6 w-6 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Income</CardTitle>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Expenses</CardTitle>
            <TrendingDown className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${netBalance >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Net Balance</CardTitle>
            <DollarSign className={`h-6 w-6 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ${netBalance.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Savings</CardTitle>
            <PiggyBank className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <InlineEdit
                value={displaySavingAmount}
                onSave={handleSavingAmountChange}
                showResetButton={false}
              />
              <p className="text-xs text-gray-500">
                {savingAmount !== null ? 'User-set monthly target' : 'Auto-calculated from monthly net balance'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Savings</CardTitle>
            <Wallet className="h-6 w-6 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <InlineEdit
                value={displayCurrentSavings}
                onSave={handleCurrentSavingsChange}
                showResetButton={false}
              />
              <p className="text-xs text-gray-500">
                Your current savings balance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <DoughnutChart data={expensesByCategory} categories={categories} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Transaction Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <TransactionCalendar transactions={currentMonthTransactions} />
          </CardContent>
        </Card>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;