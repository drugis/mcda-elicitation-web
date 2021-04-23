import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IUnitOfMeasurement, {
  UnitOfMeasurementType
} from '@shared/interface/IUnitOfMeasurement';
import {ManualInputContext} from 'app/ts/McdaApp/ManualInput/ManualInputContext';
import {normalizeCells} from 'app/ts/McdaApp/ManualInput/ManualInputUtil/ManualInputUtil';
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
    updateEffects,
    updateDistributions,
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
      covertingFromCustomToPercentage(
        dataSource.unitOfMeasurement.type,
        newUnitOfMeasurement.type
      )
    ) {
      updateEffects(normalizeCells(dataSource.id, effects));
      updateDistributions(normalizeCells(dataSource.id, distributions));
    }
  }

  function covertingFromCustomToPercentage(
    typeFrom: UnitOfMeasurementType,
    typeTo: UnitOfMeasurementType
  ): boolean {
    return typeFrom === 'custom' && typeTo === 'percentage';
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
