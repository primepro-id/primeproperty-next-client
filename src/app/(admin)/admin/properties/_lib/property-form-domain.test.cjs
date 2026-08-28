const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "property-form-domain.ts");
let domain = {};

try {
  const source = readFileSync(modulePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };

  new Function("module", "exports", "require", output)(
    loadedModule,
    loadedModule.exports,
    require,
  );
  domain = loadedModule.exports;
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const validValues = {
  title: "Rumah Kemang",
  description: "Rumah siap huni",
  province: "DKI Jakarta",
  regency: "Jakarta Selatan",
  street: "Kemang",
  gmap_iframe: "",
  purchase_status: "ForSale",
  rent_time: null,
  price: 10_000_000,
  price_down_payment: 0,
  currency: "Idr",
  sold_channel: null,
  is_njop_price: false,
  is_popular: false,
  building_type: "rumah",
  building_condition: "Good",
  building_certificate: "shm",
  building_furniture_capacity: null,
  measurements: {
    building_area: undefined,
    building_level: undefined,
    land_area: undefined,
  },
  specifications: {
    bathrooms: undefined,
    bedrooms: undefined,
    carport: undefined,
    electrical_power: undefined,
    garage: undefined,
  },
  facilities: [],
  images: [
    {
      key: "one",
      path: "/one.jpg",
      is_cover: true,
      english_label: "",
      indonesian_label: "",
    },
    {
      key: "two",
      path: "/two.jpg",
      is_cover: false,
      english_label: "",
      indonesian_label: "",
    },
    {
      key: "three",
      path: "/three.jpg",
      is_cover: false,
      english_label: "",
      indonesian_label: "",
    },
  ],
};

function createInitialProperty(images) {
  return {
    id: 1,
    user_id: "agent-1",
    created_at: "",
    updated_at: "",
    site_path: "rumah/dki-jakarta/jakarta-selatan/kemang",
    title: validValues.title,
    description: validValues.description,
    province: validValues.province,
    regency: validValues.regency,
    street: validValues.street,
    gmap_iframe: null,
    price: validValues.price,
    images,
    purchase_status: validValues.purchase_status,
    sold_status: "Available",
    measurements: { building_area: 0, building_level: 0, land_area: 0 },
    building_type: validValues.building_type,
    building_condition: validValues.building_condition,
    building_furniture_capacity: null,
    building_certificate: validValues.building_certificate,
    specifications: {
      bathrooms: 0,
      bedrooms: 0,
      carport: 0,
      electrical_power: 0,
      garage: 0,
    },
    facilities: [],
    is_deleted: false,
    sold_channel: null,
    configurations: {},
    currency: validValues.currency,
    rent_time: null,
    price_down_payment: validValues.price_down_payment,
    description_seo: null,
  };
}

test("property schema requires core values, a non-negative down payment, and 3-8 images", () => {
  assert.equal(domain.propertyFormSchema.safeParse(validValues).success, true);
  assert.equal(
    domain.propertyFormSchema.safeParse({ ...validValues, title: "" }).success,
    false,
  );
  assert.equal(
    domain.propertyFormSchema.safeParse({
      ...validValues,
      price_down_payment: undefined,
    }).success,
    false,
  );
  assert.equal(
    domain.propertyFormSchema.safeParse({
      ...validValues,
      images: validValues.images.slice(0, 2),
    }).success,
    false,
  );
});

test("property schema accepts rent time only for rental properties and requires one cover", () => {
  assert.equal(
    domain.propertyFormSchema.safeParse({
      ...validValues,
      purchase_status: "ForRent",
      rent_time: "Monthly",
    }).success,
    true,
  );
  assert.equal(
    domain.propertyFormSchema.safeParse({
      ...validValues,
      purchase_status: "ForRent",
      rent_time: null,
    }).success,
    true,
  );
  assert.equal(
    domain.propertyFormSchema.safeParse({
      ...validValues,
      images: validValues.images.map((image) => ({
        ...image,
        is_cover: false,
      })),
    }).success,
    false,
  );
});

test("navigation options are trimmed, case-insensitive, distinct, and sorted", () => {
  assert.deepEqual(
    domain.extractPropertyNavigationOptions([
      { province: " Bali ", regency: "Badung", street: "Seminyak" },
      { province: "bali", regency: "Denpasar", street: "sanur" },
      { province: "Jawa Barat", regency: "Bandung", street: "Dago" },
    ]),
    {
      provinces: ["Bali", "Jawa Barat"],
      regencies: ["Badung", "Bandung", "Denpasar"],
      streets: ["Dago", "sanur", "Seminyak"],
    },
  );
});

test("compact price preview uses K and M suffixes", () => {
  assert.equal(domain.formatCompactPropertyPrice(10_000, "Idr"), "Rp 10K");
  assert.equal(domain.formatCompactPropertyPrice(10_000_000, "Idr"), "Rp 10M");
  assert.equal(domain.formatCompactPropertyPrice(1_500_000, "Usd"), "$1.5M");
});

test("Google Maps iframe normalization accepts embeds and rejects executable markup", () => {
  const normalized = domain.normalizeGoogleMapsIframe(
    '<iframe src="https://www.google.com/maps/embed?pb=abc"></iframe>',
  );
  assert.equal(normalized.src, "https://www.google.com/maps/embed?pb=abc");
  assert.match(normalized.html, /^<iframe /);
  assert.equal(domain.normalizeGoogleMapsIframe(""), null);
  assert.throws(() =>
    domain.normalizeGoogleMapsIframe(
      '<iframe src="javascript:alert(1)"></iframe>',
    ),
  );
  assert.throws(() =>
    domain.normalizeGoogleMapsIframe(
      '<iframe src="https://example.com/maps/embed"></iframe><script>alert(1)</script>',
    ),
  );
});

test("removing the cover promotes the first remaining image", () => {
  const images = domain.removePropertyFormImage(validValues.images, 0);
  assert.equal(images.length, 2);
  assert.equal(images[0].is_cover, true);
  assert.equal(images.filter((image) => image.is_cover).length, 1);
});

test("payload conversion fills optional numbers and preserves hidden admin values for agent edits", () => {
  const payload = domain.buildPropertyPayload(validValues, {
    mode: "edit",
    viewerRole: "Agent",
    initialProperty: {
      sold_channel: "R123",
      configurations: { is_popular: true, is_njop_price: true },
    },
    images: validValues.images.map(
      ({ path, is_cover, english_label, indonesian_label }) => ({
        path,
        is_cover,
        english_label,
        indonesian_label,
      }),
    ),
  });

  assert.deepEqual(payload.measurements, {
    building_area: 0,
    building_level: 0,
    land_area: 0,
  });
  assert.deepEqual(payload.specifications, {
    bathrooms: 0,
    bedrooms: 0,
    carport: 0,
    electrical_power: 0,
    garage: 0,
  });
  assert.equal(payload.sold_channel, "R123");
  assert.equal(payload.configurations.is_popular, true);
  assert.equal(payload.configurations.is_njop_price, false);
  assert.equal(payload.gmap_iframe, "");
});

test("uploaded image paths merge with retained images without changing form order", () => {
  const images = [
    validValues.images[0],
    {
      key: "new",
      file: { name: "new.jpg" },
      is_cover: false,
      english_label: "Bedroom",
      indonesian_label: "Kamar Tidur",
    },
    validValues.images[2],
  ];

  assert.deepEqual(domain.mergeUploadedPropertyImages(images, ["/new.jpg"]), [
    {
      path: "/one.jpg",
      is_cover: true,
      english_label: "",
      indonesian_label: "",
    },
    {
      path: "/new.jpg",
      is_cover: false,
      english_label: "Bedroom",
      indonesian_label: "Kamar Tidur",
    },
    {
      path: "/three.jpg",
      is_cover: false,
      english_label: "",
      indonesian_label: "",
    },
  ]);
  assert.throws(() => domain.mergeUploadedPropertyImages(images, []));
});

test("existing untagged images hydrate with string labels and valid form values", () => {
  const initialProperty = createInitialProperty([
    {
      path: "/one.jpg",
      is_cover: true,
      english_label: null,
      indonesian_label: null,
    },
    { path: "/two.jpg", is_cover: false },
    {
      path: "/three.jpg",
      is_cover: false,
      english_label: "Bedroom",
      indonesian_label: "Kamar Tidur",
    },
  ]);

  const defaults = domain.createPropertyFormDefaults(initialProperty);

  assert.deepEqual(
    defaults.images.map(({ english_label, indonesian_label }) => ({
      english_label,
      indonesian_label,
    })),
    [
      { english_label: "", indonesian_label: "" },
      { english_label: "", indonesian_label: "" },
      { english_label: "Bedroom", indonesian_label: "Kamar Tidur" },
    ],
  );
  assert.equal(domain.propertyFormSchema.safeParse(defaults).success, true);
});

test("unchanged edit images merge without uploaded paths", () => {
  const defaults = domain.createPropertyFormDefaults(
    createInitialProperty(validValues.images),
  );

  const images = domain.mergeUploadedPropertyImages(defaults.images, []);

  assert.deepEqual(
    images.map(({ path, is_cover, english_label, indonesian_label }) => ({
      path,
      is_cover,
      english_label,
      indonesian_label,
    })),
    validValues.images.map(
      ({ path, is_cover, english_label, indonesian_label }) => ({
        path,
        is_cover,
        english_label,
        indonesian_label,
      }),
    ),
  );
  assert.equal(images.filter((image) => image.is_cover).length, 1);
  assert.equal(
    images.every(
      (image) =>
        typeof image.english_label === "string" &&
        typeof image.indonesian_label === "string",
    ),
    true,
  );
});
