import { router } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PeriodDayPicker } from '@/components/budget/PeriodDayPicker';
import { RecurringQuickAdd } from '@/components/budget/RecurringQuickAdd';
import { RecurringRow } from '@/components/budget/RecurringRow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatLongDay, todayKey } from '@/lib/budget/dates';
import { getPeriod, periodBudget, sumRecurring } from '@/lib/budget/engine';
import { useBudgetStore } from '@/lib/budget/store';
import type { FlowType } from '@/lib/budget/types';
import { formatMoney } from '@/lib/format';
import LucideIcon from '@/lib/icons/LucideIcon';
import { cn } from '@/lib/utils';

const STEPS = ['welcome', 'period', 'income', 'expense', 'recap'] as const;

export default function OnboardingScreen() {
  const [step, setStep] = React.useState(0);
  const current = STEPS[step];
  const store = useBudgetStore();
  const { income, expense, budget } = sumRecurring(store.recurring);
  const today = todayKey();
  const period = getPeriod(today, store.periodStartDay);
  const firstPeriodBudget = periodBudget(period, budget, today);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    store.completeOnboarding();
    router.replace('/today');
  };

  const tryDemo = () => {
    store.loadDemo();
    router.replace('/today');
  };

  if (current === 'welcome') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-between px-6 py-8 web:mx-auto web:w-full web:max-w-md">
          <View className="flex-1 justify-center">
            <View className="mb-8 h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <LucideIcon name="Wallet" size={26} className="text-primary-foreground" />
            </View>
            <Text className="text-h1 tracking-tight text-foreground">Daily Budget</Text>
            <Text className="mt-3 text-base leading-6 text-muted-foreground">
              Sachez chaque matin combien vous pouvez dépenser aujourd'hui — et les jours suivants.
            </Text>

            <View className="mt-10 gap-5">
              <Feature icon="Repeat" title="Vos revenus et charges fixes" text="Renseignés une seule fois." />
              <Feature icon="Receipt" title="Vos dépenses du quotidien" text="Notées en quelques secondes." />
              <Feature icon="Sparkles" title="Votre budget du jour" text="Recalculé automatiquement chaque jour." />
            </View>
          </View>

          <View className="gap-2">
            <Button size="lg" onPress={next}>
              <Text>Commencer</Text>
            </Button>
            <Button size="lg" variant="ghost" onPress={tryDemo}>
              <Text>Essayer avec un exemple</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const items = store.recurring.filter((r) => r.type === current);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center gap-3 px-5 pb-2 pt-3 web:mx-auto web:w-full web:max-w-md">
          <Pressable
            onPress={back}
            accessibilityLabel="Retour"
            className="h-10 w-10 items-center justify-center rounded-md active:bg-accent">
            <LucideIcon name="ArrowLeft" size={20} className="text-foreground" />
          </Pressable>
          <View className="flex-1 flex-row gap-1.5">
            {STEPS.slice(1).map((s, i) => (
              <View
                key={s}
                className={cn('h-1 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-muted')}
              />
            ))}
          </View>
          <View className="w-10" />
        </View>

        <ScrollView
          contentContainerClassName="px-6 pb-6 pt-6 web:mx-auto web:w-full web:max-w-md"
          keyboardShouldPersistTaps="handled">
          {current === 'period' ? (
            <>
              <StepTitle
                title="Quand commence votre mois ?"
                text="Souvent le jour où tombe votre salaire. Votre budget repartira de zéro à cette date."
              />
              <PeriodDayPicker value={store.periodStartDay} onChange={store.setPeriodStartDay} />
            </>
          ) : null}

          {current === 'income' || current === 'expense' ? (
            <>
              <StepTitle
                title={current === 'income' ? 'Vos revenus réguliers' : 'Vos dépenses fixes'}
                text={
                  current === 'income'
                    ? 'Ce que vous touchez chaque période : salaire, allocations, pension…'
                    : 'Ce qui part chaque période : loyer, factures, abonnements, épargne…'
                }
              />
              <RecurringQuickAdd
                type={current}
                suggestions={
                  current === 'income'
                    ? ['Salaire', 'Prime', 'Allocations', 'Pension']
                    : ['Loyer', 'Électricité', 'Internet', 'Téléphone', 'Assurance', 'Abonnements', 'Épargne']
                }
                onAdd={(label, amount) =>
                  store.upsertRecurring({ type: current as FlowType, label, amount })
                }
              />
              {items.length > 0 ? (
                <Card className="mt-6 overflow-hidden">
                  {items.map((item, i) => (
                    <RecurringRow
                      key={item.id}
                      item={item}
                      isLast={i === items.length - 1}
                      onRemove={() => store.removeRecurring(item.id)}
                    />
                  ))}
                </Card>
              ) : null}
            </>
          ) : null}

          {current === 'recap' ? (
            <>
              <StepTitle
                title="Tout est prêt"
                text="Voici ce qu'il vous reste pour vivre sur la période, une fois les charges fixes payées."
              />
              <Card className="p-5">
                <View className="gap-2">
                  <RecapLine label="Revenus" value={`+${formatMoney(income)}`} tone="success" />
                  <RecapLine label="Dépenses fixes" value={`−${formatMoney(expense)}`} />
                </View>
                <View className="mt-4 border-t border-border pt-4">
                  <Text className="text-sm text-muted-foreground">Budget de la période</Text>
                  <Text
                    className={cn('text-4xl font-display', budget < 0 ? 'text-destructive' : 'text-foreground')}>
                    {formatMoney(budget)}
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    ≈ {formatMoney(budget / period.totalDays)} par jour sur {period.totalDays} jours
                  </Text>
                </View>
              </Card>
              {budget > 0 && firstPeriodBudget < budget ? (
                <Text className="mt-4 text-xs leading-5 text-muted-foreground">
                  Comme la période en cours a déjà commencé, votre premier budget est calculé au
                  prorata : {formatMoney(firstPeriodBudget)} jusqu'au {formatLongDay(period.end)}.
                </Text>
              ) : null}
              {budget <= 0 ? (
                <Text className="mt-4 text-sm text-destructive">
                  Vos dépenses fixes dépassent vos revenus. Vous pourrez ajuster tout cela dans
                  l'onglet Budget.
                </Text>
              ) : null}
            </>
          ) : null}
        </ScrollView>

        <View className="px-6 pb-4 pt-2 web:mx-auto web:w-full web:max-w-md">
          {current === 'recap' ? (
            <Button size="lg" onPress={finish}>
              <Text>C'est parti</Text>
            </Button>
          ) : (
            <Button size="lg" onPress={next}>
              <Text>
                {(current === 'income' || current === 'expense') && items.length === 0
                  ? 'Passer pour le moment'
                  : 'Continuer'}
              </Text>
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StepTitle({ title, text }: { title: string; text: string }) {
  return (
    <View className="mb-6">
      <Text className="text-h2 tracking-tight text-foreground">{title}</Text>
      <Text className="mt-2 text-sm leading-5 text-muted-foreground">{text}</Text>
    </View>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ComponentProps<typeof LucideIcon>['name'];
  title: string;
  text: string;
}) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-10 w-10 items-center justify-center rounded-lg border border-border">
        <LucideIcon name={icon} size={18} className="text-foreground" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-muted-foreground">{text}</Text>
      </View>
    </View>
  );
}

function RecapLine({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <Text className={cn('text-sm font-medium', tone === 'success' ? 'text-success' : 'text-foreground')}>
        {value}
      </Text>
    </View>
  );
}
