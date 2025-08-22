
import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { Transactions } from '@/components/Transactions';
import { Budget } from '@/components/Budget';
import { Target } from '@/components/Target';
import { MonthlyLedger } from '@/components/MonthlyLedger';
import { Settings } from '@/components/Settings';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseStore } from '@/store/supabaseStore';

const Index = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { user, loading } = useAuth();
  const { fetchTransactions, fetchCategories, fetchUserSettings, initialized } = useSupabaseStore();

  useEffect(() => {
    if (user && !initialized) {
      console.log('User authenticated, fetching data...');
      // Fetch all necessary data when user is authenticated
      const loadData = async () => {
        try {
          await Promise.all([
            fetchTransactions(),
            fetchCategories(),
            fetchUserSettings()
          ]);
          console.log('All data loaded successfully');
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      
      loadData();
    }
  }, [user, initialized, fetchTransactions, fetchCategories, fetchUserSettings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'budget':
        return <Budget />;
      case 'target':
        return <Target />;
      case 'ledger':
        return <MonthlyLedger />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;