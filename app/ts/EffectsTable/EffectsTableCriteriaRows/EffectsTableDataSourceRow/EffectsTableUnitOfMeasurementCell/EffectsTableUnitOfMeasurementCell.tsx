import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {deselectedCellStyle} from 'app/ts/Subproblem/SubproblemButtons/AddSubproblemButton/AddSubproblemEffectsTable/deselectedCellStyle';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {useContext} from 'react';

export default function EffectsTableUnitOfMeasurementCell({
  dataSource,
  isExcluded
}: {
  dataSource: IDataSource;
  isExcluded?: boolean;
}) {
  const {
    showPercentages,
    toggledColumns: {units}
  } = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return units ? (
    <TableCell id={`unit-cell-${dataSource.id}`} style={cellStyle}>
      {getUnitLabel(dataSource.unitOfMeasurement, showPercentages)}
    </TableCell>
  ) : (
    <></>
  );
}
