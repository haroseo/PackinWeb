import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { categories, type Feature } from "../shared/catalog";
import {
  canonicalUrl,
  HOME_TITLE,
  HOME_DESCRIPTION,
  pageSchema,
} from "../shared/seo";
import { getCodeExample } from "../client/src/data/codeExamples";

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!
  );
const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
const paragraph = (heading: string, text: string) =>
  `<section><h2>${heading}</h2><p>${escapeHtml(text)}</p></section>`;
const list = (heading: string, items: string[], ordered = false) =>
  `<section><h2>${heading}</h2><${ordered ? "ol" : "ul"}>${items.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</${ordered ? "ol" : "ul"}></section>`;
const guideList = (features: Feature[]) =>
  `<ul>${features.map(f => `<li>${link(`/features/${f.id}/`, f.title)}<p>${escapeHtml(f.description)}</p></li>`).join("")}</ul>`;

export function featureBody(feature: Feature, features: Feature[]) {
  const category = categories.find(c => c.id === feature.category)!;
  const example = getCodeExample(feature);
  return (
    `<nav aria-label="현재 위치">${link("/", "모든 기능")} / ${link(`/categories/${category.id}/`, category.label)}</nav><h1>${escapeHtml(feature.title)} 기능 가이드</h1><p>${escapeHtml(feature.description)}</p>` +
    paragraph("기능 이해하기", feature.overview) +
    paragraph("왜 필요한가요?", feature.why) +
    list("사용자 흐름", feature.flow, true) +
    list("필수 구성 요소", feature.components) +
    list("예외 상황", feature.exceptions) +
    paragraph("보안", feature.security) +
    paragraph("개인정보", feature.privacy) +
    paragraph("접근성", feature.accessibility) +
    paragraph("법률 확인 사항", feature.legal) +
    `<section><h2>구현 방식 비교</h2>${feature.options.map(o => `<h3>${escapeHtml(o.name)}</h3><dl><dt>장점</dt><dd>${escapeHtml(o.pros)}</dd><dt>고려할 점</dt><dd>${escapeHtml(o.cons)}</dd><dt>적합한 경우</dt><dd>${escapeHtml(o.bestFor)}</dd></dl>`).join("")}</section>` +
    list("구현 체크리스트", feature.checklist) +
    `<section><h2>공식 참고 자료</h2><ul>${feature.sources.map(s => `<li>${link(s.url, s.title)}</li>`).join("")}</ul></section>` +
    `<section><h2>코드로 바로 시작하기</h2><p>아래 예시는 기능의 핵심 흐름을 단순화한 출발점입니다. 운영 환경에서는 인증, 오류 처리, 로깅과 개인정보 보호를 함께 적용하세요.</p><h3>${escapeHtml(example.title)}</h3><pre><code>${escapeHtml(example.code)}</code></pre></section>` +
    `<section><h2>함께 살펴볼 기능</h2>${guideList(features.filter(f => feature.related.includes(f.id)))}</section>`
  );
}

