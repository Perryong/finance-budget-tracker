import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finance.tracker',
  appName: 'Finance Tracker',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
  },
};

export default config;


