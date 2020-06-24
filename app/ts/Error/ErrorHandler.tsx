import React, {useContext} from 'react';
import Error from './Error';
import {ErrorContext} from './ErrorContext';

export default function ErrorHandler({children}: any) {
  const {error} = useContext(ErrorContext);
  return (
    <span>
      {children} {error ? <Error /> : <></>}
    </span>
  );
}
