import { ScrollView, View } from 'react-native'

import { DemoBadge } from '@/components/budget/DemoBadge'
import { RecurringSection } from '@/components/budget/RecurringSection'
import { ScreenHeader } from '@/components/budget/ScreenHeader'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { formatShortDay } from '@/lib/budget/dates'
import { getPeriod, sumRecurring } from '@/lib/budget/engine'
import { useToday } from '@/lib/budget/hooks'
import { useBudgetStore } from '@/lib/budget/store'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function BudgetScreen() {
  const today = useToday()
  const recurring = useBudgetStore((s) => s.recurring)
  const periodStartDay = useBudgetStore((s) => s.periodStartDay)
  const { income, expense, budget } = sumRecurring(recurring)
  const period = getPeriod(today, periodStartDay)

  const incomes = recurring.filter((r) => r.type === 'income')
  const expenses = recurring.filter((r) => r.type === 'expense')

  return (
    <View className="bg-background pt-safe flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Chaque période" title="Budget" right={<DemoBadge />} />

        <View className="px-5 pb-5">
          <Card className="p-5">
            <Text className="text-muted-foreground text-sm">Reste pour vivre par période</Text>
            <Text
              className={cn(
                'font-display mt-1 text-4xl tracking-tight',
                budget < 0 ? 'text-destructive' : 'text-foreground'
              )}
            >
              {formatMoney(budget)}
            </Text>
            <Text className="text-muted-foreground mt-1 text-xs">
              Soit environ {formatMoney(budget / period.totalDays)} par jour du{' '}
              {formatShortDay(period.start)} au {formatShortDay(period.end)}
            </Text>

            <View className="border-border mt-5 gap-2 border-t pt-4">
              <Line label="Revenus" value={`+${formatMoney(income)}`} tone="success" />
              <Line label="Dépenses fixes" value={`−${formatMoney(expense)}`} />
            </View>
          </Card>

          <RecurringSection type="income" items={incomes} />
          <RecurringSection type="expense" items={expenses} />
        </View>
      </ScrollView>
    </View>
  )
}

function Line({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-muted-foreground text-sm">{label}</Text>
      <Text
        className={cn(
          'text-sm font-medium',
          tone === 'success' ? 'text-success' : 'text-foreground'
        )}
      >
        {value}
      </Text>
    </View>
  )
}
