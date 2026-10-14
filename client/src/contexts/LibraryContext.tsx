import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useStoredList } from "@/hooks/useLibrary";
import { toggleCompareItem } from "@/data/library";
interface LibraryState {
  saved: string[];
  toggleSaved: (id: string) => void;
  checked: string[];
  toggleChecked: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  setCompare: (ids: string[]) => void;
}
const LibraryContext = createContext<LibraryState | null>(null);
export function LibraryProvider({ children }: { children: ReactNode }) {
  const saved = useStoredList("packinweb:saved");
  const checked = useStoredList("packinweb:checked");
  const [compare, setCompare] = useState<string[]>([]);
  function toggleCompare(id: string) {
    if (!compare.includes(id) && compare.length >= 3) {
      toast("한 번에 최대 3개 기능을 비교할 수 있어요.");
      return;
    }
    setCompare(current => toggleCompareItem(current, id));
  }
  function toggleSaved(id: string) {
    saved.toggle(id);
    toast(
      saved.items.includes(id)
        ? "컬렉션에서 제거했어요."
        : "내 컬렉션에 저장했어요.",
      { description: "이 브라우저에 저장됩니다." }
    );
  }
  return (
    <LibraryContext.Provider
      value={{
        saved: saved.items,
        toggleSaved,
        checked: checked.items,
        toggleChecked: checked.toggle,
        compare,
        toggleCompare,
        setCompare,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
export function useLibrary() {
  const value = useContext(LibraryContext);
  if (!value) throw new Error("LibraryProvider is missing");
  return value;
}
