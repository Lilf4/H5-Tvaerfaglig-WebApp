import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'selftest',
  webDir: 'build',
  server: {
    androidScheme: "https"
  }
};

export default config;
