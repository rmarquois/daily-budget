import { Tabs } from 'expo-router';
import LucideIcon, { type IconName } from '@/lib/icons/LucideIcon';
import { useTheme } from '@/theming/ThemeProvider';

const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: string; size: number }) => (
    <LucideIcon name={name} color={color} size={size - 2} strokeWidth={1.75} />
  );

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.foreground,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11 },
      }}>
      <Tabs.Screen name="today" options={{ title: "Aujourd'hui", tabBarIcon: tabIcon('Wallet') }} />
      <Tabs.Screen name="history" options={{ title: 'Historique', tabBarIcon: tabIcon('History') }} />
      <Tabs.Screen name="budget" options={{ title: 'Budget', tabBarIcon: tabIcon('Repeat') }} />
      <Tabs.Screen name="settings" options={{ title: 'Réglages', tabBarIcon: tabIcon('Settings2') }} />
    </Tabs>
  );
}
