export function formatNumber(num = 0) {
  return (
    Number(num)?.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) ?? "0"
  );
}
