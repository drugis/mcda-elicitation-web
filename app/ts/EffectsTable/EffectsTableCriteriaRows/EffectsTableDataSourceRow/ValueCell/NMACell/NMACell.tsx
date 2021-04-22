import TableCell from '@material-ui/core/TableCell';
import IScale from '@shared/interface/IScale';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {deselectedCellStyle} from 'app/ts/McdaApp/deselectedCellStyle';
import {useStyles} from 'app/ts/McdaApp/McdaApp';
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
  const classes = useStyles();
  const cellStyle = isExcluded ? deselectedCellStyle : {}; //FIXME also define gloabally?

  return (
    <TableCell
      id={`value-cell-${dataSourceId}-${alternativeId}`}
      style={cellStyle}
    >
      <div className={classes.textCenter}>
        <UncertainValue
          value={getPercentifiedValue(scale['50%'], usePercentage)}
          lowerBound={getPercentifiedValue(scale['2.5%'], usePercentage)}
          upperBound={getPercentifiedValue(scale['97.5%'], usePercentage)}
        />
      </div>
    </TableCell>
  );
}
