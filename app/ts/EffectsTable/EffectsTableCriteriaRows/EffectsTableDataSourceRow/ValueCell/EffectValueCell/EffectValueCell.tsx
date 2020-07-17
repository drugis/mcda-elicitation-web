import { Effect } from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import { SettingsContext } from 'app/ts/Settings/SettingsContext';
import React, { useContext } from 'react';

export default function EffectValueCell({effect, scale}: {effect: Effect; scale: IScale}) {
  const {displayMode} = useContext(SettingsContext);
  // if no value entered the value is calculated from distribution cell

  function renderEffect(effect: Effect): string {
    if (displayMode === 'enteredData') {
      return renderEnteredValues(effect);
    } else {
      return renderValuesForAnalysis(effect);
    }

    function renderEnteredValues(effect: Effect): string {
      if (effect) {
        switch (effect.type) {
          case 'empty':
            return 'empty';
          case 'range':
            return `[${effect.lowerBound}, ${effect.upperBound}]`;
          case 'text':
            return effect.text;
          case 'value':
            return effect.value.toString();
          case 'valueCI':
            return `${effect.value} (${effect.lowerBound}, ${effect.upperBound})`;
        }
      } else {
        return '';
      }
    }

    function renderValuesForAnalysis(effect: Effect): string {
      if (effect && effectIsViable(effect)) {
        switch (effect.type) {
          case 'range':
            return `${(effect.lowerBound + effect.upperBound) / 2}`;
          case 'value':
            return effect.value.toString();
          case 'valueCI':
            return effect.value.toString();
        }
      } else {
        return getValueFromScales(scale);
      }
    }

    function effectIsViable(effect: Effect) {
      return effect.type !== 'empty' && effect.type !== 'text';
    }

    function getValueFromScales(scale: IScale):string {
      return scale["50%"].toString(); //fixme
    }
  }

  return <span>{renderEffect(effect)}</span>;
}
