import {CircularProgress} from '@material-ui/core';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import Axios, {AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import ManualInput from './ManualInput';
import {ManualInputContextProviderComponent} from './ManualInputContext';

export default function ManualInputWrapper() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState<IInProgressMessage>();
  const [inProgressId, setInProgressId] = useState<string>();

  useEffect(getInProgressWorkspace, []);

  function getInProgressWorkspace() {
    const id = window.location.toString().split('manual-input/')[1];
    setInProgressId(id);
    Axios.get(`/api/v2/inProgress/${id}`).then((response: AxiosResponse) => {
      setMessage(response.data);
      setIsLoaded(true);
    });
  }

  return isLoaded ? (
    <ManualInputContextProviderComponent
      inProgressId={inProgressId}
      message={message}
    >
      <ManualInput />
    </ManualInputContextProviderComponent>
  ) : (
    <CircularProgress />
  );
}
