
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSupabaseStore } from '@/store/supabaseStore';

export const ThemeSettings = () => {
  const { theme, toggleTheme } = useSupabaseStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-gray-600">Toggle between light and dark themes</p>
          </div>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>
      </CardContent>
    </Card>
  );
};
