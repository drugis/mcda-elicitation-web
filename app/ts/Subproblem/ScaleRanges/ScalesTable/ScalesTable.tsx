import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import ScalesTableRow from './ScalesTableRow/ScalesTableRow';

export default function ScalesTable({}: {}) {
  const {workspace} = useContext(WorkspaceContext);

  function createScaleTableRows() {
    return _.map(workspace.criteria, (criterion: IProblemCriterion) => {
      return <ScalesTableRow key={criterion.id} criterion={criterion} />;
    });
  }

  return (
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
  );
}
