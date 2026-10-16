import { router } from 'expo-router'
import * as React from 'react'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useBudgetStore } from '@/lib/budget/store'
import LucideIcon from '@/lib/icons/LucideIcon'

interface ScreenHeaderProps {
  eyebrow?: string
  title: string
}

export function ScreenHeader({ eyebrow, title }: ScreenHeaderProps) {
  const isDemo = useBudgetStore((s) => s.isDemo)

  return (
    <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
      <View className="flex-1">
        {eyebrow ? (
          <Text className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">
            {eyebrow}
          </Text>
        ) : null}
        <View className="flex flex-row items-center gap-2">
          <Text className="text-h2 text-foreground tracking-tight">{title}</Text>
          {isDemo && (
            <View className="border-warning flex-row items-center justify-center gap-1 rounded-full border bg-orange-100 px-2.5 py-0.5">
              <LucideIcon name="FlaskConical" size={12} className="text-warning" />
              <Text className="text-warning text-xs font-medium">Données d'exemple</Text>
            </View>
          )}
        </View>
      </View>
      <Button
        variant="outline"
        onPress={() => router.push('/settings')}
        className="native:w-12 w-10 rounded-full p-2"
      >
        <LucideIcon name="Settings2" className="text-foreground" />
      </Button>
    </View>
  )
}
