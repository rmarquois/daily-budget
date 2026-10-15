import { Stack, useLocalSearchParams } from 'expo-router'
import * as React from 'react'
import { ScrollView, View } from 'react-native'

import { AmountInput } from '@/components/budget/AmountInput'
import { CategoryTag } from '@/components/budget/CategoryTag'
import { FieldLabel } from '@/components/budget/FieldLabel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { RECURRING_EXPENSE_CATEGORIES, RECURRING_INCOME_CATEGORIES } from '@/lib/budget/categories'
import { useBudgetStore } from '@/lib/budget/store'
import type { FlowType } from '@/lib/budget/types'
import { amountToInput, parseAmount } from '@/lib/format'
import { closeModal } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export default function RecurringScreen() {
  const params = useLocalSearchParams<{ id?: string; type?: FlowType }>()
  const existing = useBudgetStore((s) =>
    params.id ? s.recurring.find((r) => r.id === params.id) : undefined
  )
  const upsertRecurring = useBudgetStore((s) => s.upsertRecurring)
  const removeRecurring = useBudgetStore((s) => s.removeRecurring)

  const type = existing?.type ?? (params.type === 'income' ? 'income' : 'expense')

  const [label, setLabel] = React.useState(existing?.label ?? '')
  const [categoryId, setCategoryId] = React.useState(existing?.categoryId ?? 'salary')
  const [amount, setAmount] = React.useState(existing ? amountToInput(existing.amount) : '')
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const parsed = parseAmount(amount)
  const canSave = !!parsed && label.trim().length > 0

  const save = () => {
    if (!canSave || !parsed) return
    upsertRecurring({ id: existing?.id, type, label: label.trim(), categoryId, amount: parsed })
    closeModal('/budget')
  }

  const remove = () => {
    if (!existing) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    removeRecurring(existing.id)
    closeModal('/budget')
  }

  return (
    <View className="bg-background py-safe flex-1">
      <Stack.Screen
        options={{
          title: existing
            ? 'Modifier'
            : type === 'income'
              ? 'Revenu récurrent'
              : 'Dépense récurrente',
        }}
      />
      <ScrollView contentContainerClassName="px-5 pb-6 pt-4" keyboardShouldPersistTaps="handled">
        <View className="py-8">
          <AmountInput value={amount} onChangeText={setAmount} autoFocus={!existing} />
          <Text className="text-muted-foreground mt-1 text-center text-xs">par période</Text>
        </View>

        <FieldLabel>Description</FieldLabel>
        <Input
          value={label}
          onChangeText={setLabel}
          placeholder={type === 'income' ? 'Ex. Salaire principal' : 'Ex. Loyer appartement'}
          returnKeyType="done"
          onSubmitEditing={save}
        />
        <View className="mt-3 flex-row flex-wrap gap-2">
          {(type === 'income' ? RECURRING_INCOME_CATEGORIES : RECURRING_EXPENSE_CATEGORIES).map(
            (c) => (
              <CategoryTag
                key={c.id}
                category={c}
                activeCategoryId={categoryId}
                onPress={() => setCategoryId(c.id)}
              />
            )
          )}
        </View>
      </ScrollView>

      <View className="border-border gap-2 border-t px-5 pb-3 pt-3">
        <Button size="lg" onPress={save} disabled={!canSave}>
          <Text>{existing ? 'Enregistrer' : 'Ajouter'}</Text>
        </Button>
        {existing ? (
          <Button variant="ghost" onPress={remove}>
            <Text className={cn('text-destructive', confirmDelete ? 'font-bold' : undefined)}>
              {confirmDelete ? 'Confirmer la suppression' : 'Supprimer'}
            </Text>
          </Button>
        ) : null}
      </View>
    </View>
  )
}
