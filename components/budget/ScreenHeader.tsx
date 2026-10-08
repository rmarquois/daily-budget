import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ eyebrow, title, right }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-end justify-between px-5 pb-4 pt-3">
      <View className="flex-1">
        {eyebrow ? (
          <Text className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </Text>
        ) : null}
        <Text className="text-h2 tracking-tight text-foreground">{title}</Text>
      </View>
      {right}
    </View>
  );
}
