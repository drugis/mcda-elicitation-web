import {TableCell, TableRow} from '@material-ui/core';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import dateFormat from 'dateformat';
import React from 'react';
import {Link} from 'react-router-dom';
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
  const date = new Date(workspace.creationDate);
  const datestring = dateFormat(date, 'yyyy-mm-dd');

  return (
    <TableRow>
      <TableCell width="100%">
        <Link
          id={`in-progress-workspace-${index}`}
          to={`/manual-input/${workspace.id}`}
        >
          {workspace.title}
        </Link>
      </TableCell>
      <TableCell>{datestring}</TableCell>
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
