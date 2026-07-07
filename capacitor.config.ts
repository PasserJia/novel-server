import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.passerjia.novelreader',
  appName: '小说阅读器',
  webDir: 'mobile-dist',
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
