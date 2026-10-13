import { router } from 'expo-router'
import { Pressable, ScrollView, View } from 'react-native'

import { DemoBadge } from '@/components/budget/DemoBadge'
import { ProgressBar } from '@/components/budget/ProgressBar'
import { ScreenHeader } from '@/components/budget/ScreenHeader'
import { SectionTitle } from '@/components/budget/SectionTitle'
import { TransactionRow } from '@/components/budget/TransactionRow'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { formatLongDay, formatShortDay, formatWeekdayShort } from '@/lib/budget/dates'
import type { DayBudget } from '@/lib/budget/engine'
import { useBudgetOverview, useToday } from '@/lib/budget/hooks'
import { formatMoney, formatMoneyRounded } from '@/lib/format'
import LucideIcon from '@/lib/icons/LucideIcon'
import { cn } from '@/lib/utils'

export default function TodayScreen() {
  const today = useToday()
  const { todayBudget, upcoming, summary, todayTransactions } = useBudgetOverview(today)
  const { available, allowance, spent } = todayBudget
  const overspent = available < 0
  const noBudget = summary.budget <= 0 && summary.income === 0

  return (
    <View className="bg-background pt-safe flex-1">
      <ScrollView contentContainerClassName="pb-26" showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow={formatLongDay(today)} title="Aujourd'hui" right={<DemoBadge />} />

        <View className="px-5">
          {noBudget ? (
            <Pressable onPress={() => router.push('/budget')}>
              <Card className="border-warning/40 bg-warning/10 mb-4 flex-row items-center gap-3 p-4">
                <LucideIcon name="TriangleAlert" size={18} className="text-warning" />
                <Text className="text-foreground flex-1 text-sm">
                  Ajoutez vos revenus récurrents pour calculer votre budget quotidien.
                </Text>
                <LucideIcon name="ChevronRight" size={18} className="text-muted-foreground" />
              </Card>
            </Pressable>
          ) : null}

          {/* Hero: what's left to spend today */}
          <View className="bg-primary rounded-2xl p-6">
            <Text className="text-primary-foreground text-sm font-medium">
              {overspent ? 'Dépassement du jour' : 'Vous pouvez encore dépenser'}
            </Text>
            <Text
              className={cn(
                'font-display mt-1 text-5xl tracking-tight',
                overspent ? 'text-destructive' : 'text-primary-foreground'
              )}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {formatMoney(available)}
            </Text>
            <ProgressBar
              value={allowance > 0 ? spent / allowance : spent > 0 ? 1 : 0}
              tone={overspent ? 'destructive' : 'default'}
              className="bg-muted-foreground mt-5"
              barClassName={overspent ? undefined : 'bg-primary-foreground'}
            />
            <View className="mt-3 flex-row justify-between">
              <Text className="text-primary-foreground text-xs">
                {formatMoney(Math.max(0, spent))} dépensés
              </Text>
              <Text className="text-primary-foreground text-xs">
                Budget du jour : {formatMoney(allowance)}
              </Text>
            </View>
            {overspent ? (
              <Text className="text-primary-foreground mt-3 text-xs leading-5">
                Pas de panique : ce dépassement sera réparti sur les{' '}
                {Math.max(1, todayBudget.daysLeft - 1)} jours restants de la période.
              </Text>
            ) : null}
          </View>

          {/* Next 3 days */}
          <SectionTitle title="Les prochains jours" />
          <View className="flex-row gap-3">
            {upcoming.map((d, i) => (
              <UpcomingCard
                key={d.day}
                day={d}
                label={i === 0 ? 'Demain' : formatWeekdayShort(d.day)}
              />
            ))}
          </View>
          <Text className="text-muted-foreground mt-2 px-1 text-xs">
            Montant disponible chaque jour si vous ne dépensez plus rien aujourd'hui.
          </Text>

          {/* Today's entries */}
          <SectionTitle
            title="Dépenses du jour"
            right={
              todayTransactions.length > 0 ? (
                <Text className="text-muted-foreground text-xs">
                  {todayTransactions.length}{' '}
                  {todayTransactions.length > 1 ? 'opérations' : 'opération'}
                </Text>
              ) : null
            }
          />
          <Card className="overflow-hidden">
            {todayTransactions.length === 0 ? (
              <Pressable
                onPress={() => router.push('/transaction')}
                className="active:bg-accent items-center px-6 py-8"
              >
                <View className="bg-muted mb-3 h-11 w-11 items-center justify-center rounded-full">
                  <LucideIcon name="Receipt" size={20} className="text-muted-foreground" />
                </View>
                <Text className="text-foreground text-sm font-medium">
                  Rien de noté aujourd'hui
                </Text>
                <Text className="text-muted-foreground mt-1 text-center text-xs">
                  Touchez ici ou le bouton + pour ajouter une dépense.
                </Text>
              </Pressable>
            ) : (
              todayTransactions.map((t, i) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  isLast={i === todayTransactions.length - 1}
                  onPress={() => router.push({ pathname: '/transaction', params: { id: t.id } })}
                />
              ))
            )}
          </Card>

          {/* Period summary */}
          <SectionTitle title="Période en cours" />
          <Card className="p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <LucideIcon name="CalendarRange" size={16} className="text-muted-foreground" />
                <Text className="text-muted-foreground text-sm">
                  {formatShortDay(summary.period.start)} → {formatShortDay(summary.period.end)}
                </Text>
              </View>
              <Text className="text-muted-foreground text-xs font-medium">
                Jour {summary.daysElapsed}/{summary.period.totalDays}
              </Text>
            </View>

            <View className="mt-4 flex-row items-baseline gap-2">
              <Text
                className={cn(
                  'font-display text-3xl tracking-tight',
                  summary.remaining < 0 ? 'text-destructive' : 'text-foreground'
                )}
              >
                {formatMoney(summary.remaining)}
              </Text>
              <Text className="text-muted-foreground text-sm">
                restants sur {formatMoneyRounded(summary.budget)}
              </Text>
            </View>

            <ProgressBar
              className="mt-4"
              value={summary.budget > 0 ? summary.spent / summary.budget : 0}
              marker={summary.daysElapsed / summary.period.totalDays}
              tone={
                summary.remaining < 0
                  ? 'destructive'
                  : summary.budget > 0 &&
                      summary.spent / summary.budget >
                        summary.daysElapsed / summary.period.totalDays
                    ? 'warning'
                    : 'success'
              }
            />
            <Text className="text-muted-foreground mt-2 text-xs">
              Le trait indique où vous devriez en être aujourd'hui.
              {summary.prorated
                ? ' Première période : le budget est calculé à partir du jour où vous avez commencé.'
                : ''}
            </Text>

            <View className="border-border mt-5 flex-row border-t pt-4">
              <Stat label="Dépensé" value={formatMoney(summary.spent)} />
              <Stat label="Jours restants" value={String(todayBudget.daysLeft)} />
              <Stat
                label="Moyenne / jour"
                value={formatMoneyRounded(summary.budget / summary.period.totalDays)}
              />
            </View>
          </Card>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push('/transaction')}
        accessibilityLabel="Ajouter une dépense"
        className="bg-primary absolute bottom-6 right-5 h-14 flex-row items-center gap-2 rounded-full px-5 shadow-lg active:opacity-90"
      >
        <LucideIcon name="Plus" size={20} className="text-primary-foreground" />
        <Text className="text-primary-foreground text-sm font-semibold">Dépense</Text>
      </Pressable>
    </View>
  )
}

function UpcomingCard({ day, label }: { day: DayBudget; label: string }) {
  const newPeriod = day.day === day.period.start
  const negative = day.available < 0
  return (
    <Card className="flex-1 p-3.5">
      <Text className="text-muted-foreground text-xs font-medium">{label}</Text>
      <Text className="text-muted-foreground text-[11px]">{formatShortDay(day.day)}</Text>
      <Text
        className={cn(
          'font-display mt-2 text-lg tracking-tight',
          negative ? 'text-destructive' : 'text-foreground'
        )}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {formatMoneyRounded(day.available)}
      </Text>
      {newPeriod ? (
        <Text className="text-success mt-1 text-[10px] font-medium uppercase tracking-wide">
          Nouvelle période
        </Text>
      ) : day.spent !== 0 ? (
        <Text className="text-muted-foreground mt-1 text-[10px]">
          {formatMoneyRounded(day.spent)} prévus
        </Text>
      ) : null}
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-muted-foreground text-[11px]">{label}</Text>
      <Text className="text-foreground mt-0.5 text-sm font-semibold">{value}</Text>
    </View>
  )
}
