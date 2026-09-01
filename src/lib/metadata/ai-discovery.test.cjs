const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const projectRoot = join(__dirname, "..", "..", "..");

function readProjectFile(relativePath) {
  const path = join(projectRoot, relativePath);
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

test("AI discovery files expose public PrimePro resources without private routes", () => {
  const llms = readProjectFile("public/llms.txt");

  assert.match(llms, /^# PrimePro Indonesia/m);
  assert.match(llms, /## When to use PrimePro Indonesia/);
  assert.match(llms, /https:\/\/primeproindonesia\.com\/properties/);
  assert.match(llms, /https:\/\/primeproindonesia\.com\/agents/);
  assert.match(llms, /https:\/\/primeproindonesia\.com\/property-catalog\.md/);
  assert.doesNotMatch(
    llms,
    /\/admin|\/auth|\/properties\/bookmark|\/properties\/comparison/,
  );
});

test("production builds refresh the static property catalog", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));

  assert.equal(
    packageJson.scripts["generate:ai-catalog"],
    "node scripts/generate-property-catalog.mjs",
  );
  assert.equal(packageJson.scripts.prebuild, "yarn generate:ai-catalog");
});

test("robots.txt states an explicit allow policy for major AI crawlers", () => {
  const robots = readProjectFile("public/robots.txt");

  for (const bot of [
    "GPTBot",
    "ChatGPT-User",
    "PerplexityBot",
    "ClaudeBot",
    "anthropic-ai",
    "Google-Extended",
    "bingbot",
  ]) {
    assert.match(robots, new RegExp(`User-agent: ${bot}`, "i"));
  }
});

test("homepage emits the site identity graph through a literal JSON-LD script", () => {
  const homepage = readProjectFile("src/app/(client)/page.tsx");

  assert.match(homepage, /createSiteIdentitySchema/);
  assert.match(homepage, /<script/);
  assert.doesNotMatch(homepage, /from "next\/script"/);
  assert.match(homepage, /JSON\.stringify\(siteIdentitySchema\)/);
});
