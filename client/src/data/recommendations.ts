import type { Feature } from "@shared/catalog";

const KEY = "packinweb:recommendation-history";
const CACHE_KEY = "packinweb:recommendation-cache:v1";
const CACHE_TTL = 6 * 60 * 60 * 1000;
type Visit = { id: string; at: number };
type RecommendationCache = { expires: number; signature: string; ids: string[] };

function readVisits(): Visit[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(data)
      ? data.filter((v): v is Visit => !!v && typeof v.id === "string" && typeof v.at === "number").slice(-80)
      : [];
  } catch { return []; }
}

export function recordFeatureVisit(id: string) {
  try {
    const visits = readVisits().filter(v => v.id !== id);
    visits.push({ id, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(visits.slice(-80)));
    localStorage.removeItem(CACHE_KEY);
  } catch { /* Recommendations remain available without persistent storage. */ }
}

export function getRecommendations(features: Feature[], saved: string[], limit = 6) {
  const visits = readVisits();
  const history = [...visits.map(v => v.id), ...saved];
  const signature = JSON.stringify([history.slice(-20), saved.slice().sort(), features.length]);
  try {
    const cache: RecommendationCache = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cache?.expires > Date.now() && cache.signature === signature) {
      const cached = cache.ids.map(id => features.find(f => f.id === id)).filter((f): f is Feature => !!f);
      if (cached.length) return { items: cached.slice(0, limit), personalized: history.length > 0, reason: "최근 본 기능과 저장한 분야를 바탕으로 골랐어요." };
    }
  } catch { /* Recompute when the cache is unavailable or malformed. */ }

  const viewed = new Set(visits.slice(-8).map(v => v.id));
  const savedSet = new Set(saved);
  const affinity = new Map<string, number>();
  for (const [index, id] of history.slice(-20).entries()) {
    const feature = features.find(f => f.id === id);
    if (!feature) continue;
    const weight = id && savedSet.has(id) ? 4 : 1 + index / 20;
    affinity.set(`category:${feature.category}`, (affinity.get(`category:${feature.category}`) || 0) + weight);
    for (const purpose of feature.purposes) affinity.set(`purpose:${purpose}`, (affinity.get(`purpose:${purpose}`) || 0) + weight * 0.35);
  }
  const ranked = features.filter(f => !savedSet.has(f.id) && !viewed.has(f.id)).map(feature => {
    const categoryScore = affinity.get(`category:${feature.category}`) || 0;
    const purposeScore = Math.max(0, ...feature.purposes.map(p => affinity.get(`purpose:${p}`) || 0));
    const score = categoryScore * 3 + purposeScore + (feature.essential ? 0.2 : 0);
    return { feature, score };
  }).sort((a, b) => b.score - a.score || a.feature.title.localeCompare(b.feature.title, "ko"));
  const items = ranked.slice(0, limit).map(v => v.feature);
  const personalized = history.length > 0;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ expires: Date.now() + CACHE_TTL, signature, ids: items.map(f => f.id) } satisfies RecommendationCache)); } catch { /* Cache is optional. */ }
  return { items, personalized, reason: personalized ? "최근 본 기능과 저장한 분야를 바탕으로 골랐어요." : "처음 방문하셨다면 많이 찾는 기본 기능부터 살펴보세요." };
}
