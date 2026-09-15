export enum CurrencyUnit {
  IDR = "IDR",
  USD = "USD",
}

export const formatToCurrencyUnit = (
  value: number,
  currency: string = CurrencyUnit.IDR
): string => {
  const code = currency.toUpperCase();

  if (code === CurrencyUnit.IDR) {
    const absValue = Math.abs(value);
    let formattedNumber = value.toString();
    let unit = "";

    if (absValue >= 1_000_000_000_000) {
      formattedNumber = (value / 1_000_000_000_000).toFixed(1);
      unit = " triliun";
    } else if (absValue >= 1_000_000_000) {
      formattedNumber = (value / 1_000_000_000).toFixed(1);
      unit = " miliar";
    } else if (absValue >= 1_000_000) {
      formattedNumber = (value / 1_000_000).toFixed(1);
      unit = " juta";
    } else if (absValue >= 1_000) {
      formattedNumber = (value / 1_000).toFixed(1);
      unit = " ribu";
    }

    // Replace period with comma for Indonesian decimal representation
    formattedNumber = formattedNumber.replace(".", ",").replace(",0", "");
    return `Rp ${formattedNumber}${unit}`;
  }

  // Fallback standard compact formatting for USD and other currencies
  const formatted = Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    currency: code,
    style: "currency",
    maximumFractionDigits: 1,
  }).format(value);

  return formatted.includes(".0") ? formatted.replace(".0", "") : formatted;
};
