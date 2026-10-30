import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "../dist/public");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const urls = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  m => m[1]
);
const data = path.resolve(import.meta.dirname, "../client/src/data");
const features = fs
  .readdirSync(data)
  .filter(f => f.endsWith(".json") && !["expanded-guides.json", "remaining-guides.json"].includes(f))
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(data, f), "utf8")));
const expandedGuides = ["expanded-guides.json", "remaining-guides.json"].flatMap(file => JSON.parse(fs.readFileSync(path.join(data, file), "utf8")));
features.push(...expandedGuides.map(guide => ({
  ...guide,
  description: `${guide.topic} ${guide.pitfall}`,
  overview: guide.topic,
  why: guide.topic,
  security: guide.topic,
  privacy: guide.topic,
  accessibility: guide.topic,
  legal: guide.topic,
  flow: [], components: [], exceptions: [], checklist: [], options: [], related: [],
  sources: [{ title: "reference", url: guide.source }],
})));
const categoryIds = new Set(features.map(feature => feature.category));
assert.equal(urls.length, features.length + categoryIds.size + 3);
assert.equal(new Set(urls).size, urls.length);
for (const url of urls) {
  const pathname = new URL(url).pathname;
  assert.ok(pathname.endsWith("/"), url);
  const html = read(pathname.slice(1) + "index.html");
  assert.ok(html.includes(`rel="canonical" href="${url}"`), url);
  assert.ok(html.includes('content="index,follow'), url);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, url);
  assert.equal(
    (html.match(/type="application\/ld\+json"/g) || []).length,
    1,
    url
  );
  const schema = JSON.parse(
    html.match(
      /<script id="page-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/
    )[1]
  );
  assert.ok(
    schema["@graph"].some(node => node.url === url),
    url
  );
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g))
    assert.ok(fs.existsSync(path.join(root, asset)), asset);
}
for (const feature of features) {
  const html = read(`features/${feature.id}/index.html`);
  for (const heading of [
    "사용자 흐름",
    "예외 상황",
    "구현 체크리스트",
    "참고 문서",
  ])
    assert.ok(html.includes(heading), feature.id);
  assert.ok(
    html.includes(
      feature.codeExample
        ? "핵심 로직 코드 예시"
        : "카테고리 핵심 로직 패턴"
    ),
    feature.id
  );
  assert.ok(
    html.includes(feature.sources[0].url.replaceAll("&", "&amp;")),
    feature.id
  );
  assert.ok(
    html.includes(`href="/categories/${feature.category}/"`),
    feature.id
  );
}
for (const file of ["saved/index.html", "compare/index.html", "404.html"])
  assert.ok(read(file).includes('content="noindex,follow"'), file);
assert.ok(
  !fs.existsSync(path.join(root, "_redirects")),
  "Catch-all rewrite would hide 404 responses"
);
assert.ok(
  read("robots.txt").includes(
    "Sitemap: https://packinweb.pages.dev/sitemap.xml"
  )
);
assert.ok(read("index.html").includes('name="google-site-verification"'));
console.log(
  `SEO checks passed: ${urls.length} canonical URLs, ${features.length} complete guides, schemas, assets, noindex and crawler files.`
);
