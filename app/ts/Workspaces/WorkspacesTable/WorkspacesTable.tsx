import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import Axios, {AxiosResponse} from 'axios';
import dateFormat from 'dateformat';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import CopyWorkspaceButton from './CopyWorkspaceButton/CopyWorkspaceButton';
import DeleteWorkspaceButton from './DeleteWorkspaceButton/DeleteWorkspaceButton';

export default function WorkspacesTable(): JSX.Element {
  const {setError} = useContext(ErrorContext);
  const [workspaces, setWorkspaces] = useState<IOldWorkspace[]>([]);

  const [orderBy, setOrderBy] = useState<TSortProperty>('title');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  type TSortProperty = 'title' | 'creationDate';

  useEffect(() => {
    Axios.get('/workspaces/')
      .then((result: AxiosResponse<IOldWorkspace[]>) => {
        setWorkspaces(_.sortBy(result.data, [orderBy]));
      })
      .catch(setError);
  }, []);

  function WorkspacesTableBody(): JSX.Element {
    return (
      <TableBody>
        {_.map(
          workspaces,
          (workspace: IOldWorkspace, index: number): JSX.Element => (
            <WorkspacesTableRow
              key={workspace.id}
              workspace={workspace}
              index={index}
            />
          )
        )}
      </TableBody>
    );
  }

  function WorkspacesTableRow({
    workspace,
    index
  }: {
    workspace: IOldWorkspace;
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
          />
        </TableCell>
      </TableRow>
    );
  }

  function deleteLocalWorkspace(id: string): void {
    setWorkspaces(_.reject(workspaces, ['id', id]));
  }

  function getLink(workspace: IOldWorkspace): string {
    return (
      '/#!/workspaces/' +
      workspace.id +
      '/problems/' +
      workspace.defaultSubProblemId +
      '/scenarios/' +
      workspace.defaultScenarioId +
      '/evidence'
    );
  }

  function EmptyWorkspaceMessage(): JSX.Element {
    return (
      <TableBody>
        <TableRow>
          <TableCell>
            <em id="empty-workspace-message">No workspaces defined</em>
          </TableCell>
          <TableCell align="center"></TableCell>
          <TableCell align="center"></TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableBody>
    );
  }

  function createSortHandler(propertyToOrder: TSortProperty, event: any): void {
    const newWorkspaces = _.sortBy(workspaces, [propertyToOrder]);
    if (orderBy === propertyToOrder) {
      orderBySameProperty(newWorkspaces);
    } else {
      orderByNewProperty(propertyToOrder, newWorkspaces);
    }
  }

  function orderBySameProperty(newWorkspaces: IOldWorkspace[]): void {
    if (orderDirection === 'desc') {
      setOrderDirection('asc');
      setWorkspaces(newWorkspaces);
    } else {
      setOrderDirection('desc');
      setWorkspaces(newWorkspaces.reverse());
    }
  }

  function orderByNewProperty(
    propertyToOrder: TSortProperty,
    newWorkspaces: IOldWorkspace[]
  ): void {
    setOrderBy(propertyToOrder);
    setWorkspaces(newWorkspaces);
    setOrderDirection('asc');
  }

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={8}>
          <Typography id="workspaces-header" variant="h4">
            Workspaces <InlineHelp helpId="workspace" />
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={8}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    id="sort-workspaces-by-title"
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? orderDirection : 'asc'}
                    onClick={_.partial(createSortHandler, 'title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    id="sort-workspaces-by-creation-date"
                    active={orderBy === 'creationDate'}
                    direction={
                      orderBy === 'creationDate' ? orderDirection : 'asc'
                    }
                    onClick={_.partial(createSortHandler, 'creationDate')}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {workspaces.length ? (
              <WorkspacesTableBody />
            ) : (
              <EmptyWorkspaceMessage />
            )}
          </Table>
        </Grid>
      </Grid>
    </>
  );
}
