export function getLevel(percent) {
  if (percent < 40) return "Learning";
  if (percent < 75) return "Intermediate";
  return "Advanced";
}
