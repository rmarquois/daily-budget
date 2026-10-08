import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useBudgetHydrated, useBudgetStore } from '@/lib/budget/store';

export default function Index() {
  const hydrated = useBudgetHydrated();
  const onboarded = useBudgetStore((s) => s.onboarded);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }
  return <Redirect href={onboarded ? '/today' : '/onboarding'} />;
}
