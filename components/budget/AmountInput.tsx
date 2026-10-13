import * as React from 'react'
import { TextInput, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface AmountInputProps {
  value: string
  onChangeText: (value: string) => void
  autoFocus?: boolean
  tone?: 'default' | 'success'
  size?: 'lg' | 'md'
}

/** Large, centred money input accepting "12,50" or "12.50". */
export function AmountInput({
  value,
  onChangeText,
  autoFocus,
  tone = 'default',
  size = 'lg',
}: AmountInputProps) {
  const color = tone === 'success' ? 'text-success' : 'text-foreground'
  return (
    <View className="flex-row items-center justify-center">
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9.,]/g, ''))}
        placeholder="0"
        keyboardType="decimal-pad"
        inputMode="decimal"
        autoFocus={autoFocus}
        className={cn(
          'font-display placeholder:text-muted-foreground web:outline-none text-center tracking-tight',
          size === 'lg' ? 'text-6xl leading-[72px]' : 'text-4xl leading-[48px]',
          color
        )}
      />
      <Text
        className={cn(
          'text-muted-foreground ml-1 font-semibold',
          size === 'lg' ? 'text-3xl' : 'text-2xl'
        )}
      >
        €
      </Text>
    </View>
  )
}
