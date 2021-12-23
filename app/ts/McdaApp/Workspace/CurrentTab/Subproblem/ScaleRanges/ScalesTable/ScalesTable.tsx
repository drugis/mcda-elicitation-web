import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';
import ScalesTableRow from './ScalesTableRow/ScalesTableRow';

export default function ScalesTable({}: {}) {
  const {filteredCriteria, observedRanges} = useContext(
    CurrentSubproblemContext
  );

  return (
    <LoadingSpinner showSpinnerCondition={_.isEmpty(observedRanges)}>
      <Table size="small" id="scales-table">
        <TableHead>
          <TableRow>
            <TableCell id="scales-table-criterion" align="center">
              <InlineHelp helpId="criterion">Criterion</InlineHelp>
            </TableCell>
            <TableCell id="theoretical-range" align="center">
              <InlineHelp helpId="theoretical-range">
                Theoretical Range
              </InlineHelp>
            </TableCell>
            <TableCell id="observed-range" align="center">
              <InlineHelp helpId="observed-range">Observed Range</InlineHelp>
            </TableCell>
            <TableCell id="configured-range" align="center">
              <InlineHelp helpId="configured-range">
                Configured Range
              </InlineHelp>
            </TableCell>
            <TableCell id="scales-table-unit-of-measurement" align="center">
              <InlineHelp helpId="unit-of-measurement">Units</InlineHelp>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ScaleTableRows criteria={filteredCriteria} />
        </TableBody>
      </Table>
    </LoadingSpinner>
  );
}

function ScaleTableRows({criteria}: {criteria: ICriterion[]}): JSX.Element {
  return (
    <>
      {_.map(criteria, (criterion: ICriterion) => {
        return <ScalesTableRow key={criterion.id} criterion={criterion} />;
      })}
    </>
  );
}
