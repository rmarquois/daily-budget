import { useEffect, useMemo, useState } from 'react';
import { addDays, todayKey, type DayKey } from './dates';
import { computeDayBudget, computePeriodSummary } from './engine';
import { useBudgetStore } from './store';

/** Current day key, refreshed when the date changes (e.g. app left open past midnight). */
export function useToday(): DayKey {
  const [today, setToday] = useState(todayKey);
  useEffect(() => {
    const id = setInterval(() => {
      const next = todayKey();
      setToday((prev) => (prev === next ? prev : next));
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  return today;
}

export function useBudgetOverview(today: DayKey, upcomingDays = 3) {
  const periodStartDay = useBudgetStore((s) => s.periodStartDay);
  const recurring = useBudgetStore((s) => s.recurring);
  const transactions = useBudgetStore((s) => s.transactions);
  const startedOn = useBudgetStore((s) => s.startedOn);

  return useMemo(() => {
    const todayBudget = computeDayBudget(today, periodStartDay, recurring, transactions, startedOn);
    const upcoming = Array.from({ length: upcomingDays }, (_, i) =>
      computeDayBudget(addDays(today, i + 1), periodStartDay, recurring, transactions, startedOn)
    );
    const summary = computePeriodSummary(today, periodStartDay, recurring, transactions, startedOn);
    const todayTransactions = transactions
      .filter((t) => t.date === today)
      .sort((a, b) => b.createdAt - a.createdAt);
    return { todayBudget, upcoming, summary, todayTransactions };
  }, [today, periodStartDay, recurring, transactions, startedOn, upcomingDays]);
}
