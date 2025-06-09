
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const SettingsHeader = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of your account.",
        });
      } catch (error) {
        toast({
          title: "Error signing out",
          description: "There was an error signing you out. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};
