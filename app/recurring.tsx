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
import { useBudgetStore } from '@/lib/budget/store';
import type { FlowType } from '@/lib/budget/types';
import { amountToInput, parseAmount } from '@/lib/format';
import { closeModal } from '@/lib/navigation';

const SUGGESTIONS: Record<FlowType, string[]> = {
  income: ['Salaire', 'Prime', 'Allocations', 'Loyer perçu', 'Pension'],
  expense: ['Loyer', 'Crédit', 'Électricité', 'Internet', 'Téléphone', 'Assurance', 'Abonnements', 'Épargne'],
};

export default function RecurringScreen() {
  const params = useLocalSearchParams<{ id?: string; type?: FlowType }>();
  const existing = useBudgetStore((s) =>
    params.id ? s.recurring.find((r) => r.id === params.id) : undefined
  );
  const upsertRecurring = useBudgetStore((s) => s.upsertRecurring);
  const removeRecurring = useBudgetStore((s) => s.removeRecurring);

  const [type, setType] = React.useState<FlowType>(
    existing?.type ?? (params.type === 'income' ? 'income' : 'expense')
  );
  const [label, setLabel] = React.useState(existing?.label ?? '');
  const [amount, setAmount] = React.useState(existing ? amountToInput(existing.amount) : '');
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const parsed = parseAmount(amount);
  const canSave = !!parsed && label.trim().length > 0;

  const save = () => {
    if (!canSave || !parsed) return;
    upsertRecurring({ id: existing?.id, type, label: label.trim(), amount: parsed });
    closeModal('/budget');
  };

  const remove = () => {
    if (!existing) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    removeRecurring(existing.id);
    closeModal('/budget');
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: existing
            ? 'Modifier'
            : type === 'income'
              ? 'Revenu récurrent'
              : 'Dépense récurrente',
          headerLeft: () => (
            <Pressable onPress={() => closeModal('/budget')} className="ml-2 h-10 justify-center px-2">
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
            onChange={setType}
            options={[
              { value: 'income', label: 'Revenu' },
              { value: 'expense', label: 'Dépense fixe' },
            ]}
          />

          <View className="py-8">
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              autoFocus={!existing}
              tone={type === 'income' ? 'success' : 'default'}
            />
            <Text className="mt-1 text-center text-xs text-muted-foreground">par période</Text>
          </View>

          <FieldLabel>Nom</FieldLabel>
          <Input
            value={label}
            onChangeText={setLabel}
            placeholder={type === 'income' ? 'Ex. Salaire' : 'Ex. Loyer'}
            returnKeyType="done"
            onSubmitEditing={save}
          />
          <View className="mt-3 flex-row flex-wrap gap-2">
            {SUGGESTIONS[type].map((s) => (
              <Pressable
                key={s}
                onPress={() => setLabel(s)}
                className="rounded-full bg-muted px-3 py-1.5 active:opacity-70">
                <Text className="text-xs text-muted-foreground">{s}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View className="gap-2 border-t border-border px-5 pb-3 pt-3 web:mx-auto web:w-full web:max-w-xl">
          <Button size="lg" onPress={save} disabled={!canSave}>
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
