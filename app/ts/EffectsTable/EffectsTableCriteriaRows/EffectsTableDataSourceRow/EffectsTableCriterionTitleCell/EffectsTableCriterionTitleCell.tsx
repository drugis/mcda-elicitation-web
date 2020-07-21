import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import React from 'react';

export default function EffectsTableCriterionTitleCell({
  rowIndex,
  criterion
}: {
  rowIndex: number;
  criterion: ICriterion;
}) {
  return (
    <TableCell
      id={`criterion-title-${rowIndex}`}
      rowSpan={criterion.dataSources.length}
    >
      {criterion.title}
    </TableCell>
  );
}
