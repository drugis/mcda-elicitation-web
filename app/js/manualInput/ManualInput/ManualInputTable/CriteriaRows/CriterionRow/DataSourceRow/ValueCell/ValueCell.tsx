import React, {useContext, useState} from 'react';
import {TableCell} from '@material-ui/core';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import EffectCellDialog from './EffectCellDialog/EffectCellDialog';
import { EffectCellContextProviderComponent } from './EffectCellContext/EffectCellContext';

export default function ValueCell() {
  const {} = useContext(ManualInputContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
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
