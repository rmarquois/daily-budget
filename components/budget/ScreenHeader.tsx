import { router } from 'expo-router'
import * as React from 'react'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import LucideIcon from '@/lib/icons/LucideIcon'

interface ScreenHeaderProps {
  eyebrow?: string
  title: string
}

export function ScreenHeader({ eyebrow, title }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
      <View className="flex-1">
        {eyebrow ? (
          <Text className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">
            {eyebrow}
          </Text>
        ) : null}
        <Text className="text-h2 text-foreground tracking-tight">{title}</Text>
      </View>
      <Button
        variant="outline"
        onPress={() => router.push('/settings')}
        className="h-10 w-10 rounded-full p-2"
      >
        <LucideIcon name="Settings2" />
      </Button>
    </View>
  )
}
