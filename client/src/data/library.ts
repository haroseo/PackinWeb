export interface ListStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}
export function readStoredList(storage: ListStorage, key: string): string[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(key) || "[]");
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter((item): item is string => typeof item === "string")
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
export function writeStoredList(
  storage: ListStorage,
  key: string,
  items: string[]
): boolean {
  try {
    storage.setItem(key, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
export function toggleListItem(current: string[], id: string): string[] {
  return current.includes(id)
    ? current.filter(v => v !== id)
    : [...current, id];
}
export function toggleCompareItem(current: string[], id: string): string[] {
  if (current.includes(id)) return current.filter(v => v !== id);
  if (current.length >= 3) return current;
  return [...current, id];
}
