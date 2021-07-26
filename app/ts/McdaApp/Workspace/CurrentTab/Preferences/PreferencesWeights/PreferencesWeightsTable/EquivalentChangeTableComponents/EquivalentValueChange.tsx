import {TPvf} from '@shared/interface/Problem/IPvf';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../../../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {getEquivalentValue} from '../../../EquivalentChange/equivalentChangeUtil';

export default function EquivalentValueChange({
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
      {getEquivalentValue(
        usePercentage,
        otherWeight,
        pvf,
        partOfInterval,
        referenceWeight
      )}
    </span>
  );
}
