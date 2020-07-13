import {Button} from '@material-ui/core';
import IError from '@shared/interface/IError';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import Axios, {AxiosResponse} from 'axios';
import React, {useContext} from 'react';
import {ErrorContext} from '../../Error/ErrorContext';
import {ManualInputContext} from '../ManualInputContext';

export default function DoneButton() {
  const {isDoneDisabled, id} = useContext(ManualInputContext);
  const {setError} = useContext(ErrorContext);

  function handleDoneClick() {
    Axios.post(`api/v2/inProgress/${id}/doCreateWorkspace`)
      .then((response: AxiosResponse) => {
        const workspaceInfo: IWorkspaceInfo = response.data;
        const url = `/#!/workspaces/${workspaceInfo.id}/problems/${workspaceInfo.defaultSubProblemId}/scenarios/${workspaceInfo.defaultScenarioId}/evidence`;
        window.location.assign(url);
      })
      .catch((error: IError) => {
        setError(error.message + ', ' + error.response.data);
      });
  }

  return (
    <Button
      id="done-button"
      color="primary"
      variant="contained"
      onClick={handleDoneClick}
      disabled={isDoneDisabled}
    >
      Done
    </Button>
  );
}
