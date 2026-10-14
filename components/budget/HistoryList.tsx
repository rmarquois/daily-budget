import { router } from 'expo-router'
import * as React from 'react'
import { SectionList, View } from 'react-native'

import { TransactionRow } from '@/components/budget/TransactionRow'
import { Text } from '@/components/ui/text'
import { DayKey, formatRelativeDay } from '@/lib/budget/dates'
import { Period } from '@/lib/budget/engine'
import { useToday } from '@/lib/budget/hooks'
import type { Transaction } from '@/lib/budget/types'
import { formatMoney } from '@/lib/format'
import LucideIcon from '@/lib/icons/LucideIcon'
import { cn } from '@/lib/utils'

export interface DaySection {
  day: DayKey
  net: number
  data: Transaction[]
}

export function HistoryList({
  transactions,
  period,
}: {
  transactions: Transaction[]
  period: Period
}) {
  const today = useToday()

  const sections = React.useMemo(() => {
    const byDay = new Map<DayKey, Transaction[]>()

    for (const t of transactions) {
      if (t.date < period.start || t.date > period.end) continue
      const list = byDay.get(t.date) ?? []
      list.push(t)
      byDay.set(t.date, list)
    }

    return [...byDay.entries()]
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([day, list]) => {
        const net = list.reduce((s, t) => s + (t.type === 'expense' ? t.amount : -t.amount), 0)
        return { day, net, data: list.sort((a, b) => b.createdAt - a.createdAt) }
      })
  }, [transactions, period.start, period.end])

  return (
    <SectionList
      sections={sections}
      keyExtractor={(t) => t.id}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <View className="mb-2 mt-5 flex-row items-center justify-between px-1">
          <Text className="text-foreground text-sm font-semibold">
            {formatRelativeDay(section.day, today)}
          </Text>
          <Text className="text-muted-foreground text-xs">
            {section.net >= 0 ? '−' : '+'}
            {formatMoney(Math.abs(section.net))}
          </Text>
        </View>
      )}
      renderItem={({ item, index, section }) => (
        <View
          className={cn(
            'border-border bg-card overflow-hidden border-x',
            index === 0 && 'rounded-t-lg border-t',
            index === section.data.length - 1 && 'rounded-b-lg border-b'
          )}
        >
          <TransactionRow
            transaction={item}
            isLast={index === section.data.length - 1}
            onPress={() => router.push({ pathname: '/transaction', params: { id: item.id } })}
          />
        </View>
      )}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center">
          <View className="bg-muted mb-3 h-12 w-12 items-center justify-center rounded-full">
            <LucideIcon name="Inbox" size={22} className="text-muted-foreground" />
          </View>
          <Text className="text-foreground text-sm font-medium">Aucune opération</Text>
          <Text className="text-muted-foreground mt-1 text-center text-xs">
            Retrouvez ici l'ensemble de vos dépenses sur la période choisie
          </Text>
        </View>
      }
      className="flex-1"
      contentContainerClassName="px-4 pb-4 grow"
    />
  )
}
