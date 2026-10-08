import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DemoBadge } from '@/components/budget/DemoBadge';
import { RecurringRow } from '@/components/budget/RecurringRow';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { SectionTitle } from '@/components/budget/SectionTitle';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatShortDay } from '@/lib/budget/dates';
import { getPeriod, sumRecurring } from '@/lib/budget/engine';
import { useToday } from '@/lib/budget/hooks';
import { useBudgetStore } from '@/lib/budget/store';
import type { FlowType, RecurringItem } from '@/lib/budget/types';
import { formatMoney } from '@/lib/format';
import LucideIcon from '@/lib/icons/LucideIcon';
import { cn } from '@/lib/utils';

export default function BudgetScreen() {
  const today = useToday();
  const recurring = useBudgetStore((s) => s.recurring);
  const periodStartDay = useBudgetStore((s) => s.periodStartDay);
  const { income, expense, budget } = sumRecurring(recurring);
  const period = getPeriod(today, periodStartDay);

  const incomes = recurring.filter((r) => r.type === 'income');
  const expenses = recurring.filter((r) => r.type === 'expense');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Chaque période" title="Budget" right={<DemoBadge />} />

        <View className="px-5">
          <Card className="p-5">
            <Text className="text-sm text-muted-foreground">Reste pour vivre par période</Text>
            <Text
              className={cn(
                'mt-1 text-4xl font-display tracking-tight',
                budget < 0 ? 'text-destructive' : 'text-foreground'
              )}>
              {formatMoney(budget)}
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              Soit environ {formatMoney(budget / period.totalDays)} par jour du{' '}
              {formatShortDay(period.start)} au {formatShortDay(period.end)}
            </Text>

            <View className="mt-5 gap-2 border-t border-border pt-4">
              <Line label="Revenus" value={`+${formatMoney(income)}`} tone="success" />
              <Line label="Dépenses fixes" value={`−${formatMoney(expense)}`} />
            </View>
          </Card>

          <Section
            title="Revenus récurrents"
            type="income"
            items={incomes}
            empty="Ajoutez votre salaire et vos autres rentrées régulières."
          />
          <Section
            title="Dépenses récurrentes"
            type="expense"
            items={expenses}
            empty="Loyer, factures, abonnements, épargne… tout ce qui part chaque mois."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  type,
  items,
  empty,
}: {
  title: string;
  type: FlowType;
  items: RecurringItem[];
  empty: string;
}) {
  const add = () => router.push({ pathname: '/recurring', params: { type } });
  return (
    <>
      <SectionTitle
        title={title}
        right={
          <Pressable
            onPress={add}
            className="flex-row items-center gap-1 rounded-md px-2 py-1 active:bg-accent">
            <LucideIcon name="Plus" size={14} className="text-foreground" />
            <Text className="text-xs font-medium text-foreground">Ajouter</Text>
          </Pressable>
        }
      />
      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <Pressable onPress={add} className="px-4 py-5 active:bg-accent">
            <Text className="text-sm text-muted-foreground">{empty}</Text>
          </Pressable>
        ) : (
          items.map((item, i) => (
            <RecurringRow
              key={item.id}
              item={item}
              isLast={i === items.length - 1}
              onPress={() => router.push({ pathname: '/recurring', params: { id: item.id } })}
            />
          ))
        )}
      </Card>
    </>
  );
}

function Line({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <Text className={cn('text-sm font-medium', tone === 'success' ? 'text-success' : 'text-foreground')}>
        {value}
      </Text>
    </View>
  );
}
