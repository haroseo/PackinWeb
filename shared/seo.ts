import { categories, type Feature } from "./catalog";

export const SITE_ORIGIN = "https://packinweb.pages.dev";
export const SITE_NAME = "PackinWeb";
export const HOME_TITLE = "패킨웹(패킨앱) — 웹사이트 기능 모음과 구현 가이드";
export const HOME_DESCRIPTION = `패킨웹(PackinWeb·패킨앱)은 로그인·결제부터 예약·지도·AI·자동화까지 ${categories.length}개 분야의 웹사이트 기능 모음을 제공하는 한국어 라이브러리입니다. 사용자 흐름, 구현 체크리스트와 코드 예시를 확인하세요.`;

export function canonicalUrl(path = "/") {
  const pathname = new URL(path, SITE_ORIGIN).pathname;
  return SITE_ORIGIN + (pathname.endsWith("/") ? pathname : pathname + "/");
}

export function pageSchema(
  path: string,
  title: string,
  description: string,
  features: Feature[]
) {
  const url = canonicalUrl(path);
  const website = {
    "@type": "WebSite",
    "@id": SITE_ORIGIN + "/#website",
    name: SITE_NAME,
    alternateName: ["패킨웹", "패킨앱"],
    url: SITE_ORIGIN + "/",
    inLanguage: "ko-KR",
  };
  const feature = features.find(f => url === canonicalUrl(`/features/${f.id}`));
  const category = categories.find(
    c => url === canonicalUrl(`/categories/${c.id}`)
  );
  const page = {
    "@type": feature
      ? "Article"
      : category || path === "/"
        ? "CollectionPage"
        : "WebPage",
    "@id": url + "#page",
    url,
    name: title,
    description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": website["@id"] },
  };
  const graph: object[] = [
    website,
    feature
      ? {
          ...page,
          headline: feature.title + " 기능 가이드",
          mainEntityOfPage: url,
          articleSection: categories.find(c => c.id === feature.category)?.name,
          citation: feature.sources.map(s => s.url),
        }
      : page,
  ];
  if (category || path === "/") {
    const list = category
      ? features.filter(f => f.category === category.id)
      : features;
    graph.push({
      "@type": "ItemList",
      "@id": url + "#guides",
      numberOfItems: list.length,
      itemListElement: list.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: f.title,
        url: canonicalUrl(`/features/${f.id}`),
      })),
    });
  }
  if (feature || category) {
    const parent =
      category || categories.find(c => c.id === feature?.category)!;
    const crumbs = [
      { name: "모든 기능", item: SITE_ORIGIN + "/" },
      { name: parent.label, item: canonicalUrl(`/categories/${parent.id}`) },
    ];
    if (feature) crumbs.push({ name: feature.title, item: url });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...c,
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
