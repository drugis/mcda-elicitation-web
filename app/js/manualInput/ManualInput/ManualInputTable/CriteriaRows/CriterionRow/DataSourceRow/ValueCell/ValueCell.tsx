import {TableCell} from '@material-ui/core';
import React, {MouseEvent, useContext, useState} from 'react';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';
import {EffectCellContextProviderComponent} from './EffectCellContext/EffectCellContext';
import EffectCellDialog from './EffectCellDialog/EffectCellDialog';

export default function ValueCell({alternativeId}: {alternativeId: string}) {
  const {getEffectValue} = useContext(ManualInputContext);
  const {dataSource, criterion} = useContext(DataSourceRowContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(event: MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    event.preventDefault();
    event.stopPropagation();
    setIsDialogOpen(false);
  }

  const effect = getEffectValue(alternativeId, dataSource.id, criterion.id);

  function createLabel() {
    switch (effect.type) {
      case 'value':
        return effect.value;
      case 'valueCI':
        return effect.value;
      case 'range':
        return 'range';
      case 'text':
        return effect.value;
    }
  }

  return (
    <TableCell onClick={openDialog}>
      {createLabel()}
      <EffectCellContextProviderComponent>
        <EffectCellDialog
          callback={() => {}}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </EffectCellContextProviderComponent>
    </TableCell>
  );
}
