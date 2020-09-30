import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import IUnitOfMeasurement, {
  UnitOfMeasurementType
} from '@shared/interface/IUnitOfMeasurement';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function EffectsTableUnitOfMeasurementCell({
  dataSource
}: {
  dataSource: IDataSource;
}) {
  const {showUnitsOfMeasurement, showPercentages} = useContext(SettingsContext);

  function getUnitLabel(unit: IUnitOfMeasurement): string {
    if (showPercentages && unit.type === UnitOfMeasurementType.decimal) {
      return '%';
    } else if (
      !showPercentages &&
      unit.type === UnitOfMeasurementType.percentage
    ) {
      return '';
    } else {
      return unit.label;
    }
  }

  return showUnitsOfMeasurement ? (
    <TableCell id={`unit-cell-${dataSource.id}`}>
      {getUnitLabel(dataSource.unitOfMeasurement)}
    </TableCell>
  ) : (
    <></>
  );
}
