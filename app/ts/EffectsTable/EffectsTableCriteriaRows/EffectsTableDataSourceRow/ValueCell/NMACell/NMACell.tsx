import TableCell from '@material-ui/core/TableCell';
import IScale from '@shared/interface/IScale';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {deselectedCellStyle} from 'app/ts/Styles/deselectedCellStyle';
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
      <div style={textCenterStyle}>
        <UncertainValue
          value={getPercentifiedValue(scale['50%'], usePercentage)}
          lowerBound={getPercentifiedValue(scale['2.5%'], usePercentage)}
          upperBound={getPercentifiedValue(scale['97.5%'], usePercentage)}
        />
      </div>
    </TableCell>
  );
}
