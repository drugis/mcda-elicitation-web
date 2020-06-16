import {TableCell} from '@material-ui/core';
import React, {MouseEvent, useContext, useEffect, useState} from 'react';
import {Effect} from '../../../../../../../interface/IEffect';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';
import {EffectCellContextProviderComponent} from './EffectCellContext/EffectCellContext';
import EffectCellDialog from './EffectCellDialog/EffectCellDialog';

export default function ValueCell({alternativeId}: {alternativeId: string}) {
  const {getEffect, setEffect, effectValues} = useContext(ManualInputContext);
  const {dataSource, criterion} = useContext(DataSourceRowContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [label, setLabel] = useState('💀');

  useEffect(() => {
    const effect = getEffect(criterion.id, dataSource.id, alternativeId);
    setLabel(createLabel(effect));
  }, [effectValues]);

  function saveEffect(effect: Effect) {
    setEffect(effect, dataSource.id, alternativeId);
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(event: MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    setIsDialogOpen(false);
  }

  function createLabel(effect: Effect): string {
    switch (effect.type) {
      case 'value':
        return `${effect.value}`;
      case 'valueCI':
        return `${effect.value} (${effect.lowerBound}, ${effect.upperBound})`;
      case 'range':
        return `[${effect.lowerBound}, ${effect.upperBound}]`;
      case 'text':
        return effect.value;
      case 'empty':
        return 'Empty';
    }
  }

  return (
    <TableCell>
      <span onClick={openDialog}>{label}</span>
      <EffectCellContextProviderComponent alternativeId={alternativeId}>
        <EffectCellDialog
          callback={saveEffect}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </EffectCellContextProviderComponent>
    </TableCell>
  );
}
