import {Effect} from '@shared/interface/IEffect';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IScale from '@shared/interface/IScale';
import {DisplayMode} from '@shared/interface/ISettings';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import {valueToString} from 'app/ts/DisplayUtil/DisplayUtil';

export function renderEffect(
  effect: Effect,
  displayMode: DisplayMode,
  usePercentage: boolean,
  scale: IScale
): string {
  if (displayMode === 'enteredData') {
    return renderEnteredValues(effect, usePercentage, false);
  } else {
    return renderValuesForAnalysis(effect, usePercentage, scale);
  }
}

export function renderInputEffect(effect: Effect, usePercentage: boolean) {
  return renderEnteredValues(effect, usePercentage, true);
}

function renderEnteredValues(
  effect: Effect,
  usePercentage: boolean,
  isInput: boolean
): string {
  if (effect) {
    switch (effect.type) {
      case 'empty':
        return isInput ? 'Empty' : '';
      case 'range':
        return renderRange(effect, usePercentage);
      case 'text':
        return effect.text;
      case 'value':
        return valueToString(
          effect.value,
          usePercentage,
          effect.unitOfMeasurementType
        );
      case 'valueCI':
        return renderValueCI(effect, usePercentage);
    }
  } else {
    return '';
  }
}

function renderRange(effect: IRangeEffect, usePercentage: boolean): string {
  const lowerBound = valueToString(
    effect.lowerBound,
    usePercentage,
    effect.unitOfMeasurementType
  );
  const upperBound = valueToString(
    effect.upperBound,
    usePercentage,
    effect.unitOfMeasurementType
  );
  return `[${lowerBound}, ${upperBound}]`;
}

function renderValueCI(effect: IValueCIEffect, usePercentage: boolean): string {
  const value = valueToString(
    effect.value,
    usePercentage,
    effect.unitOfMeasurementType
  );
  const lowerBound = getBound(
    effect.lowerBound,
    effect.isNotEstimableLowerBound,
    usePercentage,
    effect.unitOfMeasurementType
  );
  const upperBound = getBound(
    effect.upperBound,
    effect.isNotEstimableUpperBound,
    usePercentage,
    effect.unitOfMeasurementType
  );
  return `${value}\n(${lowerBound}, ${upperBound})`;
}

function getBound(
  value: number,
  isNotEstimable: boolean,
  usePercentage: boolean,
  unitType: UnitOfMeasurementType
) {
  if (isNotEstimable) {
    return 'NE';
  } else {
    return valueToString(value, usePercentage, unitType);
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
        return valueToString(
          effect.value,
          usePercentage,
          effect.unitOfMeasurementType
        );
      case 'valueCI':
        return valueToString(
          effect.value,
          usePercentage,
          effect.unitOfMeasurementType
        );
    }
  } else {
    return getValueFromScales(scale, usePercentage);
  }
}

function renderRangeValueForAnalysis(
  effect: IRangeEffect,
  usePercentage: boolean
): string {
  return valueToString(
    (effect.lowerBound + effect.upperBound) / 2,
    usePercentage,
    effect.unitOfMeasurementType
  );
}

function effectIsViable(effect: Effect): boolean {
  return effect.type !== 'empty' && effect.type !== 'text';
}

function getValueFromScales(scale: IScale, usePercentage: boolean): string {
  if (scale['50%'] !== null && scale['50%'] !== undefined) {
    return valueToString(
      scale['50%'],
      usePercentage,
      UnitOfMeasurementType.decimal
    );
  } else {
    return 'No data entered';
  }
}
