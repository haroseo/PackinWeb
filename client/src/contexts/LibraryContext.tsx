import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useStoredList } from "@/hooks/useLibrary";
import { toggleCompareItem } from "@/data/library";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

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

type LibraryTable = "saved_features" | "checked_features";

async function replaceRemoteList(
  table: LibraryTable,
  userId: string,
  ids: string[]
) {
  if (!supabase) return;
  const { error: removeError } = await supabase
    .from(table)
    .delete()
    .eq("user_id", userId);
  if (removeError) throw removeError;
  if (ids.length === 0) return;
  const { error } = await supabase
    .from(table)
    .insert(ids.map(feature_id => ({ user_id: userId, feature_id })));
  if (error) throw error;
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const saved = useStoredList("packinweb:saved");
  const checked = useStoredList("packinweb:checked");
  const [compare, setCompare] = useState<string[]>([]);
  const [remoteReady, setRemoteReady] = useState(false);
  const { user, isAnonymous } = useAuth();

  useEffect(() => {
    let active = true;
    setRemoteReady(false);
    if (!user || !supabase) {
      setRemoteReady(true);
      return () => {
        active = false;
      };
    }
    void Promise.all([
      supabase
        .from("saved_features")
        .select("feature_id")
        .eq("user_id", user.id),
      supabase
        .from("checked_features")
        .select("feature_id")
        .eq("user_id", user.id),
    ]).then(([savedResult, checkedResult]) => {
      if (!active) return;
      if (savedResult.error || checkedResult.error) {
        toast.error("계정 데이터 동기화에 실패해 브라우저 저장을 사용합니다.");
      } else {
        saved.replace(savedResult.data.map(row => row.feature_id));
        checked.replace(checkedResult.data.map(row => row.feature_id));
      }
      setRemoteReady(true);
    });
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !supabase || !remoteReady) return;
    void replaceRemoteList("saved_features", user.id, saved.items).catch(() => {
      toast.error("컬렉션을 계정에 저장하지 못했습니다.");
    });
  }, [saved.items, user, remoteReady]);

  useEffect(() => {
    if (!user || !supabase || !remoteReady) return;
    void replaceRemoteList("checked_features", user.id, checked.items).catch(
      () => {
        toast.error("체크리스트를 계정에 저장하지 못했습니다.");
      }
    );
  }, [checked.items, user, remoteReady]);

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
      {
        description: user
          ? isAnonymous
            ? "임시 세션에 동기화됩니다."
            : "Google 계정에 동기화됩니다."
          : "이 브라우저에 저장됩니다.",
      }
    );
  }

  function toggleChecked(id: string) {
    checked.toggle(id);
    if (user && !isAnonymous)
      toast("체크리스트를 Google 계정에 동기화합니다.");
    else if (user) toast("체크리스트를 임시 세션에 동기화합니다.");
  }

  return (
    <LibraryContext.Provider
      value={{
        saved: saved.items,
        toggleSaved,
        checked: checked.items,
        toggleChecked,
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
