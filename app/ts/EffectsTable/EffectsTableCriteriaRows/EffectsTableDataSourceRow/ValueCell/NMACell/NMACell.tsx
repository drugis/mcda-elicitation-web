import React from 'react';
import {TableCell} from '@material-ui/core';
import IScale from '@shared/interface/IScale';
import UncertainValue from '../UncertainValue/UncertainValue';
import {getStringForValue} from '../ValueCellService';

export default function NMACell({
  dataSourceId,
  alternativeId,
  scale,
  usePercentage
}: {
  dataSourceId: string;
  alternativeId: string;
  scale: IScale;
  usePercentage: boolean;
}) {
  return (
    <TableCell id={`value-cell-${dataSourceId}-${alternativeId}`}>
      <div className="text-centered">
        <UncertainValue
          value={getStringForValue(scale['50%'], usePercentage)}
          lowerBound={getStringForValue(scale['2.5%'], usePercentage)}
          upperBound={getStringForValue(scale['97.5%'], usePercentage)}
        />
      </div>
    </TableCell>
  );
}
