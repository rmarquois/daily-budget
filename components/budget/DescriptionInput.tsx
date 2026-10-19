import * as React from 'react'
import { TextInputProps, View } from 'react-native'

import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

type DescriptionInputProps = TextInputProps & {
  suggestions: string[]
}

export function DescriptionInput(props: DescriptionInputProps) {
  const [focused, setFocused] = React.useState(false)
  const [value, setValue] = React.useState(typeof props.value === 'string' ? props.value : '')

  React.useEffect(() => {
    if (typeof props.value === 'string') {
      setValue(props.value)
    }
  }, [props.value])

  const suggestions = React.useMemo(() => {
    const query = value.toLowerCase()
    if (!query) return []

    return props.suggestions.filter(
      (item) => item.toLowerCase().startsWith(query) && item.toLowerCase() !== query
    )
  }, [props.suggestions, value])

  const bestSuggestion = suggestions[0] ?? ''

  const completion = bestSuggestion ? bestSuggestion.slice(value.length) : ''

  const acceptSuggestion = (text: string) => {
    setValue(text)
    props.onChangeText?.(text)
  }

  return (
    <View className="relative">
      {!!completion && focused && (
        <View pointerEvents="none" className="absolute inset-0 justify-center px-3">
          <Text
            className="native:text-lg text-body text-foreground lg:text-sm"
            style={{
              includeFontPadding: false,
              lineHeight: 24,
            }}
          >
            <Text className="native:text-background">{value}</Text>
            <Text className="text-muted-foreground">{completion}</Text>
          </Text>
        </View>
      )}

      <Input
        {...props}
        value={value}
        onChangeText={(text) => {
          setValue(text)
          props.onChangeText?.(text)
        }}
        returnKeyType="done"
        onFocus={(e) => {
          setFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          props.onBlur?.(e)
        }}
        onSubmitEditing={(e) => {
          if (bestSuggestion) {
            acceptSuggestion(bestSuggestion)
          } else {
            props.onSubmitEditing?.(e)
          }
        }}
        className={cn(props.className, 'native:p-0! native:bg-transparent')}
        style={[
          props.style,
          {
            includeFontPadding: false,
            textAlignVertical: 'center',
            lineHeight: 24,
          },
        ]}
      />
    </View>
  )
}
