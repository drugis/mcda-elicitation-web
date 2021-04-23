import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import React, {useState} from 'react';
import {AddSubproblemContextProviderComponent} from './AddSubproblemContext';
import AddSubproblemDialog from './AddSubproblemDialog/AddSubproblemDialog';

export default function AddSubproblemButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  return (
    <>
      <Tooltip title={'Add a new problem'}>
        <IconButton
          id={'add-subproblem-button'}
          color={'primary'}
          onClick={openDialog}
          size="small"
        >
          <Add />
        </IconButton>
      </Tooltip>
      {isDialogOpen ? (
        <AddSubproblemContextProviderComponent>
          <AddSubproblemDialog
            isDialogOpen={isDialogOpen}
            closeDialog={closeDialog}
          />
        </AddSubproblemContextProviderComponent>
      ) : (
        <></>
      )}
    </>
  );
}
