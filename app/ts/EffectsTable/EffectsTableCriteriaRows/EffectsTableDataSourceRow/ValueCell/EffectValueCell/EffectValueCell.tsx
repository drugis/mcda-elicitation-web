import {Effect} from '@shared/interface/IEffect';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IScale from '@shared/interface/IScale';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function EffectValueCell({
  effect,
  scale,
  canBePercentage
}: {
  effect: Effect;
  scale: IScale;
  canBePercentage: boolean;
}) {
  const {displayMode, showPercentages} = useContext(SettingsContext);

  function renderEffect(effect: Effect): string {
    if (displayMode === 'enteredData') {
      return renderEnteredValues(effect);
    } else {
      return renderValuesForAnalysis(effect);
    }
  }

  function renderEnteredValues(effect: Effect): string {
    if (effect) {
      switch (effect.type) {
        case 'empty':
          return 'empty';
        case 'range':
          return renderRange(effect);
        case 'text':
          return effect.text;
        case 'value':
          return getStringForValue(effect.value);
        case 'valueCI':
          return renderValueCI(effect);
      }
    } else {
      return '';
    }
  }

  function getStringForValue(value: number): string {
    if (showPercentages && canBePercentage) {
      return significantDigits(value * 100) + '%';
    } else {
      return value.toString();
    }
  }

  function renderRange(effect: IRangeEffect): string {
    const lowerBound = getStringForValue(effect.lowerBound);
    const upperBound = getStringForValue(effect.upperBound);
    return `[${lowerBound}, ${upperBound}]`;
  }

  function renderValueCI(effect: IValueCIEffect): string {
    const value = getStringForValue(effect.value);
    const lowerBound = getStringForValue(effect.lowerBound);
    const upperBound = getStringForValue(effect.upperBound);
    return `${value} (${lowerBound}, ${upperBound})`;
  }

  function renderValuesForAnalysis(effect: Effect): string {
    if (effect && effectIsViable(effect)) {
      switch (effect.type) {
        case 'range':
          return renderRangeValueForAnalysis(effect);
        case 'value':
          return getStringForValue(effect.value);
        case 'valueCI':
          return getStringForValue(effect.value);
      }
    } else {
      return getValueFromScales(scale);
    }
  }

  function renderRangeValueForAnalysis(effect: IRangeEffect): string {
    return getStringForValue((effect.lowerBound + effect.upperBound) / 2);
  }

  function effectIsViable(effect: Effect): boolean {
    return effect.type !== 'empty' && effect.type !== 'text';
  }

  function getValueFromScales(scale: IScale): string {
    if (scale['50%'] !== null && scale['50%'] !== undefined) {
      return getStringForValue(scale['50%']);
    } else {
      return 'No data entered';
    }
  }

  return <div className="text-centered">{renderEffect(effect)}</div>;
}
