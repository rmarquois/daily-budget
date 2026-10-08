const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Normalises narrow/no-break spaces so amounts never wrap mid-number. */
const clean = (s: string) => s.replace(/[\u202f\u00a0]/g, '\u00a0');

export function formatMoney(value: number): string {
  return clean(formatter.format(Math.abs(value) < 0.005 ? 0 : value));
}

export function formatMoneyRounded(value: number): string {
  return clean(compactFormatter.format(Math.abs(value) < 0.5 ? 0 : value));
}

/** Accepts "12,50", "12.5", "1 200" → number, or null if invalid. */
export function parseAmount(input: string): number | null {
  const normalized = input.replace(/[\s\u00a0\u202f€]/g, '').replace(',', '.');
  if (!normalized || !/^\d*\.?\d{0,2}$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) / 100 : null;
}

export function amountToInput(value: number): string {
  return String(value).replace('.', ',');
}
