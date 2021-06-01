import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import useSorting from 'app/ts/McdaApp/Workspaces/workspacesUtil/useSorting';
import _ from 'lodash';
import React, {useContext, useState} from 'react';
import {WorkspacesContext} from '../WorkspacesContext/WorkspacesContext';
import InProgressWorkspacesTableRow from '../WorkspacesTable/InProgressWorkspacesTableRow/InProgressWorkspacesTableRow';
import WorkspacesTableBody from '../WorkspacesTable/WorkspacesTableBody';

export default function InProgressWorkspacesTable(): JSX.Element {
  const {inProgressWorkspaces} = useContext(WorkspacesContext);

  const [sortedWorkspaces, setSortedWorkspaces] =
    useState<IInProgressWorkspaceProperties[]>(inProgressWorkspaces);

  const [orderBy, orderDirection, orderByProperty] = useSorting(
    sortedWorkspaces,
    setSortedWorkspaces
  );

  function deleteLocalWorkspace(id: string): void {
    setSortedWorkspaces(_.reject(sortedWorkspaces, ['id', id]));
  }

  function EmptyWorkspaceMessage(): JSX.Element {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={3}>
            <em id="empty-workspace-message">No workspaces defined</em>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            <TableSortLabel
              id="sort-workspaces-by-title"
              active={orderBy === 'title'}
              direction={orderBy === 'title' ? orderDirection : 'asc'}
              onClick={_.partial(orderByProperty, 'title')}
            >
              Title
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              id="sort-workspaces-by-creation-date"
              active={orderBy === 'creationDate'}
              direction={orderBy === 'creationDate' ? orderDirection : 'asc'}
              onClick={_.partial(orderByProperty, 'creationDate')}
            >
              Created
            </TableSortLabel>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      {sortedWorkspaces?.length ? (
        <WorkspacesTableBody
          workspaces={sortedWorkspaces}
          RowComponent={InProgressWorkspacesTableRow}
          deleteLocalWorkspace={deleteLocalWorkspace}
        />
      ) : (
        <EmptyWorkspaceMessage />
      )}
    </Table>
  );
}
