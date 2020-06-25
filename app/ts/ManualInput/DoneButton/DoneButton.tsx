import {Button} from '@material-ui/core';
import Axios, {AxiosResponse} from 'axios';
import React, {useContext} from 'react';
import {ErrorContext} from '../../Error/ErrorContext';
import IError from '../../interface/IError';
import {ManualInputContext} from '../ManualInputContext';

export default function DoneButton() {
  const {isDoneDisabled, id} = useContext(ManualInputContext);
  const {setError} = useContext(ErrorContext);

  function handleDoneClick() {
    Axios.post(`api/v2/inProgress/${id}/doCreateWorkspace`)
      .then((response: AxiosResponse) => {
        console.log(response.data.id);
      })
      .catch((error: IError) => {
        setError(error.message + ', ' + error.response.data);
      });
  }

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={handleDoneClick}
      disabled={isDoneDisabled}
    >
      Done
    </Button>
  );
}
