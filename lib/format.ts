import type { Money } from "@/features/stays/types/stay";

const currencyFormatters = new Map<Money["currency"], Intl.NumberFormat>();

const getCurrencyFormatter = (currency: Money["currency"]) => {
  const cached = currencyFormatters.get(currency);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  currencyFormatters.set(currency, formatter);

  return formatter;
};

export const formatMoney = (money: Money) => getCurrencyFormatter(money.currency).format(money.amount);

export const formatCompactCount = (count: number) =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export const formatMonthYear = (isoDate: string) => dateFormatter.format(new Date(isoDate));

export const humanizeLabel = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
