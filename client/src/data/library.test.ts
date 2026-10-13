import { describe, it, expect } from "vitest";
import {
  readStoredList,
  writeStoredList,
  toggleListItem,
  toggleCompareItem,
  type ListStorage,
} from "./library";
function memoryStore(): ListStorage {
  const data = new Map<string, string>();
  return {
    getItem: key => data.get(key) || null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}
describe("내 컬렉션과 체크리스트 로컬 저장", () => {
  it("추가, 저장, 복원, 제거", () => {
    const storage = memoryStore();
    const first = toggleListItem([], "login");
    expect(writeStoredList(storage, "saved", first)).toBe(true);
    expect(readStoredList(storage, "saved")).toEqual(["login"]);
    const removed = toggleListItem(readStoredList(storage, "saved"), "login");
    writeStoredList(storage, "saved", removed);
    expect(readStoredList(storage, "saved")).toEqual([]);
  });
  it("손상된 데이터나 잘못된 형식에서 복구", () => {
    const storage = memoryStore();
    storage.setItem("a", "bad json");
    expect(readStoredList(storage, "a")).toEqual([]);
    storage.setItem("a", '["login",true,42,"login"]');
    expect(readStoredList(storage, "a")).toEqual(["login"]);
    storage.setItem("a", "{}");
    expect(readStoredList(storage, "a")).toEqual([]);
  });
  it("저장 제한 시 실패를 반환하고 화면 상태는 유지 가능", () => {
    const storage = {
      getItem: () => {
        throw Error("blocked");
      },
      setItem: () => {
        throw Error("full");
      },
    };
    expect(readStoredList(storage, "a")).toEqual([]);
    expect(writeStoredList(storage, "a", ["login"])).toBe(false);
  });
  it("가이드와 서비스 체크 상태를 독립적으로 저장", () => {
    const storage = memoryStore();
    const checked = ["login:0", "service:saas:login"];
    writeStoredList(storage, "checked", checked);
    writeStoredList(storage, "saved", ["login"]);
    expect(readStoredList(storage, "checked")).toEqual(checked);
    expect(readStoredList(storage, "saved")).toEqual(["login"]);
  });
});
describe("기능 비교", () => {
  it("최대 3개이며 중복 선택은 해제", () => {
    let ids: string[] = [];
    for (const id of ["login", "payments", "search", "api"])
      ids = toggleCompareItem(ids, id);
    expect(ids).toEqual(["login", "payments", "search"]);
    expect(toggleCompareItem(ids, "payments")).toEqual(["login", "search"]);
  });
  it("원본 상태를 변경하지 않음", () => {
    const ids = ["login"];
    expect(toggleCompareItem(ids, "payments")).toEqual(["login", "payments"]);
    expect(ids).toEqual(["login"]);
  });
});
