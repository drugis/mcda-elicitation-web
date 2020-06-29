import IErrorContext from '@shared/interface/IErrorContext';
import React, {createContext, useState} from 'react';

export const ErrorContext = createContext<IErrorContext>({} as IErrorContext);

export function ErrorContextProviderComponent(props: {children: any}) {
  const [error, setError] = useState<string>();

  return (
    <ErrorContext.Provider
      value={{
        error: error,
        setError: setError
      }}
    >
      {props.children}
    </ErrorContext.Provider>
  );
}
