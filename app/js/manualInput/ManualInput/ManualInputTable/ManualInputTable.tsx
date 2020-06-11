import {Table, TableCell, TableHead, TableRow} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';
import AddAlternativeButton from './AddAlternativeButton/AddAlternativeButton';
import AlternativeHeader from './AlternativeHeader/AlternativeHeader';
import CriteriaRows from './CriteriaRows/CriteriaRows';

export default function ManualInputTable() {
  const {alternatives} = useContext(ManualInputContext);

  function createAlternativeHeaders() {
    return _.map(alternatives, (alternative) => {
      return (
        <AlternativeHeader key={alternative.id} alternative={alternative} />
      );
    });
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={3}>Criterion</TableCell>
          <TableCell>Description</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>Unit of measurement</TableCell>
          {createAlternativeHeaders()}
          <TableCell align="center">
            <AddAlternativeButton />
          </TableCell>
          <TableCell>Strength of evidence / Uncertainties</TableCell>
          <TableCell>Reference</TableCell>
        </TableRow>
      </TableHead>
      <CriteriaRows />
    </Table>
  );
}
