import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {WorkspacesContext} from '../WorkspacesContext/WorkspacesContext';
import WorkspacesTableRow from './WorkspacesTableRow/WorkspacesTableRow';

export default function WorkspacesTable(): JSX.Element {
  const {filteredWorkspaces, deleteWorkspace} = useContext(WorkspacesContext);

  const [sortedWorkspaces, setSortedWorkspaces] =
    useState<IWorkspaceSummary[]>(filteredWorkspaces);

  useEffect(() => {
    setSortedWorkspaces(filteredWorkspaces);
  }, [filteredWorkspaces]);

  const [orderBy, setOrderBy] = useState<TSortProperty>('title');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  type TSortProperty = 'title' | 'creationDate';

  function WorkspacesTableBody(): JSX.Element {
    return (
      <TableBody>
        {_.map(
          sortedWorkspaces,
          (workspace: IWorkspaceSummary, index: number) => (
            <WorkspacesTableRow
              key={workspace.id}
              workspace={workspace}
              index={index}
              deleteLocalWorkspace={deleteLocalWorkspace}
            />
          )
        )}
      </TableBody>
    );
  }

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

  function orderByProperty(propertyToOrder: TSortProperty, event: any): void {
    const newWorkspaces = _.sortBy(sortedWorkspaces, [propertyToOrder]);
    if (orderBy === propertyToOrder) {
      orderBySameProperty(newWorkspaces);
    } else {
      orderByOtherProperty(propertyToOrder, newWorkspaces);
    }
  }

  function orderBySameProperty(newWorkspaces: IWorkspaceSummary[]): void {
    if (orderDirection === 'desc') {
      setOrderDirection('asc');
      setSortedWorkspaces(newWorkspaces);
    } else {
      setOrderDirection('desc');
      setSortedWorkspaces(newWorkspaces.reverse());
    }
  }

  function orderByOtherProperty(
    propertyToOrder: TSortProperty,
    newWorkspaces: IWorkspaceSummary[]
  ): void {
    setOrderBy(propertyToOrder);
    setSortedWorkspaces(newWorkspaces);
    setOrderDirection('asc');
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
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      {sortedWorkspaces.length ? (
        <WorkspacesTableBody />
      ) : (
        <EmptyWorkspaceMessage />
      )}
    </Table>
  );
}
