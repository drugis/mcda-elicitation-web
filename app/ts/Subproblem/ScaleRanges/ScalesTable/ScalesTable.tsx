import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import _ from 'lodash';
import React from 'react';
import {calculateObservedRanges} from './ScalesTableUtil';

export default function ScalesTable({
  scales,
  oldWorkspace
}: {
  scales: Record<string, Record<string, IScale>>;
  oldWorkspace: IOldWorkspace;
}) {
  const observedRanges: Record<
    string,
    [number, number]
  > = calculateObservedRanges(
    scales,
    oldWorkspace.problem.criteria,
    oldWorkspace.problem.performanceTable
  );

  function createScaleTableRows() {
    return _.map(
      oldWorkspace.problem.criteria,
      (criterion: IProblemCriterion) => {
        return (
          <TableRow key={criterion.id}>
            <TableCell id={`scales-table-criterion-${criterion.id}`}>
              {criterion.title}
            </TableCell>
            <TableCell id={`theoretical-range-${criterion.id}`}>
              {`${criterion.dataSources[0].scale[0]}, ${criterion.dataSources[0].scale[1]}`}
            </TableCell>
            <TableCell id={`observed-range-${criterion.id}`}>
              {`${observedRanges[criterion.id][0]}, ${
                observedRanges[criterion.id][1]
              }`}
            </TableCell>
            <TableCell id={`configured-range-${criterion.id}`}>
              {getConfiguredRange(criterion)}
            </TableCell>
            <TableCell id={`unit-${criterion.id}`}>
              {criterion.dataSources[0].unitOfMeasurement.label}
            </TableCell>
          </TableRow>
        );
      }
    );
  }

  function getConfiguredRange(criterion: IProblemCriterion) {
    const pvf = criterion.dataSources[0].pvf;
    if (pvf) {
      return pvf.range[0] + ', ' + pvf.range[1];
    } else {
      return (
        observedRanges[criterion.id][0] + ', ' + observedRanges[criterion.id][1]
      );
    }
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
