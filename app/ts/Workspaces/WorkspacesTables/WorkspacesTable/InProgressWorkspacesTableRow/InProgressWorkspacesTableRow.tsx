import {TableCell, TableRow} from '@material-ui/core';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import React from 'react';
import DeleteWorkspaceButton from '../DeleteWorkspaceButton/DeleteWorkspaceButton';

export default function InProgressWorkspacesTableRow({
  deleteLocalWorkspace,
  workspace,
  index
}: {
  deleteLocalWorkspace: (id: string) => void;
  workspace: IInProgressWorkspaceProperties;
  index: number;
}): JSX.Element {
  return (
    <TableRow>
      <TableCell width="100%">
        <a
          id={`in-progress-workspace-${index}`}
          href={'/#!/manual-input/' + workspace.id}
        >
          {workspace.title}
        </a>
      </TableCell>
      <TableCell id={`delete-in-progress-workspace-${index}`} align="center">
        <DeleteWorkspaceButton
          workspace={workspace}
          deleteLocalWorkspace={deleteLocalWorkspace}
          type="inProgress"
        />
      </TableCell>
    </TableRow>
  );
}
