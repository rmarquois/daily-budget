import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { RecurringItem } from '@/lib/budget/types';
import { formatMoney } from '@/lib/format';
import LucideIcon from '@/lib/icons/LucideIcon';
import { cn } from '@/lib/utils';

interface RecurringRowProps {
  item: RecurringItem;
  onPress?: () => void;
  onRemove?: () => void;
  isLast?: boolean;
}

export function RecurringRow({ item, onPress, onRemove, isLast }: RecurringRowProps) {
  const isIncome = item.type === 'income';
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'flex-row items-center gap-3 px-4 py-3 active:bg-accent web:hover:bg-accent/60',
        !isLast && 'border-b border-border'
      )}>
      <View
        className={cn(
          'h-8 w-8 items-center justify-center rounded-full',
          isIncome ? 'bg-success/15' : 'bg-muted'
        )}>
        <LucideIcon
          name={isIncome ? 'ArrowDownLeft' : 'ArrowUpRight'}
          size={16}
          className={isIncome ? 'text-success' : 'text-muted-foreground'}
        />
      </View>
      <Text className="flex-1 text-sm font-medium text-foreground" numberOfLines={1}>
        {item.label}
      </Text>
      <Text
        className={cn('text-sm font-semibold', isIncome ? 'text-success' : 'text-foreground')}>
        {isIncome ? '+' : '−'}
        {formatMoney(item.amount)}
      </Text>
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          accessibilityLabel={`Supprimer ${item.label}`}
          className="-mr-2 h-8 w-8 items-center justify-center rounded-md active:bg-accent">
          <LucideIcon name="X" size={16} className="text-muted-foreground" />
        </Pressable>
      ) : (
        <LucideIcon name="ChevronRight" size={16} className="text-muted-foreground" />
      )}
    </Pressable>
  );
}
