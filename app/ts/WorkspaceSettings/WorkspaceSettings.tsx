import {Button, Tooltip} from '@material-ui/core';
import Settings from '@material-ui/icons/Settings';
import IEditMode from '@shared/interface/IEditMode';
import {HelpContextProviderComponent} from 'help-popup';
import React, {useState} from 'react';
import {lexicon} from '../InlineHelp/lexicon';
import {WorkspaceSettingsContextProviderComponent} from './WorkspaceSettingsContext/WorkspaceSettingsContext';
import WorkspaceSettingsDialog from './WorkspaceSettingsDialog/WorkspaceSettingsDialog';

export default function WorkspaceSettings({
  editMode
}: {
  editMode: IEditMode;
}): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  return editMode.canEdit ? (
    <HelpContextProviderComponent lexicon={lexicon}>
      <Tooltip title="Change workspace settings">
        <Button
          id="settings-button"
          variant="contained"
          color="primary"
          onClick={openDialog}
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
    </HelpContextProviderComponent>
  ) : (
    <></>
  );
}
