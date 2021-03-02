import TableCell from '@material-ui/core/TableCell';
import {InlineHelp} from 'help-popup';
import React from 'react';

export default function CriteriaHeader({colSpan}: {colSpan: number}) {
  return (
    <TableCell id="criteria-header" align="center" colSpan={colSpan}>
      <InlineHelp helpId="criterion">Criterion</InlineHelp>
    </TableCell>
  );
}
