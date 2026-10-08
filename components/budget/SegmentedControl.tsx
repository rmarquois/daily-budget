import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row rounded-lg bg-muted p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            className={cn(
              'h-9 flex-1 items-center justify-center rounded-md',
              active && 'bg-background shadow-sm shadow-foreground/10'
            )}>
            <Text
              className={cn(
                'text-sm font-medium',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
