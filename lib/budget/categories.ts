import type { IconName } from '@/lib/icons/LucideIcon'

type CategoryId =
  | 'salary'
  | 'benefits'
  | 'pensions'
  | 'capital'
  | 'housing'
  | 'bills_subscriptions'
  | 'transport'
  | 'insurance_health'
  | 'loans'
  | 'taxes_fees'
  | 'loved_ones'
  | 'savings'
  | 'sales'
  | 'refunds'
  | 'gifts_received'
  | 'exceptional'
  | 'groceries'
  | 'eating_out'
  | 'eating_out'
  | 'shopping'
  | 'leisure'
  | 'transport'
  | 'health'
  | 'home'
  | 'unexpected'

export interface CategoryDef {
  id: CategoryId
  label: string
  description: string
  icon: IconName
  color: string
}

export const RECURRING_INCOME_CATEGORIES: CategoryDef[] = [
  {
    id: 'salary',
    label: 'Salaire',
    description: "Salaire, primes régulières, revenus d'indépendant",
    icon: 'Briefcase',
    color: '#16A34A',
  },
  {
    id: 'benefits',
    label: 'Aides et allocations',
    description: "CAF, APL, chômage, prime d'activité",
    icon: 'HandHelping',
    color: '#14B8A6',
  },
  {
    id: 'pensions',
    label: 'Retraites et pensions',
    description: "Retraite, pension alimentaire reçue, pension d'invalidité",
    icon: 'Armchair',
    color: '#0EA5E9',
  },
  {
    id: 'capital',
    label: 'Revenus du patrimoine',
    description: 'Loyers perçus, dividendes, intérêts',
    icon: 'TrendingUp',
    color: '#84CC16',
  },
]

export const RECURRING_EXPENSE_CATEGORIES: CategoryDef[] = [
  {
    id: 'housing',
    label: 'Logement',
    description: 'Loyer ou crédit immo, charges de copro, taxe foncière, assurance habitation',
    icon: 'House',
    color: '#6366F1',
  },
  {
    id: 'bills_subscriptions',
    label: 'Factures et abonnements',
    description: 'Électricité, gaz, eau, internet, mobile, streaming, sport, presse',
    icon: 'Receipt',
    color: '#06B6D4',
  },
  {
    id: 'transport',
    label: 'Transport',
    description: 'Assurance auto, pass transport, parking, leasing',
    icon: 'Car',
    color: '#3B82F6',
  },
  {
    id: 'insurance_health',
    label: 'Santé et assurances',
    description: 'Mutuelle, prévoyance, assurances diverses',
    icon: 'ShieldPlus',
    color: '#EF4444',
  },
  {
    id: 'loans',
    label: 'Crédits',
    description: 'Crédit auto, crédit conso, prêt étudiant',
    icon: 'CreditCard',
    color: '#F59E0B',
  },
  {
    id: 'taxes_fees',
    label: 'Impôts et frais bancaires',
    description:
      "Prélèvement à la source, taxe d'habitation, cotisation CB, frais de tenue de compte",
    icon: 'Landmark',
    color: '#64748B',
  },
  {
    id: 'loved_ones',
    label: 'Proches et dons',
    description: 'Crèche, cantine, pension versée, argent de poche, dons réguliers, associations',
    icon: 'HeartHandshake',
    color: '#8B5CF6',
  },
  {
    id: 'savings',
    label: 'Épargne',
    description: 'Livret, assurance-vie, PEA, épargne projet',
    icon: 'PiggyBank',
    color: '#A855F7',
  },
]

export const INCOME_CATEGORIES: CategoryDef[] = [
  {
    id: 'sales',
    label: 'Ventes',
    description: "Leboncoin, Vinted, vente d'objets",
    icon: 'Tag',
    color: '#22C55E',
  },
  {
    id: 'refunds',
    label: 'Remboursements',
    description: 'Sécu, mutuelle, amis, notes de frais',
    icon: 'ReceiptText',
    color: '#10B981',
  },
  {
    id: 'gifts_received',
    label: 'Cadeaux reçus',
    description: 'Argent offert, cagnotte, coup de pouce de la famille',
    icon: 'Gift',
    color: '#34D399',
  },
  {
    id: 'exceptional',
    label: 'Rentrées exceptionnelles',
    description: "Prime ponctuelle, remboursement d'impôt, cashback, jeux",
    icon: 'Sparkles',
    color: '#4ADE80',
  },
]

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  {
    id: 'groceries',
    label: 'Courses',
    description: 'Supermarché, marché, boulangerie, drive',
    icon: 'ShoppingBasket',
    color: '#F97316',
  },
  {
    id: 'eating_out',
    label: 'Restos et gourmandises',
    description: 'Restaurant, café, bar, fast-food, pâtisserie, livraison',
    icon: 'Coffee',
    color: '#EC4899',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    description: 'Vêtements, chaussures, high-tech, beauté, coiffeur',
    icon: 'ShoppingBag',
    color: '#D946EF',
  },
  {
    id: 'leisure',
    label: 'Loisirs et voyages',
    description: 'Sorties, cinéma, culture, sport, hobbies, week-ends, vacances',
    icon: 'Ticket',
    color: '#F43F5E',
  },
  {
    id: 'transport',
    label: 'Transport',
    description: 'Carburant, péage, train, taxi, entretien voiture',
    icon: 'Car',
    color: '#3B82F6',
  },
  {
    id: 'health',
    label: 'Santé',
    description: 'Médecin, pharmacie, dentiste, optique',
    icon: 'HeartPulse',
    color: '#EF4444',
  },
  {
    id: 'loved_ones',
    label: 'Proches et dons',
    description: 'Cadeaux, cousinades, fêtes de famille, dons, cagnottes',
    icon: 'HeartHandshake',
    color: '#8B5CF6',
  },
  {
    id: 'home',
    label: 'Maison',
    description: 'Bricolage, déco, électroménager, jardin, produits ménagers',
    icon: 'Sofa',
    color: '#6366F1',
  },
  {
    id: 'unexpected',
    label: 'Imprévus et frais',
    description: 'Réparations, amendes, frais bancaires, frais divers',
    icon: 'TriangleAlert',
    color: '#EAB308',
  },
]

const ALL = [
  ...RECURRING_INCOME_CATEGORIES,
  ...RECURRING_EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
]

export function getCategory(id: string): CategoryDef {
  return ALL.find((c) => c.id === id) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}
