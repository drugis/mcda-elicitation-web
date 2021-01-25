import IPvf from '@shared/interface/Problem/IPvf';

export function getPartOfInterval(
  from: number,
  to: number,
  lowerBound: number,
  upperbound: number
): number {
  return Math.abs(to - from) / (upperbound - lowerBound);
}

export function getInitialReferenceValueFrom(
  lowerBound: number,
  upperBound: number,
  pvf: IPvf
): number {
  const multiplier = pvf.direction === 'increasing' ? 0.45 : 0.55;
  return (upperBound - lowerBound) * multiplier + lowerBound;
}

export function getInitialReferenceValueTo(
  lowerBound: number,
  upperBound: number,
  pvf: IPvf
): number {
  const multiplier = pvf.direction === 'increasing' ? 0.55 : 0.45;
  return (upperBound - lowerBound) * multiplier + lowerBound;
}
