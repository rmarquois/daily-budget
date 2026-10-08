import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DemoBadge } from '@/components/budget/DemoBadge';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { TransactionRow } from '@/components/budget/TransactionRow';
import { Text } from '@/components/ui/text';
import { addDays, formatRelativeDay, formatShortDay, type DayKey } from '@/lib/budget/dates';
import { getPeriod } from '@/lib/budget/engine';
import { useToday } from '@/lib/budget/hooks';
import { useBudgetStore } from '@/lib/budget/store';
import type { Transaction } from '@/lib/budget/types';
import { formatMoney } from '@/lib/format';
import LucideIcon from '@/lib/icons/LucideIcon';
import { cn } from '@/lib/utils';

interface DaySection {
  day: DayKey;
  net: number;
  data: Transaction[];
}

export default function HistoryScreen() {
  const today = useToday();
  const transactions = useBudgetStore((s) => s.transactions);
  const periodStartDay = useBudgetStore((s) => s.periodStartDay);
  const [anchor, setAnchor] = React.useState(today);
  const period = getPeriod(anchor, periodStartDay);
  const isCurrent = today >= period.start && today <= period.end;

  const { sections, total } = React.useMemo(() => {
    const byDay = new Map<DayKey, Transaction[]>();
    for (const t of transactions) {
      if (t.date < period.start || t.date > period.end) continue;
      const list = byDay.get(t.date) ?? [];
      list.push(t);
      byDay.set(t.date, list);
    }
    let sum = 0;
    const result: DaySection[] = [...byDay.entries()]
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([day, list]) => {
        const net = list.reduce((s, t) => s + (t.type === 'expense' ? t.amount : -t.amount), 0);
        sum += net;
        return { day, net, data: list.sort((a, b) => b.createdAt - a.createdAt) };
      });
    return { sections: result, total: sum };
  }, [transactions, period.start, period.end]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScreenHeader eyebrow="Vos opérations" title="Historique" right={<DemoBadge />} />

      <View className="mx-5 mb-2 flex-row items-center rounded-xl border border-border p-1.5">
        <Pressable
          onPress={() => setAnchor(addDays(period.start, -1))}
          accessibilityLabel="Période précédente"
          className="h-10 w-10 items-center justify-center rounded-lg active:bg-accent">
          <LucideIcon name="ChevronLeft" size={18} className="text-foreground" />
        </Pressable>
        <Pressable onPress={() => setAnchor(today)} className="flex-1 items-center">
          <Text className="text-sm font-semibold text-foreground">
            {formatShortDay(period.start)} – {formatShortDay(period.end)}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {isCurrent ? 'Période en cours' : 'Toucher pour revenir à aujourd’hui'} · {formatMoney(total)}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setAnchor(addDays(period.end, 1))}
          accessibilityLabel="Période suivante"
          className="h-10 w-10 items-center justify-center rounded-lg active:bg-accent">
          <LucideIcon name="ChevronRight" size={18} className="text-foreground" />
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(t) => t.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.content}
        renderSectionHeader={({ section }) => (
          <View className="mb-2 mt-5 flex-row items-center justify-between px-1">
            <Text className="text-sm font-semibold text-foreground">
              {formatRelativeDay(section.day, today)}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {section.net >= 0 ? '−' : '+'}
              {formatMoney(Math.abs(section.net))}
            </Text>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <View
            className={cn(
              'overflow-hidden border-x border-border bg-card',
              index === 0 && 'rounded-t-lg border-t',
              index === section.data.length - 1 && 'rounded-b-lg border-b'
            )}>
            <TransactionRow
              transaction={item}
              isLast={index === section.data.length - 1}
              onPress={() => router.push({ pathname: '/transaction', params: { id: item.id } })}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center px-8 py-16">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-muted">
              <LucideIcon name="Inbox" size={22} className="text-muted-foreground" />
            </View>
            <Text className="text-sm font-medium text-foreground">Aucune opération</Text>
            <Text className="mt-1 text-center text-xs text-muted-foreground">
              Les dépenses que vous notez sur cette période apparaîtront ici.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
});
