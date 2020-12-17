import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import CopyWorkspaceButton from './CopyWorkspaceButton/CopyWorkspaceButton';
import DeleteWorkspaceButton from './DeleteWorkspaceButton/DeleteWorkspaceButton';

export default function WorkspacesTable(): JSX.Element {
  const {setError} = useContext(ErrorContext);
  const [workspaces, setWorkspaces] = useState<IOldWorkspace[]>([]);

  useEffect(() => {
    Axios.get('/workspaces/')
      .then((result: AxiosResponse<IOldWorkspace[]>) => {
        setWorkspaces(result.data);
      })
      .catch(setError);
  }, []);

  function WorkspacesTableBody(): JSX.Element {
    return (
      <TableBody>
        {_.map(
          workspaces,
          (workspace: IOldWorkspace, index: number): JSX.Element => {
            return (
              <TableRow key={workspace.id}>
                <TableCell>
                  <a id={`workspace-${index}`} href={getLink(workspace)}>
                    {workspace.title}
                  </a>
                </TableCell>
                <TableCell id={`copy-workspace-${index}`} align="center">
                  <CopyWorkspaceButton workspace={workspace} />
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
        )}
      </TableBody>
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
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={6}>
          <Typography id="workspaces-header" variant="h4">
            Workspaces <InlineHelp helpId="workspace" />
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={6}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
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
