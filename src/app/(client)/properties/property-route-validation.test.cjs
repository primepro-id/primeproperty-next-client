const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourceRoot = join(__dirname, "..", "..", "..");

function transpile(relativePath, jsx = false) {
  return ts.transpileModule(
    readFileSync(join(sourceRoot, relativePath), "utf8"),
    {
      compilerOptions: {
        jsx: jsx ? ts.JsxEmit.ReactJSX : undefined,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
}

function loadModule(relativePath, stubs, jsx = false) {
  const output = transpile(relativePath, jsx);
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (request === "react/jsx-runtime") return require(request);
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

const routeIdModule = loadModule(
  "app/(client)/properties/_lib/parse-property-route-ids.ts",
  {},
);

function containsElementType(node, type) {
  if (!node || typeof node !== "object") return false;
  if (Array.isArray(node)) {
    return node.some((child) => containsElementType(child, type));
  }
  if (node.type === type) return true;
  return containsElementType(node.props?.children, type);
}

function findElementType(node, type) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findElementType(child, type);
      if (match) return match;
    }
    return null;
  }
  if (node.type === type) return node;
  return findElementType(node.props?.children, type);
}

test("malformed property detail IDs render the property fallback without API calls", async () => {
  const calls = [];
  const PropertyNotFound = () => null;
  const detailContent = loadModule(
    "app/(client)/properties/[id]/_components/dynamic-property-page-content.tsx",
    {
      "./dynamic-property": { DynamicProperty: () => null },
      "../../_components/fillters/properties-filter": {
        PropertiesFilter: () => null,
      },
      "../../_components/not-found": { PropertyNotFound },
      "@/lib/api": {
        findUniquePropertyJoinAgent: async () => {
          calls.push("detail");
          return { data: null };
        },
      },
      "../../_lib/parse-property-route-ids": routeIdModule,
    },
    true,
  );

  const rendered = await detailContent.DynamicPropertyPageContent({
    params: Promise.resolve({ id: "not-a-property" }),
  });

  assert.deepEqual(calls, []);
  assert.equal(rendered.type, PropertyNotFound);
});

test("missing, repeated, and malformed comparison IDs render a stable fallback without API calls", async () => {
  for (const ids of [undefined, "7", "7,nope", "7,8,9", ["1,2", "3,4"]]) {
    const calls = [];
    const PropertyComparisonFallback = () => null;
    const comparisonContent = loadModule(
      "app/(client)/properties/comparison/_components/property-comparison-page-content.tsx",
      {
        "./property-comparison": {
          PropertyComparison: () => null,
          PropertyComparisonFallback,
        },
        "@/lib/api": {
          findUniquePropertyJoinAgent: async (id) => {
            calls.push(id);
            return { data: null };
          },
        },
        "../../_lib/parse-property-route-ids": routeIdModule,
      },
      true,
    );

    const rendered = await comparisonContent.PropertyComparisonPageContent({
      searchParams: Promise.resolve({ ids }),
    });

    assert.deepEqual(calls, []);
    assert.equal(
      containsElementType(rendered, PropertyComparisonFallback),
      true,
    );
  }
});

test("valid comparison properties start in parallel and reach the comparison component", async () => {
  const calls = [];
  const resolvers = new Map();
  const PropertyComparison = () => null;
  const comparisonContent = loadModule(
    "app/(client)/properties/comparison/_components/property-comparison-page-content.tsx",
    {
      "./property-comparison": {
        PropertyComparison,
        PropertyComparisonFallback: () => null,
      },
      "@/lib/api": {
        findUniquePropertyJoinAgent: (id) => {
          calls.push(id);
          return new Promise((resolve) => resolvers.set(id, resolve));
        },
      },
      "../../_lib/parse-property-route-ids": routeIdModule,
    },
    true,
  );

  const renderedPromise = comparisonContent.PropertyComparisonPageContent({
    searchParams: Promise.resolve({ ids: "7,8" }),
  });
  await Promise.resolve();

  assert.deepEqual(calls, [7, 8]);
  resolvers.get(7)({ data: [{ id: 7 }] });
  resolvers.get(8)({ data: [{ id: 8 }] });
  const rendered = await renderedPromise;

  assert.equal(rendered.type, PropertyComparison);
  assert.deepEqual(rendered.props.ids, [7, 8]);
  assert.deepEqual(rendered.props.firstProperty, [{ id: 7 }]);
  assert.deepEqual(rendered.props.secondProperty, [{ id: 8 }]);
});

test("related property requests include the current property's regency", async () => {
  const queries = [];
  const relatedPropertiesModule = loadModule(
    "app/(client)/properties/_components/related-properties.tsx",
    {
      "./card": { PropertyCard: () => null },
      "@/components/ui/carousel": {
        Carousel: () => null,
        CarouselContent: () => null,
        CarouselItem: () => null,
        CarouselNext: () => null,
        CarouselPrevious: () => null,
      },
      "@/lib/api": {
        findPropertyJoinAgent: async (query) => {
          queries.push(query);
          return { data: { data: [] } };
        },
      },
      "@/lib/types": {},
    },
    true,
  );

  await relatedPropertiesModule.RelatedProperties({
    propertyId: 42,
    regency: "Jakarta Selatan",
  });

  assert.deepEqual(queries, [
    { id: 42, is_related: true, regency: "Jakarta Selatan" },
  ]);
});

test("property detail forwards its regency to related properties", () => {
  const RelatedProperties = () => null;
  const dynamicPropertyModule = loadModule(
    "app/(client)/properties/[id]/_components/dynamic-property.tsx",
    {
      "./property-overview": { PropertyOverview: () => null },
      "./property-images": { PropertyImages: () => null },
      "../../_components/not-found": { PropertyNotFound: () => null },
      "./share-links": { ShareLinks: () => null },
      "../../_components/contact-agent-dialog": {
        ContactAgentDialog: () => null,
      },
      "./agent-avatar": { AgentAvatar: () => null },
      "./related-search": { RelatedSearch: () => null },
      "../../_components": { RelatedProperties },
      "../../_components/faq": { Faq: () => null },
      "@/lib/schema/create-dynamic-property-schema": {
        createDynamicPropertySchema: () => ({}),
      },
      "@/lib/schema/create-place-schema": { createPlaceSchema: () => ({}) },
      "@/lib/schema/create-related-area-schema": {
        createRelatedAreaSchema: () => ({}),
      },
      "@/lib/types": {},
    },
    true,
  );
  const property = [{ id: 42, regency: "Jakarta Selatan", title: "Rumah" }];

  const rendered = dynamicPropertyModule.DynamicProperty({
    propertyId: 42,
    property,
  });

  const relatedElement = findElementType(rendered, RelatedProperties);
  assert.equal(relatedElement.props.regency, "Jakarta Selatan");
});
