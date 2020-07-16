import {Effect} from '@shared/interface/IEffect';
import React from 'react';

export default function EffectValueCell({effect}: {effect: Effect}) {
  // todo: if setting set to analysis values, show those;
  // if no value entered the value is calculated from distribution cell
  function renderEffect(effect: Effect): string {
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
  }

  return <span>{renderEffect(effect)}</span>;
}
