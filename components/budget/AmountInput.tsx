import * as React from 'react'
import { Platform, TextInput, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface AmountInputProps {
  value: string
  onChangeText: (value: string) => void
  autoFocus?: boolean
  size?: 'lg' | 'md'
}

/** Large, centred money input accepting "12,50" or "12.50". */
export function AmountInput({ value, onChangeText, autoFocus, size = 'lg' }: AmountInputProps) {
  const [textWidth, setTextWidth] = React.useState(0)

  const textClassName = cn(
    'font-display placeholder:text-muted-foreground web:outline-none text-foreground',
    size === 'lg' ? 'text-6xl leading-[72px]' : 'text-4xl leading-[48px]'
  )

  return (
    <>
      <Text
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width
          setTextWidth((previous) => (previous === width ? previous : width))
        }}
        className={cn('absolute opacity-0', textClassName)}
      >
        {value === '' ? 0 : value}
      </Text>
      <View className="flex-row items-center justify-center">
        <TextInput
          value={value}
          onChangeText={(t) => {
            onChangeText(
              t
                .replace(/[^0-9.,]/g, '')
                .replace(/^([.,])/, '')
                .replace(/([.,].*)[.,]/g, '$1')
            )
          }}
          placeholder="0"
          keyboardType="decimal-pad"
          inputMode="decimal"
          autoFocus={autoFocus}
          multiline={Platform.OS !== 'web'}
          maxLength={7}
          underlineColorAndroid="transparent"
          className={cn('w-full text-center', textClassName)}
        />
        <Text
          style={{
            transform: [{ translateX: textWidth / 2 + 12 }],
          }}
          className={cn(
            'text-muted-foreground absolute font-semibold',
            size === 'lg' ? 'text-3xl' : 'text-2xl'
          )}
        >
          €
        </Text>
      </View>
    </>
  )
}
