import { describe, expect, it } from "vitest";
import { features } from "./catalog";
import { getCodeExample } from "./codeExamples";

describe("구현 코드 예시", () => {
  it("모든 기능이 비어 있지 않은 코드와 미리보기를 갖는다", () => {
    for (const feature of features) {
      const example = getCodeExample(feature);
      expect(example.code.length, feature.id).toBeGreaterThan(80);
      expect(example.title, feature.id).toBeTruthy();
      expect(example.preview, feature.id).toBe(feature.category);
    }
  });

  it("fallback 코드가 선언되지 않은 response를 호출하지 않는다", () => {
    for (const feature of features) {
      const code = getCodeExample(feature).code;
      if (
        !feature.codeExample &&
        ![
          "login",
          "payments",
          "search",
          "uploads",
          "notifications",
          "api",
        ].includes(feature.id)
      ) {
        expect(code).not.toContain("return response.json(");
        expect(code).toContain("return created;");
        expect(code).toContain("session: { userId: string }");
      }
    }
  });
});
