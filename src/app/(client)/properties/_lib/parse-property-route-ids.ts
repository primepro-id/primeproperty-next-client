const parsePositiveInteger = (value: string) => {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
};

export const parsePropertyDetailId = (segment: string) =>
  parsePositiveInteger(segment.split("-")[0]);

export const parsePropertyComparisonIds = (ids?: string | string[]) => {
  if (!ids || Array.isArray(ids)) return null;

  const segments = ids.split(",");
  if (segments.length !== 2) return null;

  const parsedIds = segments.map(parsePositiveInteger);
  return parsedIds.every((id): id is number => id !== null)
    ? ([parsedIds[0], parsedIds[1]] as const)
    : null;
};
