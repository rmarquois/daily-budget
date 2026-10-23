import { Pressable, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface Option<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  secondary?: boolean
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  secondary = false,
}: SegmentedControlProps<T>) {
  return (
    <View
      className={cn(
        'flex-row rounded-lg p-1.5',
        secondary ? 'bg-card border-border border' : 'bg-muted'
      )}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            className={cn(
              'h-9 flex-1 items-center justify-center rounded-md',
              active && 'shadow-sm',
              active && !secondary && 'bg-background',
              active && secondary && 'bg-muted'
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {o.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
