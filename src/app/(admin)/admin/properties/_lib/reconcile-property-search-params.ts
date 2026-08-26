type ReconciledSearchParams = {
  value: string;
  pending: boolean;
};

export function reconcilePropertySearchParams(
  incomingValue: string,
  optimisticValue: string,
  pending: boolean,
): ReconciledSearchParams {
  if (pending && incomingValue !== optimisticValue) {
    return { value: optimisticValue, pending: true };
  }

  return { value: incomingValue, pending: false };
}
