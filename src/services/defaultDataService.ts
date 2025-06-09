
import { supabase } from '@/integrations/supabase/client';

const defaultCategories = [
  // Housing & Utilities
  { name: 'Rent / Bond', color: '#ef4444', type: 'expense' as const },
  { name: 'Mortgage', color: '#dc2626', type: 'expense' as const },
  { name: 'Home Insurance', color: '#b91c1c', type: 'expense' as const },
  { name: 'Property Tax', color: '#991b1b', type: 'expense' as const },
  { name: 'Home Maintenance', color: '#7f1d1d', type: 'expense' as const },
  { name: 'Electricity & Water', color: '#eab308', type: 'expense' as const },
  { name: 'Internet & Cable', color: '#ca8a04', type: 'expense' as const },
  { name: 'Heating & Cooling', color: '#a16207', type: 'expense' as const },
  
  // Transportation
  { name: 'Transport', color: '#22c55e', type: 'expense' as const },
  { name: 'Fuel / Petrol', color: '#16a34a', type: 'expense' as const },
  { name: 'Car Insurance', color: '#15803d', type: 'expense' as const },
  { name: 'Car Maintenance', color: '#166534', type: 'expense' as const },
  { name: 'Public Transport', color: '#14532d', type: 'expense' as const },
  { name: 'Parking & Tolls', color: '#052e16', type: 'expense' as const },
  { name: 'Car Registration', color: '#84cc16', type: 'expense' as const },
  
  // Food & Dining
  { name: 'Groceries', color: '#f97316', type: 'expense' as const },
  { name: 'Restaurant / Takeout', color: '#ea580c', type: 'expense' as const },
  { name: 'Coffee & Beverages', color: '#dc2626', type: 'expense' as const },
  { name: 'Alcohol', color: '#b91c1c', type: 'expense' as const },
  { name: 'Lunch at Work', color: '#f59e0b', type: 'expense' as const },
  
  // Personal Care & Health
  { name: 'Healthcare', color: '#06b6d4', type: 'expense' as const },
  { name: 'Medications', color: '#0891b2', type: 'expense' as const },
  { name: 'Dental Care', color: '#0e7490', type: 'expense' as const },
  { name: 'Vision Care', color: '#155e75', type: 'expense' as const },
  { name: 'Hair & Beauty', color: '#ec4899', type: 'expense' as const },
  { name: 'Gym & Fitness', color: '#db2777', type: 'expense' as const },
  { name: 'Personal Items', color: '#be185d', type: 'expense' as const },
  { name: 'Clothing', color: '#9d174d', type: 'expense' as const },
  
  // Technology & Communication
  { name: 'Airtime & Data', color: '#3b82f6', type: 'expense' as const },
  { name: 'Software & Apps', color: '#2563eb', type: 'expense' as const },
  { name: 'Electronics', color: '#1d4ed8', type: 'expense' as const },
  { name: 'Phone Upgrades', color: '#1e40af', type: 'expense' as const },
  { name: 'Computer & Tech', color: '#1e3a8a', type: 'expense' as const },
  
  // Financial & Professional
  { name: 'Loan/Debt Payments', color: '#8b5cf6', type: 'expense' as const },
  { name: 'Bank Fees', color: '#7c3aed', type: 'expense' as const },
  { name: 'Investment Fees', color: '#6d28d9', type: 'expense' as const },
  { name: 'Tax Preparation', color: '#5b21b6', type: 'expense' as const },
  { name: 'Professional Development', color: '#4c1d95', type: 'expense' as const },
  { name: 'Work Supplies', color: '#581c87', type: 'expense' as const },
  
  // Family & Social
  { name: 'Education & Childcare', color: '#ec4899', type: 'expense' as const },
  { name: 'School Supplies', color: '#db2777', type: 'expense' as const },
  { name: 'Gifts', color: '#be185d', type: 'expense' as const },
  { name: 'Pet Care', color: '#9d174d', type: 'expense' as const },
  { name: 'Donations & Charity', color: '#831843', type: 'expense' as const },
  { name: 'Baby Care', color: '#701a75', type: 'expense' as const },
  
  // Entertainment & Lifestyle
  { name: 'Entertainment', color: '#8b5cf6', type: 'expense' as const },
  { name: 'Streaming Services', color: '#7c3aed', type: 'expense' as const },
  { name: 'Movies & Events', color: '#6d28d9', type: 'expense' as const },
  { name: 'Hobbies', color: '#5b21b6', type: 'expense' as const },
  { name: 'Books & Magazines', color: '#4c1d95', type: 'expense' as const },
  { name: 'Gaming', color: '#581c87', type: 'expense' as const },
  
  // Shopping & Miscellaneous
  { name: 'Shopping', color: '#ef4444', type: 'expense' as const },
  { name: 'Home Decor', color: '#dc2626', type: 'expense' as const },
  { name: 'Tools & Equipment', color: '#b91c1c', type: 'expense' as const },
  { name: 'Office Supplies', color: '#991b1b', type: 'expense' as const },
  
  // Travel & Vacation
  { name: 'Vacation', color: '#06b6d4', type: 'expense' as const },
  { name: 'Travel Insurance', color: '#0891b2', type: 'expense' as const },
  { name: 'Accommodation', color: '#0e7490', type: 'expense' as const },
  { name: 'Travel Transport', color: '#155e75', type: 'expense' as const },
  
  // Savings & Investment
  { name: 'Emergency Fund', color: '#10b981', type: 'expense' as const },
  { name: 'Retirement Savings', color: '#059669', type: 'expense' as const },
  { name: 'Investment Contribution', color: '#047857', type: 'expense' as const },
  
  // Catch-all
  { name: 'Other Expenses', color: '#64748b', type: 'expense' as const },
  { name: 'Miscellaneous', color: '#475569', type: 'expense' as const },
  
  // INCOME CATEGORIES
  // Regular Income
  { name: 'Salary', color: '#10b981', type: 'income' as const },
  { name: 'Part-time Job', color: '#059669', type: 'income' as const },
  { name: 'Freelance', color: '#06b6d4', type: 'income' as const },
  { name: 'Consulting', color: '#0891b2', type: 'income' as const },
  { name: 'Side Hustle', color: '#0e7490', type: 'income' as const },
  
  // Investment Income
  { name: 'Investment', color: '#8b5cf6', type: 'income' as const },
  { name: 'Dividends', color: '#7c3aed', type: 'income' as const },
  { name: 'Interest Income', color: '#6d28d9', type: 'income' as const },
  { name: 'Rental Income', color: '#5b21b6', type: 'income' as const },
  { name: 'Capital Gains', color: '#4c1d95', type: 'income' as const },
  
  // Irregular Income
  { name: 'Bonus', color: '#f59e0b', type: 'income' as const },
  { name: 'Tax Refund', color: '#d97706', type: 'income' as const },
  { name: 'Insurance Payout', color: '#b45309', type: 'income' as const },
  { name: 'Cash Gift', color: '#92400e', type: 'income' as const },
  { name: 'Prize / Winnings', color: '#78350f', type: 'income' as const },
  
  // Government & Benefits
  { name: 'Pension', color: '#047857', type: 'income' as const },
  { name: 'Government Benefits', color: '#065f46', type: 'income' as const },
  { name: 'Unemployment', color: '#064e3b', type: 'income' as const },
  { name: 'Child Support', color: '#022c22', type: 'income' as const },
  
  // Business Income
  { name: 'Business Income', color: '#1e40af', type: 'income' as const },
  { name: 'Commission', color: '#1e3a8a', type: 'income' as const },
  { name: 'Royalties', color: '#1d4ed8', type: 'income' as const },
  
  // Other Income
  { name: 'Other Income', color: '#475569', type: 'income' as const },
];

