import * as React from 'react';
import { TextInput, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface AmountInputProps {
  value: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
  tone?: 'default' | 'success';
  size?: 'lg' | 'md';
}

/** Large, centred money input accepting "12,50" or "12.50". */
export function AmountInput({
  value,
  onChangeText,
  autoFocus,
  tone = 'default',
  size = 'lg',
}: AmountInputProps) {
  const color = tone === 'success' ? 'text-success' : 'text-foreground';
  // Size the field to its content so the € sign sits right next to the number.
  const charWidth = size === 'lg' ? 36 : 24;
  const inputStyle = { width: Math.max(1, (value || '0').length) * charWidth + 12 };
  return (
    <View className="flex-row items-center justify-center">
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9.,]/g, ''))}
        placeholder="0"
        keyboardType="decimal-pad"
        inputMode="decimal"
        autoFocus={autoFocus}
        style={inputStyle}
        className={cn(
          'text-center font-display tracking-tight placeholder:text-muted-foreground/50 web:outline-none',
          size === 'lg' ? 'text-6xl' : 'text-4xl',
          color
        )}
        placeholderClassName="text-muted-foreground"
      />
      <Text
        className={cn(
          'ml-1 font-semibold text-muted-foreground',
          size === 'lg' ? 'text-3xl' : 'text-2xl'
        )}>
        €
      </Text>
    </View>
  );
}
