import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import DistributionCell from './DistributionCell/DistributionCell';
import EffectCell from './EffectCell/EffectCell';

export default function ValueCell({alternativeId}: {alternativeId: string}) {
  const {tableInputMode} = useContext(ManualInputContext);

  return tableInputMode === 'effect' ? (
    <EffectCell alternativeId={alternativeId} />
  ) : (
    <DistributionCell alternativeId={alternativeId} />
  );
}
