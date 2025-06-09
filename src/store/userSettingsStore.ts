
import { create } from 'zustand';
import { supabaseService } from '@/services/supabaseService';

interface UserSettingsState {
  theme: 'light' | 'dark';
  monthlyIncomeTarget: number | null;
  emergencyFundGoal: number | null;
  savingAmount: number | null;
  currentSavings: number | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUserSettings: () => Promise<void>;
  setMonthlyIncomeTarget: (amount: number | null) => Promise<void>;
  setEmergencyFundGoal: (amount: number | null) => Promise<void>;
  setSavingAmount: (amount: number | null) => Promise<void>;
  setCurrentSavings: (amount: number | null) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useUserSettingsStore = create<UserSettingsState>((set, get) => ({
  theme: 'light',
  monthlyIncomeTarget: null,
  emergencyFundGoal: null,
  savingAmount: null,
  currentSavings: null,
  loading: false,
  error: null,

  fetchUserSettings: async () => {
    try {
      set({ loading: true, error: null });
      console.log('UserSettingsStore: Fetching user settings...');
      const settings = await supabaseService.getUserSettings();
      
      if (settings) {
        console.log('UserSettingsStore: Settings found:', settings);
        set({
          theme: (settings.theme === 'dark' ? 'dark' : 'light') as 'light' | 'dark',
          monthlyIncomeTarget: settings.monthly_income_target,
          emergencyFundGoal: settings.emergency_fund_goal,
          savingAmount: settings.total_savings,
          currentSavings: settings.current_savings,
          loading: false
        });
      } else {
        console.log('UserSettingsStore: No settings found, creating defaults...');
        // Initialize with default values if no settings exist
        await supabaseService.updateUserSettings({
          theme: 'light',
          monthly_income_target: null,
          emergency_fund_goal: null,
          total_savings: null,
          current_savings: 0
        });
        set({
          theme: 'light',
          monthlyIncomeTarget: null,
          emergencyFundGoal: null,
          savingAmount: null,
          currentSavings: 0,
          loading: false
        });
      }
    } catch (error) {
      console.error('UserSettingsStore: Error fetching user settings:', error);
      set({ 
        error: (error as Error).message, 
        loading: false 
      });
    }
  },

  setMonthlyIncomeTarget: async (amount) => {
    try {
      set({ error: null });
      console.log('UserSettingsStore: Setting monthly income target to:', amount);
      await supabaseService.updateUserSettings({ monthly_income_target: amount });
      set({ monthlyIncomeTarget: amount });
      console.log('UserSettingsStore: Monthly income target updated successfully');
    } catch (error) {
      console.error('UserSettingsStore: Error setting monthly income target:', error);
      set({ error: (error as Error).message });
      throw error; // Re-throw to allow component to handle
    }
  },

  setEmergencyFundGoal: async (amount) => {
    try {
      set({ error: null });
      console.log('UserSettingsStore: Setting emergency fund goal to:', amount);
      await supabaseService.updateUserSettings({ emergency_fund_goal: amount });
      set({ emergencyFundGoal: amount });
      console.log('UserSettingsStore: Emergency fund goal updated successfully');
    } catch (error) {
      console.error('UserSettingsStore: Error setting emergency fund goal:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setSavingAmount: async (amount) => {
    try {
      set({ error: null });
      console.log('UserSettingsStore: Setting saving amount to:', amount);
      await supabaseService.updateUserSettings({ total_savings: amount });
      set({ savingAmount: amount });
      console.log('UserSettingsStore: Saving amount updated successfully');
    } catch (error) {
      console.error('UserSettingsStore: Error setting saving amount:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setCurrentSavings: async (amount) => {
    try {
      set({ error: null });
      console.log('UserSettingsStore: Setting current savings to:', amount);
      await supabaseService.updateUserSettings({ current_savings: amount });
      set({ currentSavings: amount });
      console.log('UserSettingsStore: Current savings updated successfully');
    } catch (error) {
      console.error('UserSettingsStore: Error setting current savings:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  toggleTheme: async () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    try {
      set({ error: null });
      console.log('UserSettingsStore: Toggling theme to:', newTheme);
      await supabaseService.updateUserSettings({ theme: newTheme });
      set({ theme: newTheme });
      console.log('UserSettingsStore: Theme updated successfully');
    } catch (error) {
      console.error('UserSettingsStore: Error toggling theme:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));
