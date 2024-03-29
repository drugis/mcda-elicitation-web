import Button from '@material-ui/core/Button';
import {OurError} from '@shared/interface/IError';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import Axios, {AxiosResponse} from 'axios';
import {useContext, useState} from 'react';
import {useHistory} from 'react-router';
import {ErrorContext} from '../../../Error/ErrorContext';
import {ManualInputContext} from '../ManualInputContext';

export default function DoneButton() {
  const history = useHistory();
  const {isDoneDisabled, id} = useContext(ManualInputContext);
  const {setError} = useContext(ErrorContext);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  function handleDoneClick() {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      Axios.post(`/api/v2/inProgress/${id}/doCreateWorkspace`)
        .then((response: AxiosResponse<IWorkspaceInfo>) => {
          const {id, defaultScenarioId, defaultSubProblemId} = response.data;
          const url = `/workspaces/${id}/problems/${defaultSubProblemId}/scenarios/${defaultScenarioId}/overview`;
          history.push(url);
        })
        .catch((error: OurError) => {
          setIsButtonPressed(false);
          setError(error);
        });
    }
  }

  return (
    <Button
      id="finish-creating-workspace"
      color="primary"
      variant="contained"
      onClick={handleDoneClick}
      disabled={isDoneDisabled}
    >
      Done
    </Button>
  );
}
