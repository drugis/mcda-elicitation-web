import React, {useContext} from 'react';
import {ErrorContext} from './ErrorContext';
import Error from './Error';

export default function ErrorHandler({children}: any) {
  const {error} = useContext(ErrorContext);
  return error ? <Error/> : children;
}
