import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmountInput } from '@/components/budget/AmountInput';
import { FieldLabel } from '@/components/budget/FieldLabel';
import { SegmentedControl } from '@/components/budget/SegmentedControl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/budget/categories';
import { addDays, formatRelativeDay, todayKey } from '@/lib/budget/dates';
import { useBudgetStore } from '@/lib/budget/store';
import type { FlowType } from '@/lib/budget/types';
import { amountToInput, parseAmount } from '@/lib/format';
import LucideIcon from '@/lib/icons/LucideIcon';
import { closeModal } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useBudgetStore((s) => (id ? s.transactions.find((t) => t.id === id) : undefined));
  const upsertTransaction = useBudgetStore((s) => s.upsertTransaction);
  const removeTransaction = useBudgetStore((s) => s.removeTransaction);

  const today = todayKey();
  const [type, setType] = React.useState<FlowType>(existing?.type ?? 'expense');
  const [amount, setAmount] = React.useState(existing ? amountToInput(existing.amount) : '');
  const [label, setLabel] = React.useState(existing?.label ?? '');
  const [categoryId, setCategoryId] = React.useState(existing?.categoryId ?? 'food');
  const [date, setDate] = React.useState(existing?.date ?? today);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const parsed = parseAmount(amount);

  const changeType = (next: FlowType) => {
    setType(next);
    setCategoryId(next === 'expense' ? 'food' : 'extra');
  };

  const save = () => {
    if (!parsed) return;
    upsertTransaction({ id: existing?.id, type, amount: parsed, label: label.trim(), categoryId, date });
    closeModal();
  };

  const remove = () => {
    if (!existing) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    removeTransaction(existing.id);
    closeModal();
  };

  const title = existing
    ? 'Modifier'
    : type === 'expense'
      ? 'Nouvelle dépense'
      : 'Nouvelle rentrée';

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title,
          headerLeft: () => (
            <Pressable onPress={() => closeModal()} className="ml-2 h-10 justify-center px-2">
              <Text className="text-sm text-muted-foreground">Annuler</Text>
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerClassName="px-5 pb-6 pt-4 web:mx-auto web:w-full web:max-w-xl"
          keyboardShouldPersistTaps="handled">
          <SegmentedControl
            value={type}
            onChange={changeType}
            options={[
              { value: 'expense', label: 'Dépense' },
              { value: 'income', label: 'Rentrée d’argent' },
            ]}
          />

          <View className="py-8">
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              autoFocus={!existing}
              tone={type === 'income' ? 'success' : 'default'}
            />
          </View>

          <FieldLabel>Description</FieldLabel>
          <Input
            value={label}
            onChangeText={setLabel}
            placeholder={type === 'expense' ? 'Ex. Boulangerie' : 'Ex. Vente Vinted'}
            returnKeyType="done"
            onSubmitEditing={save}
          />

          <View className="mt-6">
            <FieldLabel>Catégorie</FieldLabel>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((c) => {
                const active = c.id === categoryId;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCategoryId(c.id)}
                    className={cn(
                      'flex-row items-center gap-1.5 rounded-full border px-3 py-2',
                      active
                        ? 'border-primary bg-primary'
                        : 'border-border bg-background active:bg-accent'
                    )}>
                    <LucideIcon
                      name={c.icon}
                      size={14}
                      className={active ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                    <Text
                      className={cn(
                        'text-sm',
                        active ? 'font-medium text-primary-foreground' : 'text-foreground'
                      )}>
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mt-6">
            <FieldLabel>Date</FieldLabel>
            <View className="h-12 flex-row items-center rounded-md border border-input">
              <Pressable
                onPress={() => setDate((d) => addDays(d, -1))}
                accessibilityLabel="Jour précédent"
                className="h-full w-12 items-center justify-center active:bg-accent">
                <LucideIcon name="ChevronLeft" size={18} className="text-foreground" />
              </Pressable>
              <Pressable onPress={() => setDate(today)} className="flex-1 items-center">
                <Text className="text-sm font-medium text-foreground">
                  {formatRelativeDay(date, today)}
                </Text>
                {date !== today ? (
                  <Text className="text-[11px] text-muted-foreground">
                    Toucher pour revenir à aujourd'hui
                  </Text>
                ) : null}
              </Pressable>
              <Pressable
                onPress={() => setDate((d) => addDays(d, 1))}
                accessibilityLabel="Jour suivant"
                className="h-full w-12 items-center justify-center active:bg-accent">
                <LucideIcon name="ChevronRight" size={18} className="text-foreground" />
              </Pressable>
            </View>
            {date > today ? (
              <Text className="mt-2 text-xs text-muted-foreground">
                Dépense prévue : elle sera déduite de ce jour-là.
              </Text>
            ) : null}
          </View>
        </ScrollView>

        <View className="gap-2 border-t border-border px-5 pb-3 pt-3 web:mx-auto web:w-full web:max-w-xl">
          <Button size="lg" onPress={save} disabled={!parsed}>
            <Text>{existing ? 'Enregistrer' : 'Ajouter'}</Text>
          </Button>
          {existing ? (
            <Button variant="ghost" onPress={remove}>
              <Text className="text-destructive">
                {confirmDelete ? 'Confirmer la suppression' : 'Supprimer'}
              </Text>
            </Button>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
