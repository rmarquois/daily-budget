import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PeriodDayPicker } from '@/components/budget/PeriodDayPicker';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { SectionTitle } from '@/components/budget/SectionTitle';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useBudgetStore } from '@/lib/budget/store';
import LucideIcon, { type IconName } from '@/lib/icons/LucideIcon';
import { useColorScheme } from '@/lib/useColorScheme';
import { cn } from '@/lib/utils';

export default function SettingsScreen() {
  const periodStartDay = useBudgetStore((s) => s.periodStartDay);
  const setPeriodStartDay = useBudgetStore((s) => s.setPeriodStartDay);
  const isDemo = useBudgetStore((s) => s.isDemo);
  const resetAll = useBudgetStore((s) => s.resetAll);
  const { isDarkColorScheme } = useColorScheme();
  const [confirmReset, setConfirmReset] = React.useState(false);

  const reset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetAll();
    setConfirmReset(false);
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Préférences" title="Réglages" />

        <View className="px-5">
          <SectionTitle title="Période budgétaire" />
          <Card className="p-4">
            <Text className="mb-4 text-xs leading-5 text-muted-foreground">
              Choisissez le jour où votre mois redémarre, par exemple le jour où tombe votre
              salaire (du 25 au 25, du 30 au 30…).
            </Text>
            <PeriodDayPicker value={periodStartDay} onChange={setPeriodStartDay} />
          </Card>

          <SectionTitle title="Apparence" />
          <Card className="overflow-hidden">
            <Row icon={isDarkColorScheme ? 'MoonStar' : 'Sun'} label="Thème">
              <Text className="text-sm text-muted-foreground">
                Automatique · {isDarkColorScheme ? 'Sombre' : 'Clair'}
              </Text>
            </Row>
          </Card>
          <Text className="mt-2 px-1 text-xs leading-5 text-muted-foreground">
            L’app passe en clair ou en sombre selon le réglage de votre appareil.
          </Text>

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
                isLast
              />
            </Pressable>
          </Card>
          <Text className="mt-2 px-1 text-xs leading-5 text-muted-foreground">
            Vos données restent sur votre téléphone (ou dans ce navigateur). Elles ne sont pas
            synchronisées entre appareils.
          </Text>

          <Text className="mt-10 text-center text-xs text-muted-foreground">Daily Budget · v1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  children,
  destructive,
  isLast = true,
}: {
  icon: IconName;
  label: string;
  children?: React.ReactNode;
  destructive?: boolean;
  isLast?: boolean;
}) {
  return (
    <View
      className={cn(
        'min-h-[52px] flex-row items-center gap-3 px-4 py-3',
        !isLast && 'border-b border-border'
      )}>
      <LucideIcon
        name={icon}
        size={18}
        className={destructive ? 'text-destructive' : 'text-muted-foreground'}
      />
      <Text
        className={cn('flex-1 text-sm', destructive ? 'text-destructive' : 'text-foreground')}>
        {label}
      </Text>
      {children}
    </View>
  );
}