export const defaultDataService = {
  async setupDefaultCategories(userId: string): Promise<void> {
    try {
      // Check if user already has categories to avoid duplicates
      const { data: existingCategories, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (checkError) {
        console.error('Error checking existing categories:', checkError);
        return;
      }

      // Only insert if no categories exist for this user
      if (!existingCategories || existingCategories.length === 0) {
        const { error } = await supabase
          .from('categories')
          .insert(
            defaultCategories.map(category => ({
              ...category,
              user_id: userId,
              is_system: true
            }))
          );

        if (error) {
          console.error('Error setting up default categories:', error);
        } else {
          console.log('Default categories set up successfully');
        }
      } else {
        console.log('Categories already exist for user, skipping setup');
      }
    } catch (error) {
      console.error('Error setting up default categories:', error);
    }
  },

  async forceLoadAllCategories(userId: string): Promise<void> {
    try {
      console.log('Force loading all enhanced categories for user:', userId);
      
      // Get existing category names to avoid duplicates
      const { data: existingCategories, error: existingError } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', userId);

      if (existingError) {
        console.error('Error fetching existing categories:', existingError);
        return;
      }

      const existingNames = new Set(existingCategories?.map(cat => cat.name) || []);
      
      // Filter out categories that already exist
      const newCategories = defaultCategories.filter(
        category => !existingNames.has(category.name)
      );

      console.log('Adding', newCategories.length, 'new categories');

      if (newCategories.length > 0) {
        const { error } = await supabase
          .from('categories')
          .insert(
            newCategories.map(category => ({
              ...category,
              user_id: userId,
              is_system: true
            }))
          );

        if (error) {
          console.error('Error force loading categories:', error);
          throw error;
        } else {
          console.log('Enhanced categories loaded successfully:', newCategories.length, 'new categories added');
        }
      } else {
        console.log('All enhanced categories already exist for this user');
      }
    } catch (error) {
      console.error('Error force loading enhanced categories:', error);
      throw error;
    }
  },

  async setupDefaultUserSettings(userId: string): Promise<void> {
    try {
      // Check if user settings already exist
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user settings:', checkError);
        return;
      }

      // Only insert if settings don't exist
      if (!existingSettings) {
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            theme: 'light',
            total_savings: 0
          });

        if (error) {
          console.error('Error setting up default user settings:', error);
        } else {
          console.log('Default user settings set up successfully');
        }
      } else {
        console.log('User settings already exist, skipping setup');
      }
    } catch (error) {
      console.error('Error setting up default user settings:', error);
    }
  }
};
