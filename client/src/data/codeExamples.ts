import type { Feature } from "./catalog";

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  preview: Feature["category"];
  steps?: string[];
  prerequisites?: string[];
  categoryPattern?: boolean;
}

const copyableCorePatterns: Record<
  Feature["category"],
  (feature: Feature) => Omit<CodeExample, "preview">
> = {
  ai: feature => ({
    title: `${feature.title} 핵심 로직`,
    language: "TypeScript",
    code: `type Candidate = { id: string; text: string; score: number };\n\nexport function selectGroundedAnswer<T extends Candidate>(\n  candidates: T[],\n  minimumScore: number,\n): T[] {\n  if (!Number.isFinite(minimumScore)) throw new Error("기준 점수가 올바르지 않습니다.");\n  return candidates\n    .filter(item => item.text.trim().length > 0 && item.score >= minimumScore)\n    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));\n}\n\n// ${feature.title}: 생성 결과를 확정하거나 외부 동작을 실행하기 전에 근거와 권한을 확인하세요.`,
    prerequisites: [
      "외부 모델 호출과 공급자별 SDK는 포함하지 않은 순수 TypeScript 핵심 로직입니다.",
      "점수 기준은 검증 데이터로 조정하고, 결과를 사용자에게 보여주기 전에 출처와 권한을 확인하세요.",
    ],
  }),
  auth: feature => ({
    title: `${feature.title} 권한 확인`,
    language: "TypeScript",
    code: `type Permission = { subjectId: string; resourceId: string; action: string; allowed: boolean };\n\nexport function canAccess(\n  permissions: Permission[],\n  subjectId: string,\n  resourceId: string,\n  action: string,\n): boolean {\n  if (!subjectId || !resourceId || !action) return false;\n  return permissions.some(rule =>\n    rule.subjectId === subjectId && rule.resourceId === resourceId &&\n    rule.action === action && rule.allowed\n  );\n}\n\n// ${feature.title}: 실제 인증·권한 원본은 서버에서 검증해야 합니다.`,
    prerequisites: [
      "클라이언트 UI만으로 접근을 허용하지 말고, 서버에서 세션과 리소스 소유권을 다시 확인하세요.",
    ],
  }),
  booking: feature => ({
    title: `${feature.title} 시간 범위 검사`,
    language: "TypeScript",
    code: `type Interval = { start: number; end: number };\n\nexport function isAvailable(\n  requested: Interval,\n  reserved: Interval[],\n  bufferMs = 0,\n): boolean {\n  if (![requested.start, requested.end, bufferMs].every(Number.isFinite) ||\n      requested.start >= requested.end || bufferMs < 0) return false;\n  return reserved.every(slot =>\n    requested.end + bufferMs <= slot.start || slot.end + bufferMs <= requested.start\n  );\n}\n\n// ${feature.title}: 동시 요청은 데이터베이스 제약 또는 트랜잭션으로도 막아야 합니다.`,
    prerequisites: [
      "시간 단위와 시간대 기준을 통일하세요.",
      "이 검사는 사전 안내용이며 동시 예약 방지는 저장소의 원자적 제약이 필요합니다.",
    ],
  }),
  commerce: feature => ({
    title: `${feature.title} 금액 계산`,
    language: "TypeScript",
    code: `type LineItem = { unitPrice: number; quantity: number };\n\nexport function subtotal(items: LineItem[]): number {\n  return items.reduce((sum, item) => {\n    if (!Number.isSafeInteger(item.unitPrice) || item.unitPrice < 0 ||\n        !Number.isSafeInteger(item.quantity) || item.quantity < 0) {\n      throw new Error("상품 금액 또는 수량이 올바르지 않습니다.");\n    }\n    const line = item.unitPrice * item.quantity;\n    if (!Number.isSafeInteger(line) || !Number.isSafeInteger(sum + line)) {\n      throw new Error("금액 범위를 초과했습니다.");\n    }\n    return sum + line;\n  }, 0);\n}\n\n// ${feature.title}: 최종 가격·통화·세금은 서버의 신뢰 가능한 상품 데이터로 계산하세요.`,
    prerequisites: [
      "금액은 부동소수점 대신 최소 화폐 단위의 정수로 처리하세요.",
      "결제 승인과 환불은 결제 사업자 API 및 서버 검증을 별도로 연결해야 합니다.",
    ],
  }),
  communication: feature => ({
    title: `${feature.title} 대상 결정`,
    language: "TypeScript",
    code: `type Recipient = { id: string; enabled: boolean; channel: string };\n\nexport function eligibleRecipients(\n  recipients: Recipient[],\n  channel: string,\n): string[] {\n  if (!channel.trim()) return [];\n  return [...new Set(recipients\n    .filter(user => user.enabled && user.channel === channel)\n    .map(user => user.id)\n    .filter(id => id.length > 0))];\n}\n\n// ${feature.title}: 발송 전 수신 동의, 구독 해지와 재시도 중복 방지를 확인하세요.`,
    prerequisites: [
      "이 코드는 발송 대상 선택만 처리합니다. 이메일·푸시·채팅 공급자 연동은 포함하지 않습니다.",
      "수신 동의와 수신 거부 상태를 발송 직전에 다시 확인하세요.",
    ],
  }),
  content: feature => ({
    title: `${feature.title} 공개 항목 선택`,
    language: "TypeScript",
    code: `type ContentRecord = { id: string; status: "draft" | "scheduled" | "published"; publishAt: number };\n\nexport function visibleContent<T extends ContentRecord>(\n  items: T[],\n  now = Date.now(),\n): T[] {\n  if (!Number.isFinite(now)) throw new Error("기준 시각이 올바르지 않습니다.");\n  return items\n    .filter(item => item.status === "published" && item.publishAt <= now)\n    .sort((a, b) => b.publishAt - a.publishAt || a.id.localeCompare(b.id));\n}\n\n// ${feature.title}: 공개 여부와 접근 권한은 서버 응답에서도 확인하세요.`,
    prerequisites: [
      "시간은 epoch milliseconds 기준입니다.",
      "실제 파일 저장·변환·편집 API는 서비스에 맞게 별도로 연결해야 합니다.",
    ],
  }),
  search: feature => ({
    title: `${feature.title} 검색 결과`,
    language: "TypeScript",
    code: `type SearchItem = { id: string; title: string; description: string };\n\nexport function searchItems<T extends SearchItem>(items: T[], query: string): T[] {\n  const terms = query.trim().toLocaleLowerCase().split(/\\s+/).filter(Boolean);\n  if (terms.length === 0) return [];\n  return items\n    .map(item => ({ item, text: (item.title + " " + item.description).toLocaleLowerCase() }))\n    .filter(row => terms.every(term => row.text.includes(term)))\n    .map(row => row.item);\n}\n\n// ${feature.title}: 대규모·다국어 검색은 색인과 언어 분석기를 사용하세요.`,
    prerequisites: [
      "예제는 이미 로드된 항목에서 부분 문자열을 찾습니다. 전체 텍스트 엔진·동의어·자동완성 API는 포함하지 않습니다.",
    ],
  }),
  operations: feature => ({
    title: `${feature.title} 입력 경계 검사`,
    language: "TypeScript",
    code: `export function withinLimit(value: number, maximum: number): boolean {\n  return Number.isSafeInteger(value) && Number.isSafeInteger(maximum) &&\n    value >= 0 && maximum >= 0 && value <= maximum;\n}\n\nexport function boundedWindow<T>(items: T[], limit: number): T[] {\n  if (!Number.isSafeInteger(limit) || limit < 0) throw new Error("한도가 올바르지 않습니다.");\n  return items.slice(0, limit);\n}\n\n// ${feature.title}: 서버 저장소, 분산 잠금, 경보 전송은 이 로직만으로 대체되지 않습니다.`,
    prerequisites: [
      "요청 제한·감사·백업·모니터링은 여러 서버에서 일관되게 적용되도록 저장소와 운영 환경에 연결하세요.",
    ],
  }),
  forms: feature => ({
    title: `${feature.title} 필수 입력 검증`,
    language: "TypeScript",
    code: `type FormValues = Record<string, unknown>;\n\nexport function missingRequired(values: FormValues, required: string[]): string[] {\n  return required.filter(key => {\n    const value = values[key];\n    return value === undefined || value === null ||\n      (typeof value === "string" && value.trim() === "");\n  });\n}\n\nexport function canSubmit(values: FormValues, required: string[]): boolean {\n  return missingRequired(values, required).length === 0;\n}\n\n// ${feature.title}: 서버에서도 같은 규칙과 파일 검사를 다시 적용하세요.`,
    prerequisites: [
      "필드별 형식·길이·허용값은 별도 스키마로 검증하세요.",
      "클라이언트 검증은 서버 검증을 대체하지 않습니다.",
    ],
  }),
  data: feature => ({
    title: `${feature.title} 데이터 검증`,
    language: "TypeScript",
    code: `type Row = Record<string, unknown>;\n\nexport function validateRows(rows: Row[], required: string[]): { valid: Row[]; invalid: number[] } {\n  const valid: Row[] = [];\n  const invalid: number[] = [];\n  rows.forEach((row, index) => {\n    const ok = required.every(key => row[key] !== undefined && row[key] !== null && row[key] !== "");\n    if (ok) valid.push(row); else invalid.push(index);\n  });\n  return { valid, invalid };\n}\n\n// ${feature.title}: 실제 컬럼 타입, 크기와 개인정보 정책을 반영하세요.`,
    prerequisites: [
      "예시는 필수 열 존재 여부만 확인합니다. CSV 파싱·내보내기·파일 생성은 라이브러리별 계약을 따르세요.",
    ],
  }),
  documents: feature => ({
    title: `${feature.title} 문서 값 검증`,
    language: "TypeScript",
    code: `export function renderPlainTemplate(template: string, values: Record<string, string>): string {\n  return template.replace(/\\{\\{([a-zA-Z0-9_]+)\\}\\}/g, (_match, key: string) => {\n    if (!Object.prototype.hasOwnProperty.call(values, key)) throw new Error("템플릿 값이 없습니다: " + key);\n    return values[key];\n  });\n}\n\n// ${feature.title}: HTML 출력 시 이스케이프하고 문서 접근 권한을 확인하세요.`,
    prerequisites: [
      "이 예제는 일반 텍스트 템플릿만 처리하며 PDF·OCR·전자서명 공급자 연동을 구현하지 않습니다.",
      "HTML에 삽입할 값은 문맥에 맞게 이스케이프하세요.",
    ],
  }),
  learning: feature => ({
    title: `${feature.title} 진도 계산`,
    language: "TypeScript",
    code: `export function completionPercent(completed: number, total: number): number | null {\n  if (!Number.isSafeInteger(completed) || !Number.isSafeInteger(total) ||\n      completed < 0 || total < 0 || completed > total) {\n    throw new Error("진도 값이 올바르지 않습니다.");\n  }\n  return total === 0 ? null : Math.round((completed / total) * 100);\n}\n\n// ${feature.title}: 완료 조건과 평가 기준은 서비스 정책에 맞춰 정의하세요.`,
    prerequisites: [
      "진도 원본은 사용자·강좌 권한을 검증한 서버 데이터로 가져오세요.",
    ],
  }),
  logistics: feature => ({
    title: `${feature.title} 수량 검사`,
    language: "TypeScript",
    code: `export function availableQuantity(onHand: number, reserved: number): number {\n  if (![onHand, reserved].every(Number.isSafeInteger) || onHand < 0 || reserved < 0) {\n    throw new Error("재고 수량이 올바르지 않습니다.");\n  }\n  return Math.max(0, onHand - reserved);\n}\n\nexport function canAllocate(requested: number, onHand: number, reserved: number): boolean {\n  return Number.isSafeInteger(requested) && requested > 0 &&\n    requested <= availableQuantity(onHand, reserved);\n}\n\n// ${feature.title}: 동시 입출고는 트랜잭션 또는 원자적 갱신으로 보호하세요.`,
    prerequisites: [
      "이 예제는 정수 수량만 다룹니다. 재고 예약과 출고는 트랜잭션·멱등성 키로 중복 처리를 방지하세요.",
    ],
  }),
  maps: feature => ({
    title: `${feature.title} 좌표 거리 계산`,
    language: "TypeScript",
    code: `type Point = { latitude: number; longitude: number };\n\nexport function distanceMeters(a: Point, b: Point): number {\n  const valid = (p: Point) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude) &&\n    Math.abs(p.latitude) <= 90 && Math.abs(p.longitude) <= 180;\n  if (!valid(a) || !valid(b)) throw new Error("좌표 범위를 확인하세요.");\n  const radians = (degrees: number) => degrees * Math.PI / 180;\n  const dLat = radians(b.latitude - a.latitude);\n  const dLon = radians(b.longitude - a.longitude);\n  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLon / 2) ** 2;\n  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));\n}\n\n// ${feature.title}: 주소 검색·경로 API와 지도 SDK 코드는 포함하지 않습니다.`,
    prerequisites: [
      "거리 비교용 순수 TypeScript 예시입니다. 주소·경로·지도 공급자 API 및 위치 권한 처리는 별도 구현이 필요합니다.",
    ],
  }),
  mobile: feature => ({
    title: `${feature.title} 브라우저 기능 확인`,
    language: "TypeScript",
    code: `export function supportsFeature(available: boolean, secureContext: boolean): boolean {\n  return secureContext && available;\n}\n\nexport function shouldOfferFallback(supported: boolean, permissionGranted: boolean): boolean {\n  return !supported || !permissionGranted;\n}\n\n// ${feature.title}: 사용 전에 기능 지원과 권한 상태를 확인하고 대체 입력 경로를 제공하세요.`,
    prerequisites: [
      "기기 API와 권한 이름은 브라우저별 공식 문서에서 확인하세요.",
      "사용자 동의 없이 카메라·마이크·위치 권한을 요청하지 마세요.",
    ],
  }),
  organizations: feature => ({
    title: `${feature.title} 조직 범위 확인`,
    language: "TypeScript",
    code: `type ScopedRecord = { organizationId: string; ownerId: string };\n\nexport function belongsToOrganization<T extends ScopedRecord>(\n  record: T, organizationId: string, actorId: string, isAdmin: boolean,\n): boolean {\n  if (!organizationId || !actorId || record.organizationId !== organizationId) return false;\n  return isAdmin || record.ownerId === actorId;\n}\n\n// ${feature.title}: 조직 ID와 역할은 신뢰할 수 있는 서버 세션에서 가져오세요.`,
    prerequisites: [
      "테넌트 식별자를 요청 본문에서 그대로 신뢰하지 마세요.",
      "DB 행 수준 정책 또는 동등한 서버 권한 검사를 모든 쿼리에 적용하세요.",
    ],
  }),
  algorithms: feature => ({
    title: `${feature.title} 알고리즘 핵심 로직`,
    language: "TypeScript",
    code: `type ScoredItem = { id: string; score: number };\n\nexport function rankCandidates<T extends ScoredItem>(items: T[], limit: number): T[] {\n  if (!Number.isSafeInteger(limit) || limit < 0) throw new Error("결과 한도가 올바르지 않습니다.");\n  return items\n    .filter(item => Number.isFinite(item.score))\n    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))\n    .slice(0, limit);\n}\n\n// ${feature.title}: 운영 입력에 맞는 목적 함수·제약·평가 기준으로 교체하세요.`,
    prerequisites: [
      "동점 처리와 입력 데이터의 범위를 확인하세요.",
      "이 예제는 결정적 점수 정렬의 핵심 로직이며, 해당 알고리즘의 전체 운영 시스템을 대체하지 않습니다.",
    ],
  }),
  "developer-tools": feature => ({
    title: `${feature.title} 요청 검증`,
    language: "TypeScript",
    code: `export function isValidRequestId(value: string): boolean {\n  return /^[A-Za-z0-9_-]{16,128}$/.test(value);\n}\n\nexport function canRetry(status: number, attempt: number, maximumAttempts: number): boolean {\n  return Number.isInteger(status) && status >= 500 &&\n    Number.isInteger(attempt) && attempt >= 0 &&\n    Number.isInteger(maximumAttempts) && attempt < maximumAttempts;\n}\n\n// ${feature.title}: 키 보관·서명 검증·로그 마스킹은 서버의 신뢰 경계에서 처리하세요.`,
    prerequisites: [
      "예시는 요청 식별자 형식과 재시도 여부만 판정합니다. 인증, 서명, 영속화는 서비스 공식 API를 연결하세요.",
    ],
  }),
  "trust-safety": feature => ({
    title: `${feature.title} 검토 대기 분류`,
    language: "TypeScript",
    code: `type ReviewItem = { id: string; riskScore: number; reported: boolean };\n\nexport function moderationQueue<T extends ReviewItem>(items: T[], threshold: number): T[] {\n  if (!Number.isFinite(threshold)) throw new Error("검토 기준이 올바르지 않습니다.");\n  return items\n    .filter(item => item.reported || item.riskScore >= threshold)\n    .sort((a, b) => Number(b.reported) - Number(a.reported) || b.riskScore - a.riskScore);\n}\n\n// ${feature.title}: 자동 점수만으로 계정·콘텐츠에 불이익을 확정하지 마세요.`,
    prerequisites: [
      "민감 속성을 점수에 사용하지 말고, 사람 검토·이의 제기·감사 기록을 제공하세요.",
    ],
  }),
  performance: feature => ({
    title: `${feature.title} 제한된 재시도`,
    language: "TypeScript",
    code: `export function retryDelayMs(attempt: number, baseMs: number, maximumMs: number): number {\n  if (![attempt, baseMs, maximumMs].every(Number.isFinite) ||\n      attempt < 0 || baseMs < 0 || maximumMs < baseMs) throw new Error("재시도 설정이 올바르지 않습니다.");\n  return Math.min(maximumMs, baseMs * 2 ** Math.min(Math.floor(attempt), 30));\n}\n\n// ${feature.title}: 타임아웃·취소·지터·재시도 가능한 오류 분류를 함께 설계하세요.`,
    prerequisites: [
      "예제는 지수 지연 값만 계산하며 큐·캐시·연결 풀·추적 시스템의 구현은 포함하지 않습니다.",
    ],
  }),
  accessibility: feature => ({
    title: `${feature.title} 키보드 상호작용`,
    language: "TypeScript",
    code: `export function nextIndex(current: number, count: number, key: string): number {\n  if (!Number.isSafeInteger(count) || count <= 0) return -1;\n  if (!Number.isInteger(current) || current < 0 || current >= count) return 0;\n  if (key === "Home") return 0;\n  if (key === "End") return count - 1;\n  if (key === "ArrowRight" || key === "ArrowDown") return (current + 1) % count;\n  if (key === "ArrowLeft" || key === "ArrowUp") return (current - 1 + count) % count;\n  return current;\n}\n\n// ${feature.title}: 컴포넌트 역할·포커스 표시·스크린리더 알림도 함께 구현하세요.`,
    prerequisites: [
      "실제 위젯의 키보드 동작은 해당 ARIA 패턴과 브라우저·보조기기 조합으로 확인하세요.",
    ],
  }),
};

/** Return a guide-authored snippet or a labeled, dependency-free core pattern for its category. */
export function getCodeExample(feature: Feature): CodeExample | undefined {
  if (!feature.codeExample)
    return {
      ...copyableCorePatterns[feature.category](feature),
      preview: feature.category,
      steps: feature.flow,
      categoryPattern: true,
    };
  return {
    ...feature.codeExample,
    preview: feature.category,
    steps: feature.flow,
  };
}
