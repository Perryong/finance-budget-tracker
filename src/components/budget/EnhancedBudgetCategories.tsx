
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useSupabaseStore } from '@/store/supabaseStore';

interface EnhancedBudgetCategoriesProps {
  categories: Array<{ name: string; color: string; type: string }>;
  budgets: Record<string, number>;
  setBudgets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSaveBudgets: () => void;
}

export const EnhancedBudgetCategories: React.FC<EnhancedBudgetCategoriesProps> = ({
  categories,
  budgets,
  setBudgets,
  onSaveBudgets
}) => {
  const { addCategory } = useSupabaseStore();
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  const totalAllocated = Object.values(budgets).reduce((sum, amount) => sum + amount, 0);

  const handleBudgetChange = (categoryName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBudgets(prev => ({
      ...prev,
      [categoryName]: numValue
    }));
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      await addCategory({
        name: newCategoryName,
        color: randomColor,
        type: 'expense'
      });
      
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget Categories</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Adjust your monthly expenses for each category
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenseCategories.map((category) => (
            <div key={category.name} className="grid grid-cols-2 gap-4 items-center">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <Label className="font-medium">{category.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">S$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={budgets[category.name] || ''}
                  onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                  min="0"
                  step="0.01"
                  className="text-right"
                />
              </div>
            </div>
          ))}
          
          {isAddingCategory && (
            <div className="grid grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded-lg">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddCategory}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total Allocated</span>
              <span className="font-bold text-xl text-blue-600">
                S${totalAllocated.toFixed(2)}
              </span>
            </div>
            
            <Button 
              onClick={onSaveBudgets} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={totalAllocated === 0}
            >
              Save Budget
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
