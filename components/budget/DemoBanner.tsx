import { View } from 'react-native'

import { Text } from '@/components/ui/text'
import { useBudgetStore } from '@/lib/budget/store'
import LucideIcon from '@/lib/icons/LucideIcon'

/** Visible banner shown while the example dataset is loaded. */
export function DemoBanner() {
  const isDemo = useBudgetStore((s) => s.isDemo)
  if (!isDemo) return null
  return (
    <View className="flex-row items-center justify-center gap-1 bg-orange-100 px-2.5 py-1">
      <LucideIcon name="FlaskConical" size={12} className="text-warning" />
      <Text className="text-warning text-xs font-medium">Données d'exemple</Text>
    </View>
  )
}
