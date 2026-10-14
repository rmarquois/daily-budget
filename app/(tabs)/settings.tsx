import { router } from 'expo-router'
import * as React from 'react'
import { Pressable, ScrollView, View } from 'react-native'

import { PeriodDayPicker } from '@/components/budget/PeriodDayPicker'
import { ScreenHeader } from '@/components/budget/ScreenHeader'
import { SectionTitle } from '@/components/budget/SectionTitle'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { useBudgetStore } from '@/lib/budget/store'
import LucideIcon, { type IconName } from '@/lib/icons/LucideIcon'
import { cn } from '@/lib/utils'

export default function SettingsScreen() {
  const periodStartDay = useBudgetStore((s) => s.periodStartDay)
  const setPeriodStartDay = useBudgetStore((s) => s.setPeriodStartDay)
  const isDemo = useBudgetStore((s) => s.isDemo)
  const resetAll = useBudgetStore((s) => s.resetAll)
  const [confirmReset, setConfirmReset] = React.useState(false)

  const reset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetAll()
    setConfirmReset(false)
    router.replace('/onboarding')
  }

  return (
    <View className="bg-background pt-safe flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Préférences" title="Réglages" />

        <View className="px-5">
          <SectionTitle title="Période budgétaire" className="mt-0" />
          <Card className="p-4">
            <Text className="text-muted-foreground mb-4 text-xs leading-5">
              Choisissez le jour où votre mois redémarre, par exemple le jour où tombe votre salaire
              (du 25 au 25, du 30 au 30…).
            </Text>
            <PeriodDayPicker value={periodStartDay} onChange={setPeriodStartDay} />
          </Card>

          <SectionTitle title="Données" />
          <Card className="overflow-hidden">
            <Row icon="Smartphone" label="Stockées sur cet appareil" isLast={false}>
              <LucideIcon name="ShieldCheck" size={16} className="text-success" />
            </Row>
            <Pressable onPress={reset} className="active:bg-accent">
              <Row
                icon="RotateCcw"
                label={
                  confirmReset
                    ? 'Toucher à nouveau pour tout effacer'
                    : isDemo
                      ? 'Quitter l’exemple et commencer'
                      : 'Tout effacer et recommencer'
                }
                destructive
                confirm={confirmReset}
                isLast
              />
            </Pressable>
          </Card>
          <Text className="text-muted-foreground mt-2 px-1 text-xs leading-5">
            Vos données restent sur votre téléphone. Elles ne sont pas synchronisées entre
            appareils.
          </Text>

          <Text className="text-muted-foreground mb-5 mt-10 text-center text-xs">
            Daily Budget · v1.0
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

function Row({
  icon,
  label,
  children,
  destructive,
  confirm,
  isLast = true,
}: {
  icon: IconName
  label: string
  children?: React.ReactNode
  destructive?: boolean
  confirm?: boolean
  isLast?: boolean
}) {
  return (
    <View
      className={cn(
        'min-h-[52px] flex-row items-center gap-3 px-4 py-3',
        !isLast && 'border-border border-b'
      )}
    >
      <LucideIcon
        name={icon}
        size={18}
        className={destructive ? 'text-destructive' : 'text-muted-foreground'}
      />
      <Text
        className={cn(
          'flex-1 text-sm',
          destructive ? 'text-destructive' : 'text-foreground',
          confirm ? 'font-bold' : undefined
        )}
      >
        {label}
      </Text>
      {children}
    </View>
  )
}
