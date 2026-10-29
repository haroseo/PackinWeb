import type { Feature } from "./catalog";

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  preview: Feature["category"];
  steps?: string[];
  prerequisites?: string[];
}

/**
 * Only show examples that are written beside their feature guide and reviewed
 * with that guide's references. Do not synthesize a copyable snippet for an
 * unrelated feature: a plausible-looking generic template is not an example.
 */
export function getCodeExample(feature: Feature): CodeExample | undefined {
  if (!feature.codeExample) return undefined;
  return {
    ...feature.codeExample,
    preview: feature.category,
    steps: feature.flow,
  };
}
