import TableCell from '@material-ui/core/TableCell';
import IScale from '@shared/interface/IScale';
import {getPercentifiedValueLabel} from 'app/ts/DisplayUtil/DisplayUtil';
import {deselectedCellStyle} from 'app/ts/Subproblem/SubproblemButtons/AddSubproblemButton/AddSubproblemEffectsTable/deselectedCellStyle';
import React from 'react';
import UncertainValue from '../UncertainValue/UncertainValue';

export default function NMACell({
  dataSourceId,
  alternativeId,
  scale,
  usePercentage,
  isExcluded
}: {
  dataSourceId: string;
  alternativeId: string;
  scale: IScale;
  usePercentage: boolean;
  isExcluded?: boolean;
}) {
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return (
    <TableCell
      id={`value-cell-${dataSourceId}-${alternativeId}`}
      style={cellStyle}
    >
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
