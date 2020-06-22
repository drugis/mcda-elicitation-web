import Axios from 'axios';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import ManualInput from './ManualInput/ManualInput';
import {ManualInputContextProviderComponent} from './ManualInputContext';

export default function ManualInputWrapper() {
  const inProgressId: string = window.location
    .toString()
    .split('manual-input/')[1];

  function getWorkspace() {
    Axios.get(`api/v2/${inProgressId}`);
  }

  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>
        <ManualInputContextProviderComponent>
          <ManualInput />
        </ManualInputContextProviderComponent>
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
