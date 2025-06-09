
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCategoryStore } from '@/store/categoryStore';
import { useAuth } from '@/hooks/useAuth';
import { SettingsHeader } from './settings/SettingsHeader';
import { ThemeSettings } from './settings/ThemeSettings';
import { CategoryForm } from './settings/CategoryForm';
import { CategoryList } from './settings/CategoryList';
import { defaultDataService } from '@/services/defaultDataService';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const Settings = () => {
  const { loading, fetchCategories, categories } = useCategoryStore();
  const { user } = useAuth();
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);

  const handleLoadAllCategories = async () => {
    if (!user) {
      toast.error('Please log in to load categories');
      return;
    }

    setIsLoadingCategories(true);
    try {
      console.log('Loading all enhanced categories for user:', user.id);
      await defaultDataService.forceLoadAllCategories(user.id);
      await fetchCategories();
      toast.success('Enhanced categories loaded successfully!');
    } catch (error) {
      console.error('Error loading enhanced categories:', error);
      toast.error('Failed to load enhanced categories. Please try again.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      console.log('Settings: User found, fetching categories...');
      fetchCategories();
    } else {
      console.log('Settings: No user found');
    }
  }, [fetchCategories, user]);

  console.log('Settings: Current categories count:', categories.length);
  console.log('Settings: Loading state:', loading);
  console.log('Settings: User:', user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Please log in to view settings.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsHeader />

      <ThemeSettings />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Categories</span>
              <span className="text-sm font-normal text-gray-500">({categories.length} total)</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                onClick={handleLoadAllCategories}
                variant="outline"
                size="sm"
                disabled={isLoadingCategories}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingCategories ? 'animate-spin' : ''}`} />
                <span>{isLoadingCategories ? 'Loading...' : 'Load All Categories'}</span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Manage your income and expense categories with our enhanced category system featuring 100+ real-world categories.
            </p>
            {categories.length < 80 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Click "Load All Categories" to access our comprehensive set of 100+ categorized expense and income categories.
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Subscriptions & Digital</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Transportation</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Food & Dining</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Shopping & Personal</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">+10 more groups</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <CategoryForm />
          <CategoryList />
        </CardContent>
      </Card>
    </div>
  );
};
