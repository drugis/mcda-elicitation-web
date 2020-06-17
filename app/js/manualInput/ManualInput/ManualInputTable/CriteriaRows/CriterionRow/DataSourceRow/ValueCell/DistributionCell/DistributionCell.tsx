import {TableCell} from '@material-ui/core';
import React, {useState} from 'react';
import {DistributionCellContextProviderComponent} from '../DistributionCellContext/DistributionCellContext';
import DistributionCellDialog from '../DistributionCellDialog/DistributionCellDialog';

export default function DistributionCell({
  alternativeId
}: {
  alternativeId: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  return (
    <TableCell align="center">
      <span onClick={openDialog} style={{cursor: 'pointer'}}>
        dist
      </span>
      <DistributionCellContextProviderComponent alternativeId={alternativeId}>
        <DistributionCellDialog
          callback={() => {}}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </DistributionCellContextProviderComponent>
    </TableCell>
  );
}
