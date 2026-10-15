import * as React from 'react'
import { View } from 'react-native'
import { DonutChart } from 'react-native-chart-kit/v2'

import { Text } from '@/components/ui/text'
import { getCategory } from '@/lib/budget/categories'
import { Transaction } from '@/lib/budget/types'
import { formatMoney } from '@/lib/format'

export function PeriodChart({
  width,
  transactions,
}: {
  width: number
  transactions: Transaction[]
}) {
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

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return width > 0 ? (
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
  ) : null
}
