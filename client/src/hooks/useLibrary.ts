import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  readStoredList,
  writeStoredList,
  toggleListItem,
} from "@/data/library";
export function useStoredList(key: string) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      return readStoredList(localStorage, key);
    } catch {
      return [];
    }
  });
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    if (!changed) return;
    try {
      if (!writeStoredList(localStorage, key, items))
        throw new Error("storage");
    } catch {
      toast.error(
        "브라우저 저장 공간을 사용할 수 없습니다. 현재 화면에서만 유지됩니다."
      );
    }
  }, [key, items, changed]);
  const toggle = useCallback((id: string) => {
    setItems(current => toggleListItem(current, id));
    setChanged(true);
  }, []);
  return { items, toggle };
}
