export function formatEur(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatHours(n: number) {
  return new Intl.NumberFormat("es-ES").format(n);
}

export function computeNetBenefit(valueEur: number, feesEur: number): number {
  return valueEur - feesEur;
}

export function computeRoiMultiple(valueEur: number, feesEur: number): number {
  if (!feesEur || feesEur <= 0) return 0;
  return Number((valueEur / feesEur).toFixed(2));
}
