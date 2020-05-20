import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {ManualInputContextProviderComponent} from './ManualInputContext';
import ManualInputStep1 from './ManualInputStep1/ManualInputStep1';

export default function ManualInput() {
  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>
        <ManualInputContextProviderComponent>
          <ManualInputStep1 />
        </ManualInputContextProviderComponent>
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
