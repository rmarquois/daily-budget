module.exports = {
  name: 'Daily Budget',
  slug: 'daily-budget',
  scheme: 'daily-budget',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'fr.rmarquois.daily.budget',
    buildNumber: '1',
  },
  platforms: ['ios', 'android', 'web'],
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'fr.rmarquois.daily.budget',
    versionCode: 1,
  },
  web: { bundler: 'metro', output: 'single', favicon: './assets/images/favicon.png' },
  assetBundlePatterns: ['**/*'],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
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
  extra: {
    eas: {
      projectId: 'fcfdaedc-5bb5-4809-bd73-d618d36b18b6',
    },
  },
}
