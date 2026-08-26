const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "build-agent-update-data.ts");
let buildAgentUpdateData = () => undefined;

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
  buildAgentUpdateData = loadedModule.exports.buildAgentUpdateData;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const formData = {
  profile_picture_url: undefined,
  fullname: "Agent Prime",
  email: "agent@example.com",
  phone_number: "8123456789",
  instagram: "",
};

test("buildAgentUpdateData excludes fields unsupported by the update API", () => {
  assert.deepEqual(buildAgentUpdateData(formData), {
    fullname: "Agent Prime",
    phone_number: "8123456789",
    instagram: "",
  });
});

test("buildAgentUpdateData includes a newly uploaded profile picture", () => {
  assert.deepEqual(buildAgentUpdateData(formData, "/agents/new-picture.webp"), {
    fullname: "Agent Prime",
    phone_number: "8123456789",
    instagram: "",
    profile_picture_url: "/agents/new-picture.webp",
  });
});
