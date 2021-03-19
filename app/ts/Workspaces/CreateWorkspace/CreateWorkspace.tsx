import {Button, Grid} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import React, {useCallback, useState} from 'react';
import {CreateWorkspaceContextProviderComponent} from './CreateWorkspaceContext';
import CreateWorkspaceDialog from './CreateWorkspaceDialog/CreateWorkspaceDialog';

export default function CreateWorkspace(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const openDialog = useCallback((): void => {
    setIsDialogOpen(true);
  }, [setIsDialogOpen]);

  const closeDialog = useCallback((): void => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

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
            <CreateWorkspaceDialog
              isDialogOpen={isDialogOpen}
              closeDialog={closeDialog}
            />
          </CreateWorkspaceContextProviderComponent>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
}
