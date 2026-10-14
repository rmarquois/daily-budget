import { router } from 'expo-router'
import * as React from 'react'
import { Pressable, View } from 'react-native'

import { RecurringRow } from '@/components/budget/RecurringRow'
import { SectionTitle } from '@/components/budget/SectionTitle'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import type { FlowType, RecurringItem } from '@/lib/budget/types'
import LucideIcon from '@/lib/icons/LucideIcon'

export function RecurringSection({ type, items }: { type: FlowType; items: RecurringItem[] }) {
  const add = () => router.push({ pathname: '/recurring', params: { type } })

  return (
    <>
      <SectionTitle
        title={type === 'income' ? 'Mes revenus' : 'Mes dépenses fixes'}
        right={
          <Pressable
            onPress={add}
            className="active:bg-accent flex-row items-center gap-1 rounded-md px-2 py-1"
          >
            <LucideIcon name="Plus" size={14} className="text-foreground" />
            <Text className="text-foreground text-xs font-medium">Ajouter</Text>
          </Pressable>
        }
      />
      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <View className="items-center justify-center p-4">
            <View className="bg-muted mb-3 h-12 w-12 items-center justify-center rounded-full">
              <LucideIcon name="Inbox" size={22} className="text-muted-foreground" />
            </View>
            <Text className="text-foreground text-sm font-medium">
              {type === 'income' ? 'Aucun revenu' : 'Aucune dépense fixe'}
            </Text>
            <Text className="text-muted-foreground mt-1 text-center text-xs">
              {type === 'income'
                ? 'Retrouvez ici l’ensemble de vos entrées d’argent régulières.'
                : 'Retrouvez ici vos charges et prélèvements réguliers.'}
            </Text>
          </View>
        ) : (
          items.map((item, i) => (
            <RecurringRow
              key={item.id}
              item={item}
              isLast={i === items.length - 1}
              onPress={() => router.push({ pathname: '/recurring', params: { id: item.id } })}
            />
          ))
        )}
      </Card>
    </>
  )
}
