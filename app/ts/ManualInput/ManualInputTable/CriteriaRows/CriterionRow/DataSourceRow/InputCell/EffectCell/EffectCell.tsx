import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {renderEffect} from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/EffectValueCell/EffectValueCellService';
import {ManualInputContext} from 'app/ts/ManualInput/ManualInputContext';
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
      renderEffect(
        effect,
        'enteredData',
        dataSource.unitOfMeasurement.type === 'percentage',
        {} as IScale
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
