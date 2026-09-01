const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const sourceRoot = join(__dirname, "..", "..", "..");

test("blog posts visibly identify the accountable author and freshness dates", () => {
  const source = readFileSync(
    join(sourceRoot, "app/(client)/blog/[slug]/_components/blog-post.tsx"),
    "utf8",
  );

  assert.match(source, /Oleh PrimePro Indonesia/);
  assert.match(source, /Diterbitkan/);
  assert.match(source, /Diperbarui/);
  assert.match(source, /article\._publishedAt/);
  assert.match(source, /article\._updatedAt/);
  assert.match(source, /toLocaleDateString\("id-ID"/);
});
