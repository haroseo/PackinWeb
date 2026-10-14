import type { Feature } from "./catalog";
export interface CodeExample {
  title: string;
  language: string;
  code: string;
  preview:
    | "auth"
    | "commerce"
    | "content"
    | "search"
    | "communication"
    | "operations";
}
const examples: Record<string, Partial<CodeExample>> = {
  login: {
    title: "세션 쿠키로 로그인 상태 확인",
    language: "TypeScript",
    code: `export async function signIn(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('로그인 정보를 확인해 주세요.');
  return response.json();
}`,
  },
  payments: {
    title: "결제 의도 생성과 서버 확인",
    language: "TypeScript",
    code: `const intent = await db.paymentIntents.create({
  orderId,
  amount: order.total,
  currency: 'krw',
  status: 'requires_confirmation',
});

return res.json({ clientSecret: intent.clientSecret });`,
  },
  search: {
    title: "권한을 확인하는 검색 API",
    language: "TypeScript",
    code: `const results = await search.index('articles').query(query, {
  filter: { tenantId: user.tenantId, visibility: 'public' },
  limit: 20,
});

return res.json({ items: results.map(toSearchResult) });`,
  },
  uploads: {
    title: "파일 형식과 용량을 먼저 검증",
    language: "TypeScript",
    code: `const allowed = ['image/jpeg', 'image/png'];
if (!allowed.includes(file.type) || file.size > 10_000_000) {
  throw new Error('지원하지 않는 파일입니다.');
}
const asset = await storage.upload(file, { private: true });`,
  },
  notifications: {
    title: "읽음 상태가 있는 알림 만들기",
    language: "TypeScript",
    code: `await db.notifications.create({
  userId,
  title: '주문 상태가 변경되었습니다',
  body: '배송이 시작되면 다시 알려드릴게요.',
  readAt: null,
});`,
  },
  api: {
    title: "서명된 웹훅을 안전하게 처리",
    language: "TypeScript",
    code: `const signature = req.headers['x-webhook-signature'];
if (!verifyHmac(req.rawBody, signature, process.env.WEBHOOK_SECRET)) {
  return res.status(401).json({ error: 'invalid_signature' });
}
await queue.add('process-event', req.body);
return res.status(202).end();`,
  },
};
export function getCodeExample(feature: Feature): CodeExample {
  const item = examples[feature.id];
  const name = feature.id.replace(/-/g, "_");
  const code =
    item?.code ||
    `type FeatureService = {
  create(input: Record<string, unknown>): Promise<unknown>;
};

export async function create_${name}(
  service: FeatureService,
  session: { userId: string },
) {
  const created = await service.create({
    userId: session.userId,
    status: 'active',
    metadata: { source: 'packinweb' },
  });
  return created;
}`;
  return {
    title: item?.title || `${feature.title} 기본 흐름 연결하기`,
    language: item?.language || "TypeScript",
    code,
    preview: item?.preview || feature.category,
  };
}
