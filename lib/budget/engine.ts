import { addDays, daysInMonth, diffDays, fromDayKey, toDayKey, type DayKey } from './dates';
import type { RecurringItem, Transaction } from './types';

export interface Period {
  /** First day of the period (inclusive). */
  start: DayKey;
  /** Last day of the period (inclusive). */
  end: DayKey;
  totalDays: number;
}

/** The start day of a period in a given month, clamped (e.g. 30 → 28 in February). */
function periodStartIn(year: number, monthIndex: number, startDay: number): DayKey {
  const day = Math.min(startDay, daysInMonth(year, monthIndex));
  return toDayKey(new Date(year, monthIndex, day));
}

/**
 * Returns the budget period containing `day`.
 * With startDay = 25, the period runs from the 25th to the 24th of the next month.
 */
export function getPeriod(day: DayKey, startDay: number): Period {
  const d = fromDayKey(day);
  const y = d.getFullYear();
  const m = d.getMonth();
  const thisMonthStart = periodStartIn(y, m, startDay);

  let start: DayKey;
  let nextStart: DayKey;
  if (day >= thisMonthStart) {
    start = thisMonthStart;
    nextStart = periodStartIn(m === 11 ? y + 1 : y, (m + 1) % 12, startDay);
  } else {
    start = periodStartIn(m === 0 ? y - 1 : y, (m + 11) % 12, startDay);
    nextStart = thisMonthStart;
  }
  const end = addDays(nextStart, -1);
  return { start, end, totalDays: diffDays(start, nextStart) };
}

export function sumRecurring(items: RecurringItem[]) {
  const income = items.filter((i) => i.type === 'income').reduce((s, i) => s + i.amount, 0);
  const expense = items.filter((i) => i.type === 'expense').reduce((s, i) => s + i.amount, 0);
  return { income, expense, budget: income - expense };
}

/**
 * Budget available for a period. If tracking started mid-period (first use of the app),
 * only the share of days from `startedOn` onward is counted — the days before were
 * presumably already spent without being recorded.
 */
export function periodBudget(period: Period, budget: number, startedOn?: DayKey | null): number {
  if (!startedOn || startedOn <= period.start || startedOn > period.end) return budget;
  const trackedDays = diffDays(startedOn, period.end) + 1;
  return (budget * trackedDays) / period.totalDays;
}

/** Net spending of a transaction: expenses are positive, extra income is negative. */
const netOf = (t: Transaction) => (t.type === 'expense' ? t.amount : -t.amount);

export interface DayBudget {
  day: DayKey;
  period: Period;
  /** What you may spend per day from this day on, given what's left. */
  allowance: number;
  /** Net amount recorded on this day. */
  spent: number;
  /** allowance - spent: what's still available on this day. */
  available: number;
  /** Days left in the period, including this day. */
  daysLeft: number;
  /** Budget remaining at the start of this day. */
  remainingAtStart: number;
}

/**
 * Daily Budget logic: whatever is left for the period is spread evenly across the
 * remaining days. Spend less today and tomorrow's amount grows; overspend and it shrinks.
 */
export function computeDayBudget(
  day: DayKey,
  startDay: number,
  recurring: RecurringItem[],
  transactions: Transaction[],
  startedOn?: DayKey | null
): DayBudget {
  const period = getPeriod(day, startDay);
  const budget = periodBudget(period, sumRecurring(recurring).budget, startedOn);

  let spentBefore = 0;
  let spent = 0;
  for (const t of transactions) {
    if (t.date < period.start || t.date > period.end) continue;
    if (t.date < day) spentBefore += netOf(t);
    else if (t.date === day) spent += netOf(t);
  }

  const daysLeft = diffDays(day, period.end) + 1;
  const remainingAtStart = budget - spentBefore;
  const allowance = remainingAtStart / daysLeft;
  return {
    day,
    period,
    allowance,
    spent,
    available: allowance - spent,
    daysLeft,
    remainingAtStart,
  };
}

export interface PeriodSummary {
  period: Period;
  /** Budget for this period (prorated if tracking started mid-period). */
  budget: number;
  /** True when `budget` was prorated because tracking began mid-period. */
  prorated: boolean;
  income: number;
  fixedExpenses: number;
  spent: number;
  remaining: number;
  daysElapsed: number;
}

export function computePeriodSummary(
  day: DayKey,
  startDay: number,
  recurring: RecurringItem[],
  transactions: Transaction[],
  startedOn?: DayKey | null
): PeriodSummary {
  const period = getPeriod(day, startDay);
  const { income, expense, budget: fullBudget } = sumRecurring(recurring);
  const budget = periodBudget(period, fullBudget, startedOn);
  const spent = transactions
    .filter((t) => t.date >= period.start && t.date <= period.end)
    .reduce((s, t) => s + netOf(t), 0);
  return {
    period,
    budget,
    prorated: budget !== fullBudget,
    income,
    fixedExpenses: expense,
    spent,
    remaining: budget - spent,
    daysElapsed: diffDays(period.start, day) + 1,
  };
}
