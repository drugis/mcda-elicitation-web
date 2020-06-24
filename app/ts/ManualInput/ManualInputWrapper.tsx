import Axios, {AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import IInProgressMessage from '../interface/IInProgressMessage';
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
    Axios.get(`api/v2/inProgress/${id}`).then((response: AxiosResponse) => {
      setMessage(response.data);
      setIsLoaded(true);
    });
  }

  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>
        {isLoaded ? (
          <ManualInputContextProviderComponent
            inProgressId={inProgressId}
            message={message}
          >
            <ManualInput />
          </ManualInputContextProviderComponent>
        ) : (
          <span>...loading</span>
        )}
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
