export type Difficulty = "입문" | "중급" | "고급";
export type CategoryId =
  | "auth"
  | "commerce"
  | "content"
  | "search"
  | "communication"
  | "operations"
  | "booking"
  | "maps"
  | "ai"
  | "forms"
  | "data"
  | "documents"
  | "learning"
  | "mobile"
  | "organizations"
  | "logistics";
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
  codeExample?: { title: string; language: string; code: string };
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
  {
    id: "booking",
    name: "예약·일정",
    label: "예약 · 일정",
    description: "시간과 자원을 배정하고 예약 변경까지 연결하세요.",
  },
  {
    id: "maps",
    name: "위치·지도",
    label: "위치 · 지도",
    description: "주소, 장소, 거리와 이동 경로를 이해하기 쉽게 전달하세요.",
  },
  {
    id: "ai",
    name: "AI·자동화",
    label: "AI · 자동화",
    description: "생성 결과의 근거와 비용, 실행 권한을 함께 설계하세요.",
  },
  {
    id: "forms",
    name: "폼·설문",
    label: "폼 · 설문",
    description: "필요한 질문을 묻고 작성 중인 응답을 안전하게 이어가세요.",
  },
  {
    id: "data",
    name: "데이터·시각화",
    label: "데이터 · 시각화",
    description: "표와 차트로 데이터를 읽고 가져오기·내보내기로 연결하세요.",
  },
  {
    id: "documents",
    name: "문서·서명",
    label: "문서 · 서명",
    description: "문서 생성부터 추출, 서명과 검증까지 흐름을 정리하세요.",
  },
  {
    id: "learning",
    name: "학습·평가",
    label: "학습 · 평가",
    description: "학습 진도, 과제와 평가를 명확한 완료 기준으로 연결하세요.",
  },
  {
    id: "mobile",
    name: "모바일·기기",
    label: "모바일 · 기기",
    description: "설치, 오프라인과 기기 권한을 고려한 모바일 웹을 만드세요.",
  },
  {
    id: "organizations",
    name: "조직·워크스페이스",
    label: "조직 · 워크스페이스",
    description: "팀의 구성원, 데이터 경계와 사용 한도를 관리하세요.",
  },
  {
    id: "logistics",
    name: "재고·물류",
    label: "재고 · 물류",
    description: "재고 수량과 입출고, 배송·반품 상태를 일관되게 연결하세요.",
  },
];
