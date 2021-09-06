import {OurError} from '@shared/interface/IError';
import IErrorContext from '@shared/interface/IErrorContext';
import {createContext, useCallback, useState} from 'react';

export const ErrorContext = createContext<IErrorContext>({} as IErrorContext);

export function ErrorContextProviderComponent(props: {children: any}) {
  const [error, setError] = useState<string>();

  const setErrorWrapper = useCallback(
    (ourError: OurError): void => {
      setError(ourError.message);
    },
    [setError]
  );

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError: setErrorWrapper,
        setErrorMessage: setError
      }}
    >
      {props.children}
    </ErrorContext.Provider>
  );
}
