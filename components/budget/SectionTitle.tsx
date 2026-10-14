import * as React from 'react'
import { View } from 'react-native'

import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

export function SectionTitle({
  title,
  right,
  className,
}: {
  title: string
  right?: React.ReactNode
  className?: string
}) {
  return (
    <View className={cn('mb-2 mt-6 flex-row items-center justify-between px-1', className)}>
      <Text className="text-foreground text-sm font-semibold">{title}</Text>
      {right}
    </View>
  )
}
