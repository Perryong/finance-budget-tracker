
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Edit3, Check, X, ChevronDown, Palette } from 'lucide-react';
import { useSupabaseStore } from '@/store/supabaseStore';

export const CategoryList = () => {
  const { categories, updateCategory, deleteCategory } = useSupabaseStore();
  const [editingCategory, setEditingCategory] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ name: '', color: '', type: 'expense' as 'income' | 'expense' });
  const [isOpen, setIsOpen] = React.useState(false); // Changed default to false

  // Reset collapsed state when component mounts (when user switches to settings tab)
  React.useEffect(() => {
    setIsOpen(false);
  }, []);

  const handleEdit = (category: any) => {
    setEditingCategory(category.name);
    setEditForm({
      name: category.name,
      color: category.color,
      type: category.type
    });
  };

  const handleSaveEdit = async () => {
    if (editingCategory && editForm.name.trim()) {
      await updateCategory(editingCategory, editForm);
      setEditingCategory(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: '', color: '', type: 'expense' });
  };

  const handleDelete = async (categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      await deleteCategory(categoryName);
    }
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  // Enhanced color palette
  const colorPalettes = {
    expense: ['#ef4444', '#dc2626', '#b91c1c', '#f97316', '#ea580c', '#d97706', '#8b5cf6', '#7c3aed', '#6d28d9', '#3b82f6', '#2563eb', '#1d4ed8', '#6b7280', '#4b5563', '#374151'],
    income: ['#22c55e', '#16a34a', '#15803d', '#84cc16', '#65a30d', '#4d7c0f', '#06b6d4', '#0891b2', '#0e7490', '#eab308', '#f59e0b', '#d97706', '#14b8a6', '#0d9488', '#0f766e']
  };

  const renderCategoryItem = (category: any) => {
    const isEditing = editingCategory === category.name;

    if (isEditing) {
      return (
        <div key={category.name} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 bg-blue-50 rounded-lg">
          <Input
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="font-medium"
          />
          
          <Select
            value={editForm.type}
            onValueChange={(value: 'income' | 'expense') => 
              setEditForm({ ...editForm, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">💰 Income</SelectItem>
              <SelectItem value="expense">💸 Expense</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={editForm.color}
                onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                className="w-12 h-8 p-1 rounded"
              />
              <div
                className="w-8 h-8 rounded border-2 border-gray-300"
                style={{ backgroundColor: editForm.color }}
              />
            </div>
            <div className="grid grid-cols-5 gap-1">
              {colorPalettes[editForm.type].map(color => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setEditForm({ ...editForm, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleCancelEdit} variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <span className="font-medium">{category.name}</span>
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {category.type === 'income' ? '💰 Income' : '💸 Expense'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleDelete(category.name)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left font-medium hover:underline">
        <span>Manage Categories ({categories.length} total)</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-6">
        {incomeCategories.length > 0 && (
          <div>
            <h4 className="font-medium text-green-700 mb-3">💰 Income Categories ({incomeCategories.length})</h4>
            <div className="space-y-2">
              {incomeCategories.map(renderCategoryItem)}
            </div>
          </div>
        )}

        {expenseCategories.length > 0 && (
          <div>
            <h4 className="font-medium text-red-700 mb-3">💸 Expense Categories ({expenseCategories.length})</h4>
            <div className="space-y-2">
              {expenseCategories.map(renderCategoryItem)}
            </div>
          </div>
        )}

        {categories.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No categories found. Add some categories using the form above.
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
