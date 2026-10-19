// Run after production deploy. This is a public ownership proof, not an account credential.
import fs from "node:fs/promises";
const origin = "https://packinweb.pages.dev";
const key = (
  await fs.readFile(
    new URL("../client/public/indexnow-key.txt", import.meta.url),
    "utf8"
  )
).trim();
const proof = await fetch(`${origin}/indexnow-key.txt`);
if (!proof.ok || (await proof.text()).trim() !== key)
  throw new Error("Deploy the ownership file before submitting");
const sitemap = await fetch(`${origin}/sitemap.xml`);
if (!sitemap.ok) throw new Error("Production sitemap unavailable");
const urlList = [
  ...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
].map(m => m[1]);
if (!urlList.length || urlList.some(url => new URL(url).origin !== origin))
  throw new Error("Unexpected sitemap URLs");
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(origin).host,
    key,
    keyLocation: `${origin}/indexnow-key.txt`,
    urlList,
  }),
});
console.log(
  JSON.stringify(
    {
      submittedAt: new Date().toISOString(),
      count: urlList.length,
      httpStatus: response.status,
      message:
        response.status === 200
          ? "Received; indexing is not guaranteed"
          : response.status === 202
            ? "Received; ownership validation pending"
            : await response.text(),
    },
    null,
    2
  )
);
if (![200, 202].includes(response.status)) process.exitCode = 1;
