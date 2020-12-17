import {IconButton, Tooltip} from '@material-ui/core';
import FileCopy from '@material-ui/icons/FileCopy';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import Axios, {AxiosResponse} from 'axios';
import React, {useContext} from 'react';

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
        window.location.assign(`/#!/manual-input/${response.data.id}`);
      })
      .catch(setError);
  }

  return (
    <Tooltip title={'Copy workspace'}>
      <span>
        <IconButton size="small" onClick={copyWorkspace}>
          <FileCopy color="primary" />
        </IconButton>
      </span>
    </Tooltip>
  );
}
