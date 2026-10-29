import { describe, expect, it, vi } from "vitest";
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
  it("가이드별 전용 코드 예시만 중복 없이 제공", () => {
    expect(expanded).toHaveLength(59);
    expect(
      new Set(expanded.map(feature => feature.codeExample!.code)).size
    ).toBe(59);
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
  it("복사 가능한 TypeScript 예시를 strict 모드로 타입 검사", () => {
    const snippets = expanded.filter(
      feature => feature.codeExample!.language === "TypeScript"
    );
    const keyOf = (fileName: string) =>
      ts.sys.resolvePath(fileName).replace(/\\/g, "/").toLowerCase();
    const virtualFiles = new Map(
      snippets.map(feature => [
        keyOf(`${process.cwd()}/.code-example-check/${feature.id}.ts`),
        feature.codeExample!.code,
      ])
    );
    const options: ts.CompilerOptions = {
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
    };
    const host = ts.createCompilerHost(options);
    const fileExists = host.fileExists.bind(host);
    const readFile = host.readFile.bind(host);
    const getSourceFile = host.getSourceFile.bind(host);
    host.fileExists = fileName => virtualFiles.has(keyOf(fileName)) || fileExists(fileName);
    host.readFile = fileName => virtualFiles.get(keyOf(fileName)) ?? readFile(fileName);
    host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
      const source = virtualFiles.get(keyOf(fileName));
      if (source !== undefined) return ts.createSourceFile(fileName, source, languageVersion);
      return getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    };
    const program = ts.createProgram({
      rootNames: [...virtualFiles.keys()],
      options,
      host,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program).filter(
      diagnostic => diagnostic.file && virtualFiles.has(keyOf(diagnostic.file.fileName))
    );
    expect(
      diagnostics.map(diagnostic => {
        const featureId = [...virtualFiles.keys()].find(
          file => keyOf(diagnostic.file!.fileName) === file
        );
        return `${featureId}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`;
      })
    ).toEqual([]);
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
  it("주소 자동완성은 짧은 입력을 생략하고 서버 응답을 검증", async () => {
    const { suggestAddress } = exampleExports("address-autocomplete");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: "place-1", label: "서울 마포구" }]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("location", { origin: "https://packinweb.test" });
    vi.stubGlobal("fetch", fetchMock);
    try {
      expect(await suggestAddress("서울", new AbortController().signal)).toEqual([
        { id: "place-1", label: "서울 마포구" },
      ]);
      expect(fetchMock.mock.calls[0][0].searchParams.get("q")).toBe("서울");
      expect(await suggestAddress(" ")).toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [] }), { status: 200 })
      );
      await expect(suggestAddress("부산")).rejects.toThrow(
        "주소 응답 형식이 올바르지 않습니다."
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it("카메라 예제는 비디오 스트림을 반환하고 모든 트랙을 종료", async () => {
    const track = { stop: vi.fn() };
    const stream = { getTracks: () => [track] };
    const getUserMedia = vi.fn().mockResolvedValue(stream);
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });
    try {
      const { openCamera } = exampleExports("camera-qr");
      const camera = await openCamera();
      expect(camera.stream).toBe(stream);
      camera.stop();
      expect(track.stop).toHaveBeenCalledOnce();
    } finally {
      vi.unstubAllGlobals();
    }
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
