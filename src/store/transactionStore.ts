
import { create } from 'zustand';
import { Transaction } from '@/store/financeStore';
import { supabaseService } from '@/services/supabaseService';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const transactions = await supabaseService.getTransactions();
      set({ transactions, loading: false });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTransaction: async (transaction) => {
    try {
      set({ error: null });
      const newTransaction = await supabaseService.addTransaction(transaction);
      set((state) => ({
        transactions: [newTransaction, ...state.transactions]
      }));
    } catch (error) {
      console.error('Error adding transaction:', error);
      set({ error: (error as Error).message });
    }
  },

  updateTransaction: async (id, updates) => {
    try {
      set({ error: null });
      await supabaseService.updateTransaction(id, updates);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
      }));
    } catch (error) {
      console.error('Error updating transaction:', error);
      set({ error: (error as Error).message });
    }
  },

  deleteTransaction: async (id) => {
    try {
      set({ error: null });
      await supabaseService.deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      set({ error: (error as Error).message });
    }
  },
}));
