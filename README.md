# PackinWeb

웹사이트 기능을 이해하고 선택하는 한국어 레퍼런스입니다. Apple HIG의 단순함, 일관성, 계층, 피드백과 접근성 원칙을 참고한 반응형 흑백 UI를 사용합니다. Apple의 공식 제품 또는 인증 서비스는 아닙니다.

## 제공 기능

인증·계정, 결제·커머스, 콘텐츠·미디어, 검색·탐색, 소셜·커뮤니케이션, 운영·보안의 6개 분야에 총 48개 상세 가이드가 있습니다. 각 가이드는 개요, 도입 이유, 사용자 흐름, 필수 구성 요소, 예외 상황, 보안·개인정보·접근성·법적 고려사항, 구현 방식 비교, 체크리스트와 공식 참고 자료를 제공합니다.

라이브러리에서는 한글·영문 키워드 검색, 카테고리·목적·난이도 필터, 추천순·이름순·난이도순 정렬 및 카드·목록 보기를 사용할 수 있습니다. 최대 3개 기능을 나란히 비교하고, 북마크를 내 컬렉션에 모아둘 수 있습니다. SaaS·온라인 스토어·콘텐츠·커뮤니티별로 추천 기능의 서비스 체크리스트를 제공하며 JSON 파일로 다운로드할 수 있습니다.

## 실행

Node.js 및 고정된 pnpm 10.18.0을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev:static
pnpm check
pnpm test
pnpm build:static
```

개발 서버는 PORT(기본 3000)에 바인딩합니다. 정적 빌드 출력은 `dist/public`입니다. Cloudflare Pages는 `pnpm build:static`으로 빌드하고 `dist/public`을 배포합니다.

## 프로젝트 구조

`client/src/data/`에는 분야별 JSON과 분류·검색·저장 로직이 있습니다. `components/webzip/`은 사이트 레이아웃·아이콘·카드를 담당합니다. `pages/`에는 라이브러리·상세·비교·체크리스트·소개 페이지가 있습니다. `client/public/`에는 robots.txt, sitemap.xml, llms.txt와 정적 라우팅 설정이 있습니다.

페이지 경로는 `/`, `/features/:id`, `/saved`, `/compare`, `/checklist`, `/about`이며 `client/public/manus-routes.json`에 동기화되어 있습니다.

## 데이터와 범위

컬렉션과 확인 상태는 브라우저 localStorage에 저장합니다. Supabase 익명 세션과 Google 계정 연결을 위한 코드는 준비되어 있으며 실제 Supabase 프로젝트 환경변수 설정 후 활성화할 수 있습니다. 이 사이트의 가이드는 제품 기획과 개발 검토를 위한 참고 자료이며 법률·보안·결제 정책을 대신하지 않습니다.

## 검색 노출

공개 기능 상세 페이지는 빌드 시 고유 HTML, 제목, 설명, canonical, Open Graph, Twitter Card, JSON-LD를 생성합니다. `robots.txt`, `sitemap.xml`, `llms.txt`를 함께 제공합니다. 색인 요청은 각 검색엔진의 공식 웹마스터 도구에서 사이트 소유권 확인 후 제출해야 합니다.

## 검증

TypeScript 검사, 정적 빌드 및 전체 테스트를 통과했습니다. 기능 개수·분류·관련 ID·공식 HTTPS 링크·검색·필터·로컬 저장·비교 제한·SEO 정적 페이지 생성을 검사합니다.
