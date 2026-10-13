# 운영·보안 레퍼런스 연구 메모

## 확인한 공식 출처
- OWASP API4:2019는 API 요청이 네트워크·CPU·메모리·저장소를 소비하므로 실행 시간, 메모리, 페이로드, 요청 수, 페이지 크기 등의 상한과 시간당 호출 제한을 서버에서 검증해야 한다고 설명한다. 초과 시 제한값과 재설정 시각을 클라이언트에 알리는 방안도 제시한다. https://owasp.org/API-Security/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting/
- W3C WCAG 2.2는 접근성을 지각 가능·운용 가능·이해 가능·견고함의 네 원칙으로 구성하고, 기술 중립적인 테스트 가능한 성공 기준과 A/AA/AAA 적합성 수준을 제공한다. https://www.w3.org/TR/WCAG22/
- 영국 ICO PECR 쿠키 지침은 쿠키의 존재·목적을 명확히 알리고 비필수 쿠키에는 자유롭고 구체적이며 정보에 근거한 적극적 동의를 받아야 하며, 사용자가 쉽게 거부·변경할 수 있어야 한다고 설명한다. 사용자가 요청한 서비스를 제공하는 데 엄격히 필요한 쿠키에는 예외가 있을 수 있지만 지역별 법률 검토가 필요하다. https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/

## 적용 메모
각 기능은 공식 문서의 원칙을 일반화하되 특정 제품·라이브러리 비용·출시 시점은 주장하지 않았다. 운영 데이터의 최소 수집, 접근통제, 보존·삭제, 복구 테스트, 요청·웹훅 검증, 접근 가능한 상태 안내를 기능별 점검 항목에 반영했다.
