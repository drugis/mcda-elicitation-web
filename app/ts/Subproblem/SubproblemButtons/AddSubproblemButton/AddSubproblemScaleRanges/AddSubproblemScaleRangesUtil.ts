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

export function calculateScales(
  [theoreticalLower, theoreticalUpper]: [number, number],
  from: number,
  to: number,
  [observedLower, observedUpper]: [number, number]
) {
  if (observedLower === observedUpper) {
    // dumb corner case
    observedLower -= Math.abs(observedLower) * 0.001;
    observedUpper += Math.abs(observedUpper) * 0.001;
  }

  // var boundFrom = function (val: number) {
  //   return val < theoreticalLower ? theoreticalLower : val;
  // };

  // var boundTo = function (val: number) {
  //   return val > theoreticalUpper ? theoreticalUpper : val;
  // };

  if (from === to) {
    from *= 0.95;
    to *= 1.05;
  }

  theoreticalLower = _.isNull(theoreticalLower) ? -Infinity : theoreticalLower;
  theoreticalUpper = _.isNull(theoreticalUpper) ? Infinity : theoreticalUpper;

  var floor = getFloor(from, observedLower);
  var ceil = getCeil(to, observedUpper);

  var margin = getMargin(from, to);

  // return {
  //   increaseFrom: function () {
  //     this.sliderOptions.floor = niceFrom(
  //       boundFrom(this.sliderOptions.floor - margin)
  //     );
  //   },
  //   increaseTo: function () {
  //     this.sliderOptions.ceil = niceTo(
  //       boundTo(this.sliderOptions.ceil + margin)
  //     );
  //   },
  //   sliderOptions: {
  //     restrictedRange: {
  //       from: observedLower,
  //       to: observedUpper
  //     },
  //     min: floor,
  //     max: ceil,
  //     step: Math.abs(niceTo(to) - niceFrom(from)) / 100,
  //     translate: function (value) {
  //       return numberFilter(value);
  //     }
  //   }
  // };

  return {
    min: floor,
    max: ceil,
    minRestricted: observedLower,
    maxRestricted: observedUpper,
    step: Math.abs(niceTo(to) - niceFrom(from)) / 100
  };
}
