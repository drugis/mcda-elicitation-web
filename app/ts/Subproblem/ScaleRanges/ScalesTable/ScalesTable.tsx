import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {getStringForValue} from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/EffectValueCell/EffectValueCellService';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import _ from 'lodash';
import React, {useContext} from 'react';
import {calculateObservedRanges} from './ScalesTableUtil';
export default function ScalesTable({
  scales,
  oldWorkspace
}: {
  scales: Record<string, Record<string, IScale>>;
  oldWorkspace: IOldWorkspace;
}) {
  const {showPercentages} = useContext(SettingsContext);
  const {decimal, percentage} = UnitOfMeasurementType;

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
          getObservedOrPvfValue(
            observedRanges[criterion.id][0],
            showPercentages,
            unit
          ),
          getObservedOrPvfValue(
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
              {getConfiguredRange(criterion)}
            </TableCell>
            <TableCell id={`unit-${criterion.id}`}>
              {getUnitLabel(
                criterion.dataSources[0].unitOfMeasurement,
                showPercentages
              )}
            </TableCell>
          </TableRow>
        );
      }
    );
  }

  function getObservedOrPvfValue(
    value: number,
    showPercentages: boolean,
    unit: UnitOfMeasurementType
  ): string {
    if (showPercentages && (unit === 'decimal' || unit === 'percentage')) {
      return significantDigits(value * 100).toString();
    } else {
      return value.toString();
    }
  }

  function getConfiguredRange(criterion: IProblemCriterion) {
    const pvf = criterion.dataSources[0].pvf;
    const unit = criterion.dataSources[0].unitOfMeasurement.type;
    if (pvf) {
      return (
        getObservedOrPvfValue(pvf.range[0], showPercentages, unit) +
        ', ' +
        getObservedOrPvfValue(pvf.range[1], showPercentages, unit)
      );
    } else {
      return (
        getObservedOrPvfValue(
          observedRanges[criterion.id][0],
          showPercentages,
          unit
        ) +
        ', ' +
        getObservedOrPvfValue(
          observedRanges[criterion.id][1],
          showPercentages,
          unit
        )
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
