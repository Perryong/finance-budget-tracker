
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BudgetChartProps {
  budgetData: Record<string, number>;
  actualData: Record<string, number>;
  categories: Array<{ name: string; color: string; type: string }>;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({
  budgetData,
  actualData,
  categories
}) => {
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  const chartData = expenseCategories.map(category => {
    const budget = budgetData[category.name] || 0;
    const actual = actualData[category.name] || 0;
    
    return {
      category: category.name,
      fullName: category.name,
      budget: budget,
      actual: actual,
      color: category.color
    };
  }).filter(item => item.budget > 0 || item.actual > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-blue-600">Budget: ${payload[0].value?.toFixed(2)}</p>
          <p className="text-red-600">Actual: ${payload[1]?.value?.toFixed(2)}</p>
          {payload[1] && (
            <p className={`text-sm ${payload[1].value > payload[0].value ? 'text-red-600' : 'text-green-600'}`}>
              {payload[1].value > payload[0].value ? 'Over budget' : 'Under budget'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
              <Bar dataKey="actual" fill="#ef4444" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No budget data to display</p>
            <p className="text-sm">Set budgets for your categories to see the comparison</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
