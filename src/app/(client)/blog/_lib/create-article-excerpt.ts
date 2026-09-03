const namedEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

function decodeNumericEntity(
  value: string,
  radix: 10 | 16,
  entity: string,
): string {
  const codePoint = Number.parseInt(value, radix);
  return Number.isInteger(codePoint) && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : entity;
}

export function createArticleExcerpt(content: string): string {
  return content
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, value: string) => {
      if (value.startsWith("#x") || value.startsWith("#X")) {
        return decodeNumericEntity(value.slice(2), 16, entity);
      }

      if (value.startsWith("#")) {
        return decodeNumericEntity(value.slice(1), 10, entity);
      }

      return namedEntities[value.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}