export function vitePluginSeoPages(): Plugin {
  let root: string;
  return {
    name: "packinweb-seo-pages",
    enforce: "post",
    configResolved(config) {
      root = config.root;
    },
    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset")
        throw new Error("Built index.html is required for SEO pages");
      const template = String(index.source);
      const dataDirectory = path.join(root, "src/data");
      const features = fs
        .readdirSync(dataDirectory)
        .filter(f => f.endsWith(".json"))
        .flatMap(
          f =>
            JSON.parse(
              fs.readFileSync(path.join(dataDirectory, f), "utf8")
            ) as Feature[]
        );
      if (
        !features.length ||
        new Set(features.map(f => f.id)).size !== features.length
      )
        throw new Error("Missing or duplicate feature IDs");
      const urls: string[] = [];
      const emitPage = (
        pathname: string,
        title: string,
        description: string,
        body: string,
        noindex = false,
        filename?: string
      ) => {
        const url = canonicalUrl(pathname);
        const schema = JSON.stringify(
          pageSchema(pathname, title, description, features)
        ).replace(/</g, "\\u003c");
        let html = template
          .replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${escapeHtml(title)}</title>`
          )
          .replace(
            /<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g,
            ""
          )
          .replace(/<link rel="canonical"[^>]*>/, "")
          .replace(
            /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,
            ""
          )
          .replace(
            "</head>",
            `<meta name="description" content="${escapeHtml(description)}"/><meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}"/><link rel="canonical" href="${url}"/><meta property="og:type" content="${pathname.startsWith("/features/") ? "article" : "website"}"/><meta property="og:site_name" content="PackinWeb"/><meta property="og:locale" content="ko_KR"/><meta property="og:title" content="${escapeHtml(title)}"/><meta property="og:description" content="${escapeHtml(description)}"/><meta property="og:url" content="${url}"/><meta name="twitter:card" content="summary"/><meta name="twitter:title" content="${escapeHtml(title)}"/><meta name="twitter:description" content="${escapeHtml(description)}"/><script id="page-schema" type="application/ld+json">${noindex ? "{}" : schema}</script></head>`
          )
          .replace(
            /<div id="root">[\s\S]*?<\/div>/,
            `<div id="root"><main><p>${link("/", "PackinWeb · 패킨웹")}</p>${body}<nav aria-label="주요 페이지">${link("/", "모든 기능")} · ${link("/checklist/", "서비스 체크리스트")} · ${link("/about/", "패킨웹 소개")}</nav></main></div>`
          );
        const fileName =
          filename ||
          (pathname === "/"
            ? "index.html"
            : pathname.replace(/^\//, "") + "index.html");
        if (fileName === "index.html") index.source = html;
        else this.emitFile({ type: "asset", fileName, source: html });
        if (!noindex) urls.push(url);
      };
      const categoryLinks = `<nav aria-label="기능 카테고리">${categories.map(c => link(`/categories/${c.id}/`, c.label)).join(" · ")}</nav>`;
      emitPage(
        "/",
        HOME_TITLE,
        HOME_DESCRIPTION,
        `<h1>웹사이트 기능 모음과 구현 가이드</h1><p>${escapeHtml(HOME_DESCRIPTION)}</p>${categoryLinks}${guideList(features)}`
      );
      for (const category of categories) {
        const title = `${category.label} 기능 가이드 — 패킨웹`;
        const description = `${category.description} 패킨웹에서 관련 기능의 흐름과 구현 기준을 확인하세요.`;
        emitPage(
          `/categories/${category.id}/`,
          title,
          description,
          `<h1>${escapeHtml(category.label)}</h1><p>${escapeHtml(description)}</p>${categoryLinks}${guideList(features.filter(f => f.category === category.id))}`
        );
      }
      for (const feature of features)
        emitPage(
          `/features/${feature.id}/`,
          `${feature.title} 가이드 — 패킨웹`,
          `${feature.description} 목적, 사용자 흐름, 보안·접근성 기준과 구현 코드 예시를 확인하세요.`,
          featureBody(feature, features)
        );
      emitPage(
        "/checklist/",
        "서비스 기능 체크리스트 — 패킨웹",
        "SaaS, 커머스, 콘텐츠, 커뮤니티 서비스에 필요한 웹 기능을 유형별 체크리스트로 확인하세요.",
        "<h1>서비스에 필요한 기능 체크리스트</h1><p>SaaS 서비스, 온라인 스토어, 콘텐츠 플랫폼, 커뮤니티에 필요한 기능을 점검하세요. 체크 상태는 브라우저에 저장됩니다.</p>" +
          categoryLinks
      );
      emitPage(
        "/about/",
        "패킨웹 소개 — 웹 기능을 이해하는 레퍼런스",
        "패킨웹은 기획자, 디자이너, 개발자가 웹 기능을 같은 언어로 이해하도록 돕는 한국어 레퍼런스입니다.",
        "<h1>웹을 이루는 기능을 누구나 이해할 수 있게</h1><p>패킨웹(PackinWeb, 패킨앱)은 기획자, 디자이너, 개발자를 위한 웹사이트 기능 모음입니다. 기능별 목적, 사용자 흐름, 예외 상황, 보안, 접근성, 구현 방식과 공식 참고 자료를 확인할 수 있습니다.</p><h2>이용 방법</h2><p>카테고리와 검색으로 기능을 찾고, 가이드와 구현 체크리스트를 읽고, 필요한 기능을 컬렉션에 저장하거나 비교하세요.</p><h2>가이드의 범위</h2><p>패킨웹은 학습과 기획용 레퍼런스입니다. 실제 구현 전 공식 문서의 최신 내용을 확인하세요. 법률 자문이나 운영 환경에서의 안전성을 보증하지 않습니다.</p>" +
          categoryLinks
      );
      for (const [route, title] of [
        ["saved", "내 컬렉션"],
        ["compare", "기능 비교"],
      ])
        emitPage(
          `/${route}/`,
          `${title} — 패킨웹`,
          "브라우저에 저장한 기능을 확인하세요.",
          `<h1>${title}</h1><p>저장한 기능을 보려면 JavaScript를 활성화하세요.</p>`,
          true
        );
      emitPage(
        "/404/",
        "페이지를 찾을 수 없음 — 패킨웹",
        "주소를 확인하거나 기능 라이브러리에서 다시 찾아보세요.",
        "<h1>페이지를 찾을 수 없습니다</h1>" + categoryLinks,
        true,
        "404.html"
      );
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "llms.txt",
        source: `# PackinWeb · 패킨웹 · 패킨앱\n\n> 웹사이트 기능을 설명하는 한국어 기획·구현 레퍼런스. 학습 자료이며 최신 공식 문서를 대체하지 않습니다.\n\n## 카테고리\n${categories.map(c => `- [${c.label}](${canonicalUrl(`/categories/${c.id}`)}): ${c.description}`).join("\n")}\n\n## 기능 가이드\n${features.map(f => `- [${f.title}](${canonicalUrl(`/features/${f.id}`)}): ${f.description}`).join("\n")}\n\n## 사이트\n- [소개](${canonicalUrl("/about")})\n- [서비스 체크리스트](${canonicalUrl("/checklist")})\n- [사이트맵](https://packinweb.pages.dev/sitemap.xml)\n`,
      });
    },
  };
}
