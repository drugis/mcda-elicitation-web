import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import {
  getConfiguredRangeLabel,
  getObservedRangeLabel,
  getTheoreticalRangeLabel
} from '../ScalesTableUtil';

export default function ScalesTableRow({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const dataSourceId = criterion.dataSources[0].id;
  const {currentSubproblem} = useContext(WorkspaceContext);
  const {observedRanges} = useContext(SubproblemContext);

  const unitType = criterion.dataSources[0].unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unitType);

  const theoreticalRangeLabel = getTheoreticalRangeLabel(
    usePercentage,
    criterion.dataSources[0].unitOfMeasurement
  );
  const observedRangeLabel = getObservedRangeLabel(
    usePercentage,
    observedRanges[dataSourceId]
  );
  const configuredRangeLabel = getConfiguredRangeLabel(
    usePercentage,
    observedRanges[dataSourceId],
    currentSubproblem.definition.ranges[dataSourceId]
  );

  return (
    <TableRow key={criterion.id}>
      <TableCell id={`scales-table-criterion-${criterion.id}`}>
        {criterion.title}
      </TableCell>
      <TableCell id={`theoretical-range-${criterion.id}`}>
        <div className="text-centered">{theoreticalRangeLabel}</div>
      </TableCell>
      <TableCell id={`observed-range-${criterion.id}`}>
        <div className="text-centered">{observedRangeLabel}</div>
      </TableCell>
      <TableCell id={`configured-range-${criterion.id}`}>
        <div className="text-centered">{configuredRangeLabel}</div>
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
