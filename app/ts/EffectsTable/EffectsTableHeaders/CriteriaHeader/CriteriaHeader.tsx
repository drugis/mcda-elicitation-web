import {TableCell} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';

export default function CriteriaHeader() {
  return (
    <TableCell id="criteria-header" align="center">
      Criterion <InlineHelp helpId="criterion" />
    </TableCell>
  );
}
