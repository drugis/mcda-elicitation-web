import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {useContext} from 'react';

export default function EffectsTableUnitOfMeasurementCell({
  dataSource
}: {
  dataSource: IDataSource;
}) {
  const {showUnitsOfMeasurement, showPercentages} = useContext(SettingsContext);

  return showUnitsOfMeasurement ? (
    <TableCell id={`unit-cell-${dataSource.id}`}>
      {getUnitLabel(dataSource.unitOfMeasurement, showPercentages)}
    </TableCell>
  ) : (
    <></>
  );
}
