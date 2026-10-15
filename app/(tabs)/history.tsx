import * as React from 'react'
import { Pressable, View } from 'react-native'

import { HistoryChart } from '@/components/budget/HistoryChart'
import { HistoryList } from '@/components/budget/HistoryList'
import { ScreenHeader } from '@/components/budget/ScreenHeader'
import { Text } from '@/components/ui/text'
import { addDays, formatShortDay } from '@/lib/budget/dates'
import { getPeriod } from '@/lib/budget/engine'
import { useToday } from '@/lib/budget/hooks'
import { useBudgetStore } from '@/lib/budget/store'
import { formatMoney } from '@/lib/format'
import LucideIcon from '@/lib/icons/LucideIcon'

export default function HistoryScreen() {
  const today = useToday()
  const transactions = useBudgetStore((s) => s.transactions)
  const periodStartDay = useBudgetStore((s) => s.periodStartDay)
  const [anchor, setAnchor] = React.useState(today)
  const period = getPeriod(anchor, periodStartDay)
  const isCurrent = today >= period.start && today <= period.end

  const transactionsForPeriod = React.useMemo(() => {
    return transactions.filter((transaction) => {
      return transaction.date >= period.start && transaction.date <= period.end
    })
  }, [transactions, period])

  const total = React.useMemo(() => {
    return transactionsForPeriod.reduce((sum, transaction) => {
      return sum + transaction.amount
    }, 0)
  }, [transactionsForPeriod])

  return (
    <View className="bg-background pt-safe flex-1">
      <ScreenHeader eyebrow="Vos opérations" title="Historique" />

      <View className="border-border mx-5 mb-2 flex-row items-center rounded-xl border p-1.5">
        <Pressable
          onPress={() => setAnchor(addDays(period.start, -1))}
          accessibilityLabel="Période précédente"
          className="active:bg-accent h-10 w-10 items-center justify-center rounded-lg"
        >
          <LucideIcon name="ChevronLeft" size={18} className="text-foreground" />
        </Pressable>
        <Pressable onPress={() => setAnchor(today)} className="flex-1 items-center">
          <Text className="text-foreground text-sm font-semibold">
            {formatShortDay(period.start)} – {formatShortDay(period.end)}
          </Text>
          <Text className="text-muted-foreground text-xs">
            {isCurrent ? 'Période en cours' : 'Toucher pour revenir à aujourd’hui'} ·{' '}
            {formatMoney(total)}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setAnchor(addDays(period.end, 1))}
          accessibilityLabel="Période suivante"
          className="active:bg-accent h-10 w-10 items-center justify-center rounded-lg"
        >
          <LucideIcon name="ChevronRight" size={18} className="text-foreground" />
        </Pressable>
      </View>

      {presentationType === 'list' && (
        <HistoryList transactions={transactionsForPeriod} period={period} />
      )}
      {presentationType === 'chart' && (
        <HistoryChart transactions={transactionsForPeriod} total={total} />
      )}
    </View>
  )
}
