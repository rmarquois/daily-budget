import type { IconName } from '@/lib/icons/LucideIcon'

export interface CategoryDef {
  id: string
  label: string
  icon: IconName
  color: string
}

export const RECURRING_INCOME_CATEGORIES: CategoryDef[] = [
  { id: 'salary', label: 'Salaire', icon: 'BriefcaseBusiness', color: '#C5D8C0' },
  { id: 'benefits', label: 'Allocations', icon: 'HandCoins', color: '#BFE0D5' },
  { id: 'freelance', label: 'Freelance', icon: 'Laptop', color: '#C5D7EA' },
  { id: 'bonus', label: 'Primes', icon: 'BadgeEuro', color: '#F0E1B5' },
  { id: 'rental_income', label: 'Loyers', icon: 'House', color: '#E5CCB5' },
  { id: 'pension', label: 'Pension', icon: 'Landmark', color: '#B9DDE0' },
  { id: 'investments', label: 'Placements', icon: 'ChartNoAxesCombined', color: '#D7CDEF' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis', color: '#DADDE2' },
]

export const RECURRING_EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: 'housing', label: 'Logement', icon: 'House', color: '#E5CCB5' },
  { id: 'utilities', label: 'Énergie', icon: 'Zap', color: '#F0E1B5' },
  { id: 'telecom', label: 'Téléphone et Internet', icon: 'Wifi', color: '#C5D7EA' },
  { id: 'insurance', label: 'Assurance', icon: 'ShieldCheck', color: '#DADDE2' },
  { id: 'transport', label: 'Transport', icon: 'CarFront', color: '#C5D7EA' },
  { id: 'subscriptions', label: 'Abonnements', icon: 'Repeat', color: '#D7CDEF' },
  { id: 'loans', label: 'Crédits', icon: 'Landmark', color: '#C9D0E8' },
  { id: 'bank_fees', label: 'Frais bancaires', icon: 'Landmark', color: '#C9D0E8' },
  { id: 'taxes', label: 'Impôts et taxes', icon: 'Landmark', color: '#E8C4CC' },
  { id: 'family', label: 'Famille', icon: 'Users', color: '#EBCBD2' },
  { id: 'health', label: 'Santé', icon: 'HeartPulse', color: '#EBCBD2' },
  { id: 'savings', label: 'Épargne', icon: 'PiggyBank', color: '#BFE0D5' },
  { id: 'donations', label: 'Dons', icon: 'HandHeart', color: '#BFE0D5' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis', color: '#DADDE2' },
]

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: 'food', label: 'Courses', icon: 'ShoppingBasket', color: '#C5D8C0' },
  { id: 'outings', label: 'Sorties', icon: 'Martini', color: '#F0D1BD' },
  { id: 'transport', label: 'Transport', icon: 'Car', color: '#C5D7EA' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#EBCBD2' },
  { id: 'leisure', label: 'Loisirs', icon: 'Ticket', color: '#D7CDEF' },
  { id: 'health', label: 'Santé', icon: 'HeartPulse', color: '#EBCBD2' },
  { id: 'home', label: 'Maison', icon: 'Sofa', color: '#E5CCB5' },
  { id: 'cash', label: 'Retraits', icon: 'Banknote', color: '#C9D0E8' },
  { id: 'travel', label: 'Voyages', icon: 'Plane', color: '#B9DDE0' },
  { id: 'family', label: 'Famille', icon: 'Baby', color: '#EBCBD2' },
  { id: 'gifts', label: 'Cadeaux', icon: 'Gift', color: '#E8C4CC' },
  { id: 'donations', label: 'Dons', icon: 'HandHeart', color: '#BFE0D5' },
  { id: 'repairs', label: 'Réparations', icon: 'Wrench', color: '#DADDE2' },
  { id: 'taxes', label: 'Impôts et taxes', icon: 'ReceiptText', color: '#E8C4CC' },
  { id: 'admin', label: 'Administratif', icon: 'FileText', color: '#C9D0E8' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis', color: '#DADDE2' },
]

export const INCOME_CATEGORIES: CategoryDef[] = [
  { id: 'refund', label: 'Remboursement', icon: 'Undo2', color: '#B9DDE0' },
  { id: 'sales', label: 'Ventes', icon: 'ShoppingBag', color: '#D0DFB8' },
  { id: 'bonus', label: 'Primes', icon: 'Banknote', color: '#F0E1B5' },
  { id: 'gifts', label: 'Cadeaux', icon: 'Gift', color: '#E8C4CC' },
  { id: 'freelance', label: 'Missions', icon: 'Laptop', color: '#C5D7EA' },
  { id: 'benefits', label: 'Aides', icon: 'HandCoins', color: '#BFE0D5' },
  { id: 'cashback', label: 'Cashback', icon: 'Coins', color: '#D7CDEF' },
  { id: 'interest', label: 'Intérêts', icon: 'ChartNoAxesCombined', color: '#C9D0E8' },
  { id: 'rental', label: 'Loyers', icon: 'House', color: '#E5CCB5' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis', color: '#DADDE2' },
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
