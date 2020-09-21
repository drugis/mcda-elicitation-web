import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';

export default function EmptyCell({
  dataSourceId,
  alternativeId
}: {
  dataSourceId: string;
  alternativeId: string;
}) {
  return (
    <Tooltip title="no data entered">
      <TableCell id={`value-cell-${dataSourceId}-${alternativeId}`} />
    </Tooltip>
  );
}
