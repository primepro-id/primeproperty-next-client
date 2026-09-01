const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourceRoot = join(__dirname, "..", "..");

function loadTsModule(relativePath, stubs = {}) {
  const absolutePath = join(sourceRoot, relativePath);
  assert.equal(existsSync(absolutePath), true, `${relativePath} must exist`);
  const source = readFileSync(absolutePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (Object.hasOwn(stubs, request)) return stubs[request];
    throw new Error(`Unexpected test import: ${request}`);
  };

  new Function("module", "exports", "require", output)(
    loadedModule,
    loadedModule.exports,
    localRequire,
  );
  return loadedModule.exports;
}

test("FAQ content is plain data that can be reused by visible copy and JSON-LD", () => {
  const content = loadTsModule(
    "app/(client)/properties/_components/faq/faq-content.ts",
  );

  assert.equal(content.PRIMEPRO_FAQ_SECTIONS.length, 3);
  assert.equal(content.PROPERTY_FAQ_ITEMS.length, 16);
  assert.equal(content.ALL_FAQ_ITEMS.length, 30);
  for (const item of content.ALL_FAQ_ITEMS) {
    assert.equal(typeof item.question, "string");
    assert.equal(typeof content.getFaqAnswerText(item), "string");
    assert.notEqual(content.getFaqAnswerText(item).trim(), "");
    assert.doesNotMatch(content.getFaqAnswerText(item), /\[object Object\]/);
  }
});

test("FAQPage schema serializes every visible answer as acceptedAnswer text", () => {
  const content = loadTsModule(
    "app/(client)/properties/_components/faq/faq-content.ts",
  );
  const { createFaqSchema } = loadTsModule("lib/schema/create-faq-schema.ts", {
    "@/lib/env": {
      env: { NEXT_PUBLIC_HOST_URL: "https://primeproindonesia.com" },
    },
  });
  const schema = createFaqSchema(content.ALL_FAQ_ITEMS);

  assert.equal(schema["@type"], "FAQPage");
  assert.equal(schema.mainEntity.length, content.ALL_FAQ_ITEMS.length);
  assert.equal(schema.mainEntity[0]["@type"], "Question");
  assert.equal(
    schema.mainEntity[0].acceptedAnswer["@type"],
    "Answer",
  );
  assert.equal(typeof schema.mainEntity[0].acceptedAnswer.text, "string");
  assert.doesNotMatch(JSON.stringify(schema), /\[object Object\]/);
});

test("FAQ component emits the shared FAQPage graph through a literal script", () => {
  const source = readFileSync(
    join(
      sourceRoot,
      "app/(client)/properties/_components/faq/faq.tsx",
    ),
    "utf8",
  );

  assert.match(source, /createFaqSchema\(ALL_FAQ_ITEMS\)/);
  assert.match(source, /<script/);
  assert.match(source, /application\/ld\+json/);
  assert.doesNotMatch(source, /next\/script/);
});
