import { Text } from '@/components/ui/text'

export function FieldLabel({ children }: { children: string }) {
  return <Text className="text-foreground mb-2 text-sm font-medium">{children}</Text>
}
