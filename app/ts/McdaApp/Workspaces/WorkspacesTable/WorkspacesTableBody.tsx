import {TableBody} from '@material-ui/core';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import _ from 'lodash';
import {ElementType} from 'react';

export default function WorkspacesTableBody<
  T extends IInProgressWorkspaceProperties
>({
  workspaces,
  RowComponent,
  deleteLocalWorkspace
}: {
  workspaces: T[];
  RowComponent: ElementType;
  deleteLocalWorkspace: (id: string) => void;
}): JSX.Element {
  return (
    <TableBody>
      {_.map(workspaces, (workspace: T, index: number) => (
        <RowComponent
          key={workspace.id}
          workspace={workspace}
          index={index}
          deleteLocalWorkspace={deleteLocalWorkspace}
        />
      ))}
    </TableBody>
  );
}
