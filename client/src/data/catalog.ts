import type { Feature } from "@shared/catalog";
export { categories } from "@shared/catalog";
export type { Feature, CategoryId, Difficulty } from "@shared/catalog";
const modules = import.meta.glob("./*.json", {
  eager: true,
  import: "default",
});
export const features: Feature[] = Object.values(modules).flatMap(
  value => value as Feature[]
);
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
