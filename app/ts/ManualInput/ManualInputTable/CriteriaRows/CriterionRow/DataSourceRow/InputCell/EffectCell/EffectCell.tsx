import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import {Effect} from '@shared/interface/IEffect';
import {ManualInputContext} from 'app/ts/ManualInput/ManualInputContext';
import {renderInputEffect} from 'app/ts/ManualInput/ManualInputService/ManualInputService';
import React, {useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';
import EffectCellDialog from '../EffectCellDialog/EffectCellDialog';
import {InputCellContextProviderComponent} from '../InputCellContext/InputCellContext';

export default function EffectCell({alternativeId}: {alternativeId: string}) {
  const {getEffect, setEffect, effects} = useContext(ManualInputContext);
  const {dataSource, criterion} = useContext(DataSourceRowContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [label, setLabel] = useState('');

  const effect = getEffect(criterion.id, dataSource.id, alternativeId);

  useEffect(() => {
    setLabel(
      renderInputEffect(
        {...effect, unitOfMeasurementType: dataSource.unitOfMeasurement.type},
        dataSource.unitOfMeasurement.type === 'percentage'
      )
    );
  }, [effects, dataSource.unitOfMeasurement]);

  function saveEffect(effect: Effect) {
    setEffect(effect);
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  return (
    <TableCell align="center">
      <Tooltip title="Edit effect">
        <span
          onClick={openDialog}
          style={{cursor: 'pointer', whiteSpace: 'pre-wrap', minWidth: '6rem'}}
        >
          {label}
        </span>
      </Tooltip>
      <InputCellContextProviderComponent
        alternativeId={alternativeId}
        effectOrDistribution={effect}
      >
        <EffectCellDialog
          callback={saveEffect}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </InputCellContextProviderComponent>
    </TableCell>
  );
}
