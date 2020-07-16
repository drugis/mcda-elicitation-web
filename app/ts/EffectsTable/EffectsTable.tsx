import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IAlternative from '@shared/interface/IAlternative';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import _ from 'lodash';
import React from 'react';
import {EffectsTableContextProviderComponent} from './EffectsTableContext/EffectsTableContext';
import EffectsTableCriteriaRows from './EffectsTableCriteriaRows/EffectsTableCriteriaRows';

export default function EffectsTable({
  oldWorkspace
}: {
  oldWorkspace: IOldWorkspace;
}) {
  function createAlternativeHeaders(): JSX.Element[] {
    return _.map(
      oldWorkspace.problem.alternatives,
      (alternative: IAlternative) => {
        return <TableCell align="center">{alternative.title}</TableCell>;
      }
    );
  }

  return (
    <EffectsTableContextProviderComponent oldWorkspace={oldWorkspace}>
      <Table id="effects-table" size="small" padding="none">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Criterion
            </TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">Unit of measurement</TableCell>
            {createAlternativeHeaders()}

            <TableCell align="center">
              Strength of evidence / Uncertainties
            </TableCell>
            <TableCell align="center">Reference</TableCell>
          </TableRow>
        </TableHead>
        <EffectsTableCriteriaRows />
      </Table>
    </EffectsTableContextProviderComponent>
  );
}
