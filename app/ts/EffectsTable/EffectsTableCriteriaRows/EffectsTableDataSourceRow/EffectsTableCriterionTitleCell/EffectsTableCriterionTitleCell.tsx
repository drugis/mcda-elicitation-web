import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import {deselectedCellStyle} from 'app/ts/Subproblem/SubproblemButtons/AddSubproblemButton/AddSubproblemEffectsTable/AddSubproblemEffectsTable';
import React from 'react';

export default function EffectsTableCriterionTitleCell({
  rowIndex,
  criterion,
  isExcluded
}: {
  rowIndex: number;
  criterion: ICriterion;
  isExcluded?: boolean;
}) {
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return (
    <TableCell
      id={`criterion-title-${rowIndex}`}
      rowSpan={criterion.dataSources.length}
      style={cellStyle}
    >
      {criterion.title}
    </TableCell>
  );
}
