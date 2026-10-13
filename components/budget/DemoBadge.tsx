import { View } from 'react-native'

import { Text } from '@/components/ui/text'
import { useBudgetStore } from '@/lib/budget/store'
import LucideIcon from '@/lib/icons/LucideIcon'

/** Visible marker shown while the example dataset is loaded. */
export function DemoBadge() {
  const isDemo = useBudgetStore((s) => s.isDemo)
  if (!isDemo) return null
  return (
    <View className="border-warning flex-row items-center gap-1 self-start rounded-full border bg-orange-100 px-2.5 py-1">
      <LucideIcon name="FlaskConical" size={12} className="text-warning" />
      <Text className="text-warning text-xs font-medium">Données d'exemple</Text>
    </View>
  )
}
