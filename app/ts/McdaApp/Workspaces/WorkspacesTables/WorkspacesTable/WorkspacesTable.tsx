import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {TWorkspaceType} from '../../TWorkspaceType';
import InProgressWorkspacesTableRow from './InProgressWorkspacesTableRow/InProgressWorkspacesTableRow';
import WorkspacesTableRow from './WorkspacesTableRow/WorkspacesTableRow';

type TWorkspaces = IOldWorkspace[] | IInProgressWorkspaceProperties[];

export default function WorkspacesTable({
  type,
  workspaces
}: {
  type: TWorkspaceType;
  workspaces: TWorkspaces;
}): JSX.Element {
  const [sortedWorkspaces, setSortedWorkspaces] =
    useState<TWorkspaces>(workspaces);

  useEffect(() => {
    setSortedWorkspaces(workspaces);
  }, [workspaces]);

  const [orderBy, setOrderBy] = useState<TSortProperty>('title');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  type TSortProperty = 'title' | 'creationDate';

  function WorkspacesTableBody(): JSX.Element {
    return <TableBody>{_.map(sortedWorkspaces, renderTableRow)}</TableBody>;
  }

  function renderTableRow(
    workspace: IOldWorkspace | IInProgressWorkspaceProperties,
    index: number
  ): JSX.Element {
    if (isFinishedWorkspace(workspace)) {
      return (
        <WorkspacesTableRow
          key={workspace.id}
          workspace={workspace}
          index={index}
          deleteLocalWorkspace={deleteLocalWorkspace}
        />
      );
    } else {
      return (
        <InProgressWorkspacesTableRow
          key={workspace.id}
          workspace={workspace}
          index={index}
          deleteLocalWorkspace={deleteLocalWorkspace}
        />
      );
    }
  }

  function isFinishedWorkspace(
    workspace: IOldWorkspace | IInProgressWorkspaceProperties
  ): workspace is IOldWorkspace {
    return type === 'finished';
  }

  function deleteLocalWorkspace(id: string): void {
    setSortedWorkspaces(_.reject(sortedWorkspaces, ['id', id]));
  }

  function EmptyWorkspaceMessage(): JSX.Element {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={type === 'finished' ? 4 : 3}>
            <em id="empty-workspace-message">No workspaces defined</em>
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

  function orderBySameProperty(newWorkspaces: TWorkspaces): void {
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
    newWorkspaces: TWorkspaces
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
          <ShowIf condition={type === 'finished'}>
            <TableCell></TableCell>
          </ShowIf>
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
