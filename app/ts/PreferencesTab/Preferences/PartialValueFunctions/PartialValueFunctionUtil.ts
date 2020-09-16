import IPvf from '@shared/interface/Problem/IPvf';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';

export function getPvfCoordinates(
  pvf: IPvf,
  criterionTitle: string
): [['x', ...number[]], [string, 1, ...number[]]] {
  const pvfCoordinates = [getXValues(pvf), getYValues(pvf, criterionTitle)];
  return pvfCoordinates as [['x', ...number[]], [string, 1, ...number[]]];
}

function getXValues(pvf: IPvf) {
  // Cannot type function because of smearing
  return ['x', getBest(pvf), ...intermediateX(pvf), getWorst(pvf)];
}

function intermediateX(pvf: IPvf): number[] {
  return pvf.cutoffs ? pvf.cutoffs : [];
}

function getYValues(pvf: IPvf, criterionTitle: string) {
  // Cannot type function because of smearing
  return [criterionTitle, 1, ...intermediateY(pvf), 0];
}

function intermediateY(pvf: IPvf): number[] {
  return pvf.values ? pvf.values : [];
}

export function getBest(pvf: IPvf): number {
  return significantDigits(isIncreasing(pvf) ? pvf.range[1] : pvf.range[0]);
}

export function getWorst(pvf: IPvf): number {
  return significantDigits(isIncreasing(pvf) ? pvf.range[0] : pvf.range[1]);
}
function isIncreasing(pvf: IPvf): boolean {
  return pvf.direction === 'increasing';
}
