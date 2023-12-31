
export const ranks = {
  1: "F",
  2: "D",
  3: "C",
  4: "B",
  5: "A",
  6: "S",
  7: "SS"
};

export function getRankName(rank: keyof typeof ranks): string {
  return ranks?.[rank] ?? "N/A"
}