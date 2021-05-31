import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import InProgressWorkspacesTableRow from '../WorkspacesTable/InProgressWorkspacesTableRow/InProgressWorkspacesTableRow';

export default function InProgressWorkspacesTable(): JSX.Element {
  const {setError} = useContext(ErrorContext);

  const [sortedWorkspaces, setSortedWorkspaces] =
    useState<IInProgressWorkspaceProperties[]>();

  useEffect(() => {
    axios
      .get('/api/v2/inProgress/')
      .then((result: AxiosResponse<IInProgressWorkspaceProperties[]>) => {
        setSortedWorkspaces(_.sortBy(result.data, ['title']));
      })
      .catch(setError);
  }, [setError]);

  const [orderBy, setOrderBy] = useState<TSortProperty>('title');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  type TSortProperty = 'title' | 'creationDate';

  function WorkspacesTableBody(): JSX.Element {
    return (
      <TableBody>
        {_.map(
          sortedWorkspaces,
          (workspace: IInProgressWorkspaceProperties, index: number) => (
            <InProgressWorkspacesTableRow
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

  function orderByProperty(propertyToOrder: TSortProperty, event: any): void {
    const newWorkspaces = _.sortBy(sortedWorkspaces, [propertyToOrder]);
    if (orderBy === propertyToOrder) {
      orderBySameProperty(newWorkspaces);
    } else {
      orderByOtherProperty(propertyToOrder, newWorkspaces);
    }
  }

  function orderBySameProperty(
    newWorkspaces: IInProgressWorkspaceProperties[]
  ): void {
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
    newWorkspaces: IInProgressWorkspaceProperties[]
  ): void {
    setOrderBy(propertyToOrder);
    setSortedWorkspaces(newWorkspaces);
    setOrderDirection('asc');
  }

  return (
    <LoadingSpinner showSpinnerCondition={sortedWorkspaces === undefined}>
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
        {sortedWorkspaces && sortedWorkspaces.length ? (
          <WorkspacesTableBody />
        ) : (
          <EmptyWorkspaceMessage />
        )}
      </Table>
    </LoadingSpinner>
  );
}
