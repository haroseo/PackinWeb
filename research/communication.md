# 소셜·커뮤니케이션 기술·보안 연구 메모

## 확인한 공식 자료

- [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API): 웹 푸시는 서비스 워커가 필요하며, PushSubscription의 endpoint는 메시지 전송 권한을 가진 capability URL이므로 비밀로 관리해야 한다. 구독 생성에는 CSRF/XSRF 방어가 중요하고, 브라우저별 전달·쿼터·배터리 동작 차이를 고려해야 한다.
- [OWASP Web Service Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html): 인증 세션과 민감한 데이터가 오가는 통신은 잘 구성된 TLS로 보호하고, 요청마다 권한을 확인하며, 입력·출력 검증과 메시지 크기·처리량 제한으로 남용과 DoS를 줄여야 한다. 저장 후에도 보호해야 하는 민감 데이터는 전송 암호화만으로 충분하지 않다.
- [W3C WCAG 2.2 Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html): 포커스를 빼앗지 않는 상태 변화도 role=status, alert, log 또는 적절한 접근성 속성으로 보조기술에 프로그램적으로 전달해야 한다. 성공, 대기, 진행, 오류 메시지는 현재 작업을 불필요하게 중단하지 않도록 설계한다.

## 적용 메모

알림·이메일·푸시·채팅은 수신 동의, 철회, 재시도, 중복 제거, 전달 상태와 보존 기간을 데이터 모델에 포함한다. 실시간 기능은 연결 끊김과 순서 뒤바뀜을 전제로 이벤트 ID, 재연결, 서버 권한 검사를 둔다. 문의·리뷰·공유 기능은 개인정보 최소 수집, 스팸·악성 콘텐츠·링크 미리보기 위험, 삭제·신고·감사 추적을 함께 설계한다. 모든 기능은 TLS, 서버 측 인가, 입력 검증, 속도·용량 제한을 기본값으로 삼고, 지역 및 사업 유형별 개인정보·전자통신·마케팅·소비자보호 법률은 별도 검토가 필요하다.
