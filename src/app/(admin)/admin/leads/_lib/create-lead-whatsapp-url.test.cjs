const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "create-lead-whatsapp-url.ts");
let createLeadWhatsappUrl = () => undefined;

try {
  const source = readFileSync(modulePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };

  new Function("module", "exports", output)(loadedModule, loadedModule.exports);
  createLeadWhatsappUrl = loadedModule.exports.createLeadWhatsappUrl;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("createLeadWhatsappUrl normalizes Indonesian mobile number variants", () => {
  const phoneNumbers = [
    "81234567890",
    "081234567890",
    "6281234567890",
    "+62 812-3456-7890",
  ];

  for (const phone_number of phoneNumbers) {
    const url = new URL(createLeadWhatsappUrl({ name: "Ayu", phone_number }));
    assert.equal(url.origin + url.pathname, "https://api.whatsapp.com/send");
    assert.equal(url.searchParams.get("phone"), "6281234567890");
  }
});

test("createLeadWhatsappUrl encodes the approved personalized message", () => {
  const url = new URL(
    createLeadWhatsappUrl({
      name: "Budi Santoso",
      phone_number: "081234567890",
    }),
  );

  assert.equal(
    url.searchParams.get("text"),
    "Halo Budi Santoso, saya dari PrimePro Indonesia. Kami menghubungi Anda terkait permintaan informasi properti yang Anda kirimkan. Apakah ada yang bisa kami bantu?",
  );
});

test("createLeadWhatsappUrl rejects missing and malformed mobile numbers", () => {
  assert.equal(createLeadWhatsappUrl({ name: "Ayu", phone_number: "" }), null);
  assert.equal(
    createLeadWhatsappUrl({ name: "Ayu", phone_number: "phone-number" }),
    null,
  );
  assert.equal(
    createLeadWhatsappUrl({ name: "Ayu", phone_number: "621234" }),
    null,
  );
});
