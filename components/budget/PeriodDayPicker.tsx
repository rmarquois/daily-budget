import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatLongDay, todayKey } from '@/lib/budget/dates';
import { getPeriod } from '@/lib/budget/engine';
import LucideIcon from '@/lib/icons/LucideIcon';
import { cn } from '@/lib/utils';

const PRESETS = [1, 5, 10, 15, 25, 30];

interface PeriodDayPickerProps {
  value: number;
  onChange: (day: number) => void;
}

export function PeriodDayPicker({ value, onChange }: PeriodDayPickerProps) {
  const period = getPeriod(todayKey(), value);
  const step = (delta: number) => onChange(((value - 1 + delta + 31) % 31) + 1);

  return (
    <View>
      <View className="flex-row items-center justify-between rounded-xl border border-border p-2">
        <Pressable
          onPress={() => step(-1)}
          accessibilityLabel="Jour précédent"
          className="h-12 w-12 items-center justify-center rounded-lg active:bg-accent">
          <LucideIcon name="Minus" size={18} className="text-foreground" />
        </Pressable>
        <View className="items-center">
          <Text className="text-xs text-muted-foreground">Mon mois commence le</Text>
          <Text className="font-display text-3xl text-foreground">{value}</Text>
        </View>
        <Pressable
          onPress={() => step(1)}
          accessibilityLabel="Jour suivant"
          className="h-12 w-12 items-center justify-center rounded-lg active:bg-accent">
          <LucideIcon name="Plus" size={18} className="text-foreground" />
        </Pressable>
      </View>

      <View className="mt-3 flex-row flex-wrap justify-center gap-2">
        {PRESETS.map((d) => (
          <Pressable
            key={d}
            onPress={() => onChange(d)}
            className={cn(
              'h-9 min-w-[44px] items-center justify-center rounded-md border px-3',
              d === value ? 'border-primary bg-primary' : 'border-border active:bg-accent'
            )}>
            <Text
              className={cn(
                'text-sm font-medium',
                d === value ? 'text-primary-foreground' : 'text-foreground'
              )}>
              {d === 1 ? '1er' : d}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-4 flex-row items-start gap-2 rounded-lg bg-muted p-3">
        <LucideIcon name="CalendarRange" size={16} className="mt-0.5 text-muted-foreground" />
        <Text className="flex-1 text-xs leading-5 text-muted-foreground">
          Période actuelle : du {formatLongDay(period.start)} au {formatLongDay(period.end)} (
          {period.totalDays} jours).
          {value > 28 ? ' Les mois plus courts commencent le dernier jour du mois.' : ''}
        </Text>
      </View>
    </View>
  );
}
