import * as React from 'react'
import { Pressable, View } from 'react-native'
import { DonutChart } from 'react-native-chart-kit/v2'

import { Text } from '@/components/ui/text'
import { getCategory } from '@/lib/budget/categories'
import { Transaction } from '@/lib/budget/types'
import { formatMoney } from '@/lib/format'
import LucideIcon from '@/lib/icons/LucideIcon'

export function HistoryChart({
  transactions,
  total,
}: {
  transactions: Transaction[]
  total: number
}) {
  const [width, setWidth] = React.useState(0)

  const data = React.useMemo(() => {
    const totalByCategory = transactions.reduce(
      (prev, transaction) => {
        prev[transaction.categoryId] = (prev[transaction.categoryId] ?? 0) + transaction.amount
        return prev
      },
      {} as Record<string, number>
    )

    return Object.keys(totalByCategory).map((categoryId) => {
      const category = getCategory(categoryId)
      return {
        categoryId,
        label: getCategory(categoryId).label,
        value: totalByCategory[categoryId],
        color: category.color,
      }
    })
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <View className="bg-muted mb-3 h-12 w-12 items-center justify-center rounded-full">
          <LucideIcon name="ChartPie" size={22} className="text-muted-foreground" />
        </View>
        <Text className="text-foreground text-sm font-medium">Aucune opération</Text>
        <Text className="text-muted-foreground mt-1 text-center text-xs">
          Retrouvez ici la répartition de vos opérations sur la période choisie
        </Text>
      </View>
    )
  }

  return (
    <Pressable
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width)
      }}
      className="flex-1 justify-center"
    >
      {width > 0 && (
        <DonutChart
          centerLabel={({ selectedIndex }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text className="text-muted-foreground text-sm">
                {selectedIndex !== undefined ? data[selectedIndex].label : 'Total'}
              </Text>
              <Text className="text-foreground text-lg font-medium">
                {formatMoney(selectedIndex !== undefined ? data[selectedIndex].value : total)}
              </Text>
            </View>
          )}
          data={data}
          valueKey="value"
          labelKey="label"
          width={width}
          height={width}
          interaction={{
            mode: 'tap',
          }}
        />
      )}
    </Pressable>
  )
}
