import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../ManualInputContext';
import AddAlternativeButton from './AddAlternativeButton/AddAlternativeButton';
import AlternativeHeader from './AlternativeHeader/AlternativeHeader';
import CriteriaRows from './CriteriaRows/CriteriaRows';
import IAlternative from '@shared/interface/IAlternative';

export default function ManualInputTable() {
  const {alternatives} = useContext(ManualInputContext);

  function createAlternativeHeaders() {
    return _.map(alternatives, (alternative: IAlternative, index: number) => {
      const previous = alternatives[index - 1];
      const next = alternatives[index + 1];
      return (
        <AlternativeHeader
          key={alternative.id}
          alternative={alternative}
          nextAlternative={next}
          previousAlternative={previous}
        />
      );
    });
  }

  return (
    <Table id="manual-input-table" size="small" padding="none">
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
            <AddAlternativeButton />
          </TableCell>
          <TableCell align="center">
            Strength of evidence / Uncertainties
          </TableCell>
          <TableCell align="center">Reference</TableCell>
        </TableRow>
      </TableHead>
      <CriteriaRows />
    </Table>
  );
}
