
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.62ad7c2f084445919ed6d05981978f85',
  appName: 'tracitall-expense-messenger',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://62ad7c2f-0844-4591-9ed6-d05981978f85.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
