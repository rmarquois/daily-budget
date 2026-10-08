import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import LucideIcon from '@/lib/icons/LucideIcon';
import { useBudgetStore } from '@/lib/budget/store';

/** Visible marker shown while the example dataset is loaded. */
export function DemoBadge() {
  const isDemo = useBudgetStore((s) => s.isDemo);
  if (!isDemo) return null;
  return (
    <View className="flex-row items-center gap-1 self-start rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1">
      <LucideIcon name="FlaskConical" size={12} className="text-warning" />
      <Text className="text-xs font-medium text-warning">Données d'exemple</Text>
    </View>
  );
}
