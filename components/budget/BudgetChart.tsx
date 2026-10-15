import * as React from 'react'
import { View } from 'react-native'
import { DonutChart } from 'react-native-chart-kit/v2'
import { CartesianChartTheme } from 'react-native-chart-kit/v2'

import { Text } from '@/components/ui/text'
import { getCategory } from '@/lib/budget/categories'
import { RecurringItem } from '@/lib/budget/types'
import { formatMoney } from '@/lib/format'

export function BudgetChart({
  recurring,
  width,
  theme,
}: {
  recurring: RecurringItem[]
  width: number
  theme: CartesianChartTheme
}) {
  const data = React.useMemo(() => {
    const totalByCategory = recurring.reduce(
      (prev, { categoryId, amount, type }) => {
        prev[categoryId] = (prev[categoryId] ?? 0) + amount * (type === 'expense' ? -1 : 1)
        return prev
      },
      {} as Record<string, number>
    )

    return Object.keys(totalByCategory).map((categoryId) => {
      const category = getCategory(categoryId)

      return {
        categoryId,
        label: getCategory(categoryId).label,
        originalValue: totalByCategory[categoryId],
        value: Math.abs(totalByCategory[categoryId]),
        color: category.color,
      }
    })
  }, [recurring])

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return width > 0 ? (
    <DonutChart
      centerLabel={({ selectedIndex }) => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text className="text-muted-foreground text-sm">
            {selectedIndex !== undefined ? data[selectedIndex].label : 'Total'}
          </Text>
          <Text className="text-foreground text-lg font-medium">
            {formatMoney(selectedIndex !== undefined ? data[selectedIndex].originalValue : total)}
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
      theme={theme}
    />
  ) : null
}
