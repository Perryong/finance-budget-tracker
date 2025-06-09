
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
import { Plus, Palette } from 'lucide-react';
import { useSupabaseStore } from '@/store/supabaseStore';

export const CategoryForm = () => {
  const { addCategory } = useSupabaseStore();
  const [newCategory, setNewCategory] = React.useState({ 
    name: '', 
    color: '#3b82f6', 
    type: 'expense' as 'income' | 'expense' 
  });

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      await addCategory(newCategory);
      setNewCategory({ name: '', color: '#3b82f6', type: 'expense' });
    }
  };

  // Enhanced color palette with better organization
  const colorPalettes = {
    expense: {
      title: 'Expense Colors',
      colors: [
        '#ef4444', '#dc2626', '#b91c1c', // Reds
        '#f97316', '#ea580c', '#d97706', // Oranges
        '#8b5cf6', '#7c3aed', '#6d28d9', // Purples
        '#3b82f6', '#2563eb', '#1d4ed8', // Blues
        '#6b7280', '#4b5563', '#374151', // Grays
      ]
    },
    income: {
      title: 'Income Colors',
      colors: [
        '#22c55e', '#16a34a', '#15803d', // Greens
        '#84cc16', '#65a30d', '#4d7c0f', // Limes
        '#06b6d4', '#0891b2', '#0e7490', // Cyans
        '#eab308', '#f59e0b', '#d97706', // Yellows
        '#14b8a6', '#0d9488', '#0f766e', // Teals
      ]
    }
  };

  const currentPalette = colorPalettes[newCategory.type];

  return (
    <div className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="flex items-center space-x-2 mb-4">
        <Plus className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Add New Category</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="category-name" className="text-sm font-medium">Name</Label>
          <Input
            id="category-name"
            placeholder="e.g., Netflix, Coffee, Freelance"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="category-type" className="text-sm font-medium">Type</Label>
          <Select
            value={newCategory.type}
            onValueChange={(value: 'income' | 'expense') => 
              setNewCategory({ ...newCategory, type: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">💰 Income</SelectItem>
              <SelectItem value="expense">💸 Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category-color" className="text-sm font-medium flex items-center space-x-1">
            <Palette className="h-4 w-4" />
            <span>Color</span>
          </Label>
          <div className="mt-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                id="category-color"
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-12 h-8 p-1 rounded"
              />
              <div
                className="w-8 h-8 rounded border-2 border-gray-300"
                style={{ backgroundColor: newCategory.color }}
              />
            </div>
            <div className="grid grid-cols-5 gap-1">
              {currentPalette.colors.map(color => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  title={`Use ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-end">
          <Button 
            onClick={handleAddCategory}
            disabled={!newCategory.name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>
    </div>
  );
};
