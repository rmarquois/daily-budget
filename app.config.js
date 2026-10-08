module.exports = {
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'fr.rmarquois.daily-budget',
    versionCode: 1,
  },
  assetBundlePatterns: ['**/*'],
  experiments: { typedRoutes: true, tsconfigPaths: true },
  icon: './assets/images/icon.png',
  ios: { supportsTablet: true, bundleIdentifier: 'fr.rmarquois.daily-budget', buildNumber: '1' },
  name: 'Daily Budget',
  orientation: 'portrait',
  plugins: [
    'expo-asset',
    'expo-font',
    'expo-image',
    'expo-router',
    'expo-splash-screen',
    'expo-status-bar',
    'expo-video',
    'expo-web-browser',
  ],

  scheme: 'new-app',
  slug: 'new-app',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  userInterfaceStyle: 'automatic',
  version: 'share',
  web: { bundler: 'metro', output: 'single', favicon: './assets/images/favicon.png' },
  platforms: ['ios', 'android', 'web'],
};
