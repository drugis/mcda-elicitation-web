import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {getStringForValue} from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/EffectValueCell/EffectValueCellService';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import {getConfiguredRange} from '../ScalesTableUtil';

export default function ScalesTableRow({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges, currentSubproblem} = useContext(WorkspaceContext);

  const {decimal, percentage} = UnitOfMeasurementType;
  const dataSourceId = criterion.dataSources[0].id;

  const unit = criterion.dataSources[0].unitOfMeasurement.type;
  const doPercentification =
    showPercentages && (unit === decimal || unit === percentage);
  const theoreticalValues = [
    getStringForValue(
      criterion.dataSources[0].unitOfMeasurement.lowerBound,
      showPercentages,
      unit
    ),
    getStringForValue(
      criterion.dataSources[0].unitOfMeasurement.upperBound,
      showPercentages,
      unit
    )
  ];
  const observedValues = [
    getPercentifiedValue(observedRanges[dataSourceId][0], doPercentification),
    getPercentifiedValue(observedRanges[dataSourceId][1], doPercentification)
  ];
  const rangeDefinition = currentSubproblem.definition.ranges[dataSourceId];

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
        {getConfiguredRange(
          doPercentification,
          observedRanges[dataSourceId],
          rangeDefinition.pvf ? rangeDefinition.pvf.range : undefined
        )}
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
