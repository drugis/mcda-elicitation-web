import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import ScalesTableRow from './ScalesTableRow/ScalesTableRow';

export default function ScalesTable({}: {}) {
  const {filteredCriteria, observedRanges} = useContext(SubproblemContext);

  function createScaleTableRows() {
    return _.map(filteredCriteria, (criterion: ICriterion) => {
      return <ScalesTableRow key={criterion.id} criterion={criterion} />;
    });
  }

  return !_.isEmpty(observedRanges) ? (
    <Table size="small" id="scales-table">
      <TableHead>
        <TableRow>
          <TableCell id="scales-table-criterion" align="center">
            Criterion <InlineHelp helpId="criterion" />
          </TableCell>
          <TableCell id="theoretical-range" align="center">
            Theoretical Range <InlineHelp helpId="theoretical-range" />
          </TableCell>
          <TableCell id="observed-range" align="center">
            Observed Range <InlineHelp helpId="observed-range" />
          </TableCell>
          <TableCell id="configured-range" align="center">
            Configured Range <InlineHelp helpId="configured-range" />
          </TableCell>
          <TableCell id="scales-table-unit-of-measurement" align="center">
            Units <InlineHelp helpId="unit-of-measurement" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{createScaleTableRows()}</TableBody>
    </Table>
  ) : (
    <CircularProgress />
  );
}
