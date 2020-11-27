import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import CriterionOverview from './CriterionOverview/CriterionOverview';

export default function OverviewTable() {
  const {criteria} = useContext(PreferencesContext);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Criterion</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell align="center">Worst</TableCell>
          <TableCell align="center">Best</TableCell>
          <TableCell align="center">Importance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(criteria, (criterion) => (
          <CriterionOverview key={criterion.id} criterion={criterion} />
        ))}
      </TableBody>
    </Table>
  );
}
