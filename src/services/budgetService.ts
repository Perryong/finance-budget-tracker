
import { supabase } from '@/integrations/supabase/client';

export interface Budget {
  id: string;
  user_id: string;
  category_name: string;
  amount: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export const budgetService = {
  async getBudgets(month: number, year: number): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', month)
        .eq('year', year);
      
      if (error) throw error;
      
      const budgetMap: Record<string, number> = {};
      data?.forEach(budget => {
        budgetMap[budget.category_name] = budget.amount;
      });
      
      return budgetMap;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      return {};
    }
  },

  async setBudget(categoryName: string, amount: number, month: number, year: number): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('budgets')
        .upsert({
          user_id: userData.user.id,
          category_name: categoryName,
          amount: amount,
          month: month,
          year: year
        }, {
          onConflict: 'user_id,category_name,month,year'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error setting budget:', error);
      throw error;
    }
  },

  async setBulkBudgets(budgets: Record<string, number>, month: number, year: number): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      // Process each budget entry individually to handle upserts properly
      for (const [categoryName, amount] of Object.entries(budgets)) {
        if (amount > 0) { // Only save budgets with positive amounts
          const { error } = await supabase
            .from('budgets')
            .upsert({
              user_id: userData.user.id,
              category_name: categoryName,
              amount: amount,
              month: month,
              year: year
            }, {
              onConflict: 'user_id,category_name,month,year'
            });
          
          if (error) {
            console.error(`Error setting budget for ${categoryName}:`, error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Error setting bulk budgets:', error);
      throw error;
    }
  },

  async copyFromPreviousMonth(currentMonth: number, currentYear: number): Promise<Record<string, number>> {
    try {
      // Calculate previous month/year
      let prevMonth = currentMonth - 1;
      let prevYear = currentYear;
      
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear = currentYear - 1;
      }

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', prevMonth)
        .eq('year', prevYear);
      
      if (error) throw error;
      
      const prevBudgets: Record<string, number> = {};
      data?.forEach(budget => {
        prevBudgets[budget.category_name] = budget.amount;
      });
      
      return prevBudgets;
    } catch (error) {
      console.error('Error copying from previous month:', error);
      return {};
    }
  }
};