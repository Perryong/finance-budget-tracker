
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetInsightsProps {
  budgets: Record<string, number>;
  expensesByCategory: Record<string, number>;
  budgetProgress: number;
}

export const BudgetInsights: React.FC<BudgetInsightsProps> = ({
  budgets,
  expensesByCategory,
  budgetProgress
}) => {
  const getInsights = () => {
    const insights = [];
    
    // Overall budget status
    if (budgetProgress >= 100) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Budget Exceeded',
        description: 'You have exceeded your total monthly budget. Consider reviewing your expenses.',
        color: 'text-red-600 bg-red-50'
      });
    } else if (budgetProgress >= 80) {
      insights.push({
        type: 'caution',
        icon: TrendingUp,
        title: 'Approaching Budget Limit',
        description: 'You\'ve used 80% of your budget. Monitor spending carefully for the rest of the month.',
        color: 'text-orange-600 bg-orange-50'
      });
    } else if (budgetProgress < 50) {
      insights.push({
        type: 'positive',
        icon: CheckCircle,
        title: 'Great Budget Management',
        description: 'You\'re doing excellent with your budget! Keep up the good work.',
        color: 'text-green-600 bg-green-50'
      });
    }

    // Category-specific insights
    Object.entries(budgets).forEach(([category, budget]) => {
      const spent = expensesByCategory[category] || 0;
      const categoryProgress = budget > 0 ? (spent / budget) * 100 : 0;
      
      if (categoryProgress >= 100) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: `${category} Budget Exceeded`,
          description: `You've overspent in ${category} by $${(spent - budget).toFixed(2)}.`,
          color: 'text-red-600 bg-red-50'
        });
      } else if (categoryProgress >= 90) {
        insights.push({
          type: 'caution',
          icon: TrendingUp,
          title: `${category} Almost at Limit`,
          description: `You have $${(budget - spent).toFixed(2)} left in your ${category} budget.`,
          color: 'text-orange-600 bg-orange-50'
        });
      }
    });

    // Savings opportunity
    const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
    const totalSpent = Object.values(expensesByCategory).reduce((sum, spent) => sum + spent, 0);
    const saved = totalBudget - totalSpent;
    
    if (saved > 0 && budgetProgress < 80) {
      insights.push({
        type: 'positive',
        icon: TrendingDown,
        title: 'Savings Opportunity',
        description: `You're on track to save $${saved.toFixed(2)} this month!`,
        color: 'text-green-600 bg-green-50'
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const insights = getInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className={`p-4 rounded-lg ${insight.color}`}>
                <div className="flex items-start space-x-3">
                  <IconComponent className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <p className="text-sm mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {insights.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>Set up budgets to receive personalized insights and recommendations.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
