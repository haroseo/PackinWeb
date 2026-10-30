import ts from "typescript";
import { getCodeExample } from "../client/src/data/codeExamples";
import type { Feature } from "../shared/catalog";
import fs from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "client/src/data");
const dataFiles = fs
  .readdirSync(dataDirectory)
  .filter(file => file.endsWith(".json"));
const features = dataFiles.flatMap(file => {
  const records = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, file), "utf8")
  ) as Array<Record<string, unknown>>;
  return records.map(
    record =>
      ({
        ...record,
        flow: (record.flow as string[] | undefined) ?? [],
      }) as unknown as Feature
  );
});
const examples = features.map(feature => ({
  feature,
  example: getCodeExample(feature),
}));
const missing = examples.filter(({ example }) => !example);
if (missing.length) {
  throw new Error(
    `코드 예시가 없는 기능: ${missing.map(({ feature }) => feature.id).join(", ")}`
  );
}
const unsupported = examples.filter(
  ({ example }) =>
    example?.language !== "TypeScript" && example?.language !== "SQL"
);
if (unsupported.length) {
  throw new Error(
    `지원하지 않는 코드 언어: ${unsupported.map(({ feature, example }) => `${feature.id} (${example?.language ?? "없음"})`).join(", ")}`
  );
}

const keyOf = (fileName: string) =>
  ts.sys.resolvePath(fileName).replace(/\\/g, "/").toLowerCase();
const virtualFiles = new Map(
  examples
    .filter(({ example }) => example?.language === "TypeScript")
    .map(({ feature, example }) => [
      keyOf(`${process.cwd()}/.code-example-check/${feature.id}.ts`),
      example!.code,
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
host.fileExists = fileName =>
  virtualFiles.has(keyOf(fileName)) || fileExists(fileName);
host.readFile = fileName =>
  virtualFiles.get(keyOf(fileName)) ?? readFile(fileName);
host.getSourceFile = (
  fileName,
  languageVersion,
  onError,
  shouldCreateNewSourceFile
) => {
  const source = virtualFiles.get(keyOf(fileName));
  if (source !== undefined)
    return ts.createSourceFile(fileName, source, languageVersion);
  return getSourceFile(
    fileName,
    languageVersion,
    onError,
    shouldCreateNewSourceFile
  );
};

const program = ts.createProgram({
  rootNames: [...virtualFiles.keys()],
  options,
  host,
});
const diagnostics = ts
  .getPreEmitDiagnostics(program)
  .filter(
    diagnostic =>
      diagnostic.file && virtualFiles.has(keyOf(diagnostic.file.fileName))
  );
if (diagnostics.length) {
  throw new Error(
    diagnostics
      .map(diagnostic => {
        const source = diagnostic.file!;
        const featureId = [...virtualFiles.keys()].find(
          path => keyOf(source.fileName) === path
        );
        const { line, character } = source.getLineAndCharacterOfPosition(
          diagnostic.start ?? 0
        );
        return `${featureId}:${line + 1}:${character + 1} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`;
      })
      .join("\n")
  );
}

console.log(
  `Strict TypeScript check passed: ${virtualFiles.size} snippets. ${examples.length - virtualFiles.size} SQL snippets were excluded from the TypeScript compiler.`
);
