import { describe, expect, it } from "vitest";
import { features } from "./catalog";
import { getCodeExample } from "./codeExamples";

describe("구현 코드 예시", () => {
  it("가이드에 직접 작성된 예시만 복사 가능한 코드로 노출한다", () => {
    const curated = features.filter(feature => feature.codeExample);
    expect(curated.length).toBeGreaterThan(0);

    for (const feature of features) {
      const example = getCodeExample(feature);
      expect(Boolean(example), feature.id).toBe(Boolean(feature.codeExample));
      if (!feature.codeExample) continue;

      expect(example?.code, feature.id).toBe(feature.codeExample.code);
      expect(example?.code.trim().length, feature.id).toBeGreaterThan(40);
      expect(example?.title, feature.id).toBeTruthy();
      expect(example?.preview, feature.id).toBe(feature.category);
      expect(feature.sources.length, feature.id).toBeGreaterThan(0);
      for (const source of feature.sources) {
        expect(source.url, `${feature.id}: ${source.url}`).toMatch(/^https:\/\//);
      }
    }
  });

  it("가이드별 API 계약이 없는 기능에 공통 템플릿을 만들지 않는다", () => {
    const examples = features
      .filter(feature => !feature.codeExample)
      .map(feature => getCodeExample(feature));
    expect(examples.every(example => example === undefined)).toBe(true);
  });
});
