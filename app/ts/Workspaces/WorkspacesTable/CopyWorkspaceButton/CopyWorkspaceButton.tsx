import {IconButton, Tooltip} from '@material-ui/core';
import React, {useContext} from 'react';
import FileCopy from '@material-ui/icons/FileCopy';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import Axios, {AxiosResponse} from 'axios';

export default function CopyWorkspaceButton({
  workspace
}: {
  workspace: IOldWorkspace;
}): JSX.Element {
  const {setError} = useContext(ErrorContext);

  function copyWorkspace() {
    Axios.post('/api/v2/inProgress/createCopy', {
      sourceWorkspaceId: workspace.id
    })
      .then((response: AxiosResponse<{id: string}>) => {
        window.location.assign(`/manual-input/${response.data.id}`);
      })
      .catch(setError);
  }

  return (
    <Tooltip title={'Copy workspace'}>
      <span>
        <IconButton
          id="copy-workspace-button"
          size="small"
          onClick={copyWorkspace}
        >
          <FileCopy color="primary" />
        </IconButton>
      </span>
    </Tooltip>
  );
}
