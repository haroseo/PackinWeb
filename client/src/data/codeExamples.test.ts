import { describe, expect, it } from "vitest";
import { features } from "./catalog";
import { getCodeExample } from "./codeExamples";

describe("구현 코드 예시", () => {
  it("모든 기능에 복사 가능한 직접 예시 또는 카테고리 핵심 로직 패턴을 제공한다", () => {
    const curated = features.filter(feature => feature.codeExample);
    expect(curated.length).toBeGreaterThan(0);
    expect(features.length).toBe(228);

    for (const feature of features) {
      const example = getCodeExample(feature);
      expect(example, feature.id).toBeDefined();
      expect(example?.code.trim().length, feature.id).toBeGreaterThan(40);
      expect(example?.title, feature.id).toBeTruthy();
      expect(example?.preview, feature.id).toBe(feature.category);
      expect(feature.sources.length, feature.id).toBeGreaterThan(0);
      expect(example?.categoryPattern, feature.id).toBe(!feature.codeExample);
      if (feature.codeExample) {
        expect(example?.code, feature.id).toBe(feature.codeExample.code);
      }
      for (const source of feature.sources) {
        expect(source.url, `${feature.id}: ${source.url}`).toMatch(/^https:\/\//);
      }
    }
  });

  it("가이드에 직접 작성된 코드는 기존 내용과 준비 조건을 유지한다", () => {
    for (const feature of features.filter(item => item.codeExample)) {
      const example = getCodeExample(feature)!;
      expect(example.code).toBe(feature.codeExample!.code);
      expect(example.categoryPattern).toBeUndefined();
    }
  });
});
