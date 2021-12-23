import {Mark} from '@material-ui/core/Slider';
import IDataSource from '@shared/interface/IDataSource';
import {getPercentifiedValue} from 'app/ts/util/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';

export function getSliderLimits(
  observedRange: [number, number],
  configuredRange: [number, number]
): [number, number] {
  const [localObservedLower, localObservedUpper] =
    preventOverlappingObservedRanges(observedRange);

  const [localConfiguredLower, localConfiguredUpper] =
    preventOverlappingConfiguredRanges(configuredRange);

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

export function getFloor(
  configuredLower: number,
  restrictedLower: number
): number {
  const floor = niceFrom(configuredLower);
  if (floor >= restrictedLower) {
    return niceFrom(floor - Math.abs(floor * 0.1));
  } else {
    return floor;
  }
}

export function getCeil(
  configuredUpper: number,
  restrictedUpper: number
): number {
  const ceil = niceTo(configuredUpper);
  if (ceil <= restrictedUpper) {
    return niceTo(ceil + Math.abs(ceil * 0.1));
  } else {
    return ceil;
  }
}

function niceTo(x: number): number {
  return makeValueNice(x, Math.ceil);
}

function niceFrom(x: number): number {
  return makeValueNice(x, Math.floor);
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
  return significantDigits(deNormalised);
}

function log10(x: number): number {
  return Math.log(x) / Math.log(10);
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

function getMargin(from: number, to: number): number {
  return 0.5 * (to - from);
}

export function createMarks(
  sliderRange: [number, number],
  observedRange: [number, number],
  usePercentage: boolean
): Mark[] {
  let marks: Mark[] = [
    {
      value: sliderRange[0],
      label: getPercentifiedValue(sliderRange[0], usePercentage)
    }
  ];
  if (observedRange[0] !== sliderRange[0]) {
    marks.push({
      value: observedRange[0]
    });
  }
  if (observedRange[1] !== sliderRange[1]) {
    marks.push({
      value: observedRange[1]
    });
  }
  marks.push({
    value: sliderRange[1],
    label: getPercentifiedValue(sliderRange[1], usePercentage)
  });

  return marks;
}

export function getStepSizeAdjustedConfiguredRanges(
  dataSources: Record<string, IDataSource>,
  stepSizes: Record<string, number>,
  configuredRanges: Record<string, [number, number]>,
  observedRanges: Record<string, [number, number]>
): Record<string, [number, number]> {
  return _.mapValues(dataSources, (dataSource: IDataSource): [number, number] =>
    adjustConfiguredRangeForStepSize(
      stepSizes[dataSource.id],
      configuredRanges[dataSource.id],
      observedRanges[dataSource.id]
    )
  );
}

export function adjustConfiguredRangeForStepSize(
  stepSize: number,
  configuredRange: [number, number],
  observedRange: [number, number]
): [number, number] {
  const lowerValue = getAdjustedLowerBound(configuredRange[0], stepSize);
  const upperValue = getAdjustedUpperBound(configuredRange[1], stepSize);
  return [
    Math.min(lowerValue, observedRange[0]),
    Math.max(upperValue, observedRange[1])
  ];
}

function getAdjustedLowerBound(value: number, stepSize: number): number {
  const remainder = value % stepSize;
  if (remainder === 0) {
    return value;
  } else {
    return significantDigits(value - remainder - stepSize);
  }
}

function getAdjustedUpperBound(value: number, stepSize: number): number {
  const remainder = value % stepSize;
  if (remainder === 0) {
    return value;
  } else {
    return significantDigits(value - remainder + stepSize);
  }
}
