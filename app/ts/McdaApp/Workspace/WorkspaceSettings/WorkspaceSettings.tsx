import {Button, Tooltip} from '@material-ui/core';
import Settings from '@material-ui/icons/Settings';
import {useState} from 'react';
import {WorkspaceSettingsContextProviderComponent} from './WorkspaceSettingsContext/WorkspaceSettingsContext';
import WorkspaceSettingsDialog from './WorkspaceSettingsDialog/WorkspaceSettingsDialog';

export default function WorkspaceSettings(): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  return (
    <>
      <Tooltip title="Change workspace settings">
        <Button
          id="settings-button"
          variant="contained"
          color="primary"
          onClick={openDialog}
          size="small"
        >
          <Settings /> Settings
        </Button>
      </Tooltip>
      <WorkspaceSettingsContextProviderComponent isDialogOpen={isDialogOpen}>
        <WorkspaceSettingsDialog
          isDialogOpen={isDialogOpen}
          closeDialog={closeDialog}
        />
      </WorkspaceSettingsContextProviderComponent>
    </>
  );
}
