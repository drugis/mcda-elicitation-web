import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IScale from '@shared/interface/IScale';
import UncertainValue from '../UncertainValue/UncertainValue';
import {getStringForInputValue} from '../ValueCellService';

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
          value={getStringForInputValue(scale['50%'], usePercentage)}
          lowerBound={getStringForInputValue(scale['2.5%'], usePercentage)}
          upperBound={getStringForInputValue(scale['97.5%'], usePercentage)}
        />
      </div>
    </TableCell>
  );
}
