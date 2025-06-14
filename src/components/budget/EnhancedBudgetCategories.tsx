import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, ChevronDown, ChevronRight, Maximize2, Minimize2, Folder, FolderOpen } from 'lucide-react';
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
  const [isOpen, setIsOpen] = React.useState(false);

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  const totalAllocated = Object.values(budgets).reduce((sum, amount) => sum + amount, 0);

  // Reset collapsed state when component mounts (when user switches to budget tab)
  React.useEffect(() => {
    setIsOpen(false);
  }, []);

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

  const expandCategories = () => {
    setIsOpen(true);
  };

  const collapseCategories = () => {
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>💰</span>
            <span>Budget Categories</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {/* Expand/Collapse Buttons */}
            <div className="flex items-center space-x-1 border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={expandCategories}
                disabled={isOpen}
                className="flex items-center space-x-1 text-xs px-2 py-1"
                title="Expand categories"
              >
                <Maximize2 className="h-3 w-3" />
                <span className="hidden sm:inline">Expand</span>
              </Button>
              <div className="w-px h-4 bg-gray-300" />
              <Button
                variant="ghost"
                size="sm"
                onClick={collapseCategories}
                disabled={!isOpen}
                className="flex items-center space-x-1 text-xs px-2 py-1"
                title="Collapse categories"
              >
                <Minimize2 className="h-3 w-3" />
                <span className="hidden sm:inline">Collapse</span>
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddingCategory(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Adjust your monthly expenses for each category ({expenseCategories.length} categories)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add Category Form */}
          {isAddingCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Input
                placeholder="Category name (e.g., Coffee, Gym, Netflix)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                className="col-span-1 md:col-span-1"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
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

          {/* Collapsible Budget Categories */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-3 px-4 text-left font-medium hover:bg-gray-50 rounded-lg border transition-colors">
              <div className="flex items-center space-x-3">
                {isOpen ? (
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                ) : (
                  <Folder className="h-4 w-4 text-gray-500" />
                )}
                <span className="font-semibold">
                  Budget Categories ({expenseCategories.length})
                </span>
                {!isOpen && totalAllocated > 0 && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    SGD {totalAllocated.toFixed(2)} allocated
                  </span>
                )}
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-3 mt-4">
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {expenseCategories.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No expense categories found</p>
                    <p className="text-sm">Add categories in Settings or create one above</p>
                  </div>
                ) : (
                  expenseCategories.map((category) => (
                    <div key={category.name} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: category.color }}
                        />
                        <Label className="font-medium text-sm">{category.name}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">SGD</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={budgets[category.name] || ''}
                          onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                          min="0"
                          step="0.01"
                          className="text-right flex-1"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Summary and Save Section */}
          <div className="mt-6 pt-4 border-t space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div>
                <span className="font-semibold text-lg text-gray-800">Total Monthly Budget</span>
                <p className="text-sm text-gray-600">Sum of all category budgets</p>
              </div>
              <span className="font-bold text-2xl text-blue-600">
                SGD {totalAllocated.toFixed(2)}
              </span>
            </div>
            
            <Button 
              onClick={onSaveBudgets} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={totalAllocated === 0}
            >
              {totalAllocated === 0 ? (
                'Set budgets to save'
              ) : (
                `Save Budget (SGD ${totalAllocated.toFixed(2)})`
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};