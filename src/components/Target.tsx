
import React from 'react';
import { useSupabaseStore } from '@/store/supabaseStore';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ProgressOverview } from '@/components/target/ProgressOverview';
import { EmergencyFundDetailsTable } from '@/components/target/EmergencyFundDetailsTable';
import { RecommendationsCard } from '@/components/target/RecommendationsCard';
import { getProgressColor, getStatusMessage } from '@/components/target/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Target = () => {
  const { 
    transactions, 
    monthlyIncomeTarget, 
    emergencyFundGoal,
    savingAmount,
    currentSavings,
    setMonthlyIncomeTarget,
    setEmergencyFundGoal,
    setSavingAmount,
    setCurrentSavings,
    loading,
    error,
    fetchUserSettings
  } = useSupabaseStore();

  const { toast } = useToast();
  const [settingsInitialized, setSettingsInitialized] = React.useState(false);

  // Fetch user settings when main data is loaded
  React.useEffect(() => {
    const loadUserSettings = async () => {
      if (loading || settingsInitialized) return;
      
      try {
        console.log('Target: Loading user settings...');
        await fetchUserSettings();
        setSettingsInitialized(true);
        console.log('Target: User settings loaded successfully');
      } catch (error) {
        console.error('Target: Error loading user settings:', error);
        toast({
          title: "Error",
          description: "Failed to load user settings",
          variant: "destructive",
        });
      }
    };

    if (!loading && transactions.length >= 0) {
      loadUserSettings();
    }
  }, [loading, transactions, fetchUserSettings, settingsInitialized, toast]);

  // Calculate monthly income from dashboard (auto-populate)
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter((transaction) =>
    isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
  );
  
  const dashboardMonthlyIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const netBalance = dashboardMonthlyIncome - totalExpenses;
  const dashboardMonthlySavings = savingAmount ?? netBalance;

  // Auto-populate Monthly Income Target from Dashboard's calculated monthly income
  React.useEffect(() => {
    if (dashboardMonthlyIncome > 0 && dashboardMonthlyIncome !== monthlyIncomeTarget && settingsInitialized) {
      console.log('Target: Auto-updating monthly income target:', dashboardMonthlyIncome);
      setMonthlyIncomeTarget(dashboardMonthlyIncome);
    }
  }, [dashboardMonthlyIncome, monthlyIncomeTarget, setMonthlyIncomeTarget, settingsInitialized]);

  // Calculate Current Savings Balance (Monthly Savings + Current Savings)
  const displayCurrentSavings = currentSavings ?? 0;
  const currentSavingsBalance = dashboardMonthlySavings + displayCurrentSavings;
  
  // Use user-defined values
  const monthlyIncome = monthlyIncomeTarget ?? dashboardMonthlyIncome;
  const finalEmergencyFundGoal = emergencyFundGoal ?? 0;
  
  // Calculate progress
  const amountNeeded = Math.max(0, finalEmergencyFundGoal - currentSavingsBalance);
  const progressPercentage = finalEmergencyFundGoal > 0 ? Math.min(100, (currentSavingsBalance / finalEmergencyFundGoal) * 100) : 0;
  
  // Calculate estimated time to goal: Emergency fund goal / current saving balance
  const monthsToGoal = currentSavingsBalance > 0 ? Math.ceil(finalEmergencyFundGoal / currentSavingsBalance) : 0;

  const handleMonthlyIncomeChange = async (value: number) => {
    try {
      console.log('Target: Updating monthly income target to:', value);
      await setMonthlyIncomeTarget(value);
      toast({
        title: "Success",
        description: "Monthly income target updated",
      });
    } catch (error) {
      console.error('Target: Error updating monthly income:', error);
      toast({
        title: "Error",
        description: "Failed to update monthly income target",
        variant: "destructive",
      });
    }
  };

  const handleEmergencyFundGoalChange = async (value: number) => {
    try {
      console.log('Target: Updating emergency fund goal to:', value);
      await setEmergencyFundGoal(value);
      toast({
        title: "Success",
        description: "Emergency fund goal updated",
      });
    } catch (error) {
      console.error('Target: Error updating emergency fund goal:', error);
      toast({
        title: "Error",
        description: "Failed to update emergency fund goal",
        variant: "destructive",
      });
    }
  };

  const handleCurrentSavingsBalanceChange = async (value: number) => {
    try {
      // Calculate what the current savings should be to achieve the desired total
      const newCurrentSavings = value - dashboardMonthlySavings;
      console.log('Target: Updating current savings to:', Math.max(0, newCurrentSavings));
      await setCurrentSavings(Math.max(0, newCurrentSavings));
      toast({
        title: "Success",
        description: "Current savings updated",
      });
    } catch (error) {
      console.error('Target: Error updating current savings:', error);
      toast({
        title: "Error",
        description: "Failed to update current savings",
        variant: "destructive",
      });
    }
  };

  const resetSavingAmountToAuto = async () => {
    try {
      console.log('Target: Resetting saving amount to auto-calculated');
      await setSavingAmount(null);
      toast({
        title: "Success",
        description: "Saving amount reset to auto-calculated",
      });
    } catch (error) {
      console.error('Target: Error resetting saving amount:', error);
      toast({
        title: "Error",
        description: "Failed to reset saving amount",
        variant: "destructive",
      });
    }
  };

  if (loading || !settingsInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading target data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Emergency Fund Target</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading data: {error}. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      )}

      <ProgressOverview
        progressPercentage={progressPercentage}
        getProgressColor={() => getProgressColor(progressPercentage)}
        getStatusMessage={() => getStatusMessage(progressPercentage)}
      />

      <EmergencyFundDetailsTable
        monthlyIncome={monthlyIncome}
        finalEmergencyFundGoal={finalEmergencyFundGoal}
        currentBalance={currentSavingsBalance}
        amountNeeded={amountNeeded}
        monthsToGoal={monthsToGoal}
        monthlyIncomeTarget={monthlyIncomeTarget}
        emergencyFundGoal={emergencyFundGoal}
        savingAmount={currentSavingsBalance}
        handleMonthlyIncomeChange={handleMonthlyIncomeChange}
        handleEmergencyFundGoalChange={handleEmergencyFundGoalChange}
        handleSavingAmountChange={handleCurrentSavingsBalanceChange}
        resetSavingAmountToAuto={resetSavingAmountToAuto}
      />

      <RecommendationsCard
        progressPercentage={progressPercentage}
        monthsToGoal={monthsToGoal}
      />
    </div>
  );
};