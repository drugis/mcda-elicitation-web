import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {getStringForValue} from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/EffectValueCell/EffectValueCellService';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import {getConfiguredRange} from '../ScalesTableUtil';

export default function ScalesTableRow({
  criterion
}: {
  criterion: IProblemCriterion;
}) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges} = useContext(WorkspaceContext);

  const {decimal, percentage} = UnitOfMeasurementType;

  const unit = criterion.dataSources[0].unitOfMeasurement.type;
  const usePercentages =
    showPercentages && (unit === decimal || unit === percentage);
  const theoreticalValues = [
    getStringForValue(criterion.dataSources[0].scale[0], showPercentages, unit),
    getStringForValue(criterion.dataSources[0].scale[1], showPercentages, unit)
  ];
  const observedValues = [
    getPercentifiedValue(observedRanges[criterion.id][0], usePercentages),
    getPercentifiedValue(observedRanges[criterion.id][1], usePercentages)
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
}
