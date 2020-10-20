import TableCell from '@material-ui/core/TableCell';
import IScale from '@shared/interface/IScale';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import React from 'react';
import UncertainValue from '../UncertainValue/UncertainValue';

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
          value={getPercentifiedValue(scale['50%'], usePercentage)}
          lowerBound={getPercentifiedValue(scale['2.5%'], usePercentage)}
          upperBound={getPercentifiedValue(scale['97.5%'], usePercentage)}
        />
      </div>
    </TableCell>
  );
}
