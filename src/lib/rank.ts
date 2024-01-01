export const ranks = {
  1: "F",
  2: "D",
  3: "C",
  4: "B",
  5: "A",
  6: "S",
  7: "SS",
};

export function getRankName(rank: number): string {
  const found = Object.entries(ranks).find(([r]) => {
    return parseInt(r) === rank;
  });

  if (!found) {
    return "N/A";
  }

  return found[1] ?? "N/A";
}
