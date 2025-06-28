
import { supabase } from '@/integrations/supabase/client';

export interface RecurringBudget {
  id: string;
  user_id: string;
  category_name: string;
  amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const recurringBudgetService = {
  async getRecurringBudgets(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('recurring_budgets')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      
      const recurringBudgetMap: Record<string, number> = {};
      data?.forEach(budget => {
        recurringBudgetMap[budget.category_name] = budget.amount;
      });
      
      return recurringBudgetMap;
    } catch (error) {
      console.error('Error fetching recurring budgets:', error);
      return {};
    }
  },

  async setRecurringBudget(categoryName: string, amount: number): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('recurring_budgets')
        .upsert({
          user_id: userData.user.id,
          category_name: categoryName,
          amount: amount,
          is_active: true
        }, {
          onConflict: 'user_id,category_name'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error setting recurring budget:', error);
      throw error;
    }
  },

  async setBulkRecurringBudgets(budgets: Record<string, number>): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Process each budget entry individually
      for (const [categoryName, amount] of Object.entries(budgets)) {
        if (amount > 0) {
          const { error } = await supabase
            .from('recurring_budgets')
            .upsert({
              user_id: userData.user.id,
              category_name: categoryName,
              amount: amount,
              is_active: true
            }, {
              onConflict: 'user_id,category_name'
            });
          
          if (error) {
            console.error(`Error setting recurring budget for ${categoryName}:`, error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Error setting bulk recurring budgets:', error);
      throw error;
    }
  },

  async generateMonthlyBudgets(month: number, year: number): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('generate_monthly_budgets', {
        p_user_id: userData.user.id,
        p_month: month,
        p_year: year
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error generating monthly budgets:', error);
      throw error;
    }
  },

  async deleteRecurringBudget(categoryName: string): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('recurring_budgets')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('category_name', categoryName);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting recurring budget:', error);
      throw error;
    }
  }
};