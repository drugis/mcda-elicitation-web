import React from 'react';
import LowerBoundInput from '../LowerBoundInput/LowerBoundInput';
import UpperBoundInput from '../UpperBoundInput/UpperBountInput';
import ValueInput from '../ValueInput/ValueInput';
import {EffectCellContext} from '../../../EffectCellContext/EffectCellContext';

export default function ValueCIInput() {
  return (
    <>
      <ValueInput context={EffectCellContext} />
      <LowerBoundInput context={EffectCellContext} />
      <UpperBoundInput context={EffectCellContext} />
    </>
  );
}
