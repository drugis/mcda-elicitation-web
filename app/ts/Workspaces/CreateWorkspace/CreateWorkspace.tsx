import {Button, Grid} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import React, {useState} from 'react';
import {CreateWorkspaceContextProviderComponent} from './CreateWorkspaceContext';
import CreateWorkspaceDialog from './CreateWorkspaceDialog/CreateWorkspaceDialog';

export default function CreateWorkspace(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  return (
    <>
      <Grid item xs={12}>
        <Button
          id="create-workspace-button"
          color="primary"
          variant="contained"
          onClick={openDialog}
        >
          <Add /> Add workspace
        </Button>
        {isDialogOpen ? (
          <CreateWorkspaceContextProviderComponent>
            <CreateWorkspaceDialog closeDialog={closeDialog} />
          </CreateWorkspaceContextProviderComponent>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
}
