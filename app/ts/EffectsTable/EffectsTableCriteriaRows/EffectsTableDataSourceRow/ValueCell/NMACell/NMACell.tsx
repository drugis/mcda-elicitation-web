import TableCell from '@material-ui/core/TableCell';
import IScale from '@shared/interface/IScale';
import {getPercentifiedValueLabel} from 'app/ts/DisplayUtil/DisplayUtil';
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
          value={getPercentifiedValueLabel(scale['50%'], usePercentage)}
          lowerBound={getPercentifiedValueLabel(scale['2.5%'], usePercentage)}
          upperBound={getPercentifiedValueLabel(scale['97.5%'], usePercentage)}
        />
      </div>
    </TableCell>
  );
}
