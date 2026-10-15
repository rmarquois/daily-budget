import * as React from 'react'
import { View } from 'react-native'
import { BarChart, BarChartSeries } from 'react-native-chart-kit/v2'

import { Text } from '@/components/ui/text'
import { fromDayKey, MONTHS_SHORT } from '@/lib/budget/dates'
import { useBudgetOverview, useToday } from '@/lib/budget/hooks'
import { type Transaction } from '@/lib/budget/types'

export function YearChart({
  width,
  transactions,
  onSelect,
}: {
  width: number
  transactions: Transaction[]
  onSelect: (month: number | undefined, budget: boolean) => void
}) {
  const today = useToday()
  const todayMonth = fromDayKey(today).getMonth()
  const { summary } = useBudgetOverview(today)

  const data = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => index).map((index) => {
      transactions.filter((transaction) => {
        return fromDayKey(transaction.date).getMonth() === index
      })

      return {
        month: MONTHS_SHORT[index],
        spent: transactions
          .filter((transaction) => {
            return fromDayKey(transaction.date).getMonth() === index
          })
          .reduce((sum, transaction) => {
            return sum + transaction.amount * (transaction.type === 'expense' ? 1 : -1)
          }, 0),
        budget: summary.budget,
      }
    })
  }, [transactions])

  const series: BarChartSeries<{
    month: string
    spent: number
    budget: number
  }>[] = [
    { yKey: 'spent', label: 'Budget consommé', color: '#E8A5A5' },
    { yKey: 'budget', label: 'Budget disponible', color: '#A8C7B0' },
  ]

  return (
    <>
      {width > 0 && (
        <BarChart
          data={data}
          xKey="month"
          series={series}
          formatYLabel={(value) => `${value}€`}
          scrollable
          visiblePoints={6}
          initialIndex={todayMonth}
          width={width}
          height={width}
          interaction={{
            mode: 'tap',
            onSelect: (e) => {
              onSelect(
                e.seriesKey === 'spent' ? e.dataIndex + 1 : undefined,
                e.seriesKey === 'budget'
              )
            },
            onDeselect: () => {
              onSelect(undefined, false)
            },
          }}
          legend={false}
          showValuesOnTopOfBars
        />
      )}
      <View className="mt-2 flex-row items-center justify-center gap-4">
        {series.map((value) => (
          <View key={value.yKey} className="flex-row items-center gap-2">
            <View style={{ backgroundColor: value.color }} className="h-4 w-4 rounded-full" />
            <Text>{value.label}</Text>
          </View>
        ))}
      </View>
    </>
  )
}
