export type Difficulty = "입문" | "중급" | "고급";
export type CategoryId =
  | "auth"
  | "commerce"
  | "content"
  | "search"
  | "communication"
  | "operations";
export interface Feature {
  id: string;
  title: string;
  english: string;
  category: CategoryId;
  description: string;
  difficulty: Difficulty;
  purposes: string[];
  essential: boolean;
  overview: string;
  why: string;
  flow: string[];
  components: string[];
  exceptions: string[];
  security: string;
  privacy: string;
  accessibility: string;
  legal: string;
  checklist: string[];
  options: { name: string; pros: string; cons: string; bestFor: string }[];
  related: string[];
  sources: { title: string; url: string }[];
}
export const categories: {
  id: CategoryId;
  name: string;
  label: string;
  description: string;
}[] = [
  {
    id: "auth",
    name: "인증·계정",
    label: "인증 · 계정",
    description: "사용자를 알아보고, 안전하게 연결하세요.",
  },
  {
    id: "commerce",
    name: "결제·커머스",
    label: "결제 · 커머스",
    description: "구매부터 결제, 주문 관리까지 연결하세요.",
  },
  {
    id: "content",
    name: "콘텐츠·미디어",
    label: "콘텐츠 · 미디어",
    description: "콘텐츠를 만들고, 관리하고, 전달하세요.",
  },
  {
    id: "search",
    name: "검색·탐색",
    label: "검색 · 탐색",
    description: "필요한 정보를 더 쉽게 찾도록 도와주세요.",
  },
  {
    id: "communication",
    name: "소셜·커뮤니케이션",
    label: "소셜 · 커뮤니케이션",
    description: "사용자와 서비스 사이의 대화를 만드세요.",
  },
  {
    id: "operations",
    name: "운영·보안",
    label: "운영 · 보안",
    description: "안정적이고 신뢰할 수 있는 서비스를 운영하세요.",
  },
];
