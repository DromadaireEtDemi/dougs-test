export function sortByDate<T extends { date: Date }>(a: T, b: T) {
  return a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
}
