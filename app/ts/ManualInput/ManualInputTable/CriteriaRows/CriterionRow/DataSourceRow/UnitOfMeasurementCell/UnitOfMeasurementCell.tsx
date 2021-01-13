import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {ManualInputContext} from 'app/ts/ManualInput/ManualInputContext';
import {normalizeCells} from 'app/ts/ManualInput/ManualInputService/ManualInputService';
import React, {useContext, useState} from 'react';
import InlineTooltip from '../InlineTooltip/InlineTooltip';
import UnitOfMeasurementDialog from './UnitOfMeasurementDialog/UnitOfMeasurementDialog';

export default function UnitOfMeasurementCell({
  criterion,
  dataSource
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
}) {
  const {
    setDataSource,
    setEffects,
    setDistributions,
    effects,
    distributions
  } = useContext(ManualInputContext);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const tooltipText = 'Edit unit of measurement';

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
    if (
      dataSource.unitOfMeasurement.type === 'custom' &&
      newUnitOfMeasurement.type === 'percentage'
    ) {
      setEffects(normalizeCells(dataSource.id, effects)); //not written to DB atm
      setDistributions(normalizeCells(dataSource.id, distributions));
    } else if (
      dataSource.unitOfMeasurement.type === 'decimal' &&
      newUnitOfMeasurement.type === 'percentage'
    ) {
      //multiply cells by 100 ?
    }
  }

  function createLabel(): JSX.Element {
    if (dataSource.unitOfMeasurement.label) {
      return (
        <Tooltip title={tooltipText}>
          <span>{dataSource.unitOfMeasurement.label}</span>
        </Tooltip>
      );
    } else {
      return <InlineTooltip tooltipText={tooltipText} />;
    }
  }

  function createScalesLabel(): JSX.Element {
    return (
      <span>
        [{dataSource.unitOfMeasurement.lowerBound},{' '}
        {dataSource.unitOfMeasurement.upperBound}]
      </span>
    );
  }

  return (
    <TableCell id={`ds-unit-${dataSource.id}`} align="center">
      <Grid container>
        <Grid item xs={12} onClick={openDialog} style={{cursor: 'pointer'}}>
          {createLabel()}
        </Grid>
        <Grid item xs={12}>
          {createScalesLabel()}
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
