import { describe, expect, it } from "vitest";
import ts from "typescript";
import { features } from "./catalog";

const expanded = features.filter(feature => feature.codeExample);
function exampleExports(id: string) {
  const code = features.find(feature => feature.id === id)!.codeExample!.code;
  const js = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const exports: Record<string, (...args: any[]) => any> = {};
  new Function("exports", js)(exports);
  return exports;
}
describe("확장 분야의 실제 가이드와 예시", () => {
  it("새 가이드 60개가 서로 다른 전용 코드 예시를 제공", () => {
    expect(expanded).toHaveLength(60);
    expect(
      new Set(expanded.map(feature => feature.codeExample!.code)).size
    ).toBe(60);
    const syntaxErrors: string[] = [];
    for (const feature of expanded) {
      expect(feature.sources.length, feature.id).toBeGreaterThanOrEqual(2);
      if (feature.codeExample!.language !== "TypeScript") continue;
      const result = ts.transpileModule(feature.codeExample!.code, {
        reportDiagnostics: true,
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      });
      syntaxErrors.push(
        ...(result.diagnostics || [])
          .filter(d => d.category === ts.DiagnosticCategory.Error)
          .map(
            d =>
              feature.id +
              ": " +
              ts.flattenDiagnosticMessageText(d.messageText, " ")
          )
      );
    }
    expect(syntaxErrors).toEqual([]);
  });
  it("CSV의 구분자·수식과 문서 템플릿의 누락 값을 처리", () => {
    const { quoteCsvText } = exampleExports("spreadsheet-export");
    expect(quoteCsvText('a,"b"')).toBe('"a,""b"""');
    expect(quoteCsvText("  =1+1")).toBe('"\'  =1+1"');
    const { validateQuantityRows } = exampleExports("csv-import");
    expect(
      validateQuantityRows([
        ["A", "12"],
        ["B", "abc"],
      ]).map((r: { valid: boolean }) => r.valid)
    ).toEqual([true, false]);
    const { renderPlainTemplate } = exampleExports("document-templates");
    expect(renderPlainTemplate("이름: {{name}}", { name: "서주원" })).toBe(
      "이름: 서주원"
    );
    expect(() => renderPlainTemplate("{{missing}}", {})).toThrow();
  });
  it("예약 경계와 준비 시간을 판정", () => {
    const { available } = exampleExports("booking-slots");
    expect(available({ start: 10, end: 20 }, [{ start: 20, end: 30 }])).toBe(
      true
    );
    expect(available({ start: 10, end: 20 }, [{ start: 20, end: 30 }], 1)).toBe(
      false
    );
    expect(available({ start: 20, end: 10 }, [])).toBe(false);
  });
  it("알 수 없는 AI 추출 값과 빈 설문 분모를 구분", () => {
    const { validateExtracted } = exampleExports("ai-extraction");
    expect(
      validateExtracted({ reference: "A", quantity: null }).quantity
    ).toBeNull();
    expect(() => validateExtracted({ reference: "A", quantity: -1 })).toThrow();
    const { percent } = exampleExports("survey-results");
    expect(percent(0, 0)).toBeNull();
    expect(percent(1, 4)).toBe(25);
  });
  it("조직 간 큐 전송과 수량 초과·미검수 입고를 차단", () => {
    const { readyToSync } = exampleExports("offline-sync");
    expect(readyToSync({ id: "1", ownerId: "A", baseVersion: 2 }, "B", 2)).toBe(
      "wrong-account"
    );
    expect(readyToSync({ id: "1", ownerId: "A", baseVersion: 2 }, "A", 3)).toBe(
      "conflict"
    );
    const { remainingToShip } = exampleExports("split-shipments");
    expect(remainingToShip(5, 1, [2])).toBe(2);
    expect(() => remainingToShip(2, 1, [2])).toThrow();
    const { mayRestock } = exampleExports("return-inspection");
    expect(
      mayRestock({ received: true, inspected: false, condition: "resellable" })
    ).toBe(false);
  });
});
