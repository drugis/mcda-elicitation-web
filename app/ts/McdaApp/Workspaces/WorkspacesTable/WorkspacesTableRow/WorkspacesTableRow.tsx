import {TableCell, TableRow} from '@material-ui/core';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import {getLink} from 'app/ts/McdaApp/Workspaces/workspacesUtil/workspacesUtil';
import dateFormat from 'dateformat';
import {Link} from 'react-router-dom';
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
        <Link id={`workspace-${index}`} to={getLink(workspace)}>
          {workspace.title}
        </Link>
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
