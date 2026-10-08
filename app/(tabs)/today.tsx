import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DemoBadge } from '@/components/budget/DemoBadge';
import { ProgressBar } from '@/components/budget/ProgressBar';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { SectionTitle } from '@/components/budget/SectionTitle';
import { TransactionRow } from '@/components/budget/TransactionRow';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatLongDay, formatShortDay, formatWeekdayShort } from '@/lib/budget/dates';
import type { DayBudget } from '@/lib/budget/engine';
import { useBudgetOverview, useToday } from '@/lib/budget/hooks';
import { formatMoney, formatMoneyRounded } from '@/lib/format';
import LucideIcon from '@/lib/icons/LucideIcon';
import { cn } from '@/lib/utils';

export default function TodayScreen() {
  const today = useToday();
  const { todayBudget, upcoming, summary, todayTransactions } = useBudgetOverview(today);
  const { available, allowance, spent } = todayBudget;
  const overspent = available < 0;
  const noBudget = summary.budget <= 0 && summary.income === 0;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-28" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow={formatLongDay(today)}
          title="Aujourd'hui"
          right={<DemoBadge />}
        />

        <View className="px-5">
          {noBudget ? (
            <Pressable onPress={() => router.push('/budget')}>
              <Card className="mb-4 flex-row items-center gap-3 border-warning/40 bg-warning/10 p-4">
                <LucideIcon name="TriangleAlert" size={18} className="text-warning" />
                <Text className="flex-1 text-sm text-foreground">
                  Ajoutez vos revenus récurrents pour calculer votre budget quotidien.
                </Text>
                <LucideIcon name="ChevronRight" size={18} className="text-muted-foreground" />
              </Card>
            </Pressable>
          ) : null}

          {/* Hero: what's left to spend today */}
          <View className="rounded-2xl bg-primary p-6">
            <Text className="text-sm font-medium text-primary-foreground/70">
              {overspent ? 'Dépassement du jour' : 'Vous pouvez encore dépenser'}
            </Text>
            <Text
              className={cn(
                'mt-1 text-5xl font-display tracking-tight',
                overspent ? 'text-destructive' : 'text-primary-foreground'
              )}
              adjustsFontSizeToFit
              numberOfLines={1}>
              {formatMoney(available)}
            </Text>
            <ProgressBar
              value={allowance > 0 ? spent / allowance : spent > 0 ? 1 : 0}
              tone={overspent ? 'destructive' : 'default'}
              className="mt-5 bg-primary-foreground/15"
              barClassName={overspent ? undefined : 'bg-primary-foreground'}
            />
            <View className="mt-3 flex-row justify-between">
              <Text className="text-xs text-primary-foreground/70">
                {formatMoney(Math.max(0, spent))} dépensés
              </Text>
              <Text className="text-xs text-primary-foreground/70">
                Budget du jour : {formatMoney(allowance)}
              </Text>
            </View>
            {overspent ? (
              <Text className="mt-3 text-xs leading-5 text-primary-foreground/80">
                Pas de panique : ce dépassement sera réparti sur les{' '}
                {Math.max(1, todayBudget.daysLeft - 1)} jours restants de la période.
              </Text>
            ) : null}
          </View>

          {/* Next 3 days */}
          <SectionTitle title="Les prochains jours" />
          <View className="flex-row gap-3">
            {upcoming.map((d, i) => (
              <UpcomingCard key={d.day} day={d} label={i === 0 ? 'Demain' : formatWeekdayShort(d.day)} />
            ))}
          </View>
          <Text className="mt-2 px-1 text-xs text-muted-foreground">
            Montant disponible chaque jour si vous ne dépensez plus rien aujourd'hui.
          </Text>

          {/* Today's entries */}
          <SectionTitle
            title="Dépenses du jour"
            right={
              todayTransactions.length > 0 ? (
                <Text className="text-xs text-muted-foreground">
                  {todayTransactions.length} {todayTransactions.length > 1 ? 'opérations' : 'opération'}
                </Text>
              ) : null
            }
          />
          <Card className="overflow-hidden">
            {todayTransactions.length === 0 ? (
              <Pressable
                onPress={() => router.push('/transaction')}
                className="items-center px-6 py-8 active:bg-accent">
                <View className="mb-3 h-11 w-11 items-center justify-center rounded-full bg-muted">
                  <LucideIcon name="Receipt" size={20} className="text-muted-foreground" />
                </View>
                <Text className="text-sm font-medium text-foreground">Rien de noté aujourd'hui</Text>
                <Text className="mt-1 text-center text-xs text-muted-foreground">
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
                <Text className="text-sm text-muted-foreground">
                  {formatShortDay(summary.period.start)} → {formatShortDay(summary.period.end)}
                </Text>
              </View>
              <Text className="text-xs font-medium text-muted-foreground">
                Jour {summary.daysElapsed}/{summary.period.totalDays}
              </Text>
            </View>

            <View className="mt-4 flex-row items-baseline gap-2">
              <Text
                className={cn(
                  'text-3xl font-display tracking-tight',
                  summary.remaining < 0 ? 'text-destructive' : 'text-foreground'
                )}>
                {formatMoney(summary.remaining)}
              </Text>
              <Text className="text-sm text-muted-foreground">
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
            <Text className="mt-2 text-xs text-muted-foreground">
              Le trait indique où vous devriez en être aujourd'hui.
              {summary.prorated
                ? ' Première période : le budget est calculé à partir du jour où vous avez commencé.'
                : ''}
            </Text>

            <View className="mt-5 flex-row border-t border-border pt-4">
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
        className="absolute bottom-6 right-5 h-14 flex-row items-center gap-2 rounded-full bg-primary px-5 shadow-lg shadow-foreground/20 active:opacity-90">
        <LucideIcon name="Plus" size={20} className="text-primary-foreground" />
        <Text className="text-sm font-semibold text-primary-foreground">Dépense</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function UpcomingCard({ day, label }: { day: DayBudget; label: string }) {
  const newPeriod = day.day === day.period.start;
  const negative = day.available < 0;
  return (
    <Card className="flex-1 p-3.5">
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
      <Text className="text-[11px] text-muted-foreground/70">{formatShortDay(day.day)}</Text>
      <Text
        className={cn(
          'mt-2 text-lg font-display tracking-tight',
          negative ? 'text-destructive' : 'text-foreground'
        )}
        adjustsFontSizeToFit
        numberOfLines={1}>
        {formatMoneyRounded(day.available)}
      </Text>
      {newPeriod ? (
        <Text className="mt-1 text-[10px] font-medium uppercase tracking-wide text-success">
          Nouvelle période
        </Text>
      ) : day.spent !== 0 ? (
        <Text className="mt-1 text-[10px] text-muted-foreground">
          {formatMoneyRounded(day.spent)} prévus
        </Text>
      ) : null}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-[11px] text-muted-foreground">{label}</Text>
      <Text className="mt-0.5 text-sm font-semibold text-foreground">{value}</Text>
    </View>
  );
}
