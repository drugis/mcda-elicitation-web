import {Mark} from '@material-ui/core/Slider';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import _ from 'lodash';

function log10(x: number): number {
  return Math.log(x) / Math.log(10);
}

function makeValueNice(x: number, dirFun: (x: number) => number): number {
  if (x === 0) {
    return 0;
  }
  const absX = Math.abs(x);
  const log10X = log10(absX);
  let factor;
  let normalised;
  let ceiled;
  let deNormalised;
  if (absX >= 1) {
    factor = Math.floor(log10X);
    normalised = x / Math.pow(10, factor);
    ceiled = dirFun(normalised);
    deNormalised = ceiled * Math.pow(10, factor);
  } else {
    factor = Math.ceil(Math.abs(log10X));
    normalised = x * Math.pow(10, factor);
    ceiled = dirFun(normalised);
    deNormalised = ceiled * Math.pow(10, -factor);
  }
  return deNormalised;
}

function niceTo(x: number): number {
  return makeValueNice(x, Math.ceil);
}

function niceFrom(x: number): number {
  return makeValueNice(x, Math.floor);
}

function getFloor(from: number, restrictedRangeFrom: number): number {
  const floor = niceFrom(from);
  if (floor >= restrictedRangeFrom) {
    return niceFrom(floor - Math.abs(floor * 0.1));
  } else {
    return floor;
  }
}

function getCeil(to: number, restrictedRangeTo: number): number {
  const ceil = niceTo(to);
  if (ceil <= restrictedRangeTo) {
    return niceTo(ceil + Math.abs(ceil * 0.1));
  } else {
    return ceil;
  }
}

function getMargin(from: number, to: number): number {
  return 0.5 * (to - from);
}

export function decreaseSliderLowerBound(
  [configuredLower, configuredUpper]: [number, number],
  theoreticalLower: number
): [number, number] {
  const limit = _.isNull(theoreticalLower) ? -Infinity : theoreticalLower;
  const margin = getMargin(configuredLower, configuredUpper);
  const newFrom = niceFrom(configuredLower - margin);
  return [Math.max(newFrom, limit), configuredUpper];
}

export function increaseSliderUpperBound(
  [configuredLower, configuredUpper]: [number, number],
  theoreticalUpper: number
): [number, number] {
  const limit = _.isNull(theoreticalUpper) ? Infinity : theoreticalUpper;
  const margin = getMargin(configuredLower, configuredUpper);
  const newTo = niceTo(configuredUpper + margin);
  return [configuredLower, Math.min(newTo, limit)];
}

export function getSliderLimits(
  observedRange: [number, number],
  configuredRange: [number, number]
): [number, number] {
  const [
    localObservedLower,
    localObservedUpper
  ] = preventOverlappingObservedRanges(observedRange);

  const [
    localConfiguredLower,
    localConfiguredUpper
  ] = preventOverlappingConfiguredRanges(configuredRange);

  const floor = getFloor(localConfiguredLower, localObservedLower);
  const ceil = getCeil(localConfiguredUpper, localObservedUpper);

  return [floor, ceil];
}

function preventOverlappingObservedRanges([observedLower, observedUpper]: [
  number,
  number
]): [number, number] {
  if (observedLower === observedUpper) {
    // in case of effects only
    return [
      observedLower - Math.abs(observedLower) * 0.001,
      observedUpper + Math.abs(observedUpper) * 0.001
    ];
  } else {
    return [observedLower, observedUpper];
  }
}

function preventOverlappingConfiguredRanges([
  configuredLower,
  configuredUpper
]: [number, number]): [number, number] {
  if (configuredLower === configuredUpper) {
    // in case all cells in a row have the same value
    return [configuredLower * 0.95, configuredUpper * 1.05];
  } else {
    return [configuredLower, configuredUpper];
  }
}

export function determineStepSize(from: number, to: number): number {
  const interval = to - from;
  const magnitude = Math.floor(Math.log10(interval));
  return Math.pow(10, magnitude - 2);
}

export function createMarks(
  sliderRange: [number, number],
  observedRange: [number, number],
  usePercentage: boolean
): Mark[] {
  return [
    {
      value: sliderRange[0],
      label: getPercentifiedValue(sliderRange[0], usePercentage)
    },
    {
      value: observedRange[0]
    },
    {
      value: observedRange[1]
    },
    {
      value: sliderRange[1],
      label: getPercentifiedValue(sliderRange[1], usePercentage)
    }
  ];
}
