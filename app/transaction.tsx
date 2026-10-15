import { Stack, useLocalSearchParams } from 'expo-router'
import * as React from 'react'
import { Pressable, ScrollView, View } from 'react-native'

import { AmountInput } from '@/components/budget/AmountInput'
import { CategoryTag } from '@/components/budget/CategoryTag'
import { FieldLabel } from '@/components/budget/FieldLabel'
import { SegmentedControl } from '@/components/budget/SegmentedControl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/budget/categories'
import { addDays, formatRelativeDay, todayKey } from '@/lib/budget/dates'
import { getPeriod } from '@/lib/budget/engine'
import { useBudgetStore } from '@/lib/budget/store'
import type { FlowType } from '@/lib/budget/types'
import { amountToInput, parseAmount } from '@/lib/format'
import LucideIcon from '@/lib/icons/LucideIcon'
import { closeModal } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export default function TransactionScreen() {
  const { id, edit } = useLocalSearchParams<{ id?: string; edit?: string }>()
  const periodStartDay = useBudgetStore((s) => s.periodStartDay)
  const existing = useBudgetStore((s) => (id ? s.transactions.find((t) => t.id === id) : undefined))
  const upsertTransaction = useBudgetStore((s) => s.upsertTransaction)
  const removeTransaction = useBudgetStore((s) => s.removeTransaction)

  const today = todayKey()
  const [type, setType] = React.useState<FlowType>(existing?.type ?? 'expense')
  const [amount, setAmount] = React.useState(existing ? amountToInput(existing.amount) : '')
  const [label, setLabel] = React.useState(existing?.label ?? '')
  const [categoryId, setCategoryId] = React.useState(existing?.categoryId ?? 'food')
  const [date, setDate] = React.useState(existing?.date ?? today)
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const title = existing ? 'Modifier' : type === 'expense' ? 'Nouvelle dépense' : 'Nouvelle rentrée'

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const parsed = parseAmount(amount)

  const period = getPeriod(date, periodStartDay)
  const canGoPrev = date > period.start
  const canGoNext = date < today

  const changeType = (next: FlowType) => {
    setType(next)
    setCategoryId(next === 'expense' ? 'food' : 'sales')
  }

  const save = () => {
    if (!parsed) return
    upsertTransaction({
      id: existing?.id,
      type,
      amount: parsed,
      label: label.trim(),
      categoryId,
      date,
    })
    closeModal()
  }

  const remove = () => {
    if (!existing) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    removeTransaction(existing.id)
    closeModal()
  }

  return (
    <View className="bg-background py-safe flex-1">
      <Stack.Screen
        options={{
          title,
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-6 pt-4"
        keyboardShouldPersistTaps="handled"
      >
        {edit !== 'true' && (
          <SegmentedControl
            value={type}
            onChange={changeType}
            options={[
              { value: 'expense', label: 'Dépense' },
              { value: 'income', label: 'Revenu' },
            ]}
          />
        )}

        <View className="py-8">
          <AmountInput value={amount} onChangeText={setAmount} autoFocus={!existing} />
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
            {categories.map((c) => (
              <CategoryTag
                key={c.id}
                category={c}
                activeCategoryId={categoryId}
                onPress={() => setCategoryId(c.id)}
              />
            ))}
          </View>
        </View>

        <View className="mt-6">
          <FieldLabel>Date</FieldLabel>
          <View className="border-input h-12 flex-row items-center rounded-md border">
            <Pressable
              onPress={() => setDate((d) => addDays(d, -1))}
              disabled={!canGoPrev}
              accessibilityLabel="Jour précédent"
              className={cn(
                'h-full w-12 items-center justify-center',
                canGoPrev ? 'active:bg-accent' : undefined
              )}
            >
              <LucideIcon
                name="ChevronLeft"
                size={18}
                className={!canGoPrev ? 'text-muted-foreground' : 'text-foreground'}
              />
            </Pressable>
            <Pressable onPress={() => setDate(today)} className="flex-1 items-center">
              <Text className="text-foreground text-sm font-medium">
                {formatRelativeDay(date, today)}
              </Text>
              {date !== today ? (
                <Text className="text-muted-foreground text-[11px]">
                  Toucher pour revenir à aujourd'hui
                </Text>
              ) : null}
            </Pressable>
            <Pressable
              onPress={() => setDate((d) => addDays(d, 1))}
              disabled={!canGoNext}
              accessibilityLabel="Jour suivant"
              className={cn(
                'h-full w-12 items-center justify-center',
                canGoNext ? 'active:bg-accent' : undefined
              )}
            >
              <LucideIcon
                name="ChevronRight"
                size={18}
                className={!canGoNext ? 'text-muted-foreground' : 'text-foreground'}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View className="border-border gap-2 border-t px-5 pb-3 pt-3">
        <Button size="lg" onPress={save} disabled={!parsed}>
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
