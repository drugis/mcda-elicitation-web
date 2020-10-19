import React, {useContext} from 'react';
import {IconButton} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';

export default function AddSubproblemButton() {
  const {createSubProblemDialogCallback} = useContext(WorkspaceContext);

  return (
    <IconButton
      id={'create-subproblem-button'}
      color={'primary'}
      onClick={createSubProblemDialogCallback}
    >
      <Add />
    </IconButton>
  );
}
