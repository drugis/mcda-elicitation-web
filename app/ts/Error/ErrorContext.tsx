import {OurError} from '@shared/interface/IError';
import IErrorContext from '@shared/interface/IErrorContext';
import React, {createContext, useState} from 'react';

export const ErrorContext = createContext<IErrorContext>({} as IErrorContext);

export function ErrorContextProviderComponent(props: {children: any}) {
  const [error, setError] = useState<string>();

  function setErrorWrapper(ourError: OurError): void {
    setError(ourError.message);
  }

  return (
    <ErrorContext.Provider
      value={{
        error: error,
        setError: setErrorWrapper,
        setErrorMessage: setError
      }}
    >
      {props.children}
    </ErrorContext.Provider>
  );
}
