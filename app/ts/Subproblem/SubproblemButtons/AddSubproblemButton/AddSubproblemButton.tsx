import {IconButton} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';

export default function AddSubproblemButton() {
  const {createSubProblemDialogCallback} = useContext(WorkspaceContext);

  return (
    <Tooltip title={'Create new problem'}>
      <IconButton
        id={'create-subproblem-button'}
        color={'primary'}
        onClick={createSubProblemDialogCallback}
      >
        <Add />
      </IconButton>
    </Tooltip>
  );
}
