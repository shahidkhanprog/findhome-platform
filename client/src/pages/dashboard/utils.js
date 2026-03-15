export function formatPrice(p) {
  if (p >= 10000000) return `PKR ${(p / 10000000).toFixed(1)}cr`;
  if (p >= 100000)   return `PKR ${(p / 100000).toFixed(0)}L`;
  return `PKR ${p.toLocaleString()}`;
}