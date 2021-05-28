import {TableCell, TableRow} from '@material-ui/core';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import {getLink} from 'app/ts/McdaApp/Workspaces/WorkspacesUtil/WorkspacesUtil';
import dateFormat from 'dateformat';
import React from 'react';
import CopyWorkspaceButton from '../CopyWorkspaceButton/CopyWorkspaceButton';
import DeleteWorkspaceButton from '../DeleteWorkspaceButton/DeleteWorkspaceButton';

export default function WorkspacesTableRow({
  deleteLocalWorkspace,
  workspace,
  index
}: {
  deleteLocalWorkspace: (id: string) => void;
  workspace: IWorkspaceSummary;
  index: number;
}): JSX.Element {
  const date = new Date(workspace.creationDate);
  const datestring = dateFormat(date, 'yyyy-mm-dd');

  return (
    <TableRow>
      <TableCell width="100%">
        <a id={`workspace-${index}`} href={getLink(workspace)}>
          {workspace.title}
        </a>
      </TableCell>

      <TableCell width="100%">{datestring}</TableCell>
      <TableCell id={`copy-workspace-${index}`} align="center">
        <CopyWorkspaceButton workspaceId={workspace.id} />
      </TableCell>

      <TableCell id={`delete-workspace-${index}`} align="center">
        <DeleteWorkspaceButton
          workspace={workspace}
          deleteLocalWorkspace={deleteLocalWorkspace}
          type="finished"
        />
      </TableCell>
    </TableRow>
  );
}
