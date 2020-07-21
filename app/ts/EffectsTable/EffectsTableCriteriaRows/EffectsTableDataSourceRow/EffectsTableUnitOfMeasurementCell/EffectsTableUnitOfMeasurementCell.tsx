import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import IUnitOfMeasurement, { UnitOfMeasurementType } from '@shared/interface/IUnitOfMeasurement';
import { SettingsContext } from 'app/ts/Settings/SettingsContext';
import React, { useContext } from 'react';

export default function EffectsTableUnitOfMeasurementCell({
  dataSource
}: {
  dataSource: IDataSource;
}) {
  const {showUnitsOfMeasurement, showPercentages} = useContext(SettingsContext);

  function getUnitLabel(unit: IUnitOfMeasurement): string {
    if (showPercentages && unit.type === UnitOfMeasurementType.decimal) {
      return '%';
    } else {
      return unit.label;
    }
  }

  return showUnitsOfMeasurement ? (
    <TableCell>{getUnitLabel(dataSource.unitOfMeasurement)}</TableCell>
  ) : (
    <></>
  );
}
