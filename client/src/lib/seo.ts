import { SITE_NAME, canonicalUrl, pageSchema } from "@shared/seo";
import { features } from "@/data/catalog";
export { SITE_ORIGIN, SITE_NAME } from "@shared/seo";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string
) {
  let node = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`
  );
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

export function applySeo({
  title,
  description,
  path = "/",
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  noindex?: boolean;
}) {
  const url = canonicalUrl(path);
  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("name", "robots", noindex ? "noindex,follow" : "index,follow");
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:locale", "ko_KR");
  upsertMeta("property", "og:image", canonicalUrl("/brand/packinapp-og.png"));
  upsertMeta("property", "og:image:alt", "PackinApp 브랜드 리소스 OG 이미지");
  upsertMeta("property", "og:image:type", "image/png");
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);

  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
  let schema = document.head.querySelector<HTMLScriptElement>("#page-schema");
  if (!schema) {
    schema = document.createElement("script");
    schema.id = "page-schema";
    schema.type = "application/ld+json";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify(
    noindex ? {} : pageSchema(path, title, description, features)
  );
}
