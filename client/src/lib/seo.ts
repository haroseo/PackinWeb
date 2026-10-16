export const SITE_ORIGIN = "https://packinweb.pages.dev";
export const SITE_NAME = "PackinWeb";

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
  const url = new URL(path, SITE_ORIGIN).toString();
  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("name", "robots", noindex ? "noindex,follow" : "index,follow");
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:locale", "ko_KR");
  upsertMeta("name", "twitter:card", "summary");
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
}
