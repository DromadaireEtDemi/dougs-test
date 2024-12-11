export function removeDuplicate<T>(items: T[], key: keyof T): T[] {
  return Array.from(new Map(items.map((item) => [item[key], item])).values());
}
