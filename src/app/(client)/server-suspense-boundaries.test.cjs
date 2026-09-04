const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const React = require("react");
const ts = require("typescript");

const sourceRoot = join(__dirname, "..", "..");
const Loading = () => null;
const pending = new Promise(() => {});
const EmptyComponent = () => null;

function loadPage(relativePath, stubs) {
  const source = readFileSync(join(sourceRoot, relativePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (request === "react" || request === "react/jsx-runtime") {
      return require(request);
    }
    if (request === "@/app/(client)/loading") {
      return { __esModule: true, default: Loading };
    }
    if (Object.hasOwn(stubs, request)) return stubs[request];
    throw new Error(`Unexpected test import: ${request}`);
  };

  new Function("module", "exports", "require", output)(
    loadedModule,
    loadedModule.exports,
    localRequire,
  );
  return loadedModule.exports.default;
}

function findSuspense(node) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findSuspense(child);
      if (match) return match;
    }
    return null;
  }
  if (node.type === React.Suspense) return node;
  return findSuspense(node.props?.children);
}

const sharedStubs = {
  "next/link": { __esModule: true, default: "a" },
  "next/image": { __esModule: true, default: "img" },
  "react-icons/lu": new Proxy({}, { get: () => EmptyComponent }),
  "@/components/ui/button": { buttonVariants: () => "button" },
  "@/components/custom-ui/banner": { Banner: EmptyComponent },
  "@/lib/utils": { cn: (...values) => values.filter(Boolean).join(" ") },
  "@/lib/metadata": {
    createMetadata: (value) => value,
  },
};

const cases = [
  {
    name: "home",
    path: "app/(client)/page.tsx",
    props: {},
    stubs: {
      "./properties/_components": { PopularProperties: EmptyComponent },
      "./properties/_components/fillters/search": { Search: EmptyComponent },
      "./properties/_components/faq": { Faq: EmptyComponent },
      "@/lib/schema": { createSiteIdentitySchema: () => ({}) },
      "@/lib/api/developers": { getDevelopers: () => pending },
      "@/lib/env": { env: { NEXT_PUBLIC_S3_ENDPOINT: "" } },
    },
  },
  {
    name: "agent directory",
    path: "app/(client)/agents/page.tsx",
    props: {},
    stubs: {
      "./_components/agent-list": { AgentList: EmptyComponent },
      "./_components/agents-content": { AgentsContent: EmptyComponent },
      "../properties/_components/faq": { Faq: EmptyComponent },
      "@/lib/api": { getAgents: () => pending },
    },
  },
  {
    name: "agent detail",
    path: "app/(client)/agents/[name]/page.tsx",
    props: { params: pending },
    stubs: {
      "./_lib/create-agent-metadata": { createAgentMetadata: async () => ({}) },
      "./_components/agent": { AgentPage: EmptyComponent },
      "./_components/agent-page-content": {
        AgentPageContent: EmptyComponent,
      },
      "@/lib/metadata/seo-domain": { decodeAgentRouteName: (value) => value },
    },
  },
  {
    name: "blog directory",
    path: "app/(client)/blog/page.tsx",
    props: {},
    stubs: {
      "./_lib/generate-blog-home-schema": {
        generateBlogHomeSchema: () => ({
          homeSchema: {},
          breadcrumbSchema: {},
        }),
      },
      "./_components": {
        AllArticles: EmptyComponent,
        Latest: EmptyComponent,
        Spotlight: EmptyComponent,
      },
      "./_components/blog-content": { BlogContent: EmptyComponent },
      "../properties/_components": { PopularProperties: EmptyComponent },
      "@/lib/api": { findPropertyJoinAgent: () => pending },
      "@/lib/api/articles": { findArticles: () => pending },
    },
  },
  {
    name: "blog detail",
    path: "app/(client)/blog/[slug]/page.tsx",
    props: { params: pending },
    stubs: {
      "../_lib/generate-blog-metadata": {
        generateBlogMetadata: async () => ({}),
      },
      "../_lib/generate-blog-schema": { generateBlogSchema: () => ({}) },
      "./_components/blog-post": { BlogPost: EmptyComponent },
      "./_components/blog-related": { BlogRelated: EmptyComponent },
      "./_components/blog-related-properties": {
        BlogRelatedProperties: EmptyComponent,
      },
      "./_components/blog-page-content": { BlogPageContent: EmptyComponent },
      "../../properties/_components/faq": { Faq: EmptyComponent },
      "@/lib/api/articles": { findArticleBySlug: () => pending },
    },
  },
  {
    name: "property directory",
    path: "app/(client)/properties/page.tsx",
    props: { searchParams: pending },
    stubs: {
      "./_components": { Properties: EmptyComponent },
      "./_components/properties-page-content": {
        PropertiesPageContent: EmptyComponent,
      },
      "./_lib/create-properties-metadata": {
        generatePropertiesMetadata: async () => ({}),
      },
      "@/lib/api": {},
    },
  },
  {
    name: "property filter",
    path: "app/(client)/properties/filter/[...params]/page.tsx",
    props: { params: pending, searchParams: pending },
    stubs: {
      "../../_components": { Properties: EmptyComponent },
      "./_components/properties-filter-page-content": {
        PropertiesFilterPageContent: EmptyComponent,
      },
      "../../_lib/parse-filter-params": { parseFilterParams: () => ({}) },
      "../../_lib/create-properties-filter-metadata": {
        generatePropertiesFilterMetadata: async () => ({}),
      },
    },
  },
  {
    name: "property detail",
    path: "app/(client)/properties/[id]/page.tsx",
    props: { params: pending },
    stubs: {
      "./_components": { DynamicProperty: EmptyComponent },
      "./_components/dynamic-property-page-content": {
        DynamicPropertyPageContent: EmptyComponent,
      },
      "../_components": { PropertiesFilter: EmptyComponent },
      "../_components/not-found": { PropertyNotFound: EmptyComponent },
      "./_lib/generate-dynamic-property-metadata": {
        generateDynamicPropertyMetadata: async () => ({}),
      },
      "@/lib/api": { findUniquePropertyJoinAgent: () => pending },
      "../_lib/parse-property-route-ids": {
        parsePropertyDetailId: () => 1,
      },
    },
  },
  {
    name: "property comparison",
    path: "app/(client)/properties/comparison/page.tsx",
    props: { searchParams: pending },
    stubs: {
      "./_components/property-comparison": {
        PropertyComparison: EmptyComponent,
        PropertyComparisonFallback: EmptyComponent,
      },
      "./_components/property-comparison-page-content": {
        PropertyComparisonPageContent: EmptyComponent,
      },
      "../_components/faq": { Faq: EmptyComponent },
      "@/lib/api": { findUniquePropertyJoinAgent: () => pending },
      "../_lib/parse-property-route-ids": {
        parsePropertyComparisonIds: () => [1, 2],
      },
    },
  },
];

for (const routeCase of cases) {
  test(`${routeCase.name} returns a synchronous shell with the shared loading boundary`, () => {
    const Page = loadPage(routeCase.path, {
      ...sharedStubs,
      ...routeCase.stubs,
    });
    const rendered = Page(routeCase.props);

    assert.equal(typeof rendered?.then, "undefined");
    const suspense = findSuspense(rendered);
    assert.ok(suspense, "expected a Suspense boundary");
    assert.equal(suspense.props.fallback.type, Loading);
  });
}
