import type { Feature } from "@shared/catalog";
export { categories } from "@shared/catalog";
export type { Feature, CategoryId, Difficulty } from "@shared/catalog";
const modules = import.meta.glob(["./*.json", "!./expanded-guides.json", "!./remaining-guides.json"], {
  eager: true,
  import: "default",
});
export const features: Feature[] = Object.values(modules).flatMap(
  value => value as Feature[]
);
const expandedModules = import.meta.glob(["./expanded-guides.json", "./remaining-guides.json"], {
  eager: true,
  import: "default",
});
const expanded = Object.values(expandedModules).flatMap(value => value as Array<Record<string, unknown>>);
export function materializeExpandedGuides(guides: Array<Record<string, unknown>>): Feature[] {
  return guides.map(guide => {
  const purposes = guide.purposes as string[];
  const title = guide.title as string;
  const topic = guide.topic as string;
  const source = guide.source as string;
  const difficulty = guide.difficulty as Feature["difficulty"];
  return {
    id: guide.id as string,
    title,
    english: guide.english as string,
    category: guide.category as Feature["category"],
    description: `${topic} ${guide.pitfall as string}`,
    difficulty,
    purposes,
    essential: false,
    overview: `${topic} 입력 데이터의 범위와 갱신 시점을 먼저 정의하고, 후보 생성과 최종 선택 단계를 분리합니다. 결과는 이용자에게 설명 가능한 기준으로 표시하고 변경 시 재계산합니다.`,
    why: `${title}은 선택지를 좁히고 반복 작업을 줄이는 데 유용합니다. 다만 입력 데이터의 누락·편향·지연은 결과 품질을 낮추므로 운영 지표와 되돌리기 경로를 함께 설계해야 합니다.`,
    flow: ["필요한 데이터와 제약 조건을 확인한다.", "작은 후보 집합에서 알고리즘을 실행한다.", "결과와 선택 근거를 화면에 전달한다.", "실패·편향·성능을 측정해 규칙을 조정한다."],
    components: ["검증된 입력 데이터", "후보 생성 단계", "점수 또는 제약 처리", "결과 설명과 품질 지표"],
    exceptions: [guide.pitfall as string, "데이터가 없거나 계산이 시간 제한을 넘으면 안전한 기본 결과와 재시도 경로를 제공한다."],
    security: "입력·결과에 접근 권한을 적용하고 사용자 입력을 신뢰하지 않습니다. 계산량과 요청 빈도를 제한하며 내부 점수나 민감 속성을 불필요하게 노출하지 않습니다.",
    privacy: "개인화에 쓰는 데이터 항목과 보유 기간을 공개하고 최소 정보만 사용합니다. 사용자가 개인화 기록을 확인·삭제하거나 비개인화 결과를 선택할 수 있게 합니다.",
    accessibility: "결과 순서와 추천 이유를 텍스트로 제공하고 색상만으로 점수 차이를 나타내지 않습니다. 키보드 순서와 상태 변경 알림을 지원합니다.",
    legal: "지역과 서비스 유형별 개인정보·자동화 의사결정·차별 방지 요구사항을 확인해야 하며, 이 내용은 법률 자문이 아닙니다.",
    checklist: ["입력 데이터의 출처와 갱신 시점을 기록한다.", "빈 입력과 경계값을 처리한다.", "결과 이유와 기본 대안을 표시한다.", "권한·개인정보·계산량 제한을 검토한다.", "정확도·지연·편향 지표를 추적한다."],
    options: [
      { name: "규칙 기반", pros: "빠르고 설명하기 쉽습니다.", cons: "규칙이 늘면 유지 비용이 커집니다.", bestFor: "초기 서비스와 명확한 제약" },
      { name: "데이터 기반", pros: "많은 신호와 패턴을 반영할 수 있습니다.", cons: "데이터 품질·편향·관측 가능성을 관리해야 합니다.", bestFor: "충분한 데이터와 평가 체계가 있는 서비스" },
    ],
    related: ["recommendations", "login", "search"],
    sources: [{ title: "공식 문서 및 설계 참고 자료", url: source }],
  };
  });
}
features.push(...materializeExpandedGuides(expanded));
const popular = [
  "login",
  "payments",
  "search",
  "notifications",
  "uploads",
  "api",
  "signup",
  "subscriptions",
  "cms",
  "security",
  "analytics",
  "accessibility",
];
export function filterFeatures(
  items: Feature[],
  options: {
    query?: string;
    category?: string;
    difficulty?: string;
    purpose?: string;
    sort?: string;
  }
) {
  const query = options.query?.trim().toLocaleLowerCase() || "";
  const result = items.filter(
    f =>
      (!query ||
        [f.title, f.english, f.description, ...f.purposes]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)) &&
      (!options.category ||
        options.category === "all" ||
        f.category === options.category) &&
      (!options.difficulty ||
        options.difficulty === "all" ||
        f.difficulty === options.difficulty) &&
      (!options.purpose ||
        options.purpose === "all" ||
        f.purposes.includes(options.purpose) ||
        f.purposes.includes("공통"))
  );
  return result.sort((a, b) => {
    if (options.sort === "name") return a.title.localeCompare(b.title, "ko");
    if (options.sort === "difficulty")
      return (
        ["입문", "중급", "고급"].indexOf(a.difficulty) -
        ["입문", "중급", "고급"].indexOf(b.difficulty)
      );
    const ai = popular.indexOf(a.id),
      bi = popular.indexOf(b.id);
    return (
      (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) ||
      a.title.localeCompare(b.title, "ko")
    );
  });
}
export const serviceTemplates = [
  {
    id: "saas",
    name: "SaaS 서비스",
    description:
      "계정, 구독, 권한 관리까지. 지속적으로 사용하는 서비스를 위한 기본 구성.",
    ids: [
      "signup",
      "login",
      "password-reset",
      "roles",
      "subscriptions",
      "notifications",
      "analytics",
      "security",
      "consent",
      "monitoring",
    ],
  },
  {
    id: "commerce",
    name: "온라인 스토어",
    description:
      "상품 탐색부터 안전한 결제와 주문 처리까지, 구매 여정을 연결하는 구성.",
    ids: [
      "search",
      "filters",
      "cart",
      "checkout",
      "payments",
      "orders",
      "refunds",
      "email",
      "consent",
      "security",
    ],
  },
  {
    id: "content",
    name: "콘텐츠 플랫폼",
    description:
      "콘텐츠 발행, 탐색, 사용자 참여를 중심으로 한 읽기 좋은 서비스의 구성.",
    ids: [
      "cms",
      "editor",
      "uploads",
      "tags",
      "search",
      "comments",
      "favorites",
      "sitemap",
      "accessibility",
      "backups",
    ],
  },
  {
    id: "community",
    name: "커뮤니티",
    description:
      "사람과 대화를 연결하고, 건강한 커뮤니티를 유지하기 위한 구성.",
    ids: [
      "signup",
      "profile",
      "comments",
      "chat",
      "notifications",
      "reviews",
      "sharing",
      "roles",
      "rate-limiting",
      "consent",
    ],
  },
];
