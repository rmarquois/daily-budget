import type { DayKey } from './dates';

export type FlowType = 'income' | 'expense';

/** Something that comes in or goes out every period (salary, rent, subscriptions…). */
export interface RecurringItem {
  id: string;
  type: FlowType;
  label: string;
  amount: number;
}

/** A one-off entry recorded day to day. Income entries add to the remaining budget. */
export interface Transaction {
  id: string;
  type: FlowType;
  label: string;
  amount: number;
  categoryId: string;
  date: DayKey;
  createdAt: number;
}

