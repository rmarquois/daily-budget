import * as React from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { CategoryDef } from '@/lib/budget/categories'
import LucideIcon from '@/lib/icons/LucideIcon'
import { cn } from '@/lib/utils'

interface CategoryTagProps {
  category: CategoryDef
  activeCategoryId: string
  onPress: () => void
}

export function CategoryTag({ category, activeCategoryId, onPress }: CategoryTagProps) {
  const selected = activeCategoryId !== undefined && activeCategoryId !== category.id

  return (
    <Pressable
      onPress={onPress}
      className={'border-border flex-row items-center gap-2 rounded border px-3 py-2'}
    >
      <View
        className={cn(
          'h-12 w-12 items-center justify-center rounded-full',
          selected ? 'opacity-50' : undefined
        )}
        style={{ backgroundColor: category.color }}
      >
        <LucideIcon name={category.icon} size={24} className="text-white" />
      </View>
      <View className={cn('flex-1 gap-1', selected ? 'opacity-50' : undefined)}>
        <Text className="text-foreground text-sm">{category.label}</Text>
        <Text className="text-foreground text-sm">{category.description}</Text>
      </View>
    </Pressable>
  )
}
