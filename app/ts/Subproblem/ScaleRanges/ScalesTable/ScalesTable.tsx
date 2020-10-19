import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {getStringForValue} from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/EffectValueCell/EffectValueCellService';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {
  calculateObservedRanges,
  getConfiguredRange,
  getPercentifiedValue
} from './ScalesTableUtil';

export default function ScalesTable({}: {}) {
  const {showPercentages} = useContext(SettingsContext);
  const {workspace, scales} = useContext(WorkspaceContext);

  const observedRanges: Record<
    string,
    [number, number]
  > = calculateObservedRanges(
    scales,
    workspace.problem.criteria,
    workspace.problem.performanceTable
  );

  function createScaleTableRows() {
    return _.map(workspace.problem.criteria, (criterion: IProblemCriterion) => {
      const unit = criterion.dataSources[0].unitOfMeasurement.type;
      const theoreticalValues = [
        getStringForValue(
          criterion.dataSources[0].scale[0],
          showPercentages,
          unit
        ),
        getStringForValue(
          criterion.dataSources[0].scale[1],
          showPercentages,
          unit
        )
      ];
      const observedValues = [
        getPercentifiedValue(
          observedRanges[criterion.id][0],
          showPercentages,
          unit
        ),
        getPercentifiedValue(
          observedRanges[criterion.id][1],
          showPercentages,
          unit
        )
      ];
      return (
        <TableRow key={criterion.id}>
          <TableCell id={`scales-table-criterion-${criterion.id}`}>
            {criterion.title}
          </TableCell>
          <TableCell id={`theoretical-range-${criterion.id}`}>
            {`${theoreticalValues[0]}, ${theoreticalValues[1]}`}
          </TableCell>
          <TableCell id={`observed-range-${criterion.id}`}>
            {`${observedValues[0]}, ${observedValues[1]}`}
          </TableCell>
          <TableCell id={`configured-range-${criterion.id}`}>
            {getConfiguredRange(criterion, observedRanges, showPercentages)}
          </TableCell>
          <TableCell id={`unit-${criterion.id}`}>
            {getUnitLabel(
              criterion.dataSources[0].unitOfMeasurement,
              showPercentages
            )}
          </TableCell>
        </TableRow>
      );
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
