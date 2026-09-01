import { createOrganizationSchema } from "./create-organization-schema";
import { createWebsiteSchema } from "./create-website-schema";

type SchemaNode = Record<string, unknown>;

function omitContext(schema: SchemaNode): SchemaNode {
  const node = { ...schema };
  delete node["@context"];
  return node;
}

export function createSiteIdentitySchema(): {
  "@context": "https://schema.org";
  "@graph": SchemaNode[];
} {
  return {
    "@context": "https://schema.org",
    "@graph": [
      omitContext(createWebsiteSchema()),
      omitContext(createOrganizationSchema()),
    ],
  };
}
