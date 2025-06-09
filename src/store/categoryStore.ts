
import { create } from 'zustand';
import { Category } from '@/store/financeStore';
import { supabaseService } from '@/services/supabaseService';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      console.log('CategoryStore: Fetching categories...');
      const categories = await supabaseService.getCategories();
      console.log('CategoryStore: Categories fetched successfully:', categories.length, 'categories');
      
      // Log category breakdown
      const incomeCount = categories.filter(c => c.type === 'income').length;
      const expenseCount = categories.filter(c => c.type === 'expense').length;
      console.log('CategoryStore: Income categories:', incomeCount, 'Expense categories:', expenseCount);
      
      // Sort categories for better display
      const sortedCategories = categories.sort((a, b) => {
        // Sort by type first (income, then expense), then by name
        if (a.type !== b.type) {
          return a.type === 'income' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
      set({ categories: sortedCategories, loading: false });
    } catch (error) {
      console.error('CategoryStore: Error fetching categories:', error);
      set({ error: (error as Error).message, loading: false, categories: [] });
    }
  },

  refreshCategories: async () => {
    const { fetchCategories } = get();
    console.log('CategoryStore: Refreshing categories...');
    await fetchCategories();
  },

  addCategory: async (category) => {
    try {
      set({ error: null });
      console.log('CategoryStore: Adding category:', category);
      const newCategory = await supabaseService.addCategory(category);
      console.log('CategoryStore: Category added successfully:', newCategory);
      set((state) => ({
        categories: [...state.categories, newCategory].sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'income' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
      }));
    } catch (error) {
      console.error('CategoryStore: Error adding category:', error);
      set({ error: (error as Error).message });
    }
  },

  updateCategory: async (id, updates) => {
    try {
      set({ error: null });
      console.log('CategoryStore: Updating category:', id, updates);
      await supabaseService.updateCategory(id, updates);
      console.log('CategoryStore: Category updated successfully');
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ).sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'income' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
      }));
    } catch (error) {
      console.error('CategoryStore: Error updating category:', error);
      set({ error: (error as Error).message });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ error: null });
      console.log('CategoryStore: Deleting category:', id);
      await supabaseService.deleteCategory(id);
      console.log('CategoryStore: Category deleted successfully');
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id)
      }));
    } catch (error) {
      console.error('CategoryStore: Error deleting category:', error);
      set({ error: (error as Error).message });
    }
  },
}));
