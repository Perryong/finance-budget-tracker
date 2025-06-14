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
import { Edit, Trash2, Check, X, ChevronDown, ChevronUp, RefreshCw, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const CategoryList = () => {
  const { categories, updateCategory, deleteCategory, loading, refreshCategories } = useCategoryStore();
  const [editingCategory, setEditingCategory] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ name: '', color: '', type: 'expense' as 'income' | 'expense' });
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set()); // Start with all collapsed
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleDeleteCategory = async (id: string, categoryName: string) => {
    if (confirm(`Are you sure you want to delete "${categoryName}"? This will not delete existing transactions.`)) {
      await deleteCategory(id);
    }
  };

  const startEdit = (category: any) => {
    setEditingCategory(category.id);
    setEditForm({
      name: category.name,
      color: category.color,
      type: category.type
    });
  };

  const saveEdit = async () => {
    if (editingCategory) {
      await updateCategory(editingCategory, editForm);
      setEditingCategory(null);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: '', color: '', type: 'expense' });
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const expandAll = () => {
    setExpandedGroups(new Set(Object.keys({...expenseGroups, ...incomeGroups})));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCategories();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Enhanced category grouping
  const expenseGroups = {
    housing: {
      title: 'Housing & Utilities',
      keywords: ['rent', 'mortgage', 'property', 'home', 'utilities', 'internet', 'cable'],
      color: 'bg-red-600',
      icon: '🏠'
    },
    transportation: {
      title: 'Transportation',
      keywords: ['fuel', 'gas', 'transport', 'car', 'parking', 'uber', 'taxi', 'public'],
      color: 'bg-green-600',
      icon: '🚗'
    },
    food: {
      title: 'Food & Dining',
      keywords: ['groceries', 'restaurant', 'food', 'coffee', 'alcohol', 'delivery', 'fast food'],
      color: 'bg-orange-600',
      icon: '🍽️'
    },
    health: {
      title: 'Health & Fitness',
      keywords: ['healthcare', 'health', 'medical', 'dental', 'vision', 'gym', 'fitness', 'personal care', 'medications'],
      color: 'bg-cyan-600',
      icon: '🏥'
    },
    subscriptions: {
      title: 'Subscriptions & Digital',
      keywords: ['subscription', 'streaming', 'software', 'app', 'music', 'cloud', 'gaming'],
      color: 'bg-blue-600',
      icon: '📱'
    },
    shopping: {
      title: 'Shopping & Personal',
      keywords: ['clothing', 'electronics', 'books', 'hobbies', 'gifts', 'beauty', 'cosmetics'],
      color: 'bg-purple-600',
      icon: '🛍️'
    },
    financial: {
      title: 'Financial & Fees',
      keywords: ['bank', 'investment', 'credit', 'atm', 'late', 'loan', 'fees'],
      color: 'bg-indigo-600',
      icon: '💳'
    },
    family: {
      title: 'Family & Children',
      keywords: ['childcare', 'school', 'education', 'baby', 'kids', 'tutoring', 'supplies'],
      color: 'bg-pink-600',
      icon: '👨‍👩‍👧‍👦'
    },
    entertainment: {
      title: 'Entertainment & Lifestyle',
      keywords: ['movies', 'events', 'concerts', 'sports', 'bars', 'nightlife', 'gaming', 'magazines'],
      color: 'bg-rose-600',
      icon: '🎭'
    },
    travel: {
      title: 'Travel & Vacation',
      keywords: ['vacation', 'hotels', 'lodging', 'flights', 'travel', 'rental', 'insurance'],
      color: 'bg-emerald-600',
      icon: '✈️'
    },
    pets: {
      title: 'Pets',
      keywords: ['pet', 'vet', 'grooming'],
      color: 'bg-amber-600',
      icon: '🐕'
    },
    taxes: {
      title: 'Taxes & Government',
      keywords: ['tax', 'government', 'vehicle registration', 'licenses'],
      color: 'bg-stone-600',
      icon: '🏛️'
    },
    savings: {
      title: 'Savings & Investments',
      keywords: ['emergency fund', 'retirement', 'investment contributions', 'savings goals'],
      color: 'bg-emerald-700',
      icon: '💰'
    },
    business: {
      title: 'Business & Professional',
      keywords: ['office', 'professional', 'business', 'marketing', 'services', 'development'],
      color: 'bg-slate-600',
      icon: '💼'
    },
    other: {
      title: 'Other & Miscellaneous',
      keywords: ['miscellaneous', 'other', 'cash', 'returns', 'refunds'],
      color: 'bg-gray-600',
      icon: '📦'
    }
  };

  const incomeGroups = {
    regular: {
      title: 'Regular Income',
      keywords: ['salary', 'wages', 'overtime', 'tips', 'commission', 'hourly'],
      color: 'bg-green-600',
      icon: '💵'
    },
    side: {
      title: 'Side Income',
      keywords: ['freelance', 'consulting', 'side hustle', 'gig', 'part-time'],
      color: 'bg-lime-600',
      icon: '🏃‍♂️'
    },
    investment: {
      title: 'Investment Income',
      keywords: ['dividends', 'interest', 'capital gains', 'rental', 'returns'],
      color: 'bg-blue-600',
      icon: '📈'
    },
    bonus: {
      title: 'Bonus & Rewards',
      keywords: ['bonus', 'tax refund', 'cash back', 'rewards', 'rebates'],
      color: 'bg-yellow-600',
      icon: '🎁'
    },
    benefits: {
      title: 'Government & Benefits',
      keywords: ['unemployment', 'social security', 'disability', 'child support', 'benefits'],
      color: 'bg-teal-600',
      icon: '🏛️'
    },
    other: {
      title: 'Other Income',
      keywords: ['gifts received', 'inheritance', 'insurance', 'settlements', 'winnings', 'other income'],
      color: 'bg-purple-600',
      icon: '🎯'
    }
  };

  const categorizeItems = (items: any[], groups: any) => {
    const categorized: { [key: string]: any[] } = {};
    const ungrouped: any[] = [];

    // Initialize groups
    Object.keys(groups).forEach(key => {
      categorized[key] = [];
    });

    items.forEach(item => {
      let assigned = false;
      for (const [groupKey, group] of Object.entries(groups) as [string, any][]) {
        if (group.keywords.some((keyword: string) => 
          item.name.toLowerCase().includes(keyword.toLowerCase())
        )) {
          categorized[groupKey].push(item);
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        ungrouped.push(item);
      }
    });

    // Add ungrouped items to "other" category
    if (ungrouped.length > 0 && categorized.other) {
      categorized.other.push(...ungrouped);
    }

    return categorized;
  };

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  const categorizedExpenses = categorizeItems(expenseCategories, expenseGroups);
  const categorizedIncomes = categorizeItems(incomeCategories, incomeGroups);

  const renderCategoryItem = (category: any) => (
    <div
      key={category.id}
      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      {editingCategory === category.id ? (
        <div className="flex items-center space-x-3 flex-1">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: editForm.color }}
          />
          <div className="flex-1 grid grid-cols-3 gap-2">
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="text-sm"
            />
            <Input
              type="color"
              value={editForm.color}
              onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
              className="w-16 h-8"
            />
            <Select
              value={editForm.type}
              onValueChange={(value: 'income' | 'expense') => 
                setEditForm({ ...editForm, type: value })
              }
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={saveEdit}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEdit}>
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <p className="font-medium">{category.name}</p>
              {category.is_system && (
                <p className="text-xs text-gray-500">System Category</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => startEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteCategory(category.id, category.name)}
              disabled={category.is_system}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderCategoryGroup = (groupKey: string, groupData: any, categorizedItems: any[], type: 'income' | 'expense') => {
    const items = categorizedItems;
    if (items.length === 0) return null;

    const isExpanded = expandedGroups.has(groupKey);

    return (
      <Collapsible key={groupKey} open={isExpanded} onOpenChange={() => toggleGroup(groupKey)}>
        <CollapsibleTrigger className="w-full">
          <div className={`flex items-center justify-between p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${groupData.color} text-white`}>
            <div className="flex items-center space-x-3">
              <span className="text-lg">{groupData.icon}</span>
              <div className="text-left">
                <h4 className="font-medium text-sm uppercase tracking-wide">
                  {groupData.title}
                </h4>
                <p className="text-xs text-white/80">
                  {items.length} {items.length === 1 ? 'category' : 'categories'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isExpanded ? (
                <FolderOpen className="h-4 w-4" />
              ) : (
                <Folder className="h-4 w-4" />
              )}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="grid gap-2 max-h-96 overflow-y-auto mt-2 ml-4 pr-4">
            {items.map(renderCategoryItem)}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Category Management</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${(isRefreshing || loading) ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
          >
            Collapse All
          </Button>
        </div>
      </div>
      
      {/* Income Categories */}
      {incomeCategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 border-b pb-2 flex items-center space-x-2">
            <span>💰</span>
            <span>Income Categories ({incomeCategories.length})</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(incomeGroups).map(([groupKey, groupData]) =>
              renderCategoryGroup(groupKey, groupData, categorizedIncomes[groupKey] || [], 'income')
            )}
          </div>
        </div>
      )}
      
      {/* Expense Categories */}
      {expenseCategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-700 border-b pb-2 flex items-center space-x-2">
            <span>💸</span>
            <span>Expense Categories ({expenseCategories.length})</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(expenseGroups).map(([groupKey, groupData]) =>
              renderCategoryGroup(groupKey, groupData, categorizedExpenses[groupKey] || [], 'expense')
            )}
          </div>
        </div>
      )}
      
      {categories.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>No categories found.</p>
          <p className="text-sm">Click "Load All Categories" above to get started with a comprehensive set of categories.</p>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-8 text-gray-500">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Loading categories...</p>
        </div>
      )}
    </div>
  );
};