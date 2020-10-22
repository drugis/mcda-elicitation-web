import {TableCell} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';

export default function CriteriaHeader({colSpan}: {colSpan: number}) {
  return (
    <TableCell id="criteria-header" align="center" colSpan={colSpan}>
      Criterion <InlineHelp helpId="criterion" />
    </TableCell>
  );
}
