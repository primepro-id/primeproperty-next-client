const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const adminLayout = readFileSync(join(__dirname, "../../layout.tsx"), "utf8");
const newPropertyFormCard = readFileSync(
  join(__dirname, "../properties/new/_components/new-property-form-card.tsx"),
  "utf8",
);

test("the admin content wrapper is the only main vertical scroll owner", () => {
  assert.match(adminLayout, /<main className="[^"]*overflow-hidden[^"]*">/);
  assert.match(
    adminLayout,
    /<div className="[^"]*min-h-0[^"]*overflow-y-auto[^"]*">\s*\{children\}\s*<\/div>/,
  );
  assert.doesNotMatch(
    adminLayout,
    /<main className="[^"]*overflow-y-auto[^"]*">/,
  );
});

test("the new property page does not force an additional full-height child", () => {
  assert.doesNotMatch(
    newPropertyFormCard,
    /className="flex flex-col gap-6 h-full"/,
  );
});
