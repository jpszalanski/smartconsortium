import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.meusimuladordeconsorcio.app',
  appName: 'Simulador Consórcio',
  webDir: 'dist',
  ios: {
    minVersion: '16.0'
  }
};

export default config;
