
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupabaseStore } from '@/store/supabaseStore';
import { toast } from 'sonner';
import { Repeat, Copy, Calendar, Loader2 } from 'lucide-react';

interface RecurringBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ name: string; color: string; type: string }>;
  currentBudgets: Record<string, number>;
  setBudgets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  currentMonth: number;
  currentYear: number;
}

export const RecurringBudgetModal: React.FC<RecurringBudgetModalProps> = ({
  isOpen,
  onClose,
  categories,
  currentBudgets,
  setBudgets,
  currentMonth,
  currentYear
}) => {
  const { 
    recurringBudgets, 
    fetchRecurringBudgets, 
    setBulkRecurringBudgets,
    generateMonthlyBudgets,
    recurringBudgetLoading
  } = useSupabaseStore();
  
  const [tempRecurringBudgets, setTempRecurringBudgets] = React.useState<Record<string, number>>({});
  const [autoGenerate, setAutoGenerate] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  React.useEffect(() => {
    if (isOpen) {
      fetchRecurringBudgets();
    }
  }, [isOpen, fetchRecurringBudgets]);

  React.useEffect(() => {
    setTempRecurringBudgets(recurringBudgets);
  }, [recurringBudgets]);

  const handleRecurringBudgetChange = (categoryName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempRecurringBudgets(prev => ({
      ...prev,
      [categoryName]: numValue
    }));
  };

  const handleSaveRecurringBudgets = async () => {
    try {
      setIsSaving(true);
      await setBulkRecurringBudgets(tempRecurringBudgets);
      toast.success('Recurring budget templates saved!');
      onClose();
    } catch (error) {
      console.error('Error saving recurring budgets:', error);
      toast.error('Failed to save recurring budgets');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyFromCurrent = () => {
    setTempRecurringBudgets(currentBudgets);
    toast.success('Current month budgets copied to recurring template');
  };

  const handleGenerateFromRecurring = async () => {
    try {
      setIsGenerating(true);
      await generateMonthlyBudgets(currentMonth, currentYear);
      // Refresh current budgets
      window.location.reload(); // Simple refresh for now
      toast.success('Budget generated from recurring templates!');
      onClose();
    } catch (error) {
      console.error('Error generating monthly budgets:', error);
      toast.error('Failed to generate monthly budgets');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalRecurringBudget = Object.values(tempRecurringBudgets).reduce((sum, amount) => sum + amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Repeat className="h-5 w-5" />
            <span>Recurring Budget Templates</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Set up recurring budget templates that can auto-generate monthly budgets
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyFromCurrent}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Current
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateFromRecurring}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                Generate This Month
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Recurring Budget Categories</h3>
            
            {recurringBudgetLoading ? (
              <div className="space-y-4">
                {expenseCategories.slice(0, 5).map((_, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-center">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
              </div>
            ) : (
              expenseCategories.map((category) => (
                <div key={category.name} className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <Label className="font-medium">{category.name}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">SGD</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={tempRecurringBudgets[category.name] || ''}
                      onChange={(e) => handleRecurringBudgetChange(category.name, e.target.value)}
                      min="0"
                      step="0.01"
                      className="text-right"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoGenerate}
                  onCheckedChange={setAutoGenerate}
                  id="auto-generate"
                />
                <Label htmlFor="auto-generate" className="text-sm">
                  Auto-generate budgets for new months
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Automatically create budgets from templates when viewing a new month
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Recurring Budget</p>
              <p className="font-bold text-xl text-blue-600">
                SGD {totalRecurringBudget.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRecurringBudgets} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Recurring Templates'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};