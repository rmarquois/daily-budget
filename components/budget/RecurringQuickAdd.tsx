import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { FlowType } from '@/lib/budget/types';
import { parseAmount } from '@/lib/format';
import LucideIcon from '@/lib/icons/LucideIcon';

interface RecurringQuickAddProps {
  type: FlowType;
  suggestions: string[];
  onAdd: (label: string, amount: number) => void;
}

/** Inline "name + amount" form used during onboarding. */
export function RecurringQuickAdd({ type, suggestions, onAdd }: RecurringQuickAddProps) {
  const [label, setLabel] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const parsed = parseAmount(amount);
  const canAdd = !!parsed && label.trim().length > 0;

  const submit = () => {
    if (!canAdd || !parsed) return;
    onAdd(label.trim(), parsed);
    setLabel('');
    setAmount('');
  };

  return (
    <View>
      <View className="flex-row gap-2">
        <Input
          className="flex-1"
          value={label}
          onChangeText={setLabel}
          placeholder={type === 'income' ? 'Ex. Salaire' : 'Ex. Loyer'}
        />
        <View className="w-28 flex-row items-center rounded-md border border-input pr-3">
          <Input
            className="flex-1 border-0 text-right"
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^0-9.,]/g, ''))}
            placeholder="0"
            keyboardType="decimal-pad"
            inputMode="decimal"
            onSubmitEditing={submit}
          />
          <Text className="text-sm text-muted-foreground">€</Text>
        </View>
        <Button size="icon" onPress={submit} disabled={!canAdd} accessibilityLabel="Ajouter">
          <LucideIcon name="Plus" size={18} className="text-primary-foreground" />
        </Button>
      </View>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {suggestions.map((s) => (
          <Pressable
            key={s}
            onPress={() => setLabel(s)}
            className="rounded-full bg-muted px-3 py-1.5 active:opacity-70">
            <Text className="text-xs text-muted-foreground">{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
