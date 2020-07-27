import React from 'react';
import {Tooltip, TableCell} from '@material-ui/core';

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
