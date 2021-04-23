import {Grid} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IAlternative from '@shared/interface/IAlternative';
import {InlineHelp, InlineQuestionMark} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../ManualInputContext';
import AddAlternativeButton from './AddAlternativeButton/AddAlternativeButton';
import AlternativeHeader from './AlternativeHeader/AlternativeHeader';
import CriteriaRows from './CriteriaRows/CriteriaRows';

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
            <InlineHelp helpId="criterion">Criterion</InlineHelp>
          </TableCell>
          <TableCell align="center">Description</TableCell>
          <TableCell align="center"></TableCell>
          <TableCell align="center"></TableCell>
          <TableCell align="center">
            <InlineHelp helpId="unit-of-measurement">
              Unit of measurement
            </InlineHelp>
          </TableCell>
          {createAlternativeHeaders()}
          <TableCell align="center">
            <Grid container item alignItems="center" xs={12}>
              <AddAlternativeButton />
              <InlineQuestionMark helpId="alternative" />
            </Grid>
          </TableCell>
          <TableCell align="center">
            <InlineHelp helpId="strength-of-evidence">
              Strength of evidence
            </InlineHelp>{' '}
            and <InlineHelp helpId="uncertainties">Uncertainties</InlineHelp>
          </TableCell>
          <TableCell align="center">
            <InlineHelp helpId="reference">Reference</InlineHelp>
          </TableCell>
        </TableRow>
      </TableHead>
      <CriteriaRows />
    </Table>
  );
}
