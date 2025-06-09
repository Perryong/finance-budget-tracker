
import { supabase } from '@/integrations/supabase/client';
import { Transaction, Category } from '@/store/financeStore';

export const supabaseService = {
  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data?.map(t => ({
      id: t.id,
      amount: t.amount,
      category: t.category,
      date: t.date,
      notes: t.notes || '',
      type: t.type as 'income' | 'expense'
    })) || [];
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        notes: transaction.notes,
        type: transaction.type,
        user_id: userData.user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      amount: data.amount,
      category: data.category,
      date: data.date,
      notes: data.notes || '',
      type: data.type as 'income' | 'expense'
    };
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: updates.amount,
        category: updates.category,
        date: updates.date,
        notes: updates.notes,
        type: updates.type
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Categories - Updated to include is_system field
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data?.map(c => ({
      id: c.id,
      name: c.name,
      color: c.color,
      type: c.type as 'income' | 'expense',
      is_system: c.is_system || false
    })) || [];
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        color: category.color,
        type: category.type,
        user_id: userData.user.id,
        is_system: false
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      color: data.color,
      type: data.type as 'income' | 'expense',
      is_system: data.is_system || false
    };
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        color: updates.color,
        type: updates.type
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // User Settings - Enhanced error handling and logging
  async getUserSettings() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      console.log('SupabaseService: Fetching user settings for user:', userData.user.id);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userData.user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('SupabaseService: Error fetching user settings:', error);
        throw error;
      }
      
      console.log('SupabaseService: User settings fetched:', data);
      return data || null;
    } catch (error) {
      console.error('SupabaseService: Failed to get user settings:', error);
      throw error;
    }
  },

  async updateUserSettings(settings: {
    theme?: string;
    monthly_income_target?: number | null;
    emergency_fund_goal?: number | null;
    total_savings?: number | null;
    current_savings?: number | null;
  }): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      console.log('SupabaseService: Updating user settings for user:', userData.user.id, 'with data:', settings);
      
      // Use upsert to avoid duplicate key constraint violations
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userData.user.id,
          ...settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('SupabaseService: Error updating user settings:', error);
        throw error;
      }
      
      console.log('SupabaseService: User settings updated successfully');
    } catch (error) {
      console.error('SupabaseService: Failed to update user settings:', error);
      throw error;
    }
  }
};
