import {Mark} from '@material-ui/core';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import ISliderLimits from 'app/ts/interface/ISliderLimits';
import _ from 'lodash';

function log10(x: number) {
  return Math.log(x) / Math.log(10);
}

function nice(x: number, dirFun: (x: number) => number) {
  if (x === 0) {
    return 0;
  }
  var absX = Math.abs(x);
  var log10X = log10(absX);
  var factor;
  var normalised;
  var ceiled;
  var deNormalised;
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

function niceTo(x: number) {
  return nice(x, Math.ceil);
}

function niceFrom(x: number) {
  return nice(x, Math.floor);
}

function getFloor(from: number, restrictedRangeFrom: number): number {
  var floor = niceFrom(from);
  if (floor >= restrictedRangeFrom) {
    floor = niceFrom(floor - Math.abs(floor * 0.1));
  }
  return floor;
}

function getCeil(to: number, restrictedRangeTo: number): number {
  var ceil = niceTo(to);
  if (ceil <= restrictedRangeTo) {
    ceil = niceTo(ceil + Math.abs(ceil * 0.1));
  }
  return ceil;
}

function getMargin(from: number, to: number): number {
  return 0.5 * (to - from);
}

export function increaseRangeFrom(
  [configuredLower, configuredUpper]: [number, number],
  theoreticalLower: number
): [number, number] {
  const margin = getMargin(configuredLower, configuredUpper);
  const newFrom = niceFrom(configuredLower - margin);
  return [Math.max(newFrom, theoreticalLower), configuredUpper];
}

export function increaseRangeTo(
  [configuredLower, configuredUpper]: [number, number],
  theoreticalUpper: number
): [number, number] {
  const margin = getMargin(configuredLower, configuredUpper);
  const newTo = niceTo(configuredUpper + margin);
  return [configuredLower, Math.min(newTo, theoreticalUpper)];
}

export function getSliderLimits(
  [theoreticalLower, theoreticalUpper]: [number, number],
  [observedLower, observedUpper]: [number, number],
  [configuredLower, configuredUpper]: [number, number]
): ISliderLimits {
  if (observedLower === observedUpper) {
    // dumb corner case
    observedLower -= Math.abs(observedLower) * 0.001;
    observedUpper += Math.abs(observedUpper) * 0.001;
  }

  if (configuredLower === configuredUpper) {
    configuredLower *= 0.95;
    configuredUpper *= 1.05;
  }

  theoreticalLower = _.isNull(theoreticalLower) ? -Infinity : theoreticalLower;
  theoreticalUpper = _.isNull(theoreticalUpper) ? Infinity : theoreticalUpper;

  var floor = getFloor(configuredLower, observedLower);
  var ceil = getCeil(configuredUpper, observedUpper);

  return {
    min: floor,
    max: ceil,
    minRestricted: observedLower,
    maxRestricted: observedUpper,
    step: determineStepSize(floor, ceil) //Math.abs(niceTo(observedUpper) - niceFrom(observedLower)) / 100
  };
}

function determineStepSize(from: number, to: number) {
  const interval = to - from;
  const magnitude = Math.floor(Math.log10(interval));
  return Math.pow(10, magnitude - 2);
}

export function createMarks(
  sliderRange: [number, number],
  observedRange: [number, number],
  doPercentification: boolean
): Mark[] {
  return [
    {
      value: sliderRange[0],
      label: getPercentifiedValue(sliderRange[0], doPercentification)
    },
    {
      value: observedRange[0]
    },
    {
      value: observedRange[1]
    },
    {
      value: sliderRange[1],
      label: getPercentifiedValue(sliderRange[1], doPercentification)
    }
  ];
}
