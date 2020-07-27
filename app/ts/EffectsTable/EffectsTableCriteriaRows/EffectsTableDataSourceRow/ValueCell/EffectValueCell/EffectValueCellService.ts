import {Effect} from '@shared/interface/IEffect';
import {DisplayMode} from '@shared/interface/ISettings';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IScale from '@shared/interface/IScale';

export function renderEffect(
  effect: Effect,
  displayMode: DisplayMode,
  usePercentage: boolean,
  scale: IScale
): string {
  if (displayMode === 'enteredData') {
    return renderEnteredValues(effect, usePercentage);
  } else {
    return renderValuesForAnalysis(effect, usePercentage, scale);
  }
}

function renderEnteredValues(effect: Effect, usePercentage: boolean): string {
  if (effect) {
    switch (effect.type) {
      case 'empty':
        return '';
      case 'range':
        return renderRange(effect, usePercentage);
      case 'text':
        return effect.text;
      case 'value':
        return getStringForValue(effect.value, usePercentage);
      case 'valueCI':
        return renderValueCI(effect, usePercentage);
    }
  } else {
    return '';
  }
}

function getStringForValue(value: number, usePercentage: boolean): string {
  if (usePercentage) {
    return significantDigits(value * 100) + '%';
  } else {
    return significantDigits(value).toString();
  }
}

function renderRange(effect: IRangeEffect, usePercentage: boolean): string {
  const lowerBound = getStringForValue(effect.lowerBound, usePercentage);
  const upperBound = getStringForValue(effect.upperBound, usePercentage);
  return `[${lowerBound}, ${upperBound}]`;
}

function renderValueCI(effect: IValueCIEffect, usePercentage: boolean): string {
  const value = getStringForValue(effect.value, usePercentage);
  const lowerBound = getBound(
    effect.lowerBound,
    effect.isNotEstimableLowerBound,
    usePercentage
  );
  const upperBound = getBound(
    effect.upperBound,
    effect.isNotEstimableUpperBound,
    usePercentage
  );
  return `${value} (${lowerBound}, ${upperBound})`;
}

function getBound(
  value: number,
  isNotEstimable: boolean,
  usePercentage: boolean
) {
  if (isNotEstimable) {
    return 'NE';
  } else {
    return getStringForValue(value, usePercentage);
  }
}

function renderValuesForAnalysis(
  effect: Effect,
  usePercentage: boolean,
  scale: IScale
): string {
  if (effect && effectIsViable(effect)) {
    switch (effect.type) {
      case 'range':
        return renderRangeValueForAnalysis(effect, usePercentage);
      case 'value':
        return getStringForValue(effect.value, usePercentage);
      case 'valueCI':
        return getStringForValue(effect.value, usePercentage);
    }
  } else {
    return getValueFromScales(scale, usePercentage);
  }
}

function renderRangeValueForAnalysis(
  effect: IRangeEffect,
  usePercentage: boolean
): string {
  return getStringForValue(
    (effect.lowerBound + effect.upperBound) / 2,
    usePercentage
  );
}

function effectIsViable(effect: Effect): boolean {
  return effect.type !== 'empty' && effect.type !== 'text';
}

function getValueFromScales(scale: IScale, usePercentage: boolean): string {
  if (scale['50%'] !== null && scale['50%'] !== undefined) {
    return getStringForValue(scale['50%'], usePercentage);
  } else {
    return 'No data entered';
  }
}
