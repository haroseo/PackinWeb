# 검색·탐색 기능 조사 메모

## 확인한 공식 기준

- **OWASP Input Validation Cheat Sheet**: 입력은 문법과 의미를 모두 서버에서 검증하고, 허용 목록·길이·배열 제한을 적용한다. 검증만으로 SQL injection이나 XSS를 막을 수 없으므로 파라미터화된 쿼리와 문맥별 출력 인코딩을 함께 사용해야 한다. 클라이언트 검증은 우회 가능하며, 유니코드 정규화와 로그의 원문 노출도 별도로 관리해야 한다. [출처](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- **W3C WCAG 2.2 Quick Reference**: 모든 기능은 키보드로 조작 가능해야 하며(2.1.1), 페이지를 찾는 방법을 둘 이상 제공할 수 있다(2.4.5: 검색·사이트맵·목차 등). 제목·레이블은 목적을 설명하고 포커스 표시가 보여야 한다. [출처](https://www.w3.org/WAI/WCAG22/quickref/)
- **Google Search Central — Build and submit a sitemap**: 사이트맵에는 검색 결과에 노출하고 싶은 정식 절대 URL을 넣고 UTF-8로 제공한다. 단일 파일은 비압축 50MB 또는 5만 URL 제한이 있어 초과 시 분할·인덱스가 필요하며 제출은 색인을 보장하지 않는 힌트다. [출처](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## 구현에 반영한 점

검색·필터·페이지네이션은 서버 측 허용 목록과 권한 필터를 중심으로 기술했고, 추천·즐겨찾기는 개인화 거부와 공개 범위를 별도 상태로 두었다. 내비게이션·사이트맵은 WCAG의 다중 탐색 경로와 Google의 정식 URL 원칙을 반영했다. 모든 기능의 법률 문구는 지역과 사업유형별 확인이 필요하며 법률자문이 아니라는 범위를 명시했다.
