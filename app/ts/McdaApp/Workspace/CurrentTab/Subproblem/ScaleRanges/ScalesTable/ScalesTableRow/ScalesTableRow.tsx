import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {useContext} from 'react';
import {
  getConfiguredRangeLabel,
  getRangeLabel,
  getTheoreticalRangeLabel
} from '../ScalesTableUtil';

export default function ScalesTableRow({criterion}: {criterion: ICriterion}) {
  const {showPercentages, getUsePercentage} = useContext(SettingsContext);
  const dataSourceId = criterion.dataSources[0].id;
  const {currentSubproblem, observedRanges} = useContext(
    CurrentSubproblemContext
  );

  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  const theoreticalRangeLabel = getTheoreticalRangeLabel(
    usePercentage,
    criterion.dataSources[0].unitOfMeasurement
  );
  const observedRangeLabel = getRangeLabel(
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
        <div style={textCenterStyle}>{theoreticalRangeLabel}</div>
      </TableCell>
      <TableCell id={`observed-range-${criterion.id}`}>
        <div style={textCenterStyle}>{observedRangeLabel}</div>
      </TableCell>
      <TableCell id={`configured-range-${criterion.id}`}>
        <div style={textCenterStyle}>{configuredRangeLabel}</div>
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
