import {Typography} from '@material-ui/core';
import {useContext} from 'react';
import {WorkspaceContext} from '../WorkspaceContext/WorkspaceContext';

export default function WorkspaceTitle() {
  const {workspace} = useContext(WorkspaceContext);

  return (
    <Typography id="workspace-title" variant="h4">
      {workspace.properties.title}
    </Typography>
  );
}
