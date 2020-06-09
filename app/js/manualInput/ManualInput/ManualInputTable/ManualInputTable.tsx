import {Table, TableCell, TableHead, TableRow} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';
import CriteriaRows from './CriteriaRows/CriteriaRows';

export default function ManualInputTable() {
  const {alternatives} = useContext(ManualInputContext);

  function createAlternativeHeaders() {
    return _.map(alternatives, (alternative) => {
      return <TableCell key={alternative.id}>{alternative.title}</TableCell>;
    });
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>Criterion</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Unit of measurement</TableCell>
          <TableCell colSpan={2}>Reference</TableCell>
          {createAlternativeHeaders()}
          <TableCell>(add alt)</TableCell>
          <TableCell>Strength of evidence / Uncertainties</TableCell>
        </TableRow>
      </TableHead>
      <CriteriaRows />
    </Table>
  );
}
