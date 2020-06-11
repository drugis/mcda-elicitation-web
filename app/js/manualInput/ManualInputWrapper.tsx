import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import ManualInput from './ManualInput/ManualInput';
import {ManualInputContextProviderComponent} from './ManualInputContext';

export default function ManualInputWrapper() {
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
