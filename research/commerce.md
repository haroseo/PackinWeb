# 결제·커머스 연구 메모

## 확인한 공식 근거

- [PCI Security Standards Council — PCI Security Standards](https://www.pcisecuritystandards.org/standards/): PCI DSS는 결제 계정 데이터가 저장·처리·전송되는 환경을 보호하기 위한 기술·운영 요구사항의 기준선이며, 결제 데이터 수명주기 전반을 다룬다. 결제 화면과 주문 시스템의 데이터 흐름, 위탁 결제 사업자 범위, 저장·전송 여부를 먼저 파악해야 한다.
- [OWASP — Third Party Payment Gateway Integration Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html): 서버에서 상품·가격·할인·통화를 재계산하고, 콜백을 신뢰하기 전에 서버 간 상태를 검증하며, 금액·통화·주문 ID를 대조하고, 서명/HMAC 검증과 멱등 처리를 적용해야 한다. 재전송·순서 뒤바뀜·경쟁 상태를 고려하고 민감한 인증 데이터는 보관하지 않는다.
- [W3C WAI — Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/): 결제·구매 폼은 레이블, 관련 필드 그룹, 안내, 입력 검증, 성공·오류 알림을 제공해야 한다. 긴 폼은 논리적 단계로 나누고 진행 상황을 알리며, 가능하면 사용자가 충분한 시간 안에 완료하도록 해야 한다.

## 적용 원칙

이 레퍼런스는 특정 공급자나 비용, 출시 시점을 전제하지 않고 기능별 데이터 모델과 운영 점검에 집중한다. 결제 승인 화면의 표시만으로 주문을 확정하지 않고, 신뢰 가능한 서버 검증 결과를 기준으로 재고 차감·배송·구독 권한을 한 번만 수행한다. 가격과 할인은 클라이언트 입력을 신뢰하지 않으며, 개인정보와 결제 데이터를 목적·보관기간·접근권한별로 최소화한다.

법률 항목은 한국을 포함한 판매 지역, 상품 유형, 사업자 형태, 결제수단에 따라 전자상거래·소비자보호·세금·개인정보·자동갱신 규칙이 달라질 수 있으므로 실제 적용 전 관할별 공식 안내와 전문가 검토가 필요하다.
