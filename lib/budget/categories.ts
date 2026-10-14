import type { IconName } from '@/lib/icons/LucideIcon'

export interface CategoryDef {
  id: string
  label: string
  icon: IconName
}

export const RECURRING_INCOME_CATEGORIES: CategoryDef[] = [
  { id: 'salary', label: 'Salaire', icon: 'BriefcaseBusiness' },
  { id: 'benefits', label: 'Allocations', icon: 'HandCoins' },
  { id: 'freelance', label: 'Freelance', icon: 'Laptop' },
  { id: 'bonus', label: 'Primes', icon: 'BadgeEuro' },
  { id: 'rental_income', label: 'Loyers', icon: 'House' },
  { id: 'pension', label: 'Pension', icon: 'Landmark' },
  { id: 'investments', label: 'Placements', icon: 'ChartNoAxesCombined' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis' },
]

export const RECURRING_EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: 'housing', label: 'Logement', icon: 'House' },
  { id: 'utilities', label: 'Énergie', icon: 'Zap' },
  { id: 'telecom', label: 'Internet', icon: 'Wifi' },
  { id: 'insurance', label: 'Assurance', icon: 'ShieldCheck' },
  { id: 'transport', label: 'Transport', icon: 'CarFront' },
  { id: 'subscriptions', label: 'Abonnements', icon: 'Repeat' },
  { id: 'loans', label: 'Crédits', icon: 'Landmark' },
  { id: 'family', label: 'Famille', icon: 'Users' },
  { id: 'health', label: 'Santé', icon: 'HeartPulse' },
  { id: 'savings', label: 'Épargne', icon: 'PiggyBank' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis' },
]

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: 'food', label: 'Courses', icon: 'ShoppingBasket' },
  { id: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
  { id: 'transport', label: 'Transport', icon: 'Car' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
  { id: 'leisure', label: 'Loisirs', icon: 'Ticket' },
  { id: 'health', label: 'Santé', icon: 'HeartPulse' },
  { id: 'home', label: 'Maison', icon: 'Sofa' },
  { id: 'travel', label: 'Voyages', icon: 'Plane' },
  { id: 'family', label: 'Famille', icon: 'Baby' },
  { id: 'gifts', label: 'Cadeaux', icon: 'Gift' },
  { id: 'repairs', label: 'Réparations', icon: 'Wrench' },
  { id: 'admin', label: 'Administratif', icon: 'FileText' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis' },
]

export const INCOME_CATEGORIES: CategoryDef[] = [
  { id: 'refund', label: 'Remboursement', icon: 'Undo2' },
  { id: 'sales', label: 'Ventes', icon: 'ShoppingBag' },
  { id: 'bonus', label: 'Primes', icon: 'Banknote' },
  { id: 'gifts', label: 'Cadeaux', icon: 'Gift' },
  { id: 'freelance', label: 'Missions', icon: 'Laptop' },
  { id: 'benefits', label: 'Aides', icon: 'HandCoins' },
  { id: 'cashback', label: 'Cashback', icon: 'Coins' },
  { id: 'interest', label: 'Intérêts', icon: 'ChartNoAxesCombined' },
  { id: 'rental', label: 'Loyers', icon: 'House' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis' },
]

const ALL = [
  ...RECURRING_INCOME_CATEGORIES,
  ...RECURRING_EXPENSE_CATEGORIES,
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
]

export function getCategory(id: string): CategoryDef {
  return ALL.find((c) => c.id === id) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}
