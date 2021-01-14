export function getPartOfInterval(
  from: number,
  to: number,
  lowerBound: number,
  upperbound: number
): number {
  return (to - from) / (upperbound - lowerBound);
}

export function getInitialReferenceValueFrom(
  lowerBound: number,
  upperBound: number
): number {
  return (upperBound - lowerBound) * 0.45 + lowerBound;
}

export function getInitialReferenceValueTo(
  lowerBound: number,
  upperBound: number
): number {
  return (upperBound - lowerBound) * 0.55 + lowerBound;
}
