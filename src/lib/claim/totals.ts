import type { ExpenseEntry } from "@/lib/validation/schemas";

export function parseAmount(value: string) {
  const amount = Number(value.replace(",", "."));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function totalsByCurrency(expenses: ExpenseEntry[]) {
  const totals = new Map<string, number>();

  for (const expense of expenses) {
    const currency = expense.currency || "EUR";
    totals.set(currency, (totals.get(currency) ?? 0) + parseAmount(expense.amount));
  }

  return [...totals.entries()].map(([currency, amount]) => ({
    currency,
    amount,
    label: formatMoney(amount, currency),
  }));
}

export function formatTotals(expenses: ExpenseEntry[]) {
  const totals = totalsByCurrency(expenses);
  if (totals.length === 0) return "EUR 0.00";
  return totals.map((item) => item.label).join(" + ");
}
