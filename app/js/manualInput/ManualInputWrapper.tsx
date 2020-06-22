import Axios, { AxiosResponse } from 'axios';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import ManualInput from './ManualInput/ManualInput';
import {ManualInputContextProviderComponent} from './ManualInputContext';
import IInProgressWorkspace from '../interface/IInProgressWorkspace';

export default function ManualInputWrapper() {
  function getManualInputContext() {
    const inProgressId: string = window.location
      .toString()
      .split('manual-input/')[1];
    Axios.get(`api/v2/${inProgressId}`).then(
      (response: AxiosResponse) => {
        return (
          <ManualInputContextProviderComponent {...response.data}>
            <ManualInput />
          </ManualInputContextProviderComponent>
        );
      }
    );
  }

  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>{getManualInputContext()}</ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
