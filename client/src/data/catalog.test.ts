import { describe, it, expect } from "vitest";
import {
  categories,
  features,
  filterFeatures,
  serviceTemplates,
  type Feature,
} from "./catalog";
const fixture: Feature = {
  id: "sample",
  title: "이메일 로그인",
  english: "Email login",
  category: "auth",
  description: "이메일로 로그인하는 기능",
  difficulty: "입문",
  purposes: ["SaaS"],
  essential: true,
  overview: "개요",
  why: "이유",
  flow: ["1", "2", "3", "4"],
  components: ["1", "2", "3", "4"],
  exceptions: ["1", "2"],
  security: "보안",
  privacy: "개인정보",
  accessibility: "접근성",
  legal: "법률",
  checklist: ["1", "2", "3", "4"],
  options: [{ name: "A", pros: "장점", cons: "단점", bestFor: "적합" }],
  related: [],
  sources: [{ title: "공식", url: "https://example.com" }],
};
describe("검색과 필터", () => {
  const items = [
    fixture,
    {
      ...fixture,
      id: "payment",
      title: "온라인 결제",
      english: "Online payments",
      description: "온라인에서 상품 결제를 처리하는 기능",
      category: "commerce" as const,
      difficulty: "고급" as const,
      purposes: ["커머스"],
    },
    {
      ...fixture,
      id: "common",
      title: "웹 보안",
      english: "Security",
      description: "웹 요청을 안전하게 보호하는 기능",
      category: "operations" as const,
      difficulty: "중급" as const,
      purposes: ["공통"],
    },
  ];
  it("한글과 영문 대소문자 무관 검색", () => {
    expect(filterFeatures(items, { query: "로그인" }).map(f => f.id)).toEqual([
      "sample",
    ]);
    expect(
      filterFeatures(items, { query: "  EMAIL  " }).map(f => f.id)
    ).toEqual(["sample"]);
  });
  it("분류와 난이도와 사용 목적 교집합", () => {
    expect(
      filterFeatures(items, {
        category: "commerce",
        difficulty: "고급",
        purpose: "커머스",
      }).map(f => f.id)
    ).toEqual(["payment"]);
    expect(
      filterFeatures(items, { category: "commerce", difficulty: "입문" })
    ).toHaveLength(0);
  });
  it("공통 기능을 각 서비스 목적에 포함", () => {
    expect(filterFeatures(items, { purpose: "SaaS" }).map(f => f.id)).toEqual(
      expect.arrayContaining(["sample", "common"])
    );
    expect(
      filterFeatures(items, { purpose: "SaaS" }).some(f => f.id === "payment")
    ).toBe(false);
  });
  it("쉬운 난이도부터 정렬하고 원본은 변경하지 않음", () => {
    const ids = items.map(f => f.id);
    expect(
      filterFeatures(items, { sort: "difficulty" }).map(f => f.id)
    ).toEqual(["sample", "common", "payment"]);
    expect(items.map(f => f.id)).toEqual(ids);
  });
  it("검색 결과 없음", () =>
    expect(filterFeatures(items, { query: "존재하지않는기능" })).toEqual([]));
});
describe("전체 레퍼런스 데이터", () => {
  it("16개 분야에서 총 108개 고유 기능 제공", () => {
    expect(categories).toHaveLength(16);
    expect(features).toHaveLength(108);
    expect(new Set(features.map(f => f.id)).size).toBe(108);
    categories.forEach(c =>
      expect(features.filter(f => f.category === c.id)).toHaveLength(
        [
          "auth",
          "commerce",
          "content",
          "search",
          "communication",
          "operations",
        ].includes(c.id)
          ? 8
          : 6
      )
    );
  });
  it("모든 가이드가 상세 안내와 구현 점검을 갖춤", () => {
    for (const f of features) {
      for (const field of [
        "purposes",
        "flow",
        "components",
        "exceptions",
        "checklist",
        "related",
      ] as const) {
        expect(Array.isArray(f[field]), `${f.id}.${field} 배열 형식`).toBe(
          true
        );
        expect(
          f[field].every(value => typeof value === "string"),
          `${f.id}.${field} 문자열 항목`
        ).toBe(true);
      }
      expect(Array.isArray(f.options), `${f.id}.options`).toBe(true);
      expect(Array.isArray(f.sources), `${f.id}.sources`).toBe(true);
      for (const field of [
        "overview",
        "why",
        "security",
        "privacy",
        "accessibility",
        "legal",
      ] as const)
        expect(f[field].length, `${f.id}.${field}`).toBeGreaterThan(15);
      expect(f.flow.length).toBeGreaterThanOrEqual(4);
      expect(f.components.length).toBeGreaterThanOrEqual(4);
      expect(f.exceptions.length).toBeGreaterThanOrEqual(2);
      expect(f.checklist.length).toBeGreaterThanOrEqual(4);
      expect(f.options.length).toBeGreaterThanOrEqual(2);
      expect(["입문", "중급", "고급"]).toContain(f.difficulty);
      expect(f.sources.length).toBeGreaterThanOrEqual(1);
      for (const source of f.sources) {
        expect(source.url).toMatch(/^https:\/\//);
        expect(() => new URL(source.url)).not.toThrow();
      }
    }
  });
  it("연관 기능과 서비스 템플릿의 참조가 유효", () => {
    const ids = new Set(features.map(f => f.id));
    for (const f of features) {
      expect(f.related.length).toBeGreaterThanOrEqual(3);
      f.related.forEach(id => {
        expect(ids.has(id), `${f.id} -> ${id}`).toBe(true);
        expect(id).not.toBe(f.id);
      });
    }
    for (const template of serviceTemplates) {
      expect(template.ids).toHaveLength(10);
      template.ids.forEach(id =>
        expect(ids.has(id), `${template.id} -> ${id}`).toBe(true)
      );
    }
  });
});
