const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");
function load(file) {
  const output = ts.transpileModule(
    readFileSync(join(__dirname, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", output)(
    () => ({ env: { NEXT_PUBLIC_S3_ENDPOINT: "https://storage.example/" } }),
    mod,
    mod.exports,
  );
  return mod.exports;
}
test("property images never request storage root for missing paths", () => {
  const { getPropertyImageSrc } = load("property-image.ts");
  for (const path of [undefined, null, "", "  ", "/", "///", " / "]) {
    assert.equal(getPropertyImageSrc(path), "/images/property-placeholder.svg");
  }
  assert.equal(
    getPropertyImageSrc("bucket/photo.jpg"),
    "https://storage.example/bucket/photo.jpg",
  );
  assert.equal(
    getPropertyImageSrc("/bucket/photo.jpg"),
    "https://storage.example//bucket/photo.jpg",
  );
});
test("video permissions include only supported features", () => {
  const { getVideoIframeAllow } = load("video-iframe-permissions.ts");
  assert.equal(getVideoIframeAllow(), undefined);
  assert.equal(getVideoIframeAllow([]), undefined);
  assert.equal(
    getVideoIframeAllow(["autoplay", "unrelated", "picture-in-picture"]),
    "autoplay; picture-in-picture",
  );
  const all = [
    "accelerometer",
    "autoplay",
    "clipboard-write",
    "encrypted-media",
    "gyroscope",
    "picture-in-picture",
    "web-share",
  ];
  assert.equal(getVideoIframeAllow(all), all.join("; "));
});

function loadComponent(file) {
  const React = require("react");
  const output = ts.transpileModule(
    readFileSync(join(__dirname, "..", file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    },
  ).outputText;
  const mod = { exports: {} };
  const stub = ({ children }) => children;
  const resolve = (id) => {
    if (id === "react")
      return {
        ...React,
        useMemo: (fn) => fn(),
        useState: (value) => [value, () => {}],
      };
    if (id === "react/jsx-runtime") return require(id);
    if (id === "@/lib/property-image") return load("property-image.ts");
    if (id === "@/lib/video-iframe-permissions")
      return load("video-iframe-permissions.ts");
    if (id === "@/lib/env")
      return { env: { NEXT_PUBLIC_S3_ENDPOINT: "https://storage.example/" } };
    if (id === "@/lib/developers") return { DEVELOPERS: [] };
    if (id === "@/lib/utils")
      return { cn: (...args) => args.filter(Boolean).join(" ") };
    if (id === "@/lib/metadata/seo-domain")
      return { createPropertyPath: () => "/properties/1" };
    if (id === "next/navigation") return { useRouter: () => ({ back() {} }) };
    if (id === "next/link" || id === "next/image") return stub;
    if (id === "@/components/custom-ui/watermark-image")
      return {
        WatermarkImage: ({ imageProps }) =>
          React.createElement("img", imageProps),
      };
    return new Proxy({}, { get: () => stub });
  };
  new Function("require", "module", "exports", output)(
    resolve,
    mod,
    mod.exports,
  );
  return mod.exports;
}
function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== "object") return [];
  if (typeof node.type === "function") return elements(node.type(node.props));
  return [node, ...elements(node.props?.children)];
}
const propertyFixture = (images) => [
  {
    id: 1,
    title: "Test property",
    images,
    configurations: {},
    developer_id: null,
  },
  {},
];
test("cards and galleries render missing covers without requesting storage root", () => {
  const { PropertyCard } = loadComponent(
    "app/(client)/properties/_components/card.tsx",
  );
  const { PropertyCarousel } = loadComponent(
    "app/(client)/properties/[id]/_components/property-carousel.tsx",
  );
  for (const component of [PropertyCard, PropertyCarousel]) {
    const images = elements(
      component({ propertyWithAgent: propertyFixture([]), onImageClick() {} }),
    ).filter((n) => n.type === "img");
    assert.equal(images.length, 1);
    assert.equal(images[0].props.src, "/images/property-placeholder.svg");
  }
});
test("all property image consumers preserve image order while replacing invalid paths", () => {
  const paths = ["bucket/one.jpg", "", "/", "bucket/four.jpg"];
  for (const [file, name] of [
    ["_components/card.tsx", "PropertyCard"],
    ["[id]/_components/property-carousel.tsx", "PropertyCarousel"],
    ["[id]/_components/property-dialog-carousel.tsx", "PropertyDialogCarousel"],
    [
      "comparison/_components/property-comparison-images.tsx",
      "PropertyComparisonImages",
    ],
  ]) {
    const component = loadComponent("app/(client)/properties/" + file)[name];
    const clicked = [];
    const tree = elements(
      component({
        propertyWithAgent: propertyFixture(
          paths.map((path, index) => ({ path, is_cover: index === 0 })),
        ),
        startIndex: 0,
        onImageClick: (i) => clicked.push(i),
      }),
    );
    const images = tree.filter((n) => n.type === "img");
    assert.ok(images.length > 0);
    assert.equal(images[0].props.src, "https://storage.example/bucket/one.jpg");
    assert.ok(images.every((n) => n.props.src !== "https://storage.example/"));
    if (name !== "PropertyCard") {
      assert.equal(images[1].props.src, "/images/property-placeholder.svg");
      assert.equal(images[2].props.src, "/images/property-placeholder.svg");
      assert.equal(
        images[3].props.src,
        "https://storage.example/bucket/four.jpg",
      );
    }
    if (name === "PropertyCarousel") {
      const thumbnails = images.filter((n) => n.props.onClick);
      thumbnails[2].props.onClick();
      assert.deepEqual(clicked, [2]);
    }
  }
});
test("iframe permissions are assigned before navigation and omitted without feature detection", () => {
  const { VideoThumbnail } = loadComponent(
    "app/(client)/properties/_components/faq/video-thumbnail.tsx",
  );
  const iframe = elements(VideoThumbnail()).find((n) => n.type === "iframe");
  assert.equal(iframe.props.allow, undefined);
  assert.equal(iframe.props.src, undefined);
  assert.equal(iframe.props.allowFullScreen, true);
  for (const supported of [undefined, ["autoplay"]]) {
    const calls = [];
    iframe.props.ref({
      ownerDocument: supported
        ? { featurePolicy: { features: () => supported } }
        : {},
      setAttribute: (key, value) => calls.push([key, value]),
      set src(value) {
        calls.push(["src", value]);
      },
    });
    assert.equal(calls.at(-1)[0], "src");
    assert.match(calls.at(-1)[1], /^https:\/\/www.youtube.com\/embed\//);
    assert.deepEqual(
      calls.slice(0, -1),
      supported ? [["allow", "autoplay"]] : [],
    );
  }
});
