import {TableCell} from '@material-ui/core';
import React, {MouseEvent, useContext, useState} from 'react';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import {EffectCellContextProviderComponent} from './EffectCellContext/EffectCellContext';
import EffectCellDialog from './EffectCellDialog/EffectCellDialog';

export default function ValueCell() {
  const {} = useContext(ManualInputContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(event: MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    event.preventDefault();
    event.stopPropagation();
    setIsDialogOpen(false);
  }

  return (
    <TableCell onClick={openDialog}>
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
