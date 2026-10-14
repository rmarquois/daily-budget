import { Pressable, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { getCategory } from '@/lib/budget/categories'
import type { Transaction } from '@/lib/budget/types'
import { formatMoney } from '@/lib/format'
import LucideIcon from '@/lib/icons/LucideIcon'
import { cn } from '@/lib/utils'

interface TransactionRowProps {
  transaction: Transaction
  onPress?: () => void
  isLast?: boolean
}

export function TransactionRow({ transaction, onPress, isLast }: TransactionRowProps) {
  const category = getCategory(transaction.categoryId)
  const isIncome = transaction.type === 'income'

  return (
    <Pressable
      onPress={onPress}
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
          {transaction.label || category.label}
        </Text>
        <Text className="text-muted-foreground text-xs">{category.label}</Text>
      </View>
      <Text
        className={cn(
          'text-sm font-semibold tabular-nums',
          isIncome ? 'text-success' : 'text-foreground'
        )}
      >
        {isIncome ? '+' : '−'}
        {formatMoney(transaction.amount)}
      </Text>
    </Pressable>
  )
}
