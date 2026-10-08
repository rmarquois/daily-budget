import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { addDays, todayKey } from './dates';
import type { RecurringItem, Transaction } from './types';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

interface BudgetState {
  onboarded: boolean;
  /** Day of the month the budget period starts (1–31). */
  periodStartDay: number;
  recurring: RecurringItem[];
  transactions: Transaction[];
  /** Day the user started tracking; the first period's budget is prorated from here. */
  startedOn: string | null;
  /** True while the example dataset is loaded, so the UI can flag it. */
  isDemo: boolean;

  completeOnboarding: () => void;
  setPeriodStartDay: (day: number) => void;
  upsertRecurring: (item: Omit<RecurringItem, 'id'> & { id?: string }) => void;
  removeRecurring: (id: string) => void;
  upsertTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'> & { id?: string }) => void;
  removeTransaction: (id: string) => void;
  loadDemo: () => void;
  resetAll: () => void;
}

const initialData = {
  onboarded: false,
  periodStartDay: 1,
  recurring: [] as RecurringItem[],
  transactions: [] as Transaction[],
  startedOn: null as string | null,
  isDemo: false,
};

function buildDemo() {
  const today = todayKey();
  const tx = (
    daysAgo: number,
    label: string,
    amount: number,
    categoryId: string,
    type: Transaction['type'] = 'expense'
  ): Transaction => ({
    id: uid(),
    type,
    label,
    amount,
    categoryId,
    date: addDays(today, -daysAgo),
    createdAt: Date.now() - daysAgo * 86_400_000,
  });
  return {
    periodStartDay: 25,
    recurring: [
      { id: uid(), type: 'income', label: 'Salaire', amount: 2350 },
      { id: uid(), type: 'expense', label: 'Loyer', amount: 780 },
      { id: uid(), type: 'expense', label: 'Électricité & internet', amount: 95 },
      { id: uid(), type: 'expense', label: 'Téléphone', amount: 15 },
      { id: uid(), type: 'expense', label: 'Assurances', amount: 60 },
      { id: uid(), type: 'expense', label: 'Épargne', amount: 300 },
    ] as RecurringItem[],
    transactions: [
      tx(0, 'Boulangerie', 4.6, 'food'),
      tx(0, 'Café avec Léa', 3.8, 'coffee'),
      tx(1, 'Courses Monoprix', 42.15, 'food'),
      tx(1, 'Pass Navigo', 22.8, 'transport'),
      tx(2, 'Cinéma', 12.5, 'leisure'),
      tx(3, 'Restaurant italien', 28, 'restaurant'),
      tx(4, 'Pharmacie', 9.9, 'health'),
      tx(5, 'Remboursement Tom', 15, 'refund', 'income'),
      tx(5, 'Livre', 18.9, 'shopping'),
    ],
  };
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      ...initialData,

      completeOnboarding: () => set({ onboarded: true, startedOn: todayKey() }),
      setPeriodStartDay: (day) => set({ periodStartDay: Math.min(31, Math.max(1, day)) }),

      upsertRecurring: ({ id, ...rest }) =>
        set((s) =>
          id
            ? { recurring: s.recurring.map((r) => (r.id === id ? { ...r, ...rest } : r)) }
            : { recurring: [...s.recurring, { id: uid(), ...rest }] }
        ),
      removeRecurring: (id) => set((s) => ({ recurring: s.recurring.filter((r) => r.id !== id) })),

      upsertTransaction: ({ id, ...rest }) =>
        set((s) =>
          id
            ? {
                transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...rest } : t)),
              }
            : { transactions: [{ id: uid(), createdAt: Date.now(), ...rest }, ...s.transactions] }
        ),
      removeTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      loadDemo: () => set({ ...buildDemo(), startedOn: null, isDemo: true, onboarded: true }),
      resetAll: () => set({ ...initialData }),
    }),
    {
      name: 'simple-daily-budget',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useBudgetHydrated() {
  const [hydrated, setHydrated] = useState(() => useBudgetStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useBudgetStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useBudgetStore.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}
