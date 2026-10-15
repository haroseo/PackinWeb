# PackinWeb Supabase 설정

1. Supabase 프로젝트의 SQL Editor에서 `migrations/001_library.sql`을 실행합니다
2. Authentication → Providers → Google에서 Google provider를 켭니다
3. Google Cloud OAuth client의 승인된 리디렉션 URI에 아래 주소를 등록합니다
   - `https://<project-ref>.supabase.co/auth/v1/callback`
4. Cloudflare Pages 환경변수에 `.env.example`의 두 값을 등록합니다
5. Supabase Authentication → URL Configuration에서 Site URL과 Cloudflare Pages URL을 등록합니다

`VITE_SUPABASE_ANON_KEY`는 브라우저에서 사용하는 공개 키이며, RLS가 데이터 접근을 보호합니다. 서비스 역할 키는 브라우저나 저장소에 넣지 않습니다.
