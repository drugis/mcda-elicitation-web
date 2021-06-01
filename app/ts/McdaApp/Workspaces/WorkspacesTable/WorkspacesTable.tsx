import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import useSorting from 'app/ts/McdaApp/Workspaces/workspacesUtil/useSorting';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {WorkspacesContext} from '../WorkspacesContext/WorkspacesContext';
import WorkspacesTableBody from './WorkspacesTableBody';
import WorkspacesTableRow from './WorkspacesTableRow/WorkspacesTableRow';

export default function WorkspacesTable(): JSX.Element {
  const {filteredWorkspaces, deleteWorkspace} = useContext(WorkspacesContext);

  const [sortedWorkspaces, setSortedWorkspaces] =
    useState<IWorkspaceSummary[]>(filteredWorkspaces);

  useEffect(() => {
    setSortedWorkspaces(filteredWorkspaces);
  }, [filteredWorkspaces]);

  const [orderBy, orderDirection, orderByProperty] = useSorting(
    sortedWorkspaces,
    setSortedWorkspaces
  );

  function deleteLocalWorkspace(id: string): void {
    setSortedWorkspaces(_.reject(sortedWorkspaces, ['id', id]));
    deleteWorkspace(id);
  }

  function EmptyWorkspaceMessage(): JSX.Element {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4}>
            <em id="empty-workspace-message">
              No workspaces defined or match the filters
            </em>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <Table id="workspaces-table" size="small">
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
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      {sortedWorkspaces?.length ? (
        <WorkspacesTableBody
          workspaces={sortedWorkspaces}
          RowComponent={WorkspacesTableRow}
          deleteLocalWorkspace={deleteLocalWorkspace}
        />
      ) : (
        <EmptyWorkspaceMessage />
      )}
    </Table>
  );
}
