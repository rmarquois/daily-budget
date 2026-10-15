import * as React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { CartesianChartTheme } from 'react-native-chart-kit/v2'

import { BudgetChart } from '@/components/budget/BudgetChart'
import { PeriodChart } from '@/components/budget/PeriodChart'
import { ScreenHeader } from '@/components/budget/ScreenHeader'
import { SectionTitle } from '@/components/budget/SectionTitle'
import { YearChart } from '@/components/budget/YearChart'
import { Text } from '@/components/ui/text'
import { getPeriod } from '@/lib/budget/engine'
import { useBudgetStore } from '@/lib/budget/store'
import LucideIcon from '@/lib/icons/LucideIcon'
import { useTheme } from '@/theming/ThemeProvider'

const THIS_YEAR = new Date().getFullYear()

export default function StatsScreen() {
  const [currentYear, setCurrentYear] = React.useState(THIS_YEAR)
  const [chartWidth, setChartWidth] = React.useState(0)
  const [selectedMonth, setSelectedMonth] = React.useState<number | undefined>()
  const [budgetSelected, setBudgetSelected] = React.useState(false)

  const { theme } = useTheme()

  const periodStartDay = useBudgetStore((s) => s.periodStartDay)
  const selectedPeriod = getPeriod(`${currentYear}-${selectedMonth}-01`, periodStartDay)

  const transactions = useBudgetStore((s) => s.transactions)
  const recurring = useBudgetStore((s) => s.recurring)

  const chartTheme: CartesianChartTheme = {
    background: theme.colors.background,
    plotBackground: theme.colors.background,
    axis: theme.colors.muted,
    grid: theme.colors.muted,
    text: theme.colors.foreground,
    mutedText: theme.colors.mutedForeground,
    typography: {
      fontFamily: theme.typography.body?.fontFamily,
    },
  }

  const transactionsForYear = React.useMemo(() => {
    return transactions.filter((transaction) => {
      return transaction.date.startsWith(`${currentYear}`)
    })
  }, [transactions, currentYear])

  const transactionsForPeriod = React.useMemo(() => {
    if (selectedMonth === undefined) return []

    return transactions.filter((transaction) => {
      return transaction.date >= selectedPeriod.start && transaction.date <= selectedPeriod.end
    })
  }, [transactions, selectedPeriod])

  React.useMemo(() => {
    setSelectedMonth(undefined)
    setBudgetSelected(false)
  }, [currentYear])

  return (
    <View className="bg-background pt-safe flex-1">
      <ScreenHeader eyebrow="Vos finances" title="Analyse" />

      <View className="border-border mx-5 mb-2 flex-row items-center rounded-xl border p-1.5">
        <Pressable
          onPress={() => setCurrentYear((prev) => prev - 1)}
          accessibilityLabel="Année précédente"
          className="active:bg-accent h-10 w-10 items-center justify-center rounded-lg"
        >
          <LucideIcon name="ChevronLeft" size={18} className="text-foreground" />
        </Pressable>
        <Pressable onPress={() => setCurrentYear(THIS_YEAR)} className="flex-1 items-center">
          <Text className="text-foreground text-sm font-semibold">{currentYear}</Text>
          <Text className="text-muted-foreground text-xs">
            {currentYear === THIS_YEAR ? 'Année en cours' : 'Toucher pour revenir à cette année'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentYear((prev) => prev + 1)}
          accessibilityLabel="Année suivante"
          className="active:bg-accent h-10 w-10 items-center justify-center rounded-lg"
        >
          <LucideIcon name="ChevronRight" size={18} className="text-foreground" />
        </Pressable>
      </View>

      {transactionsForYear.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <View className="bg-muted mb-3 h-12 w-12 items-center justify-center rounded-full">
            <LucideIcon name="ChartPie" size={22} className="text-muted-foreground" />
          </View>
          <Text className="text-foreground text-sm font-medium">Aucune donnée disponible</Text>
          <Text className="text-muted-foreground mt-1 text-center text-xs">
            Retrouvez ici l’évolution de vos dépenses et de votre budget sur l’année choisie
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-5">
          <View onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
            <>
              <SectionTitle title="Votre année en chiffres" />
              <YearChart
                transactions={transactionsForYear}
                onSelect={(month, budget) => {
                  setSelectedMonth(month)
                  setBudgetSelected(budget)
                }}
                width={chartWidth}
                theme={chartTheme}
              />
            </>
            {selectedMonth !== undefined && (
              <>
                <SectionTitle title="Répartition des dépenses du mois" />
                <PeriodChart
                  transactions={transactionsForPeriod.filter((t) => t.type === 'expense')}
                  width={chartWidth}
                  theme={chartTheme}
                />
                <SectionTitle title="Répartition des revenus du mois" />
                <PeriodChart
                  transactions={transactionsForPeriod.filter((t) => t.type === 'income')}
                  width={chartWidth}
                  theme={chartTheme}
                />
              </>
            )}
            {budgetSelected && (
              <>
                <SectionTitle title="Répartition du budget (dépenses)" />
                <BudgetChart
                  recurring={recurring.filter((r) => r.type === 'expense')}
                  width={chartWidth}
                  theme={chartTheme}
                />
                <SectionTitle title="Répartition du budget (revenus)" />
                <BudgetChart
                  recurring={recurring.filter((r) => r.type === 'income')}
                  width={chartWidth}
                  theme={chartTheme}
                />
              </>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}
