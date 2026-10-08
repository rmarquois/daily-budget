import type { IconName } from '@/lib/icons/LucideIcon';

export interface CategoryDef {
  id: string;
  label: string;
  icon: IconName;
}

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: 'food', label: 'Courses', icon: 'ShoppingBasket' },
  { id: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
  { id: 'coffee', label: 'Café', icon: 'Coffee' },
  { id: 'transport', label: 'Transport', icon: 'Car' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
  { id: 'leisure', label: 'Loisirs', icon: 'Ticket' },
  { id: 'health', label: 'Santé', icon: 'HeartPulse' },
  { id: 'home', label: 'Maison', icon: 'House' },
  { id: 'gift', label: 'Cadeau', icon: 'Gift' },
  { id: 'other', label: 'Autre', icon: 'CircleEllipsis' },
];

export const INCOME_CATEGORIES: CategoryDef[] = [
  { id: 'extra', label: 'Rentrée', icon: 'PiggyBank' },
  { id: 'refund', label: 'Remboursement', icon: 'Undo2' },
  { id: 'gift-in', label: 'Cadeau reçu', icon: 'Gift' },
  { id: 'other-in', label: 'Autre', icon: 'CircleEllipsis' },
];

const ALL = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategory(id: string): CategoryDef {
  return ALL.find((c) => c.id === id) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}
