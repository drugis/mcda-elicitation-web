import {Grid, IconButton, TableCell, Tooltip} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import React, {useContext, useState} from 'react';
import ICriterion from '../../../../../../../interface/ICriterion';
import IDataSource from '../../../../../../../interface/IDataSource';
import IUnitOfMeasurement from '../../../../../../../interface/IUnitOfMeasurement';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import UnitOfMeasurementDialog from './UnitOfMeasurementDialog/UnitOfMeasurementDialog';

export default function UnitOfMeasurementCell({
  criterion,
  dataSource
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
}) {
  const {setDataSource} = useContext(ManualInputContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function handleUnitOfMeasurementChanged(
    newUnitOfMeasurement: IUnitOfMeasurement
  ): void {
    closeDialog();
    setDataSource(criterion.id, {
      ...dataSource,
      unitOfMeasurement: newUnitOfMeasurement
    });
  }

  return (
    <TableCell>
      <Grid container>
        <Grid item xs={10}>
          {dataSource.unitOfMeasurement.label}
        </Grid>
        <Grid item xs={2} style={{textAlign: 'right'}}>
          <Tooltip title="Edit unit of measurement">
            <IconButton size="small" color="primary" onClick={openDialog}>
              <Edit />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <UnitOfMeasurementDialog
        unitOfMeasurement={dataSource.unitOfMeasurement}
        callback={handleUnitOfMeasurementChanged}
        isDialogOpen={isDialogOpen}
        cancel={closeDialog}
      />
    </TableCell>
  );
}
