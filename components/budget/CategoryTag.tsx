import * as React from 'react'
import { Pressable } from 'react-native'

import { Text } from '@/components/ui/text'
import { CategoryDef } from '@/lib/budget/categories'
import LucideIcon from '@/lib/icons/LucideIcon'
import { cn } from '@/lib/utils'

interface CategoryTagProps {
  category: CategoryDef
  active: boolean
  onPress: () => void
}

export function CategoryTag({ category, active, onPress }: CategoryTagProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-1.5 rounded-full border px-3 py-2',
        active ? 'border-primary bg-primary' : 'border-border bg-background active:bg-accent'
      )}
    >
      <LucideIcon
        name={category.icon}
        size={14}
        className={active ? 'text-primary-foreground' : 'text-muted-foreground'}
      />
      <Text
        className={cn(
          'text-sm',
          active ? 'text-primary-foreground font-medium' : 'text-foreground'
        )}
      >
        {category.label}
      </Text>
    </Pressable>
  )
}
