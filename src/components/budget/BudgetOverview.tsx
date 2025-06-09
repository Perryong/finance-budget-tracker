
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  budgetProgress: number;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  totalBudget,
  totalSpent,
  remainingBudget,
  budgetProgress
}) => {
  const getProgressColor = () => {
    if (budgetProgress >= 100) return 'text-red-600';
    if (budgetProgress >= 80) return 'text-orange-600';
    if (budgetProgress >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusMessage = () => {
    if (budgetProgress >= 100) return 'Budget exceeded! Consider reducing expenses.';
    if (budgetProgress >= 80) return 'Approaching budget limit. Be cautious with spending.';
    if (budgetProgress >= 60) return 'Good progress. Stay on track!';
    return 'Excellent! You\'re well within budget.';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              S${totalBudget.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              S${totalSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${remainingBudget >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Remaining Budget</CardTitle>
            <DollarSign className={`h-4 w-4 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              S${remainingBudget.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Budget Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getProgressColor()}`}>
              {budgetProgress.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Monthly Budget Progress</span>
            <span className={`text-lg font-bold ${getProgressColor()}`}>
              {budgetProgress.toFixed(1)}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={Math.min(budgetProgress, 100)} className="h-4" />
          <p className="text-center text-sm text-gray-600">
            {getStatusMessage()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
