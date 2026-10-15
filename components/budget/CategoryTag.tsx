import * as React from 'react'
import { Pressable } from 'react-native'

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
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: category.color }}
      className={cn(
        'flex-row items-center gap-1.5 rounded-full px-3 py-2',
        activeCategoryId !== undefined && activeCategoryId !== category.id
          ? 'opacity-60'
          : undefined
      )}
    >
      <LucideIcon name={category.icon} size={14} className="text-black" />
      <Text className="text-sm text-black">{category.label}</Text>
    </Pressable>
  )
}
