
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { InlineEdit } from '@/components/InlineEdit';

interface CategoryBudgetsProps {
  categories: Array<{ name: string; color: string; type: string }>;
  budgets: Record<string, number>;
  expensesByCategory: Record<string, number>;
  setBudgets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const CategoryBudgets: React.FC<CategoryBudgetsProps> = ({
  categories,
  budgets,
  expensesByCategory,
  setBudgets
}) => {
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const handleBudgetChange = (categoryName: string, value: number) => {
    setBudgets(prev => ({
      ...prev,
      [categoryName]: value
    }));
  };

  const getCategoryProgress = (categoryName: string) => {
    const budget = budgets[categoryName] || 0;
    const spent = expensesByCategory[categoryName] || 0;
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-red-500';
    if (progress >= 80) return 'bg-orange-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenseCategories.map((category) => {
            const budget = budgets[category.name] || 0;
            const spent = expensesByCategory[category.name] || 0;
            const progress = getCategoryProgress(category.name);
            
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    SGD {spent.toFixed(2)} / SGD {budget.toFixed(2)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(progress, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className={progress >= 100 ? 'text-red-600' : 'text-gray-500'}>
                      {progress.toFixed(1)}% used
                    </span>
                    <div className="flex items-center space-x-2">
                      <span>Budget:</span>
                      <InlineEdit
                        value={budget}
                        onSave={(value) => handleBudgetChange(category.name, value)}
                        showResetButton={false}
                        prefix="SGD "
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {expenseCategories.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No expense categories found. Add some categories in Settings.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};