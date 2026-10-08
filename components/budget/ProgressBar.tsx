import { View } from 'react-native';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  /** 0 → 1 */
  value: number;
  /** Optional marker position 0 → 1 (e.g. how far through the period we are). */
  marker?: number;
  tone?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
  barClassName?: string;
}

const toneClass = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
};

export function ProgressBar({ value, marker, tone = 'default', className, barClassName }: ProgressBarProps) {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <View className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <View className={cn('h-full rounded-full', toneClass[tone], barClassName)} style={{ width: `${pct}%` }} />
      {marker !== undefined ? (
        <View
          className="absolute bottom-0 top-0 w-0.5 bg-foreground/60"
          style={{ left: `${Math.min(1, Math.max(0, marker)) * 100}%` }}
        />
      ) : null}
    </View>
  );
}
