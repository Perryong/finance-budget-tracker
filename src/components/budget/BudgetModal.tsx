
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { budgetService } from '@/services/budgetService';
import { toast } from 'sonner';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ name: string; color: string; type: string }>;
  budgets: Record<string, number>;
  setBudgets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  categories,
  budgets,
  setBudgets
}) => {
  const [tempBudgets, setTempBudgets] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (isOpen) {
      setTempBudgets({ ...budgets });
    }
  }, [isOpen, budgets]);

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const handleBudgetChange = (categoryName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempBudgets(prev => ({
      ...prev,
      [categoryName]: numValue
    }));
  };

  const handleSave = async () => {
    try {
      const currentDate = new Date();
      await budgetService.setBulkBudgets(
        tempBudgets,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      setBudgets(tempBudgets);
      toast.success('Budget saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving budgets:', error);
      toast.error('Failed to save budget');
    }
  };

  const handleCancel = () => {
    setTempBudgets({ ...budgets });
    onClose();
  };

  const totalBudget = Object.values(tempBudgets).reduce((sum, budget) => sum + budget, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Set Monthly Budgets</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Set budget limits for each expense category to track your spending.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">SGD</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={tempBudgets[category.name] || ''}
                    onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                    min="0"
                    step="0.01"
                    className="text-right"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {expenseCategories.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>No expense categories found.</p>
              <p className="text-sm">Add expense categories in Settings first.</p>
            </div>
          )}
          
          {totalBudget > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-800">
                  Total Monthly Budget:
                </span>
                <span className="text-lg font-bold text-blue-800">
                  SGD {totalBudget.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={expenseCategories.length === 0}>
            Save Budgets
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};