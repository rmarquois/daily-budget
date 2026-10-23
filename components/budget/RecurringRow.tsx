import { Pressable, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { getCategory } from '@/lib/budget/categories'
import type { RecurringItem } from '@/lib/budget/types'
import { formatMoney } from '@/lib/format'
import LucideIcon from '@/lib/icons/LucideIcon'
import { cn } from '@/lib/utils'

interface RecurringRowProps {
  item: RecurringItem
  onPress?: () => void
  isLast?: boolean
}

export function RecurringRow({ item, onPress, isLast }: RecurringRowProps) {
  const category = getCategory(item.categoryId)
  const isIncome = item.type === 'income'

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'active:bg-accent web:hover:bg-accent flex-row items-center gap-3 px-4 py-3',
        !isLast && 'border-border border-b'
      )}
    >
      <View
        style={{ backgroundColor: category.color }}
        className="h-9 w-9 items-center justify-center rounded-full"
      >
        <LucideIcon name={category.icon} size={17} className="text-foreground" />
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-sm font-medium" numberOfLines={1}>
          {item.label}
        </Text>
        <Text className="text-muted-foreground text-sm">{getCategory(item.categoryId).label}</Text>
      </View>
      <View className="items-center">
        <Text
          className={cn('text-sm font-semibold', isIncome ? 'text-success' : 'text-foreground')}
        >
          {isIncome ? '+' : '−'}
          {formatMoney(item.amount)}
        </Text>
        <Text className="text-muted-foreground text-xs">
          {`/ `}
          {item.frequency === 'monthly' && 'mois'}
          {item.frequency === 'quarterly' && 'trimestre'}
          {item.frequency === 'yearly' && 'an'}
        </Text>
      </View>
    </Pressable>
  )
}
