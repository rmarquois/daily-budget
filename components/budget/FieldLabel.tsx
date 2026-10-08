import { Text } from '@/components/ui/text';

export function FieldLabel({ children }: { children: string }) {
  return <Text className="mb-2 text-sm font-medium text-foreground">{children}</Text>;
}
