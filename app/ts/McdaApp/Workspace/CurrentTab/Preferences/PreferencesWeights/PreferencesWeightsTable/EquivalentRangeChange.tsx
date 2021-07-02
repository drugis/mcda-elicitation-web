import {TPvf} from '@shared/interface/Problem/IPvf';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {getEquivalentRangeValue} from '../../EquivalentChange/equivalentChangeUtil';
import {getWorst} from '../../PartialValueFunctions/PartialValueFunctionUtil';

export default function EquivalentRangeChange({
  usePercentage,
  pvf,
  otherWeight
}: {
  usePercentage: boolean;
  pvf: TPvf;
  otherWeight: number;
}): JSX.Element {
  const {referenceWeight, partOfInterval} = useContext(EquivalentChangeContext);

  return (
    <span>
      {getWorst(pvf, usePercentage)} to{' '}
      {getEquivalentRangeValue(
        usePercentage,
        otherWeight,
        pvf,
        partOfInterval,
        referenceWeight
      )}
    </span>
  );
}
