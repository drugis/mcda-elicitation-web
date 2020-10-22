import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import {deselectedCellStyle} from 'app/ts/Subproblem/SubproblemButtons/AddSubproblemButton/AddSubproblemEffectsTable/AddSubproblemEffectsTable';
import React from 'react';

export default function EmptyCell({
  dataSourceId,
  alternativeId,
  isExcluded
}: {
  dataSourceId: string;
  alternativeId: string;
  isExcluded?: boolean;
}) {
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return (
    <Tooltip title="no data entered">
      <TableCell
        id={`value-cell-${dataSourceId}-${alternativeId}`}
        style={cellStyle}
      />
    </Tooltip>
  );
}
