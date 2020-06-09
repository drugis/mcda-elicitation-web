import {TableCell, TableRow} from '@material-ui/core';
import React from 'react';
import ICriterion from '../../../../../interface/ICriterion';

export default function CriterionRow({criterion}: {criterion: ICriterion}) {
  const numberOfDataSourceRows = criterion.dataSources.length + 1;

  function createDataSourceRows() {}

  return (
    <TableRow>
      <TableCell rowSpan={numberOfDataSourceRows}>up and down we go</TableCell>
      <TableCell rowSpan={numberOfDataSourceRows}>{criterion.title}</TableCell>
      <TableCell rowSpan={numberOfDataSourceRows}>
        {criterion.description}
      </TableCell>
      {createDataSourceRows()}
    </TableRow>
  );
}
