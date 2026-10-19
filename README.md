# PackinWeb

웹사이트 기능을 이해하고 선택하는 한국어 레퍼런스입니다. Apple HIG의 단순함, 일관성, 계층, 피드백과 접근성 원칙을 참고한 반응형 흑백 UI를 사용합니다. Apple의 공식 제품 또는 인증 서비스는 아닙니다.

## 제공 기능

기존 인증·계정, 결제·커머스, 콘텐츠·미디어, 검색·탐색, 소셜·커뮤니케이션, 운영·보안에 예약·일정, 위치·지도, AI·자동화, 폼·설문, 데이터·시각화, 문서·서명, 학습·평가, 모바일·기기, 조직·워크스페이스, 재고·물류를 추가해 총 16개 분야·108개 상세 가이드를 제공합니다. 각 가이드는 개요, 도입 이유, 사용자 흐름, 필수 구성 요소, 예외 상황, 보안·개인정보·접근성·법적 고려사항, 구현 방식 비교, 체크리스트와 공식 참고 자료를 제공합니다. 새 분야의 60개 가이드는 기능별 전용 코드 예시와 흐름 요약을 포함합니다.

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

`client/src/data/`에는 분야별 JSON과 검색·저장 로직이 있습니다. `shared/catalog.ts`는 공통 분류, `shared/seo.ts`는 canonical과 구조화 데이터를 담당합니다. `scripts/seo-pages.ts`는 공개 HTML, sitemap.xml, llms.txt를 같은 데이터에서 자동 생성합니다. `client/public/`에는 robots.txt와 공개 소유권 확인 파일이 있습니다.

페이지 경로는 `/`, `/categories/:id/`, `/features/:id/`, `/saved/`, `/compare/`, `/checklist/`, `/about/`이며 `client/public/manus-routes.json`에 동기화되어 있습니다. 기존 `/?category=...` 링크는 새 카테고리 주소로 이동합니다.

## 데이터와 범위

컬렉션과 확인 상태는 브라우저 localStorage에 저장합니다. Supabase 익명 세션과 Google 계정 연결을 위한 코드는 준비되어 있으며 실제 Supabase 프로젝트 환경변수 설정 후 활성화할 수 있습니다. 이 사이트의 가이드는 제품 기획과 개발 검토를 위한 참고 자료이며 법률·보안·결제 정책을 대신하지 않습니다.

## 검색 노출

홈·카테고리 16개·가이드 108개·소개·체크리스트의 총 127개 URL을 사이트맵에 포함합니다. 상세 가이드는 본문, 코드 예시, 공식 출처와 관련 링크를 HTML로 제공합니다. canonical은 Cloudflare Pages의 디렉터리 URL과 일치하도록 끝에 `/`를 사용합니다. WebSite, CollectionPage, ItemList, Article, BreadcrumbList 구조화 데이터는 실제 콘텐츠로만 생성하며 클라이언트 이동 시에도 갱신합니다.

`saved`·`compare`는 noindex이고 없는 주소는 `404.html`로 404 응답을 받습니다. 모든 경로를 홈페이지로 바꾸는 catch-all rewrite는 사용하지 않습니다. `llms.txt`는 문서 목록이며 AI 검색 노출을 보장하거나 대체하는 특별한 설정이 아닙니다.

Google 소유권 확인용 공개 메타태그는 `client/index.html`에 있습니다. `client/public/indexnow-key.txt`는 사이트에 공개하는 소유권 증명으로 계정 비밀번호나 비밀 API 키가 아닙니다. 배포 후 `pnpm submit:indexnow`로 운영 사이트맵의 URL을 참여 검색엔진에 통지할 수 있습니다. 스크립트는 먼저 배포된 증명 파일을 확인하고, 접수 응답과 색인 완료를 구분합니다. Google·Naver 웹마스터 사이트맵 제출은 각 관리 화면에서 수행합니다. 검색 순위·색인 시점은 보장하지 않습니다.

## 검증

`pnpm check`, `pnpm test`, `pnpm build:static`, `pnpm check:seo`를 실행합니다. SEO 검사는 전체 canonical URL, 구조화 데이터, 본문 섹션, 정적 자산 참조, noindex와 사이트맵을 확인합니다. 브라우저에서는 카테고리 이동, 기존 쿼리 링크 전환, 상세 가이드와 404를 확인하세요.
