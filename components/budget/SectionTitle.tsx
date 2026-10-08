import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View className="mb-2 mt-6 flex-row items-center justify-between px-1">
      <Text className="text-sm font-semibold text-foreground">{title}</Text>
      {right}
    </View>
  );
}
