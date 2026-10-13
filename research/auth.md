# 인증·계정 연구 메모

## 확인한 공식 자료

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): 인증 흐름은 TLS를 사용하고, 비밀번호 복구는 계정 존재 여부를 노출하지 않으며, 비밀번호는 안전한 해시로 저장해야 한다. 재인증, 로그인 시도 제한, MFA, OAuth/OIDC, 로그·모니터링을 함께 고려한다.
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): 세션 ID는 예측 불가능하고 서버가 생성해야 하며, 인증·권한 변경 시 재생성한다. `HttpOnly`, `Secure`, `SameSite` 쿠키와 서버 측 만료·폐기를 사용하고 localStorage에 인증 토큰을 두지 않는다.
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): 인증(Authentication)과 권한 부여(Authorization)를 분리하고, 최소 권한·기본 거부·모든 요청에서의 검사와 권한 로직 테스트를 적용한다.
- [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html): OTP를 로그나 장기 평문으로 저장하지 않고, MFA 변경·복구는 기존 요인 재인증과 사용자 알림을 요구한다. 피싱 저항형 WebAuthn/passkey를 우선 검토하고 복구 코드는 일회용으로 관리한다.
- [OWASP OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html): 소셜 로그인은 Authorization Code + PKCE, 등록된 redirect URI, `state`/OIDC `nonce` 검증을 사용하며 암시적 grant를 피한다.
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html): 비밀번호는 평문·복호화 가능한 암호화가 아니라 Argon2id, bcrypt, PBKDF2 같은 적응형 해시와 고유 salt로 저장한다.
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html): 쿠키 인증의 상태 변경 요청에는 서버 검증 CSRF 토큰 또는 동등한 방어를 적용하고 상태 변경을 GET으로 만들지 않는다.
- [NIST SP 800-63-4](https://pages.nist.gov/800-63-4/): 디지털 신원은 신원 확인, 인증, 연합을 구분하고 보안·프라이버시·사용자 경험을 함께 다루는 위험 기반 요구사항을 사용한다.
- [W3C Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html): 인증에서 기억·퍼즐·수동 전사를 강제하지 않는 대체 경로를 제공하고, 비밀번호 관리자 자동 입력과 붙여넣기를 막지 않는다.

## 적용 원칙

각 기능 카드는 제품 설계 점검에 바로 쓸 수 있도록 사용자 흐름, 예외, 보안·개인정보·접근성·법률 확인 항목을 분리했다. 특정 제품이나 라이브러리의 가격·출시 시점은 다루지 않았으며, 지역과 사업 유형에 따라 개인정보·전자상거래·통신·접근성 의무가 달라질 수 있으므로 실제 적용 전 관할 법률과 전문 자문을 확인해야 한다.
