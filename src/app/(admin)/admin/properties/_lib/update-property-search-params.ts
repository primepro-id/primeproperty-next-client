export type PropertySearchParamsUpdates = Record<
  string,
  string | number | undefined
>;

export type PropertySearchParamsUpdater = (
  updates: PropertySearchParamsUpdates,
  resetPage: boolean,
) => void;

export function updatePropertySearchParams(
  currentSearchParams: string,
  updates: PropertySearchParamsUpdates,
  resetPage: boolean,
) {
  const nextParams = new URLSearchParams(currentSearchParams);

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === "") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
  }

  if (resetPage) {
    nextParams.delete("page");
  }

  return nextParams.toString();
}
